// PriceHistoryChart.tsx
import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { PriceHistory } from '@/types/kassal';

interface PriceHistoryChartProps {
  data: PriceHistory[];
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const screenWidth = Dimensions.get('window').width - 32; // account for horizontal padding

  // 1. Sort entries ascending by date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 2. Build raw labels and values
  const rawLabels = sortedData.map((entry) => {
    const d = new Date(entry.date);
    // e.g. "23/4"
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
  const prices = sortedData.map((entry) => entry.price);

  // 3. Only show up to ~6 labels to prevent crowding
  const maxLabels = 6;
  const skip = Math.ceil(rawLabels.length / maxLabels);
  const labels = rawLabels.map((lbl, idx) => (idx % skip === 0 ? lbl : ''));

  const chartData = {
    labels,
    datasets: [
      {
        data: prices,
        color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Price Over Time'],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    // Shrink all axis label text
    propsForLabels: {
      fontSize: '10',
    }, // you can override SVG Text props here :contentReference[oaicite:0]{index=0}
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        withInnerLines
        withOuterLines
        bezier
        // Rotate X‑axis labels to 45° so they don’t collide :contentReference[oaicite:1]{index=1}
        verticalLabelRotation={45}
        // Nudge the labels up/down if they’re still too tight :contentReference[oaicite:2]{index=2}
        xLabelsOffset={-10}
        style={{
          marginVertical: 8,
          borderRadius: 8,
        }}
      />
    </View>
  );
}

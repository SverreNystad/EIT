// PriceHistoryChart.tsx
import React from 'react';
import {
  Dimensions,
  View,
  useColorScheme,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { PriceHistory } from '@/types/kassal';
import { getTheme } from '@/constants/Colors';

interface PriceHistoryChartProps {
  data: PriceHistory[];
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const colorScheme = useColorScheme() || 'light';
  const theme = getTheme(colorScheme);

  const screenWidth = Dimensions.get('window').width - 32;

  // 1) sort chronologically
  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 2) format dates
  const rawLabels = sorted.map((e) => {
    const d = new Date(e.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
  const prices = sorted.map((e) => e.price);

  // 3) thin labels to ≈6
  const maxLabels = 6;
  const skip = Math.ceil(rawLabels.length / maxLabels);
  const labels = rawLabels.map((lbl, i) => (i % skip === 0 ? lbl : ''));

  const chartData = {
    labels,
    datasets: [
      {
        data: prices,
        color: (_: number) => theme.primary,
        strokeWidth: 2,
      },
    ],
    legend: ['Price Over Time'],
  };

  const chartConfig = {
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    color: (_: number) => theme.text,
    labelColor: (_: number) => theme.text,
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: theme.accent,
    },
    propsForLabels: {
      fontSize: '10',
    },
    propsForBackgroundLines: {
      stroke: theme.text + '20',
    },
  };

  // merge your chart style here
  const chartStyle: ViewStyle = {
    marginVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
    backgroundColor: theme.card,
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        style={chartStyle}    
        withInnerLines
        withOuterLines
        bezier
        verticalLabelRotation={45}
        xLabelsOffset={-10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

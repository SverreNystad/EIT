// PriceHistoryChart.tsx
import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { PriceHistory } from '@/types/kassal';

interface PriceHistoryChartProps {
  data: PriceHistory[];
  // Optionally pass in multiple data arrays if you have more than one history set
  // data2?: PriceHistory[];
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const screenWidth = Dimensions.get('window').width - 32; // minus padding

  // Format data for the chart
  // Labels are date strings, data is numeric price
  // For display, you might want to shorten or format dates, e.g. "MM/DD" or "DD MMM"
  const labels = data.map((entry) => {
    const dateObj = new Date(entry.date);
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
  });
  const prices = data.map((entry) => entry.price);

  // Example if you want multiple lines in the same chart:
  // const secondPrices = data2?.map(entry => entry.price / 2) ?? [];

  const chartData = {
    labels,
    datasets: [
      {
        data: prices,
        // color, strokeWidth, etc. are optional and can be customized
        color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
        strokeWidth: 2,
      },
      // Uncomment if you have a second data set
      // {
      //   data: secondPrices,
      //   color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      //   strokeWidth: 2,
      // },
    ],
    legend: ['Price Over Time'], // optional
  };

  // Chart configuration for styling
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
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        withInnerLines={true}
        withOuterLines={true}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 8,
        }}
      />
    </View>
  );
}

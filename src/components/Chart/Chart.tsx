import { barData } from "@/src/utils/data";
import { View, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export function ChartBar() {
  const { width } = useWindowDimensions();

  return (
    <View>
      <BarChart
        barWidth={15}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="#5BBF26"
        data={barData}
        spacing={15}
        yAxisThickness={0}
        xAxisThickness={0}
        width={width - 72}
        height={120}
        xAxisLabelTextStyle={{ color: "white" }}
        yAxisTextStyle={{ color: "white" }}
        isAnimated
        animationDuration={800}
      />
    </View>
  );
}

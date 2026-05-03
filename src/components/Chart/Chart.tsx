import { barData } from "@/src/utils/data";
import { useWindowDimensions, View } from "react-native";
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
        spacing={10}
        yAxisThickness={0}
        xAxisThickness={0}
        width={width * 0.55}
        height={110}
        xAxisLabelTextStyle={{ color: "white" }}
        yAxisTextStyle={{ color: "white" }}
        isAnimated
        animationDuration={800}
      />
    </View>
  );
}

import { useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Props = {
  DadosWeek: { total: number; day: string }[];
};

export function ChartBar({ DadosWeek }: Props) {
  const { width } = useWindowDimensions();

  const dados = DadosWeek.map((item) => ({
    value: item.total,
    label: item.day,
  }));

  return (
    <View>
      <BarChart
        barWidth={15}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="#5BBF26"
        data={dados}
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

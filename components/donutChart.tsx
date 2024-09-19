import { TextColor, TitleColor, green, orange, red } from "@/constants/Colors";
import { Product } from "@/constants/interface";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Svg, { Circle, G, Text as TextSvg } from "react-native-svg";
export default function DonutChart({productData}: {
  productData: Product[];
}) {
  const center = 250 / 2;
  const radius = (250 - 70) / 2;
  const circonference = 2 * Math.PI * radius;
  const productChartData = [];

  productData.map((data) => {
    productChartData.push({
      percentage: data.percentage, 
      color: data.color
    });
  });


  const [startAngle, setStartAngle] = useState<number[]>([]);
  const [expensesCount, setExpensesCount] = useState<number>(0);


  const refresh = () => {
    let angle = 0;
    const angles: number[] = [];

    productData.forEach((item) => {
      angles.push(angle);
      angle += item.percentage * 360;
    });
    setExpensesCount(productChartData.length);
    setStartAngle(angles);
  };

  useEffect(() => {
    refresh();
  }, [productData]);

  return (
    <>
      <Svg height="250" width="250">
        {productData.map((value, index) => {
          return (
            <G key={index}>
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={value.color}
                strokeWidth="70"
                fill="transparent"
                strokeDasharray={circonference}
                strokeDashoffset={circonference * (1 - value.percentage)}
                originX={center}
                originY={center}
                rotation={startAngle[index]}
              />
              <TextSvg fill="black">
                {value.percentage}
              </TextSvg>
            </G>
          );
        })}
      </Svg>
      <Text style={styles.text}>{expensesCount} Expense(s)</Text>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
    color: TextColor,
    backgroundColor: "#fff",
    zIndex: -1,
    padding: 50,
    fontFamily: "k2d-regular",
  },
});

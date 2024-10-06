import { TextColor, TitleColor, green, orange, red } from "@/constants/Colors";
import { Product } from "@/constants/interface";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Svg, { Circle, G, Text as TextSvg } from "react-native-svg";
export default function DonutChart({
  productData,
}: {
  productData: Product[];
}) {
  const center = 200 / 2;
  const radius = (200 - 70) / 2;
  const circonference = 2 * Math.PI * radius;
  const productChartData = [];

  const [startAngle, setStartAngle] = useState<number[]>([]);
  const [expensesCount, setExpensesCount] = useState<number>(0);

  let totalAmount = 0;
  productData?.forEach((data) => {
    totalAmount += (data.amount * data.coefficient);
  });


  const refresh = () => {

    productData?.map((data) => {
      productChartData.push({
        percentage: (data.coefficient * data.amount) / totalAmount,
        color: data.color,
      });
    });

    let angle = 0;
    const angles: number[] = [];

    productData?.forEach((data) => {
      angles.push(angle);
      angle += ((data.coefficient * data.amount) / totalAmount) * 360;
    });

    setExpensesCount(productChartData.length);
    setStartAngle(angles);
  };

  useEffect(() => {
    refresh();
  }, [productData]);

  return (
    <>
      <Svg height="200" width="200">
        {productData?.map((value, index) => {
          return (
            <G key={index}>
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={value.color}
                strokeWidth="30"
                fill="transparent"
                strokeDasharray={circonference}
                strokeDashoffset={circonference * (1 - ((value.coefficient * value.amount) / totalAmount))}
                originX={center}
                originY={center}
                rotation={startAngle[index]}
              />
              <TextSvg fill="black">{(value.coefficient * value.amount) / totalAmount}</TextSvg>
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

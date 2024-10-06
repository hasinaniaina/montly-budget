import YearListModal from "@/components/yearListModal";
import { TextColor, TitleColor, greyMonth, orange, purple, red } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { getMonth } from "@/constants/db";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
} from "react-native";
import { TouchableOpacity } from "react-native";

function Home() {
  useEffect(() => {
  }, []);
  return (
    <></>
  );
}

export default Home;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    padding: 20,
    height: Dimensions.get("window").height / 3,
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  title: {
    fontSize: 50,
    fontFamily: "k2d-bold",
    color: TitleColor,
    width: 200,
  },
  monthContainer: {
    paddingVertical: 20,
    flex: 2
  },
  monthHeader: {
    width: Dimensions.get("window").width - 20,
    backgroundColor: orange,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginHorizontal: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  scheduleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  calendarText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "k2d-bold",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  yearText: {
    fontSize: 20,
    color: "#fff",
    marginRight: 5,
    fontFamily: "k2d-bold",
  },
  arrowDownIcon: {
    width: 17,
    height: 17,
  },
  monthContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    paddingVertical: 20,
  },
  monthTextContainer: {
    backgroundColor: greyMonth,
    padding: 30,
    margin: 5,
    borderRadius: 10,
  },
  monthTextContainerRed: {
    backgroundColor: red,
    padding: 30,
    margin: 5,
    borderRadius: 10,
  },
  monthTextContainerPurple: {
    backgroundColor: purple,
    padding: 30,
    margin: 5,
    borderRadius: 10,
  },
  monthText: {
    fontFamily: "k2d-bold",
    fontSize: 14,
    color: TextColor,
    width: 25,
    height: 20,
  },
  monthTextRed: {
    fontFamily: "k2d-bold",
    fontSize: 14,
    color: "#fff",
    width: 25,
    height: 20,
  },
  monthTextPurple: {
    fontFamily: "k2d-bold",
    fontSize: 14,
    color: "#fff",
    width: 25,
    height: 20,
  }
});

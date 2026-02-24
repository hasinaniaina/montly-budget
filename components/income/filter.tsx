import { View, Text, StyleSheet, TextInput, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextColor } from "@/constants/Colors";
import { getIncomeDependToIncomeSearch } from "@/constants/utils";
import { useIncomeStore } from "@/constants/store";
import { Income } from "@/constants/interface";

export default function Filter() {
  const currentUserIncomeDatas = useIncomeStore((state) => state.income);
  const setCurrentIncomeDatas = useIncomeStore((state) => state.setIncome);
  const setIncomeForFilter = useIncomeStore((state) => state.setIncomeForFilter);
  useEffect(() => {
    (async () => {
    })();
  }, [currentUserIncomeDatas]);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.searchCategory}>
        <Ionicons name="search-outline" size={25} color="#000" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Category"
          onChangeText={(incomeSearch) => {
            const newIncome = getIncomeDependToIncomeSearch(
              currentUserIncomeDatas,
              incomeSearch,
            );

            if (incomeSearch == "") {
                setIncomeForFilter([]);
                return false;
            }

            setIncomeForFilter(newIncome);
            
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("screen").width,
  },
  month: {
    fontFamily: "k2d-light",
    fontSize: 20,
  },
  searchCategory: {
    flexDirection: "row",
    borderWidth: 1,
    width: Dimensions.get("screen").width - 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
    borderRadius: 30,
    borderColor: TextColor,
  },
  searchInput: {
    width: "87%",
    marginLeft: 7,
  },
  expensesIncomeContainer: {
    width: Dimensions.get("screen").width - 40,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginVertical: 30,
  },
  textIconAmountContainer: {},
  textExpensesIncome: {
    fontFamily: "k2d-light",
  },
  iconAmountContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amount: {
    marginLeft: 5,
    fontFamily: "k2d-bold",
  },
  monthFilterContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  barChartContainer: {
    width: Dimensions.get("screen").width - 20,
    marginBottom: 40,
    marginTop: 20,
  },
});

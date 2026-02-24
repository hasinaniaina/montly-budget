import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { numStr, retrieveFirstAndLastDay } from "@/constants/utils";
import { green, red } from "@/constants/Colors";
import {
  useDateFilterStore,
  useDisabledMonth,
  useIncomeStore,
  useProductsStore,
} from "@/constants/store";

export default function ResumeIncomeExpenses() {

  const currentDateExpenses = useProductsStore(
    (state) => state.currentDateExpenses,
  );

  const dateFilterStatistic = useDateFilterStore(
    (state) => state.dateFilterStatistic,
  );

  const currentUserIncome = useIncomeStore((state) => state.income);

  const sumIncome = useIncomeStore((state) => state.sumIncome);
  const sumExpenses = useProductsStore((state) => state.sumExpenses);

  useEffect(() => {
  }, [currentDateExpenses, currentUserIncome, dateFilterStatistic]);

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={styles.expensesIncomeContainer}>
        <View style={[styles.textIconAmountContainer]}>
          <Text style={styles.textExpensesIncome}>Expenses</Text>
          <View style={styles.iconAmountContainer}>
            <Ionicons name="arrow-up-circle" size={20} color={red} />
            <Text style={styles.amount}>
              {numStr(String(sumExpenses), ".")}&nbsp;Ariary
            </Text>
          </View>
        </View>
        <View style={[styles.textIconAmountContainer]}>
          <Text style={styles.textExpensesIncome}>Income</Text>
          <View style={styles.iconAmountContainer}>
            <Ionicons name="arrow-down-circle" size={20} color={green} />
            <Text style={styles.amount}>
              {numStr(String(sumIncome), ".")}&nbsp;Ariary
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    marginLeft: 5,
    fontFamily: "k2d-bold",
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
});

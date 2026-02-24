import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import {
  useDateFilterStore,
  useIncomeStore,
  useProductsStore,
} from "@/constants/store";
import { BARCHARTMONTH } from "@/constants/constant";
import { green, orange, red, TitleColor } from "@/constants/Colors";
import {
  retrieveFirstAndLastDay,
} from "@/constants/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomDatePicker from "../customDatePicker";

type BarChartExpense = {
  label?: string;
  value: number;
  frontColor: string;
  spacing?: number;
  labelWidth?: number;
};

export default function BarchartStatistics() {
  const [barChartDatas, setBarChartDatas] = useState<BarChartExpense[]>([]);
  const [yearlyMonthly, setYearlyMonthly] = useState<"month" | "year">("year");

  const dateFilterStatistic = useDateFilterStore(
    (state) => state.dateFilterStatistic,
  );
  const setDateFilterStatistic = useDateFilterStore(
    (state) => state.setDateFilterStatistic,
  );

  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  const income = useIncomeStore((state) => state.income);
  const expenses = useProductsStore((state) => state.categoryProducts);

  const setSumIncome = useIncomeStore((state) => state.setSumIncome);
  const setSumExpenses = useProductsStore((state) => state.setSumExpenses);

  const getBarChartValueExpense = () => {
    let barchartDatasTmp: BarChartExpense[] = [];
    let sumExpensesTmp = 0;
    let sumIncomeTmp = 0;

    if (yearlyMonthly == "year") {
      const reducerYear = dateFilterStatistic.getFullYear();

      BARCHARTMONTH.map((month, index) => {
        let sumExpenseByFilter = 0;
        let sumIncomeByFilter = 0;
        expenses.map((expense) => {
          const expenseMonth = new Date(expense.createdDate!).getMonth() + 1;
          const expenseYear = new Date(expense.createdDate!).getFullYear();

          if (index + 1 == expenseMonth && expenseYear == reducerYear) {
            sumExpenseByFilter +=
              expense.productAmount * expense.productCoefficient;
            sumExpensesTmp +=
              expense.productAmount * expense.productCoefficient;
          }
        });

        barchartDatasTmp.push({
          label: month,
          value: sumExpenseByFilter,
          frontColor: red,
          spacing: 3,
          labelWidth: 30,
        });

        income.map((income) => {
          const incomeMonth = new Date(income.createdDate!).getMonth() + 1;
          const incomeYear = new Date(income.createdDate!).getFullYear();

          if (index + 1 == incomeMonth && incomeYear == reducerYear) {
            sumIncomeByFilter += Number(income.amount);
            sumIncomeTmp += Number(income.amount);
          }
        });
        barchartDatasTmp.push({ value: sumIncomeByFilter, frontColor: green });
      });
    } else {
      const { firstDay, lastDay } = retrieveFirstAndLastDay(
        new Date(dateFilterStatistic).toString(),
      );

      const lastDayTmp = new Date(lastDay).getDate();

      let dayCount = 1;
      while (dayCount <= Number(lastDayTmp)) {
        let sumExpense = 0;
        let sumIncome = 0;

        const reducerMonth = new Date(dateFilterStatistic).getMonth();
        const reducerYear = new Date(dateFilterStatistic).getFullYear();

        expenses.map((expense) => {
          const expenseDay = new Date(expense.createdDate!).getDate();
          const expenseMonth = new Date(expense.createdDate!).getMonth();
          const expenseYear = new Date(expense.createdDate!).getFullYear();

          if (
            dayCount == expenseDay &&
            expenseMonth == reducerMonth &&
            expenseYear == reducerYear
          ) {
            sumExpense += expense.productAmount * expense.productCoefficient;
            sumExpensesTmp +=
              expense.productAmount * expense.productCoefficient;
          }
        });

        barchartDatasTmp.push({
          label: String(dayCount),
          value: sumExpense,
          frontColor: red,
          spacing: 3,
          labelWidth: 20,
        });

        income.map((income, index) => {
          const incomeDay = new Date(income.createdDate!).getDate();
          const incomeMonth = new Date(income.createdDate!).getMonth();
          const incomeYear = new Date(income.createdDate!).getFullYear();

          if (
            dayCount == incomeDay &&
            incomeMonth == reducerMonth &&
            incomeYear == reducerYear
          ) {
            sumIncome += Number(income.amount);
            sumIncomeTmp += Number(income.amount);
          }
        });
        barchartDatasTmp.push({
          value: sumIncome,
          frontColor: green,
        });
        dayCount++;
      }
    }

    setBarChartDatas(barchartDatasTmp);
    setSumIncome(sumIncomeTmp);
    setSumExpenses(sumExpensesTmp);
  };

  useEffect(() => {
    getBarChartValueExpense();
  }, [expenses, yearlyMonthly, dateFilterStatistic]);
  return (
    <View style={styles.barChartContainer}>
      <View style={styles.monthOrYearContainer}>
        <TouchableOpacity
          onPress={() => {
            setYearlyMonthly("year");
          }}
        >
          <Text
            style={[
              styles.text,
              yearlyMonthly == "year"
                ? { backgroundColor: orange, color: "#414141ff" }
                : { backgroundColor: "#414141ff" },
            ]}
          >
            Yearly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setYearlyMonthly("month");
          }}
        >
          <Text
            style={[
              styles.text,
              yearlyMonthly == "month"
                ? { backgroundColor: orange, color: "#414141ff" }
                : { backgroundColor: "#414141ff" },
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.monthFilterContainer}>
        <TouchableOpacity
          delayPressIn={0}
          onPress={() => {
            setDatePickerVisible(true);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="filter-circle" size={14} color={TitleColor} />
          <Text style={styles.month}>
            {yearlyMonthly == "year"
              ? dateFilterStatistic.getFullYear()
              : BARCHARTMONTH[dateFilterStatistic.getMonth()] +
                " " +
                dateFilterStatistic.getFullYear()}
          </Text>

          <Ionicons name="chevron-down-outline" size={14} color={TitleColor} />
        </TouchableOpacity>

        <CustomDatePicker
          visible={datePickerVisible}
          mode={yearlyMonthly == "year" ? "year" : "month-year"}
          onClose={() => setDatePickerVisible(false)}
          dateFilter={dateFilterStatistic}
          onConfirm={(month, year) => {
            // 1. Créez une NOUVELLE instance à partir de la valeur existante
            const newDate = new Date(dateFilterStatistic);

            // 2. Appliquez les modifications sur cette nouvelle instance
            if (yearlyMonthly === "month" && month) {
              newDate.setMonth(BARCHARTMONTH.indexOf(month));
            }
            newDate.setFullYear(Number(year));

            // 3. Mettez à jour le store avec ce nouvel objet
            setDateFilterStatistic(newDate);
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 20, overflow: "hidden" }}>
        <BarChart
          data={barChartDatas}
          frontColor={"#FFD056"}
          barWidth={10}
          gradientColor={"#FFEEFE"}
          noOfSections={5}
          barBorderRadius={4}
          yAxisThickness={0}
          xAxisThickness={0}
          spacing={24}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barChartContainer: {
    width: Dimensions.get("screen").width - 20,
    marginBottom: 40,
    alignSelf: "center",
    paddingVertical: 30,
  },
  monthOrYearContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#414141ff",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  text: {
    paddingVertical: 10,
    color: "#FFF",
    paddingHorizontal: 50,
  },

  monthFilterContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
    alignSelf: "center",
  },

  month: {
    fontFamily: "k2d-light",
    fontSize: 14,
    marginHorizontal: 10,
  },
});

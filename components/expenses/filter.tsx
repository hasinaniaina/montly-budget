import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { green, red, TextColor, TitleColor } from "@/constants/Colors";
import {
  formatNewDateDecrease,
  formatNewDateIncrease,
  getCategorieDependToCategorieSearch,
  getCategorieDependToDate,
  getExpensesDependToDate,
  getExpensesDependToExpensesSearch,
  getValueForBarChart,
  numStr,
  prettyLog,
  retrieveFirstAndLastDay,
} from "@/constants/utils";
import {
  useCategoriesStore,
  useChangedStore,
  useDateFilterStore,
  useProductsStore,
} from "@/constants/store";
import { MONTH } from "@/constants/constant";

enum CountActionKind {
  INCREASE = "INCREASE",
  DECREASE = "DECREASE",
}

interface CountAction {
  type: CountActionKind;
}

interface CountState {
  date: string;
}

export default function Filter({
  setThereIsFilter,
}: {
  setThereIsFilter: (val: boolean[]) => void;
}) {
  const dateReducer = (state: CountState, action: CountAction): CountState => {
    switch (action.type) {
      case CountActionKind.INCREASE: {
        const newDate = new Date(state.date);
        newDate.setMonth(new Date(state.date).getMonth() + 1);
        return { date: newDate.toString() };
      }

      case CountActionKind.DECREASE: {
        const newDate = new Date(state.date);
        newDate.setMonth(new Date(state.date).getMonth() - 1);
        return { date: newDate.toString() };
      }

      default:
        return state;
    }
  };

  const [sum, setSum] = useState<number>(0);
  const [state, dispatch] = useReducer(dateReducer, {
    date: new Date().toString(),
  });

  const categories = useCategoriesStore((state) => state.categories);

  const expenses = useProductsStore((state) => state.categoryProducts);

  const currentDateExpenses = useProductsStore(
    (state) => state.currentDateExpenses,
  );

  const setCurrentDateExpenses = useProductsStore(
    (state) => state.setCurrentDateExpenses,
  );
  const change = useChangedStore((state) => state.changeHome);
  const setChange = useChangedStore((state) => state.setChangeHome);
  const categoryProducts = useProductsStore((state) => state.categoryProducts);

  const setDateFilter = useDateFilterStore((state) => state.setDateFilter);
  const dateFilter = useDateFilterStore((state) => state.dateFilter);
  const [expenseSearchCache, setExpenseSearchCache] = useState<string>("");

  const getSumExpenseForResume = (): number => {
    let expensesCount = 0;
    let sumExpensiveTmp = 0;

    if (currentDateExpenses) {
      while (expensesCount < currentDateExpenses.length) {
        sumExpensiveTmp +=
          currentDateExpenses[expensesCount].productAmount *
          currentDateExpenses[expensesCount].productCoefficient;
        expensesCount++;
      }
    }

    const result = sumExpensiveTmp;

    return result;
  };

  const retrieveDataAfterFilterDate = async (dateFilter: string[]) => {
    setThereIsFilter([true, false]);

    const newExpenses = getExpensesDependToDate(
      expenses,
      dateFilter,
      expenseSearchCache,
      "date",
    );

    setCurrentDateExpenses(newExpenses);
  };

  useEffect(() => {
    (async () => {
      const sumExpense = getSumExpenseForResume();
      const sumTmp = sumExpense;

      setSum(sumTmp);
    })();
  }, [currentDateExpenses]);

  return (
    <View style={styles.chartContainer}>
      {/* <View style={styles.barChartContainer}>
        <BarChart
          data={barChartDatas}
          frontColor={"#FFD056"}
          barWidth={15}
          gradientColor={"#FFEEFE"}
          noOfSections={3}
          barBorderRadius={4}
          yAxisThickness={0}
          xAxisThickness={0}
        />
      </View> */}
      <View style={styles.expensesIncomeContainer}>
        <View style={styles.textIconAmountContainer}>
          <Text style={styles.textExpensesIncome}>Expenses</Text>
          <View style={styles.iconAmountContainer}>
            <Ionicons name="arrow-up-circle" size={20} color={red} />
            <Text style={styles.amount}>
              {numStr(String(sum), ".")}&nbsp;Ariary
            </Text>
          </View>
        </View>
        <View style={styles.textIconAmountContainer}>
          <Text style={styles.textExpensesIncome}>Income</Text>
          <View style={styles.iconAmountContainer}>
            <Ionicons name="arrow-down-circle" size={20} color={green} />
            <Text style={styles.amount}>
              {numStr(String("300000"), ".")}&nbsp;Ariary
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.monthFilterContainer}>
        <TouchableOpacity
          onPress={() => {
            dispatch({ type: CountActionKind.DECREASE });

            setTimeout(() => {
              const theDate = formatNewDateDecrease(state.date);
              const { firstDay, lastDay } = retrieveFirstAndLastDay(
                theDate.toString(),
                true,
              );

              setDateFilter([firstDay, lastDay]);
              retrieveDataAfterFilterDate([firstDay, lastDay]);
            }, 500);
          }}
        >
          <Ionicons name="arrow-back-circle" size={25} color={TitleColor} />
        </TouchableOpacity>
        <Text style={styles.month}>
          {String(MONTH[new Date(state.date).getMonth()])}&nbsp;
          {String(new Date(state.date).getFullYear())}
        </Text>

        <TouchableOpacity
          onPress={() => {
            dispatch({ type: CountActionKind.INCREASE });

            setTimeout(() => {
              const theDate = formatNewDateIncrease(state.date);
              const { firstDay, lastDay } = retrieveFirstAndLastDay(
                theDate.toString(),
                true,
              );

              setDateFilter([firstDay, lastDay]);
              retrieveDataAfterFilterDate([firstDay, lastDay]);
            }, 500);
          }}
        >
          <Ionicons name="arrow-forward-circle" size={25} color={TitleColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchCategory}>
        <Ionicons name="search-outline" size={25} color="#000" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Expenses"
          onChangeText={(expensesSearch) => {
            const newExpenses = getExpensesDependToExpensesSearch(
              expenses,
              expensesSearch,
              dateFilter,
              "expensesSearch",
            );

            setCurrentDateExpenses(newExpenses);
            setExpenseSearchCache(expensesSearch);
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

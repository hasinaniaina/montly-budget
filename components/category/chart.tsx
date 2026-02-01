import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, useReducer, useState } from "react";
// import { BarChart } from "react-native-gifted-charts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { green, red, TextColor, TitleColor } from "@/constants/Colors";
import {
  formatNewDateDecrease,
  formatNewDateIncrease,
  getCategorieDependToCategorieSearch,
  getCategorieDependToDate,
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
import { month } from "@/constants/constant";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";

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

export default function Chart({
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
  const currentCategoryDatas = useCategoriesStore(
    (state) => state.currentCategoryDatas,
  );
  const setCurrentCategoryDatas = useCategoriesStore(
    (state) => state.setCurrentCategoryDatas,
  );
  const change = useChangedStore((state) => state.changeHome);
  const setChange = useChangedStore((state) => state.setChangeHome);
  const categoryProducts = useProductsStore((state) => state.categoryProducts);

  const setDateFilter = useDateFilterStore((state) => state.setDateFilter);
  const dateFilter = useDateFilterStore((state) => state.dateFilter);
  const [categorySearchCache, setCategorySearchCache] = useState<string>("");

  const getSumExpenseForResume = (): number => {
    let categoryCount = 0;
    let sumExpensiveTmp = 0;

    if (currentCategoryDatas) {
      while (categoryCount < currentCategoryDatas.length) {
        let transactionNumber = 0;
        let productCount = 0;

        if (categoryProducts) {
          while (productCount < categoryProducts.length) {
            if (
              categoryProducts[productCount].idCreationCategory ==
              currentCategoryDatas[categoryCount].idCreationCategory
            ) {
              sumExpensiveTmp +=
                categoryProducts[productCount].productAmount *
                categoryProducts[productCount].productCoefficient;
              transactionNumber += 1;
            }
            productCount++;
          }
        }
        categoryCount++;
      }
    }

    const result = sumExpensiveTmp;
    return result;
  };

  const retrieveDataAfterFilterDate = async (dateFilter: string[]) => {
    setThereIsFilter([true, false]);

    const newCategories = getCategorieDependToDate(categories, dateFilter, categorySearchCache, "date");

    setCurrentCategoryDatas(newCategories);
    setChange(true);
  };

  useEffect(() => {
    (async () => {
      const sumExpense = getSumExpenseForResume();

      const sumTmp = sumExpense;

      setSum(sumTmp);
    })();
  }, [currentCategoryDatas]);

  const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

  return (
    <View style={styles.chartContainer}>
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
              const dateForFilter = [firstDay, lastDay];
              setDateFilter(dateForFilter);
              retrieveDataAfterFilterDate(dateForFilter);
            }, 500);
          }}
        >
          <Ionicons name="arrow-back-circle" size={25} color={TitleColor} />
        </TouchableOpacity>
        <Text style={styles.month}>
          {String(month[new Date(state.date).getMonth()])}&nbsp;
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
              const dateForFilter = [firstDay, lastDay];
              setDateFilter(dateForFilter);
              retrieveDataAfterFilterDate(dateForFilter);
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
          placeholder="Search Category"
          onChangeText={(categorySearch) => {
            const newCategories = getCategorieDependToCategorieSearch(
              categories,
              categorySearch,
              dateFilter,
              "categorySearch"
            );

            setCurrentCategoryDatas(newCategories);
            setCategorySearchCache(categorySearch);
            setChange(true);
          }}
        />
      </View>
      <View>{/* <BarChart data={data} /> */}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
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
});

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextColor } from "@/constants/Colors";
import {
  getExpensesDependToDate,
  getExpensesDependToExpensesSearch,
  prettyLog,
  retrieveFirstAndLastDay,
} from "@/constants/utils";
import {
  useDateFilterStore,
  useDisabledMonth,
  useProductsStore,
} from "@/constants/store";
import { BARCHARTMONTH } from "@/constants/constant";
import CustomDatePicker from "../customDatePicker";
import { GloblalStyles } from "@/constants/GlobalStyles";

export default function Filter() {
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  const expenses = useProductsStore((state) => state.categoryProducts);

  const setCurrentDateExpenses = useProductsStore(
    (state) => state.setCurrentDateExpenses,
  );

  const [dateFilter, setDateFilter] = useState<string[]>([]);

  const disabledMonth = useDisabledMonth((state) => state.disabled);
  const setDisabledMonth = useDisabledMonth((state) => state.setDisabled);
  const dateFilterStore = useDateFilterStore((state) => state.dateFilter);
  const setDateFilterStore = useDateFilterStore((state) => state.setDateFilter);

  const [expenseSearchCache, setExpenseSearchCache] = useState<string>("");

  const retrieveDataAfterFilterDate = async (dateFilter: string[]) => {
    const newExpenses = getExpensesDependToDate(
      expenses,
      dateFilter,
      expenseSearchCache,
      "date",
    );

    setCurrentDateExpenses(newExpenses);
  };

  useEffect(() => {
    (() => {
      const { firstDay, lastDay } = retrieveFirstAndLastDay(
        dateFilterStore.expenseDatefilter.toString(),
      );
      setDateFilter([firstDay, lastDay]);
    })();
  }, [dateFilterStore]);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.monthFilterContainer}>
        <TouchableOpacity
          delayPressIn={0}
          onPress={() => {
            setDatePickerVisible(true);
          }}
        >
          <Text style={styles.month}>
            {String(
              BARCHARTMONTH[
                new Date(dateFilterStore.expenseDatefilter).getMonth()
              ],
            )}
            &nbsp;
            {String(new Date(dateFilterStore.expenseDatefilter).getFullYear())}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          delayPressIn={0}
          style={styles.closeDateFilter}
          onPress={() => {
            setDisabledMonth(true);
          }}
        >
          <Ionicons name="lock-closed-outline" size={24} color={"#b8b8b8ff"} />
        </TouchableOpacity>
        <CustomDatePicker
          visible={datePickerVisible}
          mode={"month-year"}
          onClose={() => setDatePickerVisible(false)}
          dateFilter={dateFilterStore.expenseDatefilter}
          onConfirm={(month, year) => {
            // 1. Créez une NOUVELLE instance à partir de la valeur existante
            const dateFilterStoreTmp = { ...dateFilterStore };

            const newDate = new Date(dateFilterStore.expenseDatefilter);
            newDate.setMonth(BARCHARTMONTH.indexOf(month));
            newDate.setFullYear(Number(year));

            dateFilterStoreTmp.expenseDatefilter = new Date(newDate);

            // 3. Mettez à jour le store avec ce nouvel objet
            setDateFilterStore(dateFilterStoreTmp);
          }}
        />
        <TouchableOpacity
          delayPressIn={0}
          onPress={() => {
            setDisabledMonth(false);
          }}
          style={[
            GloblalStyles.disabledMonthContainer,
            disabledMonth ? { display: "flex" } : { display: "none" },
          ]}
        >
          <View style={GloblalStyles.disabledMonth}>
            <Ionicons name="lock-open-outline" size={24} color={"#b8b8b8ff"} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.searchCategory}>
        <Ionicons name="search-outline" size={25} color="#000" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Income"
          onChangeText={(expensesSearch) => {
            const newExpenses = getExpensesDependToExpensesSearch(
              expenses,
              expensesSearch,
              dateFilter,
              "expensesSearch",
              disabledMonth,
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
  monthFilterContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  barChartContainer: {
    width: Dimensions.get("screen").width - 20,
    marginBottom: 40,
    marginTop: 20,
  },
  disabledMonthContainer: {
    position: "absolute",
    width: "100%",
    height: 50,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeDateFilter: {
    marginLeft: 15,
    padding: 5,
  },
});

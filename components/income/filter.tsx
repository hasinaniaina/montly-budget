import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextColor } from "@/constants/Colors";
import {
  getIncomeDependToDate,
  getIncomeDependToIncomeSearch,
  retrieveFirstAndLastDay,
} from "@/constants/utils";
import {
  useDateFilterStore,
  useDisabledMonth,
  useIncomeStore,
} from "@/constants/store";
import { Income } from "@/constants/interface";
import { BARCHARTMONTH } from "@/constants/constant";
import CustomDatePicker from "../customDatePicker";
import { GloblalStyles } from "@/constants/GlobalStyles";

export default function Filter() {
  const currentUserIncomeDatas = useIncomeStore((state) => state.income);
  const setIncomeForFilter = useIncomeStore(
    (state) => state.setIncomeForFilter,
  );
  const setIsIncomeSearch = useIncomeStore((state) => state.setIsIncomeSearch);

  const dateFilterStore = useDateFilterStore((state) => state.dateFilter);
  const setDateFilterStore = useDateFilterStore((state) => state.setDateFilter);

  const disabledMonth = useDisabledMonth((state) => state.disabled);
  const setDisabledMonth = useDisabledMonth((state) => state.setDisabled);

  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [incomeSearchValue, setIncomeSearchValue] = useState<string>("");
  useEffect(() => {
    (async () => {
      const { firstDay, lastDay } = retrieveFirstAndLastDay(
        dateFilterStore.incomeDateFilter.toString(),
      );

      const newIncome = getIncomeDependToIncomeSearch(
        currentUserIncomeDatas,
        incomeSearchValue,
        [firstDay, lastDay],
        "incomeSearch",
        disabledMonth,
      );

      setIsIncomeSearch(true);
      setIncomeForFilter(newIncome);
    })();
  }, [disabledMonth]);

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
                new Date(dateFilterStore.incomeDateFilter).getMonth()
              ],
            )}
            &nbsp;
            {String(new Date(dateFilterStore.incomeDateFilter).getFullYear())}
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
          dateFilter={dateFilterStore.incomeDateFilter}
          onConfirm={(month, year) => {
            // 1. Créez une NOUVELLE instance à partir de la valeur existante
            const dateFilterStoreTmp = { ...dateFilterStore };

            const newDate = new Date(dateFilterStore.incomeDateFilter);
            newDate.setMonth(BARCHARTMONTH.indexOf(month));
            newDate.setFullYear(Number(year));

            dateFilterStoreTmp.incomeDateFilter = new Date(newDate);
            setDateFilterStore(dateFilterStoreTmp);

            // 3. Mettez à jour le store avec ce nouvel objet
            const { firstDay, lastDay } = retrieveFirstAndLastDay(
              dateFilterStoreTmp.incomeDateFilter.toString(),
            );

            const newIncome = getIncomeDependToDate(
              currentUserIncomeDatas,
              [firstDay, lastDay],
              incomeSearchValue,
              "date",
            );

            setIsIncomeSearch(true);
            setIncomeForFilter(newIncome);
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
          onChangeText={(incomeSearch) => {
            const { firstDay, lastDay } = retrieveFirstAndLastDay(
              dateFilterStore.incomeDateFilter.toString(),
            );

            const newIncome = getIncomeDependToIncomeSearch(
              currentUserIncomeDatas,
              incomeSearch,
              [firstDay, lastDay],
              "incomeSearch",
            );

            if (incomeSearch == "") {
              setIsIncomeSearch(false);
              setIncomeForFilter([]);
              return false;
            }

            setIsIncomeSearch(true);
            setIncomeForFilter(newIncome);
            setIncomeSearchValue(incomeSearch);
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

  closeDateFilter: {
    marginLeft: 15,
    padding: 5,
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

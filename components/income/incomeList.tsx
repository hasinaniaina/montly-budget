import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { green, orange, TextColor, TitleColor } from "@/constants/Colors";
import { Category, CreationCategory, Income } from "@/constants/interface";
import {
  useCategoriesStore,
  useIncomeStore,
  usePopupStore,
  useProductsStore,
  useShowActionButtonStore,
} from "@/constants/store";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function IncomeList() {
  const setSingleIncomeData = useIncomeStore(
    (state) => state.setSingleIncomeData,
  );

  const setPopupTitle = usePopupStore((state) => state.setTitle);
  const setPopupActionType = usePopupStore((state) => state.setActionType);

  const setPopupVisible = usePopupStore((state) => state.setVisible);

  const currentUserIncome = useIncomeStore((state) => state.income);

  const incomeForFilter = useIncomeStore((state) => state.incomeForFilter);

  const [incomeList, setIncomeList] = useState<Income[]>([]);

  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  useEffect(() => {
    console.log("Income list");

    const incomeListTmp =
      incomeForFilter.length == 0 ? currentUserIncome : incomeForFilter;
    setIncomeList(incomeListTmp);
  }, [incomeForFilter, currentUserIncome]);

  return (
    <>
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTitleFilterContainer}>
          <View style={GloblalStyles.titleFlexAlignement}>
            <Text style={GloblalStyles.titleSection}>Income list</Text>
          </View>
        </View>

        {/* Category Content */}
        <View style={styles.categoryContent}>
          {incomeList && incomeList.length > 0 ? (
            <FlatList
              data={incomeList}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.item}
                  key={index}
                  onPress={() => {
                    setSingleIncomeData(item);
                    setPopupTitle("Income");
                    setPopupActionType("update");
                    setPopupVisible(true);
                  }}
                >
                  <View>
                    <Ionicons name="cash-outline" size={20} color={green} />
                  </View>
                  <View style={styles.colorNamecontainer}>
                    <View style={styles.categoryName}>
                      <Text style={styles.name}>{item.label}</Text>
                      <Text style={GloblalStyles.CreatedDate}>
                        {new Date(item.createdDate!).toLocaleDateString(
                          "en-US",
                          options,
                        )}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.amountContainer}>
                    <Text style={styles.categoryIncome}>
                      {item.amount}
                      &nbsp;Ariary
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={GloblalStyles.noList}>
              <Text style={GloblalStyles.textNoList}>No Income</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.iconAdd]}
          onPress={() => {
            setPopupVisible(true);
            setPopupTitle("Income");
            setPopupActionType("insert");
          }}
        >
          <Ionicons
            name="add-circle"
            size={60}
            color={orange}
            style={{
              shadowOffset: { width: 10, height: 20 },
              shadowOpacity: 1,
              elevation: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  categoryTitleFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconFilterAddContainer: {
    flexDirection: "row",
  },
  iconFilter: {
    marginRight: 10,
  },
  iconAdd: {
    position: "absolute",
    alignItems: "center",
    bottom: -30,
    right: 10,
    zIndex: 10,
  },
  categoryContent: {
    marginTop: 10,
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  colorNamecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  colorCategory: {
    width: 10,
    height: 10,
    borderRadius: 20,
    marginRight: 15,
  },
  categoryName: {},
  name: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
  transaction: {
    fontFamily: "k2d-regular",
    color: TextColor,
    fontSize: 9,
  },
  categoryIncome: {
    fontFamily: "k2d-bold",
    color: green,
    alignSelf: "flex-end"
  },
  amountContainer: {
    flex: 1,
  }
});

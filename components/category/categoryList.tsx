import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Pressable,
  InteractionManager,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { green, orange, TextColor, TitleColor } from "@/constants/Colors";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";
import { router } from "expo-router";
import { removeCategory, retrieveCategoryById } from "@/constants/Controller";
import ConfirmationMessageModal from "../message/confirmationMessageModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useCategoriesStore,
  useChangedStore,
  useDateFilterStore,
  usePopupStore,
  useProductsStore,
  useShowActionButtonStore,
} from "@/constants/store";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CategoryList() {
  const setChange = useChangedStore((state) => state.setChangeHome);
  const products = useProductsStore((state) => state.categoryProducts);

  const insets = useSafeAreaInsets();

  const showActionButton = useShowActionButtonStore(
    (state) => state.showActionButton,
  );

  const categories = useCategoriesStore((state) => state.categories);

  const currentCategoryDatas = useCategoriesStore(
    (state) => state.currentCategoryDatas,
  );

  const setSingleCategoryData = useCategoriesStore(
    (state) => state.setSingleCategoryData,
  );

  const currentDateExpenses = useProductsStore((state) => state.currentDateExpenses);

  const setPopupTitle = usePopupStore((state) => state.setTitle);
  const setPopupActionType = usePopupStore((state) => state.setActionType);

  const setPopupVisible = usePopupStore((state) => state.setVisible);

  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Sum expenses each categories
  const [sumExpenseCategory, setSumExpenseCategory] =
    useState<Record<string, { amount: number }> | null>(null);

  const sumAmountExpensesForEachCategories = () => {
    let sumExpenseCategoryTmp: Record<string, { amount: number }> | null = null;
    console.log(currentDateExpenses);
    

    currentCategoryDatas.map((category) => {
      let amount = 0;
      currentDateExpenses.map((expense) => {
        if (category.idCreationCategory == expense.idCreationCategory) {
          amount += (expense.productAmount * expense.productCoefficient);
        }
      });

      sumExpenseCategoryTmp = {
        ...sumExpenseCategoryTmp,
        [category.idCategory]: { amount: amount }
      }
    });

    setSumExpenseCategory(sumExpenseCategoryTmp);
  };

  useEffect(() => {
    console.log("categories list");
    sumAmountExpensesForEachCategories();
  }, [currentCategoryDatas, currentDateExpenses]);

  return (
    <>
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTitleFilterContainer}>
          <View style={GloblalStyles.titleFlexAlignement}>
            <Text style={GloblalStyles.titleSection}>Category</Text>
          </View>
        </View>

        {/* Category Content */}
        <ScrollView>
          <View style={styles.categoryContent}>
            {currentCategoryDatas.length > 0 ? (
              currentCategoryDatas.map((category, index) => {
                return (
                  <TouchableOpacity
                    style={styles.item}
                    key={index}
                    onPress={() => {
                      let showActionButtonTmp = [...showActionButton];
                      showActionButtonTmp[index] = { display: "flex" };

                      setSingleCategoryData(category);
                      setPopupTitle("category");
                      setPopupActionType("update");
                      setPopupVisible(true);
                    }}
                  >
                    <View style={styles.colorNamecontainer}>
                      <View
                        style={[
                          styles.colorCategory,
                          { backgroundColor: (category as Category).color },
                        ]}
                      ></View>
                      <View style={styles.categoryName}>
                        <Text style={styles.name}>
                          {(category as Category).label}
                        </Text>
                        <Text style={GloblalStyles.CreatedDate}>
                          {new Date(
                            (category as CreationCategory).createdDate!,
                          ).toLocaleDateString("en-US", options)}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text style={styles.categoryIncome}>
                        {sumExpenseCategory &&
                        sumExpenseCategory[category.idCategory]
                          ? sumExpenseCategory[category.idCategory].amount
                          : 0}
                        &nbsp;Ariary
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={GloblalStyles.noList}>
                <Text style={GloblalStyles.textNoList}>
                  No Category
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.iconAdd, { marginBottom: insets.bottom }]}
          onPress={() => {
            setPopupVisible(true);
            setPopupTitle("category");
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
    bottom: 0,
    right: 10,
    zIndex: 10,
  },
  categoryContent: {
    marginTop: 10,
    marginBottom: 130,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  colorNamecontainer: {
    flexDirection: "row",
    alignItems: "center",
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
    color: TextColor,
  },
});

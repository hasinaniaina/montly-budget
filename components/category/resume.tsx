import { TextColor, TitleColor, orange } from "@/constants/Colors";
import { retrieveProductByCategory } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";
import { useCategoriesStore, useChangedStore } from "@/constants/store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function Resumes({
  productByCategory,
  categoryDateFilter,
  setPopupFilterByDateVisible,
}: {
  productByCategory: (Product & CreationProduct)[];
  categoryDateFilter: string[];
  setPopupFilterByDateVisible: (val: ViewStyle) => void;
}) {
  const categories = useCategoriesStore((state) => state.categories);

  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Sum of all expenses, income, saving
  const [sumExpenseResume, setSumExpenseResume] = useState<number>(0);

  const getSumExpenseForResume = (
    categories: (Category & CreationCategory)[],
    productByCategory: (Product & CreationProduct)[],
  ): number => {
    let categoryCount = 0;
    let sumExpensiveTmp = 0;
    
    if (categories) {
      while (categoryCount < categories.length) {
        let transactionNumber = 0;
        let productCount = 0;

        if (productByCategory) {
          while (productCount < productByCategory.length) {
            if (
              productByCategory[productCount].idCreationCategory ==
              categories[categoryCount].idCreationCategory
            ) {
              sumExpensiveTmp +=
                productByCategory[productCount].productAmount *
                productByCategory[productCount].productCoefficient;
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

  useEffect(() => {
    (() => {
      console.log("resume.tsx");

      const sumExpenseResumeTmp = getSumExpenseForResume(
        categories,
        productByCategory,
      );
      setSumExpenseResume(sumExpenseResumeTmp);
    })();
  }, [categories]);

  return (
    <>
      <View style={styles.resumeContainer}>
        <View style={styles.dateTitleFilterContainer}>
          <View
            style={[
              styles.iconTitleContainer,
              GloblalStyles.titleFlexAlignement,
            ]}
          >
            <Image
              source={require("@/assets/images/annual.png")}
              style={GloblalStyles.icon}
            />
            <Text style={GloblalStyles.titleSection}>
              {new Date(categoryDateFilter[0]).toLocaleDateString("en-US", options) +
                " - " +
                new Date(categoryDateFilter[1]).toLocaleDateString("en-US", options)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dateFilter}
            onPress={() => {
              setPopupFilterByDateVisible({ display: "flex" });
            }}
          >
            <Image
              source={require("@/assets/images/filter.png")}
              style={GloblalStyles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.numberTitleContainer}>
          <View style={styles.incomeSavingExpenses}>
            <Text style={styles.number}>{sumExpenseResume}&nbsp;Ar</Text>
            <Text style={styles.title}>Expenses</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  resumeContainer: {
    marginTop: 20,
  },
  dateTitleFilterContainer: {
    width: Dimensions.get("screen").width,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconTitleContainer: {},
  dateFilter: {},
  numberTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  incomeSavingExpenses: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: orange,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
  },
  number: {
    color: TitleColor,
    fontFamily: "k2d-bold",
  },
  title: {
    color: "#fff",
    fontFamily: "k2d-regular",
  },
});

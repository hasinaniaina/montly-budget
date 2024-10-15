import { TextColor, TitleColor } from "@/constants/Colors";
import { retrieveProductByCategory } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { Category, CreationCategory } from "@/constants/interface";
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
  change,
  getCategories,
  categoryDateFilter,
  setPopupFilterByDateVisible,
}: {
  change: boolean;
  getCategories: (val: Date[]) => Promise<Category[]>;
  categoryDateFilter: Date[];
  setPopupFilterByDateVisible: (val: ViewStyle) => void;
}) {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Sum of all expenses, income, saving
  type Resume = {
    income: number;
    saving: number;
    expense: number;
  };

  const [sum, setSum] = useState<Resume>({
    income: 0,
    saving: 0,
    expense: 0,
  });

  const getProduct = async () => {
    let product = await retrieveProductByCategory();
    return product;
  };

  const getSumIncome = async (category: Category[] & CreationCategory[]): Promise<number> => {
    let categoryCount = 0;
    let sumIncomeTmp = 0;

    while (categoryCount < category.length) {
      sumIncomeTmp += category[categoryCount].categoryIncome;
      categoryCount += 1;
    }
    return sumIncomeTmp;
  };

  const getSumExpense = async (category: Category[] & CreationCategory[]): Promise<number> => {
    const product = await getProduct();
    let categoryCount = 0;
    let sumExpensiveTmp = 0;

    while (categoryCount < category.length) {
      let transactionNumber = 0;
      let productCount = 0;

      while (productCount < product.length) {
        if (product[productCount].idCreationCategory == category[categoryCount].idCreationCategory) {
          sumExpensiveTmp +=
            product[productCount].productAmount * product[productCount].productCoefficient;
          transactionNumber += 1;
        }
        productCount++;
      }
      categoryCount++;
    }

    return sumExpensiveTmp;
  };

  useEffect(() => {
    getCategories(categoryDateFilter).then((categories) => {
      getSumIncome(categories as Category[] & CreationCategory[]).then((sumIncome) => {
        getSumExpense(categories as Category[] & CreationCategory[]).then((sumExpense) => {
          const sumTmp: Resume = {
            income: sumIncome,
            expense: sumExpense,
            saving: sumIncome - sumExpense,
          };

          setSum(sumTmp);
        });
      });
    });
  }, [change]);

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
              {categoryDateFilter[0].toLocaleDateString("en-US", options) +
                " - " +
                categoryDateFilter[1].toLocaleDateString("en-US", options)}
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
            <Text style={styles.number}>{sum.income ? sum.income : 0} Ar</Text>
            <Text style={styles.title}>Income</Text>
          </View>
          <View style={styles.incomeSavingExpenses}>
            <Text style={styles.number}>
              {sum.expense ? sum.expense : 0} Ar
            </Text>
            <Text style={styles.title}>Expenses</Text>
          </View>
          <View style={styles.incomeSavingExpenses}>
            <Text style={styles.number}>{sum.saving ? sum.saving : 0} Ar</Text>
            <Text style={styles.title}>Saving</Text>
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
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  incomeSavingExpenses: {},
  number: {
    color: TitleColor,
    fontFamily: "k2d-bold",
  },
  title: {
    color: TextColor,
    fontFamily: "k2d-regular",
  },
});

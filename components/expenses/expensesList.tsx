import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { TextColor, TitleColor, green, orange, red } from "@/constants/Colors";
import { CreationProduct } from "@/constants/interface";
import { useEffect, useState } from "react";
import { GloblalStyles } from "@/constants/GlobalStyles";
import {
  useCategoriesStore,
  useDisabledMonth,
  usePopupStore,
  useProductsStore,
} from "@/constants/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { numStr } from "@/constants/utils";

export default function ExpensesList() {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const [price, setPrice] = useState<string[]>();
  const [coefficient, setCoefficient] = useState<string[]>();

  const currentDateExpenses = useProductsStore((state) => state.currentDateExpenses);
  const categories = useCategoriesStore((state) => state.categories);
  const setSingleExpenseData = useProductsStore(
    (state) => state.setSingleExpenseData,
  );

  const allExpensesList = useProductsStore((state) => state.categoryProducts);

  const setPopupTitle = usePopupStore((state) => state.setTitle);
  const setPopupActionType = usePopupStore((state) => state.setActionType);
  const setPopupVisible = usePopupStore((state) => state.setVisible);
  const disabledMonth = useDisabledMonth((state) => state.disabled);

  const [expenseCategory, setExpenseCategory] = useState<Record<
    string,
    { categoryLabel: string }
  > | null>(null);

  const calculPriceForEachProduct = () => {
    let totalAmountTmp = 0;
    let price: string[] = [];
    let coefficient: string[] = [];

    allExpensesList?.forEach((data) => {
      totalAmountTmp +=
        (data as CreationProduct).productAmount *
        (data as CreationProduct).productCoefficient;
    });

    if (currentDateExpenses) {
      for (let data of currentDateExpenses) {
        const priceTmp = data.productAmount * data.productCoefficient;
        price.push(priceTmp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
      }
    }

    setPrice(price);
    setCoefficient(coefficient);
  };

  const getExpensesGroup = () => {
    let expenseCategoryTmp: Record<string, { categoryLabel: string }> | null =
      null;
    categories.map((category, index) => {
      currentDateExpenses.map((expense) => {
        if (expense.idCreationCategory == category.idCreationCategory) {
          expenseCategoryTmp = {
            ...expenseCategoryTmp,
            [expense.idProduct]: { categoryLabel: category.label },
          };
        }
      });
    });

    setExpenseCategory(expenseCategoryTmp);
  };

  useEffect(() => {
    (() => {
      calculPriceForEachProduct();
      getExpensesGroup();
    })();
  }, [currentDateExpenses]);

  return (
    <View style={styles.container}>
      <View style={GloblalStyles.titleFlexAlignement}>
        <Text style={GloblalStyles.titleSection}>Current expenses</Text>
      </View>
      {currentDateExpenses && currentDateExpenses.length > 0 ? (
        <FlatList
          data={currentDateExpenses}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                setSingleExpenseData(currentDateExpenses[index]);
                setPopupTitle("Expenses");
                setPopupActionType("update");
                setPopupVisible(true);
              }}
              style={styles.listProduct}
            >
              <View style={[styles.itemsContainer]}>
                <View style={styles.itemLeftContent}>
                  <View
                    style={[styles.itemColor]}
                  >
                    <Ionicons name="cash-outline" size={20} color={red} />
                  </View>
                  <View>
                    <Text style={[styles.productName]}>{item.designation}</Text>
                    <Text style={{ fontSize: 10 }}>
                      Category:
                      {expenseCategory && expenseCategory[item.idProduct]
                        ? expenseCategory[item.idProduct].categoryLabel
                        : ""}
                    </Text>
                    <Text style={GloblalStyles.CreatedDate}>
                      {new Date(
                        (item as CreationProduct).createdDate!,
                      ).toLocaleDateString("en-US", options)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.itemRightContent]}>
                  <Text style={styles.price}>
                    -{price ? price[index] : ""} Ariary
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={GloblalStyles.noList}>
          <Text style={GloblalStyles.textNoList}>No Expenses</Text>
        </View>
      )}

      {!disabledMonth && (
        <TouchableOpacity
          style={[styles.iconAdd]}
          onPress={() => {
            setPopupVisible(true);
            setPopupTitle("Expenses");
            setPopupActionType("insert");
          }}
        >
          <Ionicons name="add-circle" size={60} color={orange} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingHorizontal: 20,
    flex: 1,
  },
  listProduct: {
    padding: 6,
    borderRadius: 5,
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    borderRadius: 10,
  },
  itemLeftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemColor: {
    borderRadius: 5,
    marginRight: 10,
    
  },
  productName: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
  itemRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontFamily: "k2d-regular",
    color: red,
  },
  buttonsAction: {
    position: "absolute",
    flexDirection: "row",
    right: 0,
    zIndex: 20,
    marginRight: 5,
    // backgroundColor: "#FFF",
    paddingVertical: 6,
    borderRadius: 5,
    display: "none",
  },
  editIconContainer: {
    backgroundColor: green,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  editIcon: {
    width: 15,
    height: 15,
  },
  deleteIconContainer: {
    backgroundColor: red,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  deleteIcon: {
    width: 15,
    height: 15,
  },
  percentage: {
    color: TextColor,
    fontFamily: "k2d-regular",
  },

  iconAdd: {
    position: "absolute",
    alignItems: "center",
    bottom: -30,
    right: 10,
    zIndex: 10,
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1,
    elevation: 10,
  },
});

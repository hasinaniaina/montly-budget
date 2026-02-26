import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ColorPickerViewNew from "../colorPickerNew";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { red, TextColor, TitleColor } from "@/constants/Colors";
import {
  useCategoriesStore,
  usePopupStore,
  useProductsStore,
} from "@/constants/store";
import { CreationProduct, Product } from "@/constants/interface";

import RNPickerSelect, { Item } from "react-native-picker-select";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import {
  editProduct,
  removeProduct,
  saveProduct,
} from "@/constants/Controller";
import { sortedArrayExpenses } from "@/constants/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CategoriesSelectPicker = {
  label: string;
  value: string;
};

export default function AddExpensesInput() {
  // Initiate list day number
  const [dayNumber, setDayNumber] = useState<Item[]>();

  const singleExpenseData = useProductsStore(
    (state) => state.singleExpenseData,
  );

  const setSingleExpenseData = useProductsStore(
    (state) => state.setSingleExpenseData,
  );

  const popupVisible = usePopupStore((state) => state.visible);
  const setPopupVisible = usePopupStore((state) => state.setVisible);

  const categories = useCategoriesStore((state) => state.categories);

  const popupActionType = usePopupStore((state) => state.actionType);

  const currentDateExpenses = useProductsStore(
    (state) => state.currentDateExpenses,
  );
  const setCurrentDateExpenses = useProductsStore(
    (state) => state.setCurrentDateExpenses,
  );

  const setPopupTitle = usePopupStore((state) => state.setTitle);
  const setPopupActionType = usePopupStore((state) => state.setActionType);
  const setAddCategoryInExpenseView = usePopupStore(
    (state) => state.setAddCategoryInExpenseView,
  );

  const setCategoryProducts = useProductsStore(
    (state) => state.setCategoryProducts,
  );

  const currentCategoryDatas = useCategoriesStore(
    (state) => state.currentCategoryDatas,
  );
  const categoryProducts = useProductsStore((state) => state.categoryProducts);

  const expenseAmount = singleExpenseData?.productAmount
    ? singleExpenseData.productAmount
    : null;

  const expenseCoefficient = singleExpenseData?.productCoefficient
    ? singleExpenseData.productCoefficient
    : null;

  //   Stock Total amount in add expenses view
  const [amount, setAmount] = useState<number | null>(expenseAmount);

  const [coefficient, setCoefficient] = useState<number | null>(
    expenseCoefficient,
  );

  const [categoriesSelectPicker, setCategoriesSelectPicker] = useState<
    CategoriesSelectPicker[] | null
  >(null);

  const [loading, setLoading] = useState<boolean>(false);

  // Initialize number of day (1 to 31)
  const getListDayNumber = () => {
    let dayNumberTmp: Item[] = [];

    for (let i = 1; i < 32; i++) {
      dayNumberTmp?.push({
        label: i.toString(),
        value: i,
      });
    }

    setDayNumber(dayNumberTmp);
  };

  const getCategoryLabelListForSelectPicker = () => {
    const categoriesSelectPickerTmp = [] as CategoriesSelectPicker[];

    const SortedCategory = currentCategoryDatas.sort((a, b) =>
      a.label.localeCompare(b.label),
    );

    SortedCategory.map((category) => {
      categoriesSelectPickerTmp.push({
        label: category.label,
        value: category.idCreationCategory,
      });
    });

    setCategoriesSelectPicker(categoriesSelectPickerTmp);
  };

  const addExpense = async (): Promise<boolean> => {
    const inputsNotEmpty = checkInputsEmpty(singleExpenseData!);

    if (inputsNotEmpty) {
      const uuidExpense = crypto.randomUUID();
      const uuidCreationExpense = crypto.randomUUID();

      const result = await saveProduct(
        singleExpenseData!,
        uuidExpense,
        uuidCreationExpense,
      );

      const currentDateExpensesTmp = [...currentDateExpenses];
      const categoryProductsTmp = [...categoryProducts];

      const newCurrentExpensesData: Product & CreationProduct = {
        designation: singleExpenseData?.designation!,
        color: singleExpenseData?.color!,
        idCreationProduct: uuidCreationExpense,
        idCreationCategory: singleExpenseData?.idCreationCategory!,
        idProduct: uuidExpense,
        createdDate: new Date(),
        productAmount: singleExpenseData?.productAmount!,
        productCoefficient: singleExpenseData?.productCoefficient!,
      };

      currentDateExpensesTmp.push(newCurrentExpensesData);
      const currentExpensesSorted = sortedArrayExpenses(currentDateExpensesTmp);
      setCurrentDateExpenses(currentExpensesSorted);

      categoryProductsTmp.push(newCurrentExpensesData);
      const categoryProductsSorted = sortedArrayExpenses(categoryProductsTmp);
      setCategoryProducts(categoryProductsSorted);

      if (result) {
        Toast.show({
          type: "success",
          text1: "Expense inserted!!!",
        });

        setSingleExpenseData(null);
        return true;
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong!!!",
        });

        const currentExpensesSortedDontDelete = currentExpensesSorted.filter(
          (item) => item.idProduct !== uuidExpense,
        );

        setCurrentDateExpenses(currentExpensesSortedDontDelete);
        return true;
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Inputs should not be empty!!!",
      });
      return true;
    }
  };

  const updateExpense = async (): Promise<boolean> => {
    const inputsNotEmpty = checkInputsEmpty(singleExpenseData!);

    if (inputsNotEmpty) {
      const result = await editProduct(singleExpenseData!);

      if (result) {
        Toast.show({
          type: "success",
          text1: "Expense updated!!!",
        });
        const currentDateExpensesTmp = [...currentDateExpenses];
        const categoryProductsTmp = [...categoryProducts];

        currentDateExpensesTmp.map((currentDateExpense, index) => {
          if (currentDateExpense.idProduct == singleExpenseData?.idProduct) {
            currentDateExpensesTmp[index].designation =
              singleExpenseData.designation;
            currentDateExpensesTmp[index].color = singleExpenseData.color;
            currentDateExpensesTmp[index].idCreationCategory =
              singleExpenseData.idCreationCategory;
            currentDateExpensesTmp[index].productAmount =
              singleExpenseData.productAmount;
            currentDateExpensesTmp[index].productCoefficient =
              singleExpenseData.productCoefficient;
          }
        });

        categoryProductsTmp.map((categoryProduct, index) => {
          if (categoryProduct.idProduct == singleExpenseData?.idProduct) {
            categoryProductsTmp[index].designation =
              singleExpenseData.designation;
            categoryProductsTmp[index].color = singleExpenseData.color;
            categoryProductsTmp[index].idCreationCategory =
              singleExpenseData.idCreationCategory;
            categoryProductsTmp[index].productAmount =
              singleExpenseData.productAmount;
            categoryProductsTmp[index].productCoefficient =
              singleExpenseData.productCoefficient;
          }
        });

        setCurrentDateExpenses(currentDateExpensesTmp);
        setCategoryProducts(categoryProductsTmp);

        setSingleExpenseData(null);
        setPopupVisible(false);
        return true;
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong!!!",
        });
        return true;
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Inputs should not be empty!!!",
      });
      return true;
    }
  };

  const removeExpense = async (): Promise<boolean> => {
    const result = await removeProduct(singleExpenseData?.idCreationProduct!);

    if (result) {
      const newCurrentCategoryDatas = currentDateExpenses.filter(
        (item) => item.idProduct !== singleExpenseData?.idProduct,
      );

      const newCategoryProducts = categoryProducts.filter(
        (item) => item.idProduct !== singleExpenseData?.idProduct,
      );

      setCurrentDateExpenses(newCurrentCategoryDatas);
      setCategoryProducts(newCategoryProducts);

      Toast.show({
        type: "success",
        text1: "Expense deleted!!!",
      });

      setPopupVisible(false);
      setSingleExpenseData(null);
      return true;
    } else {
      Toast.show({
        type: "error",
        text1: "Inputs should not be empty!!!",
      });
      return true;
    }
  };

  const checkInputsEmpty = (singleExpenseData: Product & CreationProduct) => {
    if (
      !singleExpenseData ||
      !singleExpenseData.color ||
      singleExpenseData.color == "" ||
      !singleExpenseData.designation ||
      singleExpenseData.designation == "" ||
      !singleExpenseData.productAmount ||
      singleExpenseData.productAmount == 0 ||
      !singleExpenseData.productCoefficient ||
      singleExpenseData.productCoefficient == 0 ||
      !singleExpenseData.idCreationCategory ||
      singleExpenseData.idCreationCategory == ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    (() => {
      getListDayNumber();
      getCategoryLabelListForSelectPicker();
    })();
  }, [popupVisible, singleExpenseData, currentCategoryDatas]);

  return (
    <View
      style={{
        flex: 1,
        width: Dimensions.get("screen").width,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ColorPickerViewNew
        data={singleExpenseData}
        setData={setSingleExpenseData}
      />
      <View style={styles.popupLabelInput}>
        <Text style={GloblalStyles.appLabel}>Label</Text>
        <View style={GloblalStyles.appInput}>
          <TextInput
            placeholder="Exemple"
            value={singleExpenseData?.designation}
            onChangeText={(designation) => {
              let expenseTmp = { ...singleExpenseData } as Product &
                CreationProduct;
              expenseTmp.designation = designation;
              setSingleExpenseData(expenseTmp);
            }}
          />
        </View>
      </View>

      <View style={[styles.popupLabelInput]}>
        <Text style={GloblalStyles.appLabel}>Category</Text>
        <View
          style={[
            GloblalStyles.appInput,
            {
              height: 40,
              alignItems: "center",
              flexDirection: "row",
              width: "70%",
            },
          ]}
        >
          <View style={{ width: 220 }}>
            <RNPickerSelect
              value={
                singleExpenseData && singleExpenseData.idCreationCategory
                  ? singleExpenseData?.idCreationCategory
                  : null
              }
              onValueChange={(idCreationCategory) => {
                let expenseTmp = { ...singleExpenseData } as Product &
                  CreationProduct;
                expenseTmp.idCreationCategory = idCreationCategory;
                setSingleExpenseData(expenseTmp);
              }}
              items={categoriesSelectPicker ? categoriesSelectPicker : []}
            ></RNPickerSelect>
          </View>
          {popupActionType == "insert" && (
            <TouchableOpacity
              style={{
                marginLeft: 10,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setPopupTitle("Category");
                setPopupActionType("insert");
                setAddCategoryInExpenseView(true);
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={30}
                color={"#414141ff"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.popupLabelInput, { flexDirection: "row" }]}>
        <View style={{ width: "58%", marginRight: 10 }}>
          <Text style={GloblalStyles.appLabel}>Amount</Text>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="0"
              keyboardType="numeric"
              value={
                singleExpenseData?.productAmount != 0
                  ? singleExpenseData?.productAmount?.toString()
                  : ""
              }
              onChangeText={(amountFieldValue) => {
                setAmount(parseFloat(amountFieldValue));

                let expenseTmp = { ...singleExpenseData } as Product &
                  CreationProduct;
                expenseTmp.productAmount = amountFieldValue
                  ? parseFloat(amountFieldValue)
                  : 0;
                setSingleExpenseData(expenseTmp);
              }}
            />
          </View>
        </View>

        <View style={{ width: "40%", marginRight: 10 }}>
          <Text style={GloblalStyles.appLabel}>Day</Text>
          <View
            style={[
              GloblalStyles.appInput,
              {
                height: 40,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <RNPickerSelect
              value={
                singleExpenseData && singleExpenseData.productCoefficient
                  ? singleExpenseData?.productCoefficient
                  : null
              }
              onValueChange={(dayFieldValue) => {
                let expenseTmp = { ...singleExpenseData } as Product &
                  CreationProduct;
                expenseTmp.productCoefficient = parseInt(dayFieldValue);

                setCoefficient(dayFieldValue);
                setSingleExpenseData(expenseTmp);
              }}
              items={dayNumber ? dayNumber : []}
            ></RNPickerSelect>
          </View>
        </View>
      </View>
      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmount}>
          Total amount:&nbsp;
          {singleExpenseData &&
          singleExpenseData.productAmount &&
          singleExpenseData.productCoefficient
            ? singleExpenseData.productAmount *
              singleExpenseData.productCoefficient
            : 0}
          &nbsp; Ar
        </Text>
      </View>
      {popupActionType == "insert" ? (
        <TouchableOpacity
          style={[GloblalStyles.popupButton]}
          onPress={async () => {
            setLoading(true);
            const result = await addExpense();
            if (result) {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Text style={GloblalStyles.popupButtonTitle}>Add</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={GloblalStyles.deleteButtonAndActionButtonContainer}>
          <TouchableOpacity
            style={[GloblalStyles.popupButton]}
            onPress={async () => {
              setLoading(true);
              const result = await updateExpense();
              if (result) {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={"white"}/>
            ) : (
              <Text style={GloblalStyles.popupButtonTitle}>Update</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={GloblalStyles.deleteIconContainer}
            onPress={async () => {
              setLoading(true);
              const result = await removeExpense();

              if (result) {
                setLoading(false);
              }
            }}
          >
            <Ionicons name="trash-outline" size={30} color={red} />
          </TouchableOpacity>
        </View>
      )}

      <Toast position="bottom" visibilityTime={2000} />
    </View>
  );
}

const styles = StyleSheet.create({
  popupLabelInput: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    width: Dimensions.get("screen").width,
  },
  totalAmountContainer: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 20,
  },
  totalAmount: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
});

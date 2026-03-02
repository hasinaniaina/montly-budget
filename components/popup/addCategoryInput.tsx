import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import ColorPickerViewNew from "../colorPickerNew";
import { TextInput } from "react-native-gesture-handler";
import { GloblalStyles } from "@/constants/GlobalStyles";
import {
  useCategoriesStore,
  useChangedStore,
  usePopupStore,
  useProductsStore,
} from "@/constants/store";
import {
  checkIfCategorylabelAlreadyStored,
  prettyLog,
  sortedArray,
} from "@/constants/utils";
import {
  createCategory,
  editCategory,
  removeCategory,
} from "@/constants/Controller";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { updateCategory } from "@/constants/db";
import Ionicons from "@expo/vector-icons/Ionicons";
import { red } from "@/constants/Colors";
import { err } from "react-native-svg";

export default function AddCategoryInput() {
  const singleCategoryData = useCategoriesStore(
    (state) => state.singleCategoryData,
  );
  const setSingleCategoryData = useCategoriesStore(
    (state) => state.setSingleCategoryData,
  );

  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  const popupActionType = usePopupStore((state) => state.actionType);

  const currentCategoryDatas = useCategoriesStore(
    (state) => state.currentCategoryDatas,
  );

  const setCurrentCategoryDatas = useCategoriesStore(
    (state) => state.setCurrentCategoryDatas,
  );

  const singleExpenseData = useProductsStore(
    (state) => state.singleExpenseData,
  );

  const setSingleExpenseData = useProductsStore(
    (state) => state.setSingleExpenseData,
  );

  const setPopupTitle = usePopupStore((state) => state.setTitle);
  const setPopupActionType = usePopupStore((state) => state.setActionType);
  const addCategoryInExpenseView = usePopupStore(
    (state) => state.addCategoryInExpenseView,
  );
  const setAddCategoryInExpenseView = usePopupStore(
    (state) => state.setAddCategoryInExpenseView,
  );

  const setPopupVisible = usePopupStore((state) => state.setVisible);

  const [loading, setLoading] = useState<boolean>(false);

  const dataAdded: (Category & CreationCategory)[] = [];

  const addCategory = async (): Promise<boolean> => {
    let inputNotEmpty = checkInputsEmpty(singleCategoryData!);

    if (inputNotEmpty) {
      const isCategoryLabelExist = await checkIfCategorylabelAlreadyStored(
        singleCategoryData!,
        categories,
      );

      if (!isCategoryLabelExist) {
        const user: any = await AsyncStorage.getItem("userCredentials");
        const uuidCategory = crypto.randomUUID();
        const uuidCreationCategory = crypto.randomUUID();

        const result = await createCategory(
          singleCategoryData!,
          uuidCategory,
          uuidCreationCategory,
        );

        const categoriesTmp = [...categories];

        const newCurrentCategoriesData: Category & CreationCategory = {
          label: singleCategoryData?.label!,
          idCategory: uuidCategory,
          idCreationCategory: uuidCreationCategory,
          idUser: JSON.parse(user).id,
          createdDate: new Date(),
        };

        categoriesTmp.push(newCurrentCategoriesData);
        const currentCategoriesSorted = sortedArray(categoriesTmp);
        setCurrentCategoryDatas(currentCategoriesSorted);

        if (result) {
          Toast.show({
            type: "success",
            text1: "Category inserted!!!",
          });

          if (addCategoryInExpenseView) {
            setPopupTitle("Expenses");
            setPopupActionType("insert");
            setAddCategoryInExpenseView(false);

            const singleExpenseDataTmp: Product & CreationProduct = {
              ...singleExpenseData!,
              idCreationCategory: uuidCreationCategory,
              categoryLabel: singleCategoryData?.label,
            };

            setSingleExpenseData(singleExpenseDataTmp);
          }

          setSingleCategoryData(null);

          return true;
        } else {
          const currentCategoriesSortedDontDelete =
            currentCategoriesSorted.filter(
              (item) => item.idCategory !== uuidCategory,
            );

          setCurrentCategoryDatas(currentCategoriesSortedDontDelete);

          Toast.show({
            type: "error",
            text1: "Something went wrong!!!",
          });
          return true;
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Category already exist!!!",
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

  const updateCategory = async (): Promise<boolean> => {
    const inputNotEmpty = checkInputsEmpty(singleCategoryData!);

    if (inputNotEmpty) {
      const result = await editCategory(singleCategoryData!);

      if (result) {
        const categoriesUpdated = [...categories];
        categoriesUpdated.map((category, index) => {
          if (category.idCategory == singleCategoryData?.idCategory) {
            ((categoriesUpdated[index].label = singleCategoryData.label));
          }
        });
        setCurrentCategoryDatas(categoriesUpdated);
        setSingleCategoryData(null);
        setPopupVisible(false);

        return true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const checkInputsEmpty = (
    singleCategoryData: Category & CreationCategory,
  ) => {
    let error = false;

    if (singleCategoryData) {
      if (!singleCategoryData.label || singleCategoryData.label == "") {
        error = true;
      }
    } else {
      error = true;
    }

    if (error) {
      Toast.show({
        type: "error",
        text1: "Inputs should not be empty!!!",
      });
      return false;
    } else {
      return true;
    }
  };

  const remove = async (): Promise<boolean> => {
    const result = await removeCategory(
      singleCategoryData?.idCreationCategory!,
    );

    const newCurrentCategoriesDatas = categories.filter(
      (item) => item.idCategory !== singleCategoryData?.idCategory,
    );

    setCurrentCategoryDatas(newCurrentCategoriesDatas);

    if (result) {
      Toast.show({
        type: "success",
        text1: "Category Deleted!!!",
      });

      const timeOut = setTimeout(() => {
        setPopupVisible(false);
      }, 1000);
      return true;
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong!!!",
      });

      return false;
    }
  };

  return (
    <View>
      <View style={{ alignItems: "center" }}>
        <View style={GloblalStyles.popupLabelInput}>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="Furniture"
              value={singleCategoryData?.label}
              onChangeText={(val) => {
                let dataTmp = { ...singleCategoryData! };
                dataTmp.label = val;
                setSingleCategoryData(dataTmp);
              }}
            />
          </View>
        </View>
        {popupActionType == "insert" ? (
          <TouchableOpacity
            style={[GloblalStyles.popupButton]}
            onPress={async () => {
              setLoading(true);
              const result = await addCategory();
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
                const result = await updateCategory();
                if (result) {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text style={GloblalStyles.popupButtonTitle}>Update</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={GloblalStyles.deleteIconContainer}
              onPress={async () => {
                setLoading(true);
                const result = await remove();
                if (result) {
                  setLoading(false);
                }
              }}
            >
              <Ionicons name="trash-outline" size={30} color={red} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Toast position="bottom" visibilityTime={2000} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPopupContainer: {
    flexDirection: "row",
  },
});

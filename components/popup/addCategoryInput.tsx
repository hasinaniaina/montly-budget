import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import ColorPickerViewNew from "../colorPickerNew";
import { TextInput } from "react-native-gesture-handler";
import { GloblalStyles } from "@/constants/GlobalStyles";
import {
  useCategoriesStore,
  useChangedStore,
  usePopupStore,
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
import { Category, CreationCategory } from "@/constants/interface";
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

  const setPopupVisible = usePopupStore((state) => state.setVisible);

  const dataAdded: (Category & CreationCategory)[] = [];

  const addCategory = async () => {
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
          color: singleCategoryData?.color!,
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
          setSingleCategoryData(null);
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
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Category already exist!!!",
        });
      }
    }
  };

  const updateCategory = async () => {
    const inputNotEmpty = checkInputsEmpty(singleCategoryData!);

    if (inputNotEmpty) {
      const result = await editCategory(singleCategoryData!);

      if (result) {
        const categoriesUpdated = [...categories];
        categoriesUpdated.map((category, index) => {
          if (category.idCategory == singleCategoryData?.idCategory) {
            ((categoriesUpdated[index].color = singleCategoryData.color),
              (categoriesUpdated[index].label = singleCategoryData.label));
          }
        });
        setCurrentCategoryDatas(categoriesUpdated);
        setSingleCategoryData(null);
        setPopupVisible(false);
      }
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

      if (!singleCategoryData.color || singleCategoryData.color == "") {
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

  const remove = async () => {
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
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong!!!",
      });
    }
  };

  return (
    <View>
      <View style={{ alignItems: "center" }}>
        <ColorPickerViewNew
          data={singleCategoryData}
          setData={setSingleCategoryData}
        />
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
              addCategory();
            }}
          >
            <Text style={GloblalStyles.popupButtonTitle}>Add</Text>
          </TouchableOpacity>
        ) : (
          <View style={GloblalStyles.deleteButtonAndActionButtonContainer}>
            <TouchableOpacity
              style={[GloblalStyles.popupButton]}
              onPress={async () => {
                updateCategory();
              }}
            >
              <Text style={GloblalStyles.popupButtonTitle}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GloblalStyles.deleteIconContainer}
              onPress={() => {
                remove();
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

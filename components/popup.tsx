import { green } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { ReactNode, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ViewStyle,
  Keyboard,
} from "react-native";
import {
  createCategory,
  editProduct,
  filterCategory,
  filterProduct,
  retrieveCategoryAccordingToDate,
  retrieveProduct,
  saveProduct,
} from "@/constants/Controller";
import ErrorMessageModal from "./message/errorMessageModal";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";
import {
  categoryDataInit,
  checkIfCategorylabelAlreadyStored,
  getCategorieDependToDate,
  isFilteredActivate,
} from "@/constants/utils";
import {
  useCategoriesStore,
  useChangedStore,
  usePopupStore,
  useProductsStore,
} from "@/constants/store";
import AddCategoryInput from "./popup/addCategoryInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddExpensesInput from "./popup/addExpensesInput";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import AddIncomeInput from "./popup/addIncomeInput";


export default function Popup({ title, action }: { title: string, action: "insert" | "update" }) {
  
  const setSingleCategoryData = useCategoriesStore((state) => state.setSingleCategoryData);

  const setSingleExpenseData = useProductsStore((state) => state.setSingleExpenseData);

  const visible = usePopupStore((state) => state.visible);
  const setVisible = usePopupStore((state) => state.setVisible);

  const navigation = useNavigation();

  useEffect(() => {
    (() => {
      console.log("popup");
      
      const unsubscribe = navigation.addListener('blur', () => {
        setVisible(false);
      });

    })();
  }, [visible]);

  return (
    <View
      style={[
        styles.popupContainer,
        visible ? { display: "flex" } : { display: "none" },
      ]}
    >
      {/* popup top */}
      <View style={styles.BackDrop}></View>

      {/* popup bottom */}
      <View style={[styles.popupBottom, , { marginBottom: 50 }]}>
        {/* popup header */}
        <View style={styles.popupHeader}>
          <View style={styles.popupHeaderTitle}>
            <Text style={[GloblalStyles.titleSection]}>{title}</Text>
          </View>
          <TouchableOpacity
            style={[styles.popupIconClose]}
            onPress={() => {
              if (title.toLocaleLowerCase() == "category") {
                setSingleCategoryData(null);
              } 

               if (title.toLocaleLowerCase() == "expenses") {
                setSingleExpenseData(null);
              }

              setVisible(false);
            }}
          >
            <Image
              style={GloblalStyles.icon}
              source={require("@/assets/images/close1.png")}
            />
          </TouchableOpacity>
        </View>
        {/* popup content */}
        <View style={styles.popupContent}>
          {title.toLocaleLowerCase() == "category" && <AddCategoryInput />}
          {title.toLocaleLowerCase() == "expenses" && <AddExpensesInput />}
          {title.toLocaleLowerCase() == "income" && <AddIncomeInput />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 10
  },
  BackDrop: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#000",
    opacity: 0.7,
  },
  popupBottom: {
    backgroundColor: "#FFF",
    padding: 20,
    position: "absolute",
    bottom: -70,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  popupHeaderTitle: {},
  popupIconClose: {
    position: "absolute",
    right: 40,
  },
  popupContent: {
    alignItems: "center",
  },
});

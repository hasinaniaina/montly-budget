import Popup from "@/components/popup";
import { TextColor, TitleColor, disabledColor } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Pressable,
  BackHandler,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  Product,
  CreationProduct,
} from "@/constants/interface";
import {
  retrieveCurrentUserCategory,
  retrieveCurrentUserIncome,
  retrieveProductByCategory,
} from "@/constants/Controller";
import Header from "@/components/category/header";
import {
  getExpensesDependToDate,
  retrieveFirstAndLastDay,
} from "@/constants/utils";
import {
  useCategoriesStore,
  useChangedStore,
  useDateFilterStore,
  useDisabledMonth,
  useIncomeStore,
  useLogoutShowStore,
  usePopupStore,
  useProductsStore,
  useShowActionButtonStore,
} from "@/constants/store";
import ResumeIncomeExpenses from "@/components/resumeIncomeExpenses";
import BarchartStatistics from "@/components/statistics/barchartStatistics";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Statistics() {
  // if new event
  const change = useChangedStore((state) => state.changeHome);
  const setChange = useChangedStore((state) => state.setChangeHome);

  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  const categoryProducts = useProductsStore((state) => state.categoryProducts);
  const setCategoryProducts = useProductsStore(
    (state) => state.setCategoryProducts,
  );

  const setCurrentDateExpenses = useProductsStore(
    (state) => state.setCurrentDateExpenses,
  );

  const setCurrentCategoryDatas = useCategoriesStore(
    (state) => state.setCurrentCategoryDatas,
  );
  const setDateFilter = useDateFilterStore((state) => state.setDateFilter);
  const dateFilter = useDateFilterStore((state) => state.dateFilter);

  const popupTitle = usePopupStore((state) => state.title);
  const popupActionType = usePopupStore((state) => state.actionType);

  const currentUserIncome = useIncomeStore((state) => state.income);
  const setCurrrentUserIncome = useIncomeStore((state) => state.setIncome);

  // Display category action button
  let showActionButtonInit: ViewStyle[] = [];

  const setShowActionButton = useShowActionButtonStore(
    (state) => state.setShowActionButton,
  );
  const setShowLogout = useLogoutShowStore((state) => state.setShowLogout);

  const disabledMonth = useDisabledMonth((state) => state.disabled);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stateVisible, setStateVisible] = useState<boolean>(true);

  const getCurrentDateExpensesList = (
    allExpensesList: (Product & CreationProduct)[],
    dateFilter: string[],
  ) => {
    const currentDateExpensesList = getExpensesDependToDate(
      allExpensesList,
      dateFilter,
      "",
      "date",
      disabledMonth,
    );

    return currentDateExpensesList;
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // 1. On récupère les données
        let expenses = categoryProducts;
        let allCategories = categories;
        let income = currentUserIncome;

        if (categories.length === 0) {
          [allCategories, expenses, income] = await Promise.all([
            retrieveCurrentUserCategory(),
            retrieveProductByCategory(),
            retrieveCurrentUserIncome(),
          ]);

          // 2. On met à jour Zustand (pour les autres composants)
          setCategories(allCategories);
          setCategoryProducts(expenses);
          setCurrrentUserIncome(income);
        }

        let dateFilterTmp = dateFilter.expenseDatefilter;        

        const { firstDay, lastDay } = retrieveFirstAndLastDay(
          dateFilterTmp.toString(),
        );


        const currentDateExpensesTmp = getCurrentDateExpensesList(
          categoryProducts.length == 0 ? expenses : categoryProducts,
          [firstDay, lastDay],
        );

        if (!disabledMonth) {
          setCurrentDateExpenses(currentDateExpensesTmp);
        } else {
          setCurrentDateExpenses(
            categoryProducts.length == 0 ? expenses : categoryProducts,
          );
        }

        setCurrentCategoryDatas(allCategories);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [change, disabledMonth, loading]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    const backAction = () => {
      // Bloque le retour
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      backHandler.remove();
    };
  }, []);

  return (
    <Pressable
      style={GloblalStyles.container}
      onPressIn={() => {
        setShowActionButton(showActionButtonInit);
        setShowLogout(false);
      }}
    >
      {!isKeyboardVisible && (
        <>
          {/* header */}
          <Header change={change} />
          {/* Resume */}
          <ResumeIncomeExpenses />
        </>
      )}

      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={[GloblalStyles.titleFlexAlignement, { alignItems: "center" }]}
          onPress={() => {
            setStateVisible(!stateVisible);
          }}
        >
          <Text style={GloblalStyles.titleSection}>Statistics</Text>
          <Ionicons
            name="chevron-down"
            size={20}
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
        {stateVisible && <BarchartStatistics />}
      </View>

  

      <Popup title={popupTitle} action={popupActionType} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  popupDatecontainer: {
    flexDirection: "row",
  },
  popupDate: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  labelText: {
    marginLeft: 10,
  },
  date: {
    fontFamily: "k2d-regular",
  },
  categoryItem: {
    flexDirection: "row",
  },
  categoriesProductsListContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },

  checkboxCategory: {
    borderWidth: 1,
    borderColor: TextColor,
    borderRadius: 5,
    width: 15,
    height: 15,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxProductDisabled: {
    marginRight: 10,
    borderRadius: 5,
    width: 13,
    height: 13,
    borderWidth: 1,
    borderColor: disabledColor,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxCategoryChecked: {
    width: 8,
    height: 8,
  },

  checkboxProductChecked: {
    borderRadius: 2,
    width: 6,
    height: 6,
    backgroundColor: TextColor,
  },

  itemCategoryProductShape: {
    width: 10,
    height: 10,
    borderRadius: 20,
    marginRight: 5,
  },

  productColorDisabled: {
    backgroundColor: disabledColor,
  },

  name: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },

  nameDisabled: {
    fontFamily: "k2d-bold",
    color: disabledColor,
  },

  noListContainer: {
    height: "80%",
    justifyContent: "center",
  },
  noList: {
    fontFamily: "k2d-bold",
  },
});

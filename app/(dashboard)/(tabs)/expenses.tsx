import Popup from "@/components/popup";
import { TextColor, TitleColor, disabledColor } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  ViewStyle,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { Product, CreationProduct } from "@/constants/interface";
import {
  retrieveCurrentUserCategory,
  retrieveCurrentUserIncome,
  retrieveProductByCategory,
} from "@/constants/Controller";
import {
  getExpensesDependToDate,
  prettyLog,
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
import ExpensesList from "@/components/expenses/expensesList";
import Filter from "@/components/expenses/filter";

export default function Expenses() {
  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  const categoryProducts = useProductsStore((state) => state.categoryProducts);
  const setCategoryProducts = useProductsStore(
    (state) => state.setCategoryProducts,
  );

  const currentDateExpenses = useProductsStore(
    (state) => state.currentDateExpenses,
  );
  const setCurrentDateExpenses = useProductsStore(
    (state) => state.setCurrentDateExpenses,
  );

  const setCurrentCategoryDatas = useCategoriesStore(
    (state) => state.setCurrentCategoryDatas,
  );
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

  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    init();
  }, [disabledMonth, loading, dateFilter.expenseDatefilter]);

  useEffect(() => {
    const backAction = () => {
      // Bloque le retour
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
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
      {/* Chart */}
      <Filter />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <ExpensesList />
      )}

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

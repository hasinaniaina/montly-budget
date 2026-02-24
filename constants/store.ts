import { create } from "zustand";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Income,
  Product,
} from "./interface";
import { categoryDataInit, retrieveFirstAndLastDay } from "./utils";
import { ViewStyle } from "react-native";
type logoutShowStore = {
  showLogout: boolean;
  setShowLogout: (show: boolean) => void;
};

type categoriesStore = {
  categories: (Category & CreationCategory)[];
  setCategories: (categories: (Category & CreationCategory)[]) => void;
  currentCategoryDatas: (Category & CreationCategory)[];
  setCurrentCategoryDatas: (
    categories: (Category & CreationCategory)[],
  ) => void;
  singleCategoryData: (Category & CreationCategory) | null;
  setSingleCategoryData: (
    singleCategoryData: (Category & CreationCategory) | null,
  ) => void;
};

type ProductsStore = {
  categoryProducts: (Product & CreationProduct)[];
  setCategoryProducts: (
    categoryProducts: (Product & CreationProduct)[],
  ) => void;
  currentDateExpenses: (Product & CreationProduct)[];
  setCurrentDateExpenses: (
    currentDateExpenses: (Product & CreationProduct)[],
  ) => void;
  singleExpenseData: (Product & CreationProduct) | null;
  setSingleExpenseData: (
    singleExpenseData: (Product & CreationProduct) | null,
  ) => void;
  sumExpenses: number,
  setSumExpenses: (sumExpenses: number) => void;
};

type IncomeStore = {
  income: Income[],
  setIncome: (income: Income[]) => void,
  singleIncomeData: Income | null;
  setSingleIncomeData: (
    singleIncomeData: Income | null,
  ) => void;
  incomeForFilter: Income[] | [],
  setIncomeForFilter: (income: Income[]) => void,
  sumIncome: number,
  setSumIncome : (sumIncome: number) => void
}


type ShowActionButtonStore = {
  showActionButton: ViewStyle[];
  setShowActionButton: (showActionButtonStore: ViewStyle[]) => void;
};

type ChangeProp = {
  changeHome: boolean;
  setChangeHome: (value: boolean | ((prev: boolean) => boolean)) => void;

  changeCategoryProduct: boolean;
  setChangeCategoryProduct: (
    value: boolean | ((prev: boolean) => boolean),
  ) => void;
};

type DateFilterProp = {
  dateInitialised: boolean;
  setDateInitialised: (dateInitialised: boolean) => void;
  dateFilter: {expenseDatefilter: Date, incomeDateFilter:Date};
  setDateFilter: (dateFilter: {expenseDatefilter: Date, incomeDateFilter:Date}) => void;
  dateFilterStatistic: Date,
  setDateFilterStatistic: (dateFilterStatistic: Date) => void,
};

type PopupStore = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  actionType: "insert" | "update";
  setActionType: (actionType: "insert" | "update") => void;
  addCategoryInExpenseView: boolean;
  setAddCategoryInExpenseView: (addCategoryInExpenseView: boolean) => void;
};

type disabledMonthStore = {
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
};

export const useDisabledMonth = create<disabledMonthStore>((set) => ({
  disabled: false,
  setDisabled: (disabled) => set(() => ({ disabled: disabled })),
}));


export const useIncomeStore = create<IncomeStore>((set) => ({
  income: [],
  setIncome: (income) => set(() => ({income: income})),
  singleIncomeData: null,
  setSingleIncomeData: (singleIncomeData) => set(() => ({singleIncomeData: singleIncomeData})),
  incomeForFilter: [],
  setIncomeForFilter: (incomeForFilter) => set(() => ({incomeForFilter: incomeForFilter})),
  sumIncome: 0,
  setSumIncome: (sumIncome) => set(() => ({sumIncome: sumIncome}))
}));

export const usePopupStore = create<PopupStore>((set) => ({
  visible: false,
  setVisible: (visible) => set(() => ({ visible: visible })),
  title: "",
  setTitle: (title) => set(() => ({ title: title })),
  actionType: "insert",
  setActionType: (actionType) => set(() => ({ actionType: actionType })),
  addCategoryInExpenseView: false,
  setAddCategoryInExpenseView: (addCategoryInExpenseView) =>
    set(() => ({ addCategoryInExpenseView: addCategoryInExpenseView })),
}));

export const useDateFilterStore = create<DateFilterProp>((set) => ({
  dateInitialised: false,
  setDateInitialised: (dateInitialised) =>
    set(() => ({ dateInitialised: dateInitialised })),
  dateFilter: {expenseDatefilter: new Date(), incomeDateFilter:new Date()},
  setDateFilter: (dateFilter) => set(() => ({ dateFilter: dateFilter })),
  dateFilterStatistic: new Date(),  
  setDateFilterStatistic: (dateFilterStatistic) => set(() => ({dateFilterStatistic: dateFilterStatistic})),
}));

export const useLogoutShowStore = create<logoutShowStore>((set) => ({
  showLogout: false,
  setShowLogout: (showLogout) => set(() => ({ showLogout: showLogout })),
}));

export const useCategoriesStore = create<categoriesStore>((set) => ({
  categories: [],
  setCategories: (categories) => set(() => ({ categories: categories })),
  currentCategoryDatas: [],
  setCurrentCategoryDatas: (currentCategoryDatas) =>
    set(() => ({ currentCategoryDatas: currentCategoryDatas })),
  singleCategoryData: null,
  setSingleCategoryData: (singleCategoryData) =>
    set(() => ({ singleCategoryData: singleCategoryData })),
}));

export const useProductsStore = create<ProductsStore>((set) => ({
  categoryProducts: [],
  setCategoryProducts: (categoryProducts) =>
    set(() => ({ categoryProducts: categoryProducts })),
  currentDateExpenses: [],
  setCurrentDateExpenses: (currentDateExpenses) =>
    set(() => ({ currentDateExpenses: currentDateExpenses })),
  singleExpenseData: null,
  setSingleExpenseData: (singleExpenseData) =>
    set(() => ({ singleExpenseData: singleExpenseData })),
  sumExpenses: 0,
  setSumExpenses: (sumExpenses) => set(() => ({sumExpenses: sumExpenses}))
}));

export const useChangedStore = create<ChangeProp>((set) => ({
  changeHome: false,
  setChangeHome: (value) =>
    set((state) => ({
      changeHome: typeof value === "function" ? value(state.changeHome) : value,
    })),

  changeCategoryProduct: false,
  setChangeCategoryProduct: (value) =>
    set((state) => ({
      changeCategoryProduct:
        typeof value === "function"
          ? value(state.changeCategoryProduct)
          : value,
    })),
}));

export const useShowActionButtonStore = create<ShowActionButtonStore>(
  (set) => ({
    showActionButton: [],
    setShowActionButton: (showActionButton) =>
      set(() => ({ showActionButton: showActionButton })),
  }),
);

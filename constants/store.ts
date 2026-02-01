import { create } from "zustand";
import { Category, CreationCategory, CreationProduct, Product } from "./interface";
import { categoryDataInit } from "./utils";
import { ViewStyle } from "react-native";
type logoutShowStore = {
  showLogout: boolean;
  setShowLogout: (show: boolean) => void;
};

type categoriesStore = {
  categories: (Category & CreationCategory)[];
  setCategories: (categories: (Category & CreationCategory)[]) => void;
  currentCategoryDatas: (Category & CreationCategory)[];
  setCurrentCategoryDatas: (categories: (Category & CreationCategory)[]) => void;
};

type ProductsStore = {
  categoryProducts: (Product & CreationProduct)[];
  setCategoryProducts: (categoryProducts: (Product & CreationProduct)[]) => void;
}

type ShowActionButtonStore = {
  showActionButton: ViewStyle[];
  setShowActionButton: (showActionButtonStore: ViewStyle[]) => void;
};

type ChangeProp = {
  changeHome: boolean;
  setChangeHome: (changeHome: boolean) => void;

  changeCategoryProduct: boolean;
  setChangeCategoryProduct: (changeCategoryProduct: boolean) => void;
};

type DateFilterProp = {
  dateInitialised: boolean;
  setDateInitialised: (dateInitialised: boolean) => void;  
  dateFilter: string[];
  setDateFilter: (dateFilter: string[]) => void; 
}

export const useDateFilterStore = create<DateFilterProp>((set) => ({
  dateInitialised: false,
  setDateInitialised : (dateInitialised) => set(() => ({dateInitialised: dateInitialised})),
  dateFilter: [],
  setDateFilter: (dateFilter) => set(() => ({dateFilter: dateFilter}))
}))

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
}));

export const useProductsStore = create<ProductsStore>((set) => ({
  categoryProducts: [],
  setCategoryProducts: (categoryProducts) => set(() => ({categoryProducts: categoryProducts}))
}))

export const useChangedStore = create<ChangeProp>((set) => ({
  changeHome: false,
  setChangeHome: (changeHome) => set(() => ({ changeHome: changeHome })),

  changeCategoryProduct: false,
  setChangeCategoryProduct: (changeCategoryProduct) =>
    set(() => ({ changeCategoryProduct: changeCategoryProduct })),
}));

export const useShowActionButtonStore = create<ShowActionButtonStore>(
  (set) => ({
    showActionButton: [],
    setShowActionButton: (showActionButton) =>
      set(() => ({ showActionButton: showActionButton })),
  }),
);

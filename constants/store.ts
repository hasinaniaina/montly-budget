import {create} from "zustand";
import { Category, CreationCategory } from "./interface";
import { categoryDataInit } from "./utils";
import { ViewStyle } from "react-native";
type logoutShowStore = {
    showLogout: boolean,
    setShowLogout: (show: boolean) => void,
}

type categoriesStore = {
    categories: (Category & CreationCategory)[],
    setCategories: (categories: (Category & CreationCategory)[]) => void,
    categoryData: Category & CreationCategory,
    setCategoryData: (categories: Category & CreationCategory) => void,

}

type ShowActionButtonStore = {
    showActionButton: ViewStyle[],
    setShowActionButton: (showActionButtonStore: ViewStyle[]) => void,
}

type ChangeProp = {
    changeHome: boolean;
    setChangeHome: (changeHome: boolean) => void;

    changeCategoryProduct: boolean,
    setChangeCategoryProduct: (changeCategoryProduct: boolean) => void;
} 

export const useLogoutShowStore = create<logoutShowStore>((set) => ({
    showLogout: false,
    setShowLogout:(showLogout) => set(() => ({showLogout: showLogout}))
}))


export const useCategoriesStore = create<categoriesStore>((set) => ({
    categories: [],
    setCategories: (categories) => set(() => ({categories: categories})),
    categoryData: categoryDataInit,
    setCategoryData: (categoryData) => set(() => ({categoryData: categoryData}))
}))

export const useChangedStore = create<ChangeProp>((set) =>({
    changeHome: false,
    setChangeHome:(changeHome) => set(() => ({changeHome: changeHome})),

    changeCategoryProduct: false,
    setChangeCategoryProduct: (changeCategoryProduct) => set(() => ({changeCategoryProduct: changeCategoryProduct})),
}));

export const useShowActionButtonStore = create<ShowActionButtonStore>((set) => ({
    showActionButton: [],
    setShowActionButton: (showActionButton) => set(() => ({showActionButton: showActionButton}))
}))

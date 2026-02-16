import Popup from "@/components/popup";
import { TextColor, TitleColor, disabledColor } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useEffect, useState } from "react";

import {
  StyleSheet,
  ViewStyle,
  ScrollView,
  Pressable,
  BackHandler,
} from "react-native";
import {
  Category,
  CreationCategory,
  ItemAddCategory,
} from "@/constants/interface";
import {
  createExistingCategories,
  retrieveCurrentUserCategory,
  retrieveProductByCategory,
} from "@/constants/Controller";
import { router } from "expo-router";
import Header from "@/components/category/header";
import CategoryList from "@/components/category/categoryList";
import {
  categoryDataInit,
  getCategorieDependToDate,
  retrieveFirstAndLastDay,
  sortedArray,
} from "@/constants/utils";
import {
  useCategoriesStore,
  useChangedStore,
  useDateFilterStore,
  useLogoutShowStore,
  usePopupStore,
  useProductsStore,
  useShowActionButtonStore,
} from "@/constants/store";
import Chart from "@/components/category/filter";
import Filter from "@/components/category/filter";

export default function Categories() {
  const [popupAddCategoryVisible, setPopupAddCategoryVisible] =
    useState<ViewStyle>({ display: "none" });

  const [
    popupChooseAddExistingCategoryVisible,
    setPopupChooseAddExistingCategoryVisible,
  ] = useState<ViewStyle>({ display: "none" });

  const [popupFilterByCategoryVisible, setPopupFilterByCategoryVisible] =
    useState<ViewStyle>({ display: "none" });

  const [popupFilterByDateVisible, setPopupFilterByDateVisible] =
    useState<ViewStyle>({ display: "none" });

  const [popupChooseAddCategory, setPopupChooseAddCategory] =
    useState<boolean>(false);

  // if new event
  const change = useChangedStore((state) => state.changeHome);
  const setChange = useChangedStore((state) => state.setChangeHome);

  const setCategories = useCategoriesStore((state) => state.setCategories);

  const setCategoryProducts = useProductsStore(
    (state) => state.setCategoryProducts,
  );

  const setCurrentCategoryDatas = useCategoriesStore(
    (state) => state.setCurrentCategoryDatas,
  );
  const currentCategoryDatas = useCategoriesStore(
    (state) => state.currentCategoryDatas,
  );

  const setDateFilter = useDateFilterStore((state) => state.setDateFilter);
  const dateFilter = useDateFilterStore((state) => state.dateFilter);

  const popupTitle = usePopupStore((state) => state.title);
  const popupActionType = usePopupStore((state) => state.actionType);

  const [userCategory, setuserCategory] = useState<
    Category[] & CreationCategory[]
  >([categoryDataInit]);

  const [itemAddCategoryIndex, setItemAddCategoryIndex] = useState<
    ItemAddCategory[]
  >([]);

  // Triggered when category filter is selected
  const isFilterActivateInit = [false, false];

  const [isCategoryFiltered, setIsCategoryFilterSelected] =
    useState<boolean[]>(isFilterActivateInit);

  const setShowLogout = useLogoutShowStore((state) => state.setShowLogout);



  const getAllCurrentUserCategory = async () => {
    let userCategories = await retrieveCurrentUserCategory();

    let itemIndexTmp: ItemAddCategory[] = [];

    let categoryNotAdded = [];

    for (let userCategory of userCategories) {
      let categoryIsListed = false;

      if (currentCategoryDatas) {
        for (let category of currentCategoryDatas) {
          if (
            category.idCategory == userCategory.idCategory ||
            category.label == userCategory.label
          ) {
            categoryIsListed = true;
            break;
          }
        }
      }

      if (!categoryIsListed) {
        itemIndexTmp.push({
          checked: false,
          idCategory: Number(userCategory.idCategory),
        });

        categoryNotAdded.push(userCategory);
      }
    }

    const result = {
      itemIndexTmp: itemIndexTmp,
      categoryNotAdded: categoryNotAdded,
    };

    return result;
  };

  const confirmAddExistingCategory = async () => {
    if (itemAddCategoryIndex.length > 0) {
      let itemTmp = [];

      for (let item of itemAddCategoryIndex) {
        if (item.checked) {
          itemTmp.push(item);
        }
      }

      if (itemTmp.length > 0) {
        const result = await createExistingCategories(itemTmp);

        if (result.changes) {
          setPopupChooseAddExistingCategoryVisible({ display: "none" });
          setChange(true);
        }
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log("Home.tsx");

      const allCategories = await retrieveCurrentUserCategory();      
      setCategories(allCategories);      
      setCurrentCategoryDatas(allCategories)
    };

    init();
  }, [change]);

  return (
    <Pressable
      style={GloblalStyles.container}
      onPressIn={() => {
        setShowLogout(false);
      }}
    >
      {/* Chart */}
      <Filter setThereIsFilter={setIsCategoryFilterSelected} />

      {/* Category */}
      <CategoryList  />

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

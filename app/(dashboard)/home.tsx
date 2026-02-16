import Popup from "@/components/popup";
import { TextColor, TitleColor, disabledColor } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useEffect, useState } from "react";
import RNPickerSelect, { Item } from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ViewStyle,
  ScrollView,
  Pressable,
  BackHandler,
  FlatList,
} from "react-native";
import {
  Category,
  CreationCategory,
  ItemAddCategory,
  Product,
  CreationProduct,
  Resume,
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
  getCategoriesForRNPickerSelect,
  prettyLog,
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
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Home() {
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

  // Open Date picker according to it
  const [openDatePicker, setOpenDatePicker] = useState<boolean[]>([
    false,
    false,
  ]);

  // if new event
  const change = useChangedStore((state) => state.changeHome);
  const setChange = useChangedStore((state) => state.setChangeHome);

  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  const categoryProducts = useProductsStore((state) => state.categoryProducts);
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

  const setDateInitialised = useDateFilterStore(
    (state) => state.setDateInitialised,
  );

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


  // Display category action button
  let showActionButtonInit: ViewStyle[] = [];

  const setShowActionButton = useShowActionButtonStore(
    (state) => state.setShowActionButton,
  );
  const setShowLogout = useLogoutShowStore((state) => state.setShowLogout);

  const getCategory = async (
    categories: (Category & CreationCategory)[],
    dateFilter: string[],
  ): Promise<(Category & CreationCategory)[]> => {
    let categoriesTmp: any = null;

    if (!isCategoryFiltered[0]) {
      categoriesTmp = getCategorieDependToDate(categories, dateFilter);
    } else {
      categoriesTmp = currentCategoryDatas;
    }

    const categoriesTmpSorted = sortedArray(categoriesTmp);
    return categoriesTmpSorted;
  };

  const modalOpenCloseAddListChoose = (openAddFieldCategory: boolean) => {
    if (openAddFieldCategory || userCategory.length == 0) {
      setPopupAddCategoryVisible({ display: "flex" });
    } else {
      setPopupChooseAddCategory(!popupChooseAddCategory);
    }
  };

  const openPopupAddNewCategoryVisible = () => {
    setPopupAddCategoryVisible({ display: "flex" });
    modalOpenCloseAddListChoose(false);
  };

  const openPopupAddExistingCategoryVisible = () => {
    setPopupChooseAddExistingCategoryVisible({ display: "flex" });
    modalOpenCloseAddListChoose(false);
  };

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

      const [allCategories, products] = await Promise.all([
        retrieveCurrentUserCategory(),
        retrieveProductByCategory(),
      ]);

      setCategories(allCategories);
      setCategoryProducts(products);

      let dateFilterTmp = [];

      if (dateFilter.length == 0) {
        const { firstDay, lastDay } = retrieveFirstAndLastDay(
          new Date().toString(),
        );

        dateFilterTmp.push(firstDay, lastDay);
        setDateFilter([firstDay, lastDay]);
      }

      const categoriesTmp = await getCategory(allCategories, dateFilterTmp);
      setCurrentCategoryDatas(categoriesTmp);

      // const categoriesForRNPickerSelectTmp =
      //   getCategoriesForRNPickerSelect(categoriesTmp);

      // setCategoriesForRNPickerSelect(categoriesForRNPickerSelectTmp);

      const allCurrentUserCategory = await getAllCurrentUserCategory();
      setItemAddCategoryIndex(allCurrentUserCategory.itemIndexTmp);
      setuserCategory(allCurrentUserCategory.categoryNotAdded);
    };

    init();

    // Back button on click event
    const backAction = () => {
      router.push("/home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [change]);

  return (
    <Pressable
      style={GloblalStyles.container}
      onPressIn={() => {
        setShowActionButton(showActionButtonInit);
        setShowLogout(false);
      }}
    >
      {/* header */}
      <Header change={change} />
      {/* Content */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.content}
      >
        {/* Chart */}
        <Chart setThereIsFilter={setIsCategoryFilterSelected} />

        {/* Category */}
        <CategoryList
          setPopupFilterByCategoryVisible={setPopupFilterByCategoryVisible}
          isCategoryFiltered={isCategoryFiltered}
          setIsCategoryFilterSelected={setIsCategoryFilterSelected}
          setOpenCloseModalChooseAdd={modalOpenCloseAddListChoose}
        />
      </ScrollView>

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

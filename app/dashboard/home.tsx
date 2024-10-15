import Popup from "@/components/popup";
import { TextColor, TitleColor, green, red } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useEffect, useLayoutEffect, useState } from "react";
import RNPickerSelect, { Item } from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  Dimensions,
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
} from "react-native";
import { Category, CreationCategory, Product } from "@/constants/interface";
import {
  getUserEmail,
  logout,
  removeCategory,
  retrieveCategoryAccordingToDate,
  retrieveCategoryById,
  retrieveProductByCategory,
} from "@/constants/Controller";
import { router } from "expo-router";
import Loading from "@/components/loading";
import Header from "@/components/category/header";
import Resumes from "@/components/category/resume";
import CategoryList from "@/components/category/categoryList";
import { categoryDataInit } from "@/constants/utils";

export default function Home() {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const [popupAddCategoryVisible, setPopupAddCategoryVisible] =
    useState<ViewStyle>({ display: "none" });

  const [popupFilterByCategoryVisible, setPopupFilterByCategoryVisible] =
    useState<ViewStyle>({ display: "none" });

  const [popupFilterByDateVisible, setPopupFilterByDateVisible] =
    useState<ViewStyle>({ display: "none" });

  // Open Date picker according to it
  const [openDatePicker, setOpenDatePicker] = useState<boolean[]>([
    false,
    false,
  ]);

  // if new category
  const [change, setChange] = useState<boolean>(false);

  const [categoryData, setCategoryData] = useState<Category & CreationCategory>(
    categoryDataInit
  );

  // Triggered when category filter is selected
  const isFilterActivateInit = [false, false];

  const [isCategoryFiltered, setIsCategoryFilterSelected] =
    useState<boolean[]>(isFilterActivateInit);

  // Retrieve Categories for filter
  const [categoriesFitler, setCategoriesFilter] = useState<Item[]>();

  // Retrieve Category date filter
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const [categoryDateFilter, setCategoryDateFilter] = useState<Date[]>([
    firstDay,
    lastDay,
  ]);

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  // Display category action button
  let showActionButtonInit: ViewStyle[] = [];
  const [showActionButton, setShowActionButton] =
    useState<ViewStyle[]>(showActionButtonInit);

  const getCategory = async (
    categoryDateFilter: Date[]
  ): Promise<Category[] & CreationCategory[]> => {
    let category = await retrieveCategoryAccordingToDate(categoryDateFilter);
    let categories: any = null;

    if (!isCategoryFiltered[0]) {
      categories = category;
    } else {
      categories = categoryData;
    }

    return categories;
  };

  useEffect(() => {
    // Count Category
    const getCountOfCategory = (category: Category[]) => {
      let categoryCount = 0;

      while (categoryCount < category.length) {
        showActionButtonInit.push({ display: "none" });
        categoryCount += 1;
      }

      setShowActionButton(showActionButtonInit);
    };

    const getCategoriesForFitler = (category: Category[]) => {
      let categoryCount = 0;
      let categoryTmp: Item[] = [];

      while (categoryCount < category.length) {
        categoryTmp.push({
          label: category[categoryCount].label!,
          value: category[categoryCount]!,
        });

        categoryCount += 1;
      }

      setCategoriesFilter(categoryTmp);
    };

    // Back button on click event
    const backAction = () => {
      router.push("/");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    const init = () => {
      setShowLoading({ display: "flex" });

      getCategory(categoryDateFilter).then((categories) => {
        getCountOfCategory(categories);

        getCategoriesForFitler(categories);

        setTimeout(() => {
          setShowLoading({ display: "none" });
        }, 2000);
      });

      setChange(false);
    };

    init();
  }, [change]);

  return (
    <Pressable
      style={GloblalStyles.container}
      onPressIn={() => {
        setShowActionButton(showActionButtonInit);
      }}
    >
      <>
        {/* header */}
        <Header change={change} />
        {/* Content */}
        <View style={styles.content}>
          {/* Resume */}
          <Resumes
            change={change}
            getCategories={getCategory}
            categoryDateFilter={categoryDateFilter}
            setPopupFilterByDateVisible={setPopupFilterByDateVisible}
          />
          {/* Category */}
          <CategoryList
            getCategories={getCategory}
            categoryDateFilter={categoryDateFilter}
            setPopupFilterByCategoryVisible={setPopupFilterByCategoryVisible}
            isCategoryFiltered={isCategoryFiltered}
            setIsCategoryFilterSelected={setIsCategoryFilterSelected}
            setPopupAddCategoryVisible={setPopupAddCategoryVisible}
            setCategoryData={setCategoryData}
            showActionButton={showActionButton}
            setShowActionButton={setShowActionButton}
            setCategoryDateFilter={setCategoryDateFilter}
            setShowLoading={setShowLoading}
            change={change}
            setChange={setChange}
          />
        </View>
      </>

      {/* popup add category*/}
      <Popup
        title="Category"
        buttonTitle="Add"
        visible={popupAddCategoryVisible}
        setVisible={setPopupAddCategoryVisible}
        viewType="category"
        datas={categoryData}
        setData={setCategoryData}
        setThereIsFilter={setIsCategoryFilterSelected}
        setChange={setChange}
        setshowLoading={setShowLoading}
      >
        <View style={styles.popupLabelInput}>
          <Text style={GloblalStyles.appLabel}>Label</Text>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="Exemple"
              value={categoryData?.label}
              onChangeText={(val) => {
                let dataTmp = { ...categoryData };
                dataTmp.label = val;
                setCategoryData(dataTmp);
              }}
            />
          </View>
        </View>
        <View style={styles.popupLabelInput}>
          <Text style={GloblalStyles.appLabel}>Income</Text>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="0"
              keyboardType="numeric"
              value={JSON.stringify((categoryData?.categoryIncome) ? categoryData?.categoryIncome : 0)}
              onChangeText={(val) => {
                let dataTmp = { ...categoryData };
                dataTmp.categoryIncome = parseFloat(val);
                setCategoryData(dataTmp);
              }}
            />
          </View>
        </View>
      </Popup>

      {/* popup filter by category*/}
      <Popup
        title="Filter by category"
        buttonTitle="Go"
        visible={popupFilterByCategoryVisible}
        setVisible={setPopupFilterByCategoryVisible}
        viewType="filterByCategory"
        datas={categoryData}
        setData={setCategoryData}
        setChange={setChange}
        thereIsFilter={isCategoryFiltered}
        setThereIsFilter={setIsCategoryFilterSelected}
        categoryDateFilter={categoryDateFilter}
        setshowLoading={setShowLoading}
      >
        <View style={styles.popupLabelInput}>
          <Text style={GloblalStyles.appLabel}>Categories</Text>
          <View style={GloblalStyles.appInput}>
            <RNPickerSelect
              onValueChange={(categorySelected) => {
                if (categorySelected?.id) {
                  setCategoryData(categorySelected);
                }
              }}
              items={categoriesFitler ? categoriesFitler : []}
            ></RNPickerSelect>
          </View>
        </View>
      </Popup>

      {/* popup filter by date*/}
      <Popup
        title="Filter by date"
        buttonTitle="Go"
        visible={popupFilterByDateVisible}
        setVisible={setPopupFilterByDateVisible}
        viewType="filterByDate"
        datas={categoryData}
        setData={setCategoryData}
        setChange={setChange}
        thereIsFilter={isCategoryFiltered}
        setThereIsFilter={setIsCategoryFilterSelected}
        categoryDateFilter={categoryDateFilter}
        setshowLoading={setShowLoading}
      >
        <View style={styles.popupDatecontainer}>
          {/* Date From */}
          <TouchableOpacity
            style={styles.popupDate}
            onPress={() => {
              setOpenDatePicker([true, false]);
            }}
          >
            <Image source={require("@/assets/images/annual.png")} />
            <View style={styles.labelText}>
              <Text style={GloblalStyles.appLabel}>From</Text>
              <Text style={[GloblalStyles.appLabel, styles.date]}>
                {categoryDateFilter[0].toLocaleDateString("en-US", options)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Date To */}
          <TouchableOpacity
            style={styles.popupDate}
            onPress={() => {
              setOpenDatePicker([false, true]);
            }}
          >
            <Image source={require("@/assets/images/annual.png")} />
            <View style={styles.labelText}>
              <Text style={GloblalStyles.appLabel}>To</Text>
              <Text style={[GloblalStyles.appLabel, styles.date]}>
                {categoryDateFilter[1].toLocaleDateString("en-US", options)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Date Picker */}
          <DateTimePickerModal
            isVisible={openDatePicker[0] || openDatePicker[1]}
            mode="date"
            date={
              openDatePicker[0] ? categoryDateFilter[0] : categoryDateFilter[1]
            }
            onConfirm={(date) => {
              const categoryDateFilterTmp: Date[] = [...categoryDateFilter];
              const dateFormat = new Date(
                `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              );

              if (openDatePicker[0]) {
                categoryDateFilterTmp[0] = dateFormat;
              } else {
                categoryDateFilterTmp[1] = dateFormat;
              }

              setCategoryDateFilter(categoryDateFilterTmp);
              setOpenDatePicker([false, false]);
            }}
            onCancel={() => {
              setOpenDatePicker([false, false]);
            }}
          />
        </View>
      </Popup>
      <Loading showLoading={showLoading} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  popupLabelInput: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    width: Dimensions.get("screen").width,
    alignItems: "center",
    justifyContent: "center",
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
});

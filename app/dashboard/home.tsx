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
  FlatList,
  SafeAreaView,
} from "react-native";
import {
  Category,
  CreationCategory,
  ItemAddCategory,
  Product,
} from "@/constants/interface";
import {
  createExistingCategories,
  getUserEmail,
  logout,
  removeCategory,
  retrieveCategoryAccordingToDate,
  retrieveCategoryById,
  retrieveCurrentUserCategory,
  retrieveProductByCategory,
} from "@/constants/Controller";
import { router } from "expo-router";
import Loading from "@/components/loading";
import Header from "@/components/category/header";
import Resumes from "@/components/category/resume";
import CategoryList from "@/components/category/categoryList";
import { categoryDataInit } from "@/constants/utils";
import PopupChooseAdd from "@/components/popupChooseAdd";
import ColorPickerViewNew from "@/components/colorPickerNew";

export default function Home() {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

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
  const [change, setChange] = useState<boolean>(false);

  // data storage
  const [categoryData, setCategoryData] = useState<Category & CreationCategory>(
    categoryDataInit
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

    let itemIndexTmp = [...itemAddCategoryIndex];

    getCategory(categoryDateFilter).then((categories) => {
      let categoryNotAdded = [];

      for (let userCategory of userCategories) {
        let categoryIsListed = false;

        for (let category of categories) {
          if (userCategory.idCategory == category.idCategory) {
            categoryIsListed = true;
            break;
          }
        }

        if (!categoryIsListed) {
          itemIndexTmp.push({
            checked: false,
            idCategory: userCategory.idCategory,
          });

          categoryNotAdded.push(userCategory);
        }
      }

      setItemAddCategoryIndex(itemIndexTmp);

      setuserCategory(categoryNotAdded);
    });
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
          setChange(true);
          setPopupChooseAddExistingCategoryVisible({ display: "none" });

          setTimeout(() => {
            setShowLoading({ display: "none" });
          }, 2000);
        }
      }
    }
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

        getAllCurrentUserCategory();

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
            setOpenCloseModalChooseAdd={modalOpenCloseAddListChoose}
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

      {/* popup add new category*/}
      <Popup
        title="Category"
        buttonTitle={"Save"}
        visible={popupAddCategoryVisible}
        setVisible={setPopupAddCategoryVisible}
        viewType="category"
        datas={categoryData}
        setData={setCategoryData}
        setThereIsFilter={setIsCategoryFilterSelected}
        setChange={setChange}
        setshowLoading={setShowLoading}
      >
        {/* popup colorPicker */}
        <ScrollView>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ColorPickerViewNew data={categoryData} setData={setCategoryData} />
            <View style={GloblalStyles.popupLabelInput}>
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
          </View>
        </ScrollView>
      </Popup>

      {/* popup add existing category*/}
      <Popup
        title="Add Categories"
        buttonTitle="Confirm"
        visible={popupChooseAddExistingCategoryVisible}
        setVisible={setPopupChooseAddExistingCategoryVisible}
        viewType="categoryExisting"
        datas={categoryData}
        setData={setCategoryData}
        setThereIsFilter={setIsCategoryFilterSelected}
        setChange={setChange}
        setshowLoading={setShowLoading}
        confirmAddExistingCategory={confirmAddExistingCategory}
      >
        {userCategory.length > 0 ? (
          <FlatList
            style={{ flexGrow: 0 }}
            data={userCategory}
            renderItem={({ item, index }) => (
              <View style={styles.categoryItem}>
                <Pressable
                  style={styles.categoriesListContainer}
                  onPress={() => {
                    let itemTmp = [...itemAddCategoryIndex];
                    itemTmp[index].checked = !itemTmp[index].checked;
                    setItemAddCategoryIndex(itemTmp);
                  }}
                >
                  <View style={styles.checkboxCategory}>
                    <View
                      style={[
                        styles.checkboxCategoryChecked,
                        itemAddCategoryIndex[index]?.checked
                          ? { backgroundColor: TextColor }
                          : { backgroundColor: "transparent" },
                      ]}
                    ></View>
                  </View>
                  <View
                    style={[
                      styles.colorCategory,
                      { backgroundColor: item.color },
                    ]}
                  ></View>
                  <View style={styles.categoryName}>
                    <Text style={styles.name}>{item.label}</Text>
                  </View>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <View style={styles.noListContainer}>
            <Text style={styles.noList}>No category</Text>
          </View>
        )}
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
        <View style={GloblalStyles.popupLabelInput}>
          <Text style={GloblalStyles.appLabel}>Categories</Text>
          <View style={GloblalStyles.appInput}>
            <RNPickerSelect
              onValueChange={(categorySelected) => {                
                if (categorySelected?.idCreationCategory) {
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


              setOpenDatePicker([false, false]);
              setCategoryDateFilter(categoryDateFilterTmp);
            }}
            onCancel={() => {
              setOpenDatePicker([false, false]);
            }}
          />
        </View>
      </Popup>

      {/* Loading view */}
      <Loading showLoading={showLoading} />

      {/* Choose add view */}
      <PopupChooseAdd
        modalShown={popupChooseAddCategory}
        setOpenCloseModalChooseAdd={modalOpenCloseAddListChoose}
        openPopupAddNewCategoryVisible={openPopupAddNewCategoryVisible}
        openPopupAddExistingCategoryVisible={
          openPopupAddExistingCategoryVisible
        }
        getAllCurrentUserCategory={getAllCurrentUserCategory}
      />
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
  categoryItem: {},
  categoriesListContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },

  checkboxCategory: {
    borderWidth: 1,
    borderColor: TextColor,
    borderRadius: 5,
    width: 15,
    height: 15,
    marginRight: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCategoryChecked: {
    width: 8,
    height: 8,
  },
  colorCategory: {
    width: 10,
    height: 10,
    borderRadius: 20,
    marginRight: 15,
  },
  categoryName: {},

  name: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
  noListContainer: {
    height: "80%",
    justifyContent: "center",
  },
  noList: {
    fontFamily: "k2d-bold",
  },
});

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
  retrieveCategoryAccordingToDate,
  retrieveCurrentUserCategory,
  retrieveProductByCategory,
} from "@/constants/Controller";
import { router } from "expo-router";
import Loading from "@/components/loading";
import Header from "@/components/category/header";
import Resumes from "@/components/category/resume";
import CategoryList from "@/components/category/categoryList";
import {
  categoryDataInit,
  getCategoriesForFitler,
  productDataInit,
} from "@/constants/utils";
import PopupChooseAdd from "@/components/popupChooseAdd";
import ColorPickerViewNew from "@/components/colorPickerNew";
import {
  useCategoriesStore,
  useChangedStore,
  useShowActionButtonStore,
} from "@/constants/store";

export default function Home() {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const [productByCategory, setProductByCategory] =
    useState<(Product & CreationProduct)[]>();

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
  const change = useChangedStore((state) => state.changed);
  const setChange = useChangedStore((state) => state.setChanged);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const categories = useCategoriesStore((state) => state.categories);

  // data storage
  const [categoryData, setCategoryData] = useState<Category & CreationCategory>(
    categoryDataInit,
  );

  const [userCategory, setuserCategory] = useState<
    Category[] & CreationCategory[]
  >([categoryDataInit]);

  const [userProductAddExistingCategory, setuserProductAddExistingCategory] =
    useState<(Product & CreationProduct)[]>([productDataInit]);

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

  var firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
  var lastDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12);

  const [categoryDateFilter, setCategoryDateFilter] = useState<string[]>([
    firstDay.toISOString(),
    lastDay.toISOString(),
  ]);

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  // Display category action button
  let showActionButtonInit: ViewStyle[] = [];

  const setShowActionButton = useShowActionButtonStore(
    (state) => state.setShowActionButton,
  );

  const getCategory = async (): Promise<(Category & CreationCategory)[]> => {
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

    let itemIndexTmp: ItemAddCategory[] = [];

    let categoryNotAdded = [];

    for (let userCategory of userCategories) {
      let categoryIsListed = false;

      if (categories) {
        for (let category of categories) {
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
          idCategory: userCategory.idCategory,
        });

        categoryNotAdded.push(userCategory);
      }
    }

    return {
      itemIndexTmp: itemIndexTmp,
      categoryNotAdded: categoryNotAdded,
    };
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
    console.log('home aloha');
    
    (async () => {
      const productByCategory = await retrieveProductByCategory();
      setProductByCategory(productByCategory);

      const categoriesTmp = await getCategory();
      setCategories(categoriesTmp);

      const categoryTmp = getCategoriesForFitler(categoriesTmp);

      const allCurrentUserCategory = await getAllCurrentUserCategory();
      setItemAddCategoryIndex(allCurrentUserCategory.itemIndexTmp);
      setuserCategory(allCurrentUserCategory.categoryNotAdded);

      setCategoriesFilter(categoryTmp);

      setuserProductAddExistingCategory(productByCategory);

      setProductByCategory(productByCategory);

      // Back button on click event
      const backAction = () => {
        router.push("/dashboard/home");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => backHandler.remove();
    })();

    setChange(false);
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
            productByCategory={productByCategory!}
            categoryDateFilter={categoryDateFilter}
            setPopupFilterByDateVisible={setPopupFilterByDateVisible}
          />
          {/* Category */}
          <CategoryList
            productByCategory={productByCategory!}
            setPopupFilterByCategoryVisible={setPopupFilterByCategoryVisible}
            isCategoryFiltered={isCategoryFiltered}
            setIsCategoryFilterSelected={setIsCategoryFilterSelected}
            setOpenCloseModalChooseAdd={modalOpenCloseAddListChoose}
            setCategoryData={setCategoryData}
            setCategoryDateFilter={setCategoryDateFilter}
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
        confirmAddExistingCategory={confirmAddExistingCategory}
      >
        {userCategory.length > 0 ? (
          <FlatList
            style={{ flexGrow: 0 }}
            data={userCategory}
            renderItem={({ item, index }) => (
              <View style={styles.categoryItem}>
                <Pressable
                  style={[
                    styles.categoriesProductsListContainer,
                    { marginRight: 30 },
                  ]}
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
                      styles.itemCategoryProductShape,
                      // styles.categoryProductShape,
                      { backgroundColor: item.color },
                    ]}
                  ></View>
                  <View>
                    <Text style={styles.name}>{item.label}</Text>
                  </View>
                </Pressable>
                {/* <View style={{ flexDirection: "column" }}>
                  {userProductAddExistingCategory.map((product: any, Productindex) => {
                    if (product.idCreationCategory == item.idCreationCategory) {
                      return (
                        <Pressable
                          key={Productindex}
                          style={styles.categoriesProductsListContainer}
                          disabled={true}
                          onPress={() => {}}
                        >
                          <View
                            style={[
                              itemAddCategoryIndex[index]?.checked
                                ? styles.checkboxCategory
                                : styles.checkboxProductDisabled,
                            ]}
                          >
                            <View
                              style={[
                                styles.checkboxProductChecked,
                                !itemAddCategoryIndex[index]?.checked
                                  ? { backgroundColor: TextColor }
                                  : { backgroundColor: "transparent" },
                              ]}
                            ></View>
                          </View>
                          <View
                            style={[
                              styles.itemCategoryProductShape,
                              !itemAddCategoryIndex[index]?.checked
                                ? styles.productColorDisabled
                                : { backgroundColor: product.color },
                            ]}
                          ></View>
                          <View>
                            <Text
                              style={[
                                !itemAddCategoryIndex[index]?.checked
                                  ? styles.nameDisabled
                                  : styles.name,
                              ]}
                            >
                              {product.designation}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    }
                  })}
                </View> */}
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
        thereIsFilter={isCategoryFiltered}
        setThereIsFilter={setIsCategoryFilterSelected}
        categoryDateFilter={categoryDateFilter}
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
        thereIsFilter={isCategoryFiltered}
        setThereIsFilter={setIsCategoryFilterSelected}
        categoryDateFilter={categoryDateFilter}
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
                {new Date(categoryDateFilter[0]).toLocaleDateString(
                  "en-US",
                  options,
                )}
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
                {new Date(categoryDateFilter[1]).toLocaleDateString(
                  "en-US",
                  options,
                )}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Date Picker */}
          <DateTimePickerModal
            isVisible={openDatePicker[0] || openDatePicker[1]}
            mode="date"
            date={
              openDatePicker[0]
                ? new Date(categoryDateFilter[0])
                : new Date(categoryDateFilter[1])
            }
            onConfirm={(date) => {
              const categoryDateFilterTmp: string[] = [...categoryDateFilter];
              const dateFormat = new Date(
                `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
              ).toISOString();

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

      {/* Choose add category view */}
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

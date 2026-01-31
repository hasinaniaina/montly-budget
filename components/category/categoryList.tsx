import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Pressable,
  InteractionManager,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { TextColor, TitleColor } from "@/constants/Colors";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";
import { router } from "expo-router";
import { removeCategory, retrieveCategoryById } from "@/constants/Controller";
import ConfirmationMessageModal from "../message/confirmationMessageModal";
import { categoryDataInit } from "@/constants/utils";
import {
  useCategoriesStore,
  useChangedStore,
  useShowActionButtonStore,
} from "@/constants/store";

export default function CategoryList({
  productByCategory,
  setPopupFilterByCategoryVisible,
  isCategoryFiltered,
  setIsCategoryFilterSelected,
  setOpenCloseModalChooseAdd,
  setCategoryData,
  setCategoryDateFilter,
}: {
  productByCategory: (Product & CreationProduct)[];
  setPopupFilterByCategoryVisible: (val: ViewStyle) => void;
  isCategoryFiltered: boolean[];
  setIsCategoryFilterSelected: (val: boolean[]) => void;
  setOpenCloseModalChooseAdd: (val: boolean) => void;
  setCategoryData: (val: Category & CreationCategory) => void;
  setCategoryDateFilter: (val: string[]) => void;
}) {
  const setChange = useChangedStore((state) => state.setChangeHome);
  const categories = useCategoriesStore((state) => state.categories);

  const showActionButton = useShowActionButtonStore(
    (state) => state.showActionButton,
  );
  const setShowActionButton = useShowActionButtonStore(
    (state) => state.setShowActionButton,
  );

  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Retrieve Category date filter
  var date = new Date();
  
  var firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
  var lastDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12);

  // Display category action button
  let showActionButtonInit: ViewStyle[] = [];

  // Index of the category list selected
  const [indexOfActionButtonShowed, setIndexOfActionButtonShowed] =
    useState<string>("");

  //  Retrieve transactions for each categorie
  const [categoriesTransactionNumber, setCategoriesTransactionNumber] =
    useState<number[]>([]);

  // Sum expenses each categories
  const [sumExpenseCategory, setSumExpenseCategory] = useState<number[]>();

  const getSumExpenseForCategoryList = (
    categories: (Category & CreationCategory)[],
    productByCategory: (Product & CreationProduct)[],
  ): number[] => {
    let categoryCount = 0;
    let sumCategoryExpensesTmp = [];

    while (categoryCount < categories.length) {
      let transactionNumber = 0;
      let productCount = 0;
      let sumExpensiveTmp = 0;
      if (productByCategory) {
        while (productCount < productByCategory.length) {
          if (
            productByCategory[productCount].idCreationCategory ==
            categories[categoryCount].idCreationCategory
          ) {
            sumExpensiveTmp +=
              productByCategory[productCount].productAmount *
              productByCategory[productCount].productCoefficient;
            transactionNumber += 1;
          }
          productCount++;
        }
      }

      sumCategoryExpensesTmp.push(sumExpensiveTmp);

      categoryCount++;
    }

    return sumCategoryExpensesTmp;
  };

  const getCategoryTransactionNumber = async () => {
    let categoryCount = 0;
    let sumExpensiveTmp = 0;
    let transactionNumberCategoriesTmp = [];

    if (categories) {
      while (categoryCount < categories.length) {
        let transactionNumber = 0;
        let productCount = 0;

        if (productByCategory) {
          while (productCount < productByCategory.length) {
            if (
              productByCategory[productCount].idCreationCategory ==
              categories[categoryCount].idCreationCategory
            ) {
              sumExpensiveTmp += transactionNumber += 1;
            }
            productCount++;
          }
        }
        transactionNumberCategoriesTmp.push(transactionNumber);
        categoryCount++;
      }
    }
    return transactionNumberCategoriesTmp;
  };

  // Count Category
  const getCountOfCategory = () => {
    let categoryCount = 0;

    while (categoryCount < categories.length) {
      showActionButtonInit.push({ display: "none" });
      categoryCount += 1;
    }

    return showActionButtonInit;
  };

  // Confirmation delete confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const removeItem = async () => {
    const result = await removeCategory(indexOfActionButtonShowed);

    return result;
  };

  useEffect(() => {
    (async () => {
      console.log("categoryList.tsx");

      const categoriesTransactionNumberTmp =
        await getCategoryTransactionNumber();
      setCategoriesTransactionNumber(categoriesTransactionNumberTmp);

      const sumExpenseCategoryListTmp = await getSumExpenseForCategoryList(
        categories,
        productByCategory,
      );

      setSumExpenseCategory(sumExpenseCategoryListTmp);

      const showActionButtonInit = getCountOfCategory();
      setShowActionButton(showActionButtonInit);
    })();
  }, [categories]);

  return (
    <>
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTitleFilterContainer}>
          <View style={GloblalStyles.titleFlexAlignement}>
            <Image
              source={require("@/assets/images/annual.png")}
              style={GloblalStyles.icon}
            />
            <Text style={GloblalStyles.titleSection}>Category</Text>
          </View>
          <View style={styles.iconFilterAddContainer}>
            {isCategoryFiltered[0] ? (
              <TouchableOpacity
                style={styles.iconFilter}
                onPress={() => {
                  setIsCategoryFilterSelected([false, false]);
                  setCategoryData(categoryDataInit);
                  setCategoryDateFilter([
                    firstDay.toISOString(),
                    lastDay.toISOString(),
                  ]);
                  setChange(true);
                }}
              >
                <Image
                  source={require("@/assets/images/refresh.png")}
                  style={GloblalStyles.icon}
                />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.iconFilter}
                  onPress={() => {
                    setPopupFilterByCategoryVisible({ display: "flex" });
                  }}
                >
                  <Image
                    source={require("@/assets/images/filter.png")}
                    style={GloblalStyles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconAdd}
                  onPress={() => {
                    setOpenCloseModalChooseAdd(false);
                  }}
                >
                  <Image
                    source={require("@/assets/images/plus.png")}
                    style={GloblalStyles.icon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Category Content */}
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.categoryContent}>
              {categories.length > 0 ? (
                categories.map((category, index) => {
                  return (
                    <TouchableOpacity
                      style={styles.item}
                      key={index}
                      onLongPress={() => {
                        let showActionButtonTmp = [...showActionButton];
                        showActionButtonTmp[index] = { display: "flex" };
                        setShowActionButton(showActionButtonTmp);

                        setIndexOfActionButtonShowed(
                          (category as CreationCategory).idCreationCategory!,
                        );
                      }}
                      onPress={() => {
                        InteractionManager.runAfterInteractions(() => {
                          setShowActionButton(showActionButtonInit);
                          setIndexOfActionButtonShowed("");
                          router.navigate({
                            pathname: "/dashboard/[categoryId]",
                            params: { categoryId: JSON.stringify(category) },
                          });
                        });
                      }}
                    >
                      <View style={styles.colorNamecontainer}>
                        <View
                          style={[
                            styles.colorCategory,
                            { backgroundColor: (category as Category).color },
                          ]}
                        ></View>
                        <View style={styles.categoryName}>
                          <Text style={styles.name}>
                            {(category as Category).label}
                          </Text>
                          <Text style={styles.transaction}>
                            {categoriesTransactionNumber[index]} expense(s)
                          </Text>
                          <Text style={GloblalStyles.CreatedDate}>
                            {new Date(
                              (category as CreationCategory).createdDate!,
                            ).toLocaleDateString("en-US", options)}
                          </Text>
                        </View>
                      </View>

                      <View>
                        <Text style={styles.categoryIncome}>
                          {sumExpenseCategory && sumExpenseCategory[index]
                            ? sumExpenseCategory[index]
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            : 0}{" "}
                          Ar
                        </Text>
                      </View>

                      {/* Catégorie action */}
                      <View
                        style={[GloblalStyles.action, showActionButton[index]]}
                      >
                        <TouchableOpacity
                          onPress={async () => {
                            const category = await retrieveCategoryById(
                              indexOfActionButtonShowed,
                            );
                            setCategoryData(category);
                            setOpenCloseModalChooseAdd(true);
                          }}
                          style={GloblalStyles.editIconContainer}
                        >
                          <Image
                            style={GloblalStyles.editIcon}
                            source={require("@/assets/images/pencil.png")}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={GloblalStyles.deleteIconContainer}
                          onPress={() => {
                            setShowConfirmationModal(true);
                          }}
                        >
                          <Image
                            style={GloblalStyles.deleteIcon}
                            source={require("@/assets/images/close.png")}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.noCategory}>
                  <Text style={{ fontFamily: "k2d-bold", color: "red" }}>
                    No Category
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      <ConfirmationMessageModal
        modalShown={showConfirmationModal}
        removeItem={removeItem}
        setModalShown={setShowConfirmationModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  categoryTitleFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconFilterAddContainer: {
    flexDirection: "row",
  },
  iconFilter: {
    marginRight: 10,
  },
  iconAdd: {
    marginLeft: 10,
  },
  categoryContent: {
    marginTop: 10,
    marginBottom: 130,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  colorNamecontainer: {
    flexDirection: "row",
    alignItems: "center",
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
  transaction: {
    fontFamily: "k2d-regular",
    color: TextColor,
    fontSize: 9,
  },
  categoryIncome: {
    fontFamily: "k2d-bold",
    color: TextColor,
  },
  noCategory: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
});

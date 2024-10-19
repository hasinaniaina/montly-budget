import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { TextColor, TitleColor } from "@/constants/Colors";
import { Category, CreationCategory, Product } from "@/constants/interface";
import { router } from "expo-router";
import {
  removeCategory,
  retrieveCategoryById,
  retrieveProductByCategory,
} from "@/constants/Controller";
import ConfirmationMessageModal from "../message/confirmationMessageModal";
import { categoryDataInit } from "@/constants/utils";

export default function CategoryList({
  getCategories,
  categoryDateFilter,
  setPopupFilterByCategoryVisible,
  isCategoryFiltered,
  setIsCategoryFilterSelected,
  setOpenCloseModalChooseAdd,
  setCategoryData,
  showActionButton,
  setShowActionButton,
  setCategoryDateFilter,
  setShowLoading,
  change,
  setChange,
}: {
  getCategories: (val: Date[]) => Promise<Category[] & CreationCategory[]>;
  categoryDateFilter: Date[];
  setPopupFilterByCategoryVisible: (val: ViewStyle) => void;
  isCategoryFiltered: boolean[];
  setIsCategoryFilterSelected: (val: boolean[]) => void;
  setOpenCloseModalChooseAdd: (val: boolean) => void;
  setCategoryData: (val: Category & CreationCategory) => void;
  showActionButton: ViewStyle[];
  setShowActionButton: (val: ViewStyle[]) => void;
  setCategoryDateFilter: (val: Date[]) => void;
  setShowLoading: (val: ViewStyle) => void;
  change: boolean;
  setChange: (val: boolean) => void;
}) {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Retrieve Category date filter
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Display category action button
  let showActionButtonInit: ViewStyle[] = [];

  // Index of the category list selected
  const [indexOfActionButtonShowed, setIndexOfActionButtonShowed] =
    useState<number>(-1);

  //  Retrieve transactions for each categorie
  const [categoriesTransactionNumber, setCategoriesTransactionNumber] =
    useState<number[]>([]);

  const getCategoryTransactionNumber = async (
    category: Category[] & CreationCategory[]
  ) => {
    const product = await retrieveProductByCategory();
    let categoryCount = 0;
    let sumExpensiveTmp = 0;
    let transactionNumberCategoriesTmp = [];

    while (categoryCount < category.length) {
      let transactionNumber = 0;
      let productCount = 0;

      while (productCount < product.length) {
        if (
          product[productCount].idCreationCategory ==
          category[categoryCount].idCreationCategory
        ) {
          sumExpensiveTmp += transactionNumber += 1;
        }
        productCount++;
      }
      transactionNumberCategoriesTmp.push(transactionNumber);
      categoryCount++;
    }

    setCategoriesTransactionNumber(transactionNumberCategoriesTmp);
  };

  // Retrieve Categories
  const [categories, setCategories] = useState<Category[] | CreationCategory[]>(
    []
  );

  // Confirmation delete confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const removeItem = async () => {
    const result = await removeCategory(indexOfActionButtonShowed);

    return result;
  };

  useEffect(() => {
    getCategories(categoryDateFilter).then((categories) => {
      setCategories(categories);
      getCategoryTransactionNumber(categories);
    });
  }, [change]);

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
            {isCategoryFiltered[0] || isCategoryFiltered[1] ? (
              <TouchableOpacity
                style={styles.iconFilter}
                onPress={() => {
                  setIsCategoryFilterSelected([false, false]);
                  setCategoryData(categoryDataInit);
                  setCategoryDateFilter([firstDay, lastDay]);
                  setShowLoading({ display: "flex" });

                  setChange(true);
                  setTimeout(() => {
                    setShowLoading({ display: "none" });
                  }, 2000);
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
              {categories ? (
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
                          (category as CreationCategory).idCreationCategory!
                        );
                      }}
                      onPress={() => {
                        setShowActionButton(showActionButtonInit);
                        setIndexOfActionButtonShowed(-1);
                        router.push({
                          pathname: "/dashboard/[categoryId]",
                          params: { categoryId: JSON.stringify(category) },
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
                            {categoriesTransactionNumber[index]} transaction(s)
                          </Text>
                          <Text style={GloblalStyles.CreatedDate}>
                            {new Date(
                              (category as CreationCategory).createdDate!
                            ).toLocaleDateString("en-US", options)}
                          </Text>
                        </View>
                      </View>

                      <View>
                        <Text style={styles.categoryIncome}>
                          Ar {(category as CreationCategory).categoryIncome}
                        </Text>
                      </View>

                      {/* Catégorie action */}
                      <View
                        style={[GloblalStyles.action, showActionButton[index]]}
                      >
                        <TouchableOpacity
                          onPress={async () => {
                            const category = await retrieveCategoryById(
                              indexOfActionButtonShowed
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
                  <Text>No Category</Text>
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
        setShowLoading={setShowLoading}
        setChange={setChange}
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

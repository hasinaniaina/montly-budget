import Popup from "@/components/popup";
import { TextColor, TitleColor, green, red } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useEffect, useState } from "react";
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
import { Category, Product } from "@/constants/interface";
import {
  getUserEmail,
  logout,
  removeCategory,
  retrieveCategory,
  retrieveCategoryById,
  retrieveProductByCategory,
} from "@/constants/Controller";
import { router } from "expo-router";
import Loading from "@/components/loading";

export default function Home() {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const [userEmail, setUserEmail] = useState<string>("");

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

  const [dateFrom, setDateFrom] = useState<string>(
    new Date().toLocaleDateString("en-US", options)
  );

  const [dateTo, setDateTo] = useState<string>(
    new Date().toLocaleDateString("en-US", options)
  );
  // if new category
  const [change, setChange] = useState<boolean>(false);

  // Retrieve Category Selected
  const categoryDataInit = {
    id: -1,
    color: "#000",
    income: "",
    label: "",
    idUser: 1,
  };
  const [categoryData, setCategoryData] = useState<Category>(categoryDataInit);

  // Triggered when category filter is selected
  const [isCategoryFilterSelected, setIsCategoryFilterSelected] =
    useState<boolean>(false);

  // Retrieve Categories
  const [categories, setCategories] = useState<Category[]>([]);

  //  Retrieve transactions for each categorie
  const [categoriesTransactionNumber, setCategoriesTransactionNumber] =
    useState<number[]>([]);

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

  // Display category action button
  let showActionButtonInit: ViewStyle[] = [];
  const [showActionButton, setShowActionButton] =
    useState<Array<ViewStyle>>(showActionButtonInit);

  // Index of the category list selected
  const [indexOfActionButtonShowed, setIndexOfActionButtonShowed] =
    useState<number>(-1);

  // Sum of all expenses, income, saving
  type Resume = {
    income: number;
    saving: number;
    expense: number;
  };

  const [sum, setSum] = useState<Resume>({
    income: 0,
    saving: 0,
    expense: 0,
  });

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  useEffect(() => {
    const fetchUserEmail = async () => {
      const user: any = getUserEmail();
      return user;
    };

    const getCategory = async (
      categoryDateFilter: Date[]
    ): Promise<Category[]> => {
      let category = await retrieveCategory(categoryDateFilter);
      let categories: any = null;

      if (!isCategoryFilterSelected) {
        categories = category;
      } else {
        categories = categoryData;
      }

      return categories;
    };

    const getProduct = async () => {
      let product = await retrieveProductByCategory();
      return product;
    };

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

    const getSumIncome = async (category: Category[]): Promise<number> => {
      let categoryCount = 0;
      let sumIncomeTmp = 0;

      while (categoryCount < category.length) {
        sumIncomeTmp += parseFloat(category[categoryCount].income!);
        categoryCount += 1;
      }

      return sumIncomeTmp;
    };

    const getSumExpense = async (category: Category[]): Promise<number> => {
      const product = await getProduct();
      let categoryCount = 0;
      let productCount = 0;
      let sumExpensiveTmp = 0;
      let transactionNumberCategoriesTmp = [];

      while (categoryCount < category.length) {
        let transactionNumber = 0;
        while (productCount < product.length) {
          if (product[productCount].idCategory == category[categoryCount].id) {
            sumExpensiveTmp += product[productCount].amount;
            transactionNumber += 1;
          }
          productCount++;
        }

        transactionNumberCategoriesTmp.push(transactionNumber);
        categoryCount++;
      }

      // Back button on click event
      const backAction = () => {
        router.push("/");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      setCategoriesTransactionNumber(transactionNumberCategoriesTmp);

      return sumExpensiveTmp;
    };

    const getSum = (sumIncome: number, sumExpense: number) => {
      const sumTmp: Resume = {
        income: sumIncome,
        expense: sumExpense,
        saving: sumIncome - sumExpense,
      };

      setSum(sumTmp);
    };

    const init = async () => {
      setShowLoading({ display: "flex" });

      fetchUserEmail().then((user) => {
        setUserEmail(JSON.parse(user)?.email);

        getCategory(categoryDateFilter).then((categories) => {
          setCategories(categories);

          getCountOfCategory(categories);

          getCategoriesForFitler(categories);

          getSumIncome(categories).then((sumIncome) => {
            getSumExpense(categories).then((sumExpense) => {
              getSum(sumIncome, sumExpense);

              setTimeout(() => {
                setShowLoading({display: "none"});
              }, 2000);
            });
          });
        });
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
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoutContainer}
          onPress={() => {
            logout(router);
          }}
        >
          <Image
            style={[styles.logoutIcon, GloblalStyles.icon]}
            source={require("@/assets/images/logout.png")}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <View style={styles.avatarEmailContainer}>
          <View style={styles.avatarContainer}>
            <Image
              style={[styles.avatar]}
              source={require("@/assets/images/user.png")}
            />
          </View>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.resumeContainer}>
          <View style={styles.dateTitleFilterContainer}>
            <View
              style={[
                styles.iconTitleContainer,
                GloblalStyles.titleFlexAlignement,
              ]}
            >
              <Image
                source={require("@/assets/images/annual.png")}
                style={GloblalStyles.icon}
              />
              <Text style={GloblalStyles.titleSection}>
                {categoryDateFilter[0].toLocaleDateString("en-US", options) +
                  " - " +
                  categoryDateFilter[1].toLocaleDateString("en-US", options)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dateFilter}
              onPress={() => {
                setPopupFilterByDateVisible({ display: "flex" });
              }}
            >
              <Image
                source={require("@/assets/images/filter.png")}
                style={GloblalStyles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.numberTitleContainer}>
            <View style={styles.incomeSavingExpenses}>
              <Text style={styles.number}>
                {sum.income ? sum.income : 0} Ar
              </Text>
              <Text style={styles.title}>Income</Text>
            </View>
            <View style={styles.incomeSavingExpenses}>
              <Text style={styles.number}>
                {sum.expense ? sum.expense : 0} Ar
              </Text>
              <Text style={styles.title}>Expenses</Text>
            </View>
            <View style={styles.incomeSavingExpenses}>
              <Text style={styles.number}>
                {sum.saving ? sum.saving : 0} Ar
              </Text>
              <Text style={styles.title}>Saving</Text>
            </View>
          </View>
        </View>

        {/* Category */}
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

              {!isCategoryFilterSelected && (
                <TouchableOpacity
                  style={styles.iconAdd}
                  onPress={() => {
                    setPopupAddCategoryVisible({ display: "flex" });
                  }}
                >
                  <Image
                    source={require("@/assets/images/plus.png")}
                    style={GloblalStyles.icon}
                  />
                </TouchableOpacity>
              )}

              {isCategoryFilterSelected && (
                <TouchableOpacity
                  style={styles.iconFilter}
                  onPress={() => {
                    setIsCategoryFilterSelected(false);
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
                          setIndexOfActionButtonShowed(category.id!);
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
                              { backgroundColor: category?.color },
                            ]}
                          ></View>
                          <View style={styles.categoryName}>
                            <Text style={styles.name}>{category?.label}</Text>
                            <Text style={styles.transaction}>
                              {categoriesTransactionNumber[index]}{" "}
                              transaction(s)
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text style={styles.categoryIncome}>
                            Ar {category?.income}
                          </Text>
                        </View>

                        {/* Catégorie action */}
                        <View
                          style={[
                            GloblalStyles.action,
                            showActionButton[index],
                          ]}
                        >
                          <TouchableOpacity
                            onPress={async () => {
                              const category = await retrieveCategoryById(
                                indexOfActionButtonShowed
                              );
                              setCategoryData(category);
                              setPopupAddCategoryVisible({ display: "flex" });
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
                            onPress={async () => {
                              setShowLoading({ display: "flex" });
                              const result = await removeCategory(
                                indexOfActionButtonShowed
                              );

                              if (result) {
                                setChange(true);
                                setTimeout(() => {
                                  setShowLoading({ display: "none" });
                                }, 2000);
                              }
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
      </View>

      {/* popup add category*/}
      <Popup
        title="Category"
        buttonTitle="Add"
        visible={popupAddCategoryVisible}
        setVisible={setPopupAddCategoryVisible}
        viewType="category"
        datas={categoryData}
        setData={setCategoryData}
        setIsFilterSelected={setIsCategoryFilterSelected}
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
              value={categoryData?.income}
              onChangeText={(val) => {
                let dataTmp = { ...categoryData };
                dataTmp.income = val;
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
        setIsFilterSelected={setIsCategoryFilterSelected}
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
        setIsFilterSelected={setIsCategoryFilterSelected}
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
                {dateFrom}
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
                {dateTo}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Date Picker */}
          <DateTimePickerModal
            isVisible={openDatePicker[0] || openDatePicker[1]}
            mode="date"
            onConfirm={(date) => {
              const categoryDateFilterTmp: Date[] = [...categoryDateFilter];

              if (openDatePicker[0]) {
                setDateFrom(date.toLocaleDateString("en-US", options));
                categoryDateFilterTmp[0] = date;
              } else {
                setDateTo(date.toLocaleDateString("en-US", options));
                categoryDateFilterTmp[1] = date;
              }

              setCategoryDateFilter(categoryDateFilterTmp);
              setOpenDatePicker([false, false]);
              setIsCategoryFilterSelected(true);
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
  header: {
    height: "40%",
    padding: 20,
    width: Dimensions.get("window").width,
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 20,
  },
  logoutIcon: {},
  logoutText: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
  avatarEmailContainer: {
    paddingVertical: 40,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {},
  email: {
    textAlign: "center",
    marginTop: 20,
    color: TitleColor,
    fontFamily: "k2d-bold",
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  resumeContainer: {
    marginTop: 20,
  },
  dateTitleFilterContainer: {
    width: Dimensions.get("screen").width,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconTitleContainer: {},
  dateFilter: {},
  numberTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  incomeSavingExpenses: {},
  number: {
    color: TitleColor,
    fontFamily: "k2d-bold",
  },
  title: {
    color: TextColor,
    fontFamily: "k2d-regular",
  },
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
  },
  categoryIncome: {
    fontFamily: "k2d-bold",
    color: TextColor,
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
  noCategory: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
});

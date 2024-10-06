import DonutChart from "@/components/donutChart";
import ListProduct from "@/components/listProduct";
import TextInputAddList from "@/components/textInputAddList";
import { TextColor, TitleColor, green, red } from "@/constants/Colors";
import { retrieveProduct } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { Category, Product } from "@/constants/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import RNPickerSelect, { Item } from "react-native-picker-select";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Popup from "@/components/popup";
import ErrorMessageModal from "@/components/message/errorMessageModal";
import Loading from "@/components/loading";

export default function Products() {
  const { categoryId } = useLocalSearchParams();
  const category: Category = JSON.parse(categoryId! as string);

  // Show button edit, delete
  const [showActionButton, setShowActionButton] = useState<ViewStyle[]>([]);

  // retrieve index of edit, delete action button
  const [indexOfActionButtonShowed, setIndexOfActionButtonShowed] =
    useState<number>(-1);

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  // Show popup
  const [showAddListField, setShowAddListField] = useState<ViewStyle>({
    display: "none",
  });

  const [productData, setProductData] = useState<Product[]>([]);

  // Retrieve Categories for filter
  const [productItemFitler, setProductItemFilter] = useState<Item[]>();

  // Get product for edit
  const productDataInit: Product = {
    id: -1,
    designation: "",
    amount: 0,
    color: "#000",
    idCategory: category.id!,
    coefficient: 1,
  };
  const [productDataTmp, setProductDataTmp] =
    useState<Product>(productDataInit);

  // Triggered when category filter is selected
  const [popupFilterByProductVisible, setPopupFilterByProductVisible] =
    useState<ViewStyle>({ display: "none" });

  // Triggered when Product filter is selected
  const [isProductFilterSelected, setIsProductFilterSelected] =
    useState<boolean>(false);

  // Initiate list day number
  const [dayNumber, setDayNumber] = useState<Item[]>();

  //   Stock Total amount in add expenses view
  const [amount, setAmount] = useState<number>(productDataTmp.amount);
  const [coefficient, setCoefficient] = useState<number>(
    productDataTmp.coefficient
  );

  // Product total amount
  const [productTotalAmount, setProductTotalAmount] = useState<number>(0);

  // if new category
  const [change, setChange] = useState<boolean>(false);

  // Error handler
  let [errorMessage, setErrorMessage] = useState<Array<string>>([]);

  let [modalShown, setModalShown] = useState<Array<boolean>>([false]);

  useEffect(() => {
    setShowLoading({display: "flex"});

    const getProduct = async () => {
      const products = await retrieveProduct(category);

      setProductData(products);
      getTotalAmountProduct(products);
      getCategoriesForFitler(products);

      // Initialize button action (edit, delete) of each product
      let productsCount = 0;
      let buttonActionDiplay: ViewStyle[] = [];

      while (productsCount < products?.length) {
        buttonActionDiplay.push({ display: "none" });
        productsCount += 1;
      }

      setShowActionButton(buttonActionDiplay);
    };

    // Initialize number of day (1 to 31)
    const getListDayNumber = () => {
      let dayNumberTmp: Item[] = [];

      for (let i = 1; i < 32; i++) {
        dayNumberTmp?.push({
          label: i.toString(),
          value: i,
        });
      }

      setDayNumber(dayNumberTmp);
    };

    const getTotalAmountProduct = (products: [Product]) => {
      let productAmountTmp = 0;

      products?.forEach((product) => {
        productAmountTmp += (product.amount * product.coefficient);
      });

      setProductTotalAmount(parseFloat(category.income!) - productAmountTmp);
    };

    const getCategoriesForFitler = (products: Product[]) => {
      let productCount = 0;
      let productTmp: Item[] = [];

      while (productCount < products?.length) {
        productTmp?.push({
          label: products[productCount].designation!,
          value: products[productCount]!,
        });

        productCount += 1;
      }

      setProductItemFilter(productTmp);
    };

    getProduct();
    getListDayNumber();
    setChange(false);

    setTimeout(() => {
      setShowLoading({display: "none"});
    }, 2000);
  }, [change]);

  return (
    <KeyboardAvoidingView style={[GloblalStyles.container]}>
      <View style={styles.header}>
        <View style={styles.top}>
          <Text style={styles.categoryLabel}>{category.label}</Text>
          <Text
            style={[
              styles.amountRemain,
              productTotalAmount < 0 ? { color: red } : { color: TitleColor },
            ]}
          >
            Income remains: {productTotalAmount} Ar
          </Text>
        </View>
      </View>
      <Pressable
        style={[styles.content, { position: "relative" }]}
        onPress={() => {
          setShowActionButton([]);
          setIndexOfActionButtonShowed(-1);
        }}
      >
        <View style={styles.scrollView}>
          <View style={GloblalStyles.titleFlexAlignement}>
            <Image
              source={require("@/assets/images/pie-chart.png")}
              style={GloblalStyles.icon}
            ></Image>
            <Text style={GloblalStyles.titleSection}>Chart</Text>
          </View>

          <View style={styles.chartImageContainer}>
            <DonutChart productData={productData} />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={GloblalStyles.titleFlexAlignement}>
              <Image
                source={require("@/assets/images/expenses.png")}
                style={GloblalStyles.icon}
              ></Image>
              <Text style={GloblalStyles.titleSection}>Expense Overview</Text>
            </View>
            <View style={GloblalStyles.titleFlexAlignement}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  setPopupFilterByProductVisible({ display: "flex" });
                }}
              >
                <Image
                  source={require("@/assets/images/filter.png")}
                  style={GloblalStyles.icon}
                />
              </TouchableOpacity>
              {!isProductFilterSelected && (
                <TouchableOpacity
                  onPress={() => {
                    setShowAddListField({ display: "flex" });
                    setProductDataTmp(productDataInit);
                  }}
                >
                  <Image
                    source={require("@/assets/images/plus.png")}
                    style={GloblalStyles.icon}
                  />
                </TouchableOpacity>
              )}

              {isProductFilterSelected && (
                <TouchableOpacity
                  onPress={() => {
                    setIsProductFilterSelected(false);
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

          <View style={styles.listProductContainer}>
            <ListProduct
              showActionButton={showActionButton}
              setShowActionButton={setShowActionButton}
              indexOfActionButtonShowed={indexOfActionButtonShowed}
              setIndexOfActionButtonShowed={setIndexOfActionButtonShowed}
              setChange={setChange}
              setShowAddListField={setShowAddListField}
              setSelectProductForEdit={setProductDataTmp}
              productData={productData}
              setShowLoading={setShowLoading}
            />
          </View>
        </View>
      </Pressable>

      {/* popup filter by category*/}
      <Popup
        title="Expenses"
        buttonTitle="Save"
        visible={showAddListField}
        setVisible={setShowAddListField}
        viewType="expenses"
        datas={productDataTmp}
        setData={setProductDataTmp}
        setChange={setChange}
        setshowLoading={setShowLoading}
      >
        <View style={styles.popupLabelInput}>
          <Text style={GloblalStyles.appLabel}>Designation</Text>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="Exemple"
              value={productDataTmp?.designation}
              onChangeText={(designation) => {
                let productTmp = { ...productDataTmp };
                productTmp.designation = designation;
                setProductDataTmp(productTmp);
              }}
            />
          </View>
        </View>

        <View style={[styles.popupLabelInput, { flexDirection: "row" }]}>
          <View style={{ width: "58%", marginRight: 10 }}>
            <Text style={GloblalStyles.appLabel}>Amount</Text>
            <View style={GloblalStyles.appInput}>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                value={JSON.stringify(
                  productDataTmp?.amount ? productDataTmp?.amount : 0
                )}
                onChangeText={(amountFieldValue) => {
                  setAmount(parseFloat(amountFieldValue));

                  let productTmp = { ...productDataTmp };
                  productTmp.amount = parseFloat(amountFieldValue);
                  setProductDataTmp(productTmp);
                }}
              />
            </View>
          </View>

          <View style={{ width: "40%", marginRight: 10 }}>
            <Text style={GloblalStyles.appLabel}>Day</Text>
            <View
              style={[
                GloblalStyles.appInput,
                {
                  height: 40,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <RNPickerSelect
                value={productDataTmp?.coefficient}
                onValueChange={(dayFieldValue) => {

                  let productTmp = { ...productDataTmp };
                  productTmp.coefficient = parseInt(dayFieldValue);

                  setCoefficient(dayFieldValue);

                  setProductDataTmp(productTmp);
                }}
                items={dayNumber ? dayNumber : []}
              ></RNPickerSelect>
            </View>
          </View>
        </View>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmount}>
            Total amount:{" "}
            {productDataTmp
              ? productDataTmp.amount * productDataTmp.coefficient
              : amount * coefficient}{" "}
            Ar
          </Text>
        </View>
      </Popup>

      {/* popup filter by category*/}
      <Popup
        title="Filter Product"
        buttonTitle="Go"
        visible={popupFilterByProductVisible}
        setVisible={setPopupFilterByProductVisible}
        viewType="filterProduct"
        datas={productData}
        setData={setProductData}
        setChange={setChange}
        setshowLoading={setShowLoading}
        setIsFilterSelected={setIsProductFilterSelected}
      >
        <View style={styles.popupLabelInput}>
          <Text style={GloblalStyles.appLabel}>Products</Text>
          <View style={GloblalStyles.appInput}>
            <RNPickerSelect
              onValueChange={(productSelected) => {
                if (productSelected?.id) {
                  setProductData([productSelected]);
                }
              }}
              items={productItemFitler ? productItemFitler : []}
            ></RNPickerSelect>
          </View>
        </View>
      </Popup>

      <ErrorMessageModal
        modalShown={modalShown[0]}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setModalShown={setModalShown}
        setShowLoading={setShowLoading}
      />

      <Loading showLoading={showLoading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    height: 150,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  top: {
    marginTop: 20,
  },
  categoryLabel: {
    color: TitleColor,
    fontFamily: "k2d-bold",
    fontSize: 20,
  },
  amountRemain: {
    color: TextColor,
    fontFamily: "k2d-regular",
    fontSize: 14,
  },
  bottom: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-end",
  },
  headerBottomLeft: {
    // justifyContent: "center"
  },
  scheduleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginBottom: 10,
  },
  headerBottomRight: {
    justifyContent: "center",
  },
  date: {
    color: TitleColor,
    fontFamily: "k2d-bold",
  },
  percentage: {
    color: TextColor,
    fontFamily: "k2d-regular",
  },
  content: {
    position: "relative",
    flex: 3,
  },
  scrollView: {
    width: Dimensions.get("window").width,
    padding: 20,
    flex: 1,
    position: "relative",
  },
  chartText: {
    color: TitleColor,
    fontFamily: "k2d-bold",
    fontSize: 16,
  },
  chartImageContainer: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  listProductContainer: {
    flex: 1,
  },
  buttonAddListContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    position: "absolute",
    right: 5,
    bottom: 0,
  },
  textInputAddListContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
  },
  textInputContainer: {
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "#F0F0F0",
    backgroundColor: "#FFF",
    width: "60%",
    paddingHorizontal: 5,
    borderRadius: 7,
    paddingVertical: 5,
  },
  textInput: {
    fontFamily: "k2d-regular",
  },
  buttonAddList: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: 60,
    margin: 5,
  },
  saveContainer: {
    backgroundColor: green,
  },
  closeContainer: {
    backgroundColor: red,
  },
  textSave: {
    fontFamily: "k2d-bold",
    color: "#fff",
  },
  checkIcon: {
    width: 32,
    height: 32,
  },

  popupLabelInput: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    width: Dimensions.get("screen").width,
  },
  totalAmountContainer: {
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 20,
  },
  totalAmount: {
    fontFamily: "k2d-bold",
    color: TitleColor,
  },
});
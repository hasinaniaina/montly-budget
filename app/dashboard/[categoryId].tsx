import DonutChart from "@/components/donutChart";
import ListProduct from "@/components/listProduct";
import TextInputAddList from "@/components/textInputAddList";
import { TextColor, TitleColor, green, red } from "@/constants/Colors";
import { retrieveProduct } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import RNPickerSelect, { Item } from "react-native-picker-select";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
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
import ColorPickerViewNew from "@/components/colorPickerNew";
import { useCategoriesStore, useChangedStore } from "@/constants/store";

export default function Products() {
  const { categoryId } = useLocalSearchParams();
  const category: Category & CreationCategory = JSON.parse(
    categoryId! as string,
  );

  // Show button edit, delete
  const [showActionButton, setShowActionButton] = useState<ViewStyle[]>([]);

  // retrieve index of edit, delete action button
  const [indexOfActionButtonShowed, setIndexOfActionButtonShowed] =
    useState<string>("");

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  // Show popup
  const [showAddListField, setShowAddListField] = useState<ViewStyle>({
    display: "none",
  });

  // Store product data
  const [productData, setProductData] = useState<Product[] & CreationProduct[]>(
    [],
  );

  // Store product data
  const [productDataWithoutFilter, setProductDataWithoutFilter] = useState<
    Product[] | CreationProduct[]
  >([]);

  // Retrieve Categories for filter
  const [productItemFitler, setProductItemFilter] = useState<Item[]>();

  // Get product for edit
  const productDataInit: Product | CreationProduct = {
    idProduct: "",
    idCreationProduct: "",
    designation: "",
    productAmount: 0,
    color: "#000",
    idCreationCategory: (category as CreationCategory).idCreationCategory!,
    productCoefficient: 1,
  };

  const [productDataTmp, setProductDataTmp] = useState<
    Product | CreationProduct
  >(productDataInit);

  // Triggered when category filter is selected
  const [popupFilterByProductVisible, setPopupFilterByProductVisible] =
    useState<ViewStyle>({ display: "none" });

  // Triggered when Product filter is selected
  const [isProductFilterSelected, setIsProductFilterSelected] = useState<
    boolean[]
  >([false]);

  // Initiate list day number
  const [dayNumber, setDayNumber] = useState<Item[]>();

  //   Stock Total amount in add expenses view
  const [amount, setAmount] = useState<number>(
    (productDataTmp as CreationProduct).productCoefficient,
  );

  const [coefficient, setCoefficient] = useState<number>(
    (productDataTmp as CreationProduct).productCoefficient,
  );

  // Product total amount
  const [productTotalAmount, setProductTotalAmount] = useState<number>(0);

  // if new category
  const change = useChangedStore((state) => state.changeCategoryProduct);
  const setChange = useChangedStore((state) => state.setChangeCategoryProduct);
  const categories = useCategoriesStore((state) => state.categories);

  // Error handler
  let [errorMessage, setErrorMessage] = useState<Array<string>>([]);

  let [modalShown, setModalShown] = useState<Array<boolean>>([false]);

  let count = 0;

  const getProduct = async () => {
    let products: Product[] & CreationProduct[] = [];
    const productForDonutChart = await retrieveProduct(category);
    const dataFromFilter: any = productDataTmp;

    if (isProductFilterSelected[0]) {
      products = dataFromFilter;
    } else {
      products = await retrieveProduct(category);
    }
  
    
    setProductData(products);
    setProductDataWithoutFilter(productForDonutChart);

    getTotalAmountRemainingProduct(products);
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

  const getTotalAmountRemainingProduct = (
    products: Product[] | CreationProduct[],
  ) => {
    let productAmountTmp = 0;

    products?.forEach((product) => {
      productAmountTmp +=
        (product as CreationProduct).productAmount *
        (product as CreationProduct).productCoefficient;
    });

    setProductTotalAmount(productAmountTmp);
  };

  const getCategoriesForFitler = (products: Product[] & CreationProduct[]) => {
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

  useEffect(() => {  
    (async () => {
      console.log("[categoryid].tsx");

      await getProduct();
      getListDayNumber();
      setChange(false);
    })();
  }, [change]);

  return (
    <KeyboardAvoidingView style={[GloblalStyles.container]}>
      <View style={styles.header}>
        <View style={styles.top}>
          <Text style={styles.categoryLabel}>
            {(category as Category).label}
          </Text>
          <Text
            style={[
              styles.amountRemain,
              productTotalAmount < 0 ? { color: red } : { color: TitleColor },
            ]}
          >
            Total expenses:{" "}
            {productTotalAmount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
            Ar
          </Text>
        </View>
      </View>
      <Pressable
        style={[styles.content, { position: "relative" }]}
        onPress={() => {
          setShowActionButton([]);
          setIndexOfActionButtonShowed("");
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
            <DonutChart productData={productDataWithoutFilter} />
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

              {!isProductFilterSelected[0] ? (
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
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setIsProductFilterSelected([false]);
                    setShowLoading({ display: "flex" });
                    setProductDataTmp(productDataInit);
                    setChange(true);
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
              setShowAddListField={setShowAddListField}
              setSelectProductForEdit={setProductDataTmp}
              productData={productData}
              productDataWithoutFilter={productDataWithoutFilter}
            />
          </View>
        </View>
      </Pressable>

      {/* popup Add new product*/}
      <Popup
        title="Expenses"
        buttonTitle="Save"
        visible={showAddListField}
        setVisible={setShowAddListField}
        viewType="expenses"
        datas={productDataTmp}
        setData={setProductDataTmp}
        category={category}
        setThereIsFilter={setIsProductFilterSelected}
      >
        <ScrollView>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ColorPickerViewNew
              data={productDataTmp}
              setData={setProductDataTmp}
            />
            <View style={styles.popupLabelInput}>
              <Text style={GloblalStyles.appLabel}>Designation</Text>
              <View style={GloblalStyles.appInput}>
                <TextInput
                  placeholder="Exemple"
                  value={(productDataTmp as Product)?.designation}
                  onChangeText={(designation) => {
                    let productTmp = { ...productDataTmp };
                    (productTmp as Product).designation = designation;
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
                    value={
                      (productDataTmp as CreationProduct)?.productAmount != 0
                        ? (
                            productDataTmp as CreationProduct
                          )?.productAmount?.toString()
                        : ""
                    }
                    onChangeText={(amountFieldValue) => {
                      setAmount(parseFloat(amountFieldValue));

                      let productTmp = { ...productDataTmp };
                      (productTmp as CreationProduct).productAmount =
                        amountFieldValue ? parseFloat(amountFieldValue) : 0;
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
                    value={
                      (productDataTmp as CreationProduct)?.productCoefficient
                    }
                    onValueChange={(dayFieldValue) => {
                      let productTmp = { ...productDataTmp };
                      (productTmp as CreationProduct).productCoefficient =
                        parseInt(dayFieldValue);

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
                  ? (productDataTmp as CreationProduct).productAmount *
                    (productDataTmp as CreationProduct).productCoefficient
                  : amount * coefficient}{" "}
                Ar
              </Text>
            </View>
          </View>
        </ScrollView>
      </Popup>

      {/* popup filter by category*/}
      <Popup
        title="Filter Product"
        buttonTitle="Go"
        visible={popupFilterByProductVisible}
        setVisible={setPopupFilterByProductVisible}
        viewType="filterProduct"
        datas={productDataTmp}
        setData={setProductDataTmp}
        setThereIsFilter={setIsProductFilterSelected}
      >
        <View style={styles.popupLabelInput}>
          <Text style={GloblalStyles.appLabel}>Products</Text>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="Exemple"
              value={(productDataTmp as Product).designation}
              onChangeText={(productFiltered) => {
                let productTmp = { ...productDataTmp };
                (productTmp as Product).designation = productFiltered;
                setProductDataTmp(productTmp);
              }}
            />
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

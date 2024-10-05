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

export default function Products() {
  const { categoryId } = useLocalSearchParams();
  const category = JSON.parse(categoryId as string) as Category;

  const [showActionButton, setShowActionButton] = useState<ViewStyle[]>([]);

  const [indexOfActionButtonShowed, setIndexOfActionButtonShowed] =
    useState<number>(-1);

  // Show popup
  const [showAddListField, setShowAddListField] = useState<ViewStyle>({
    display: "none",
  });

  const [productData, setProductData] = useState<Product[]>([]);
  // Get product for edit
  const productDataInit: Product = {
    id: -1,
    designation: "",
    amount: 0,
    color: "#FFF",
    idCategory: category.id!,
    coefficient: 1,
  };
  const [productDataTmp, setProductDataTmp] =
    useState<Product>(productDataInit);

  // if new category
  const [change, setChange] = useState<boolean>(false);

  // Triggered when category filter is selected
  const [isCategoryFilterSelected, setIsCategoryFilterSelected] =
    useState<boolean>(false);

  // Initiate list day number
  const [dayNumber, setDayNumber] = useState<Item[]>();

  //   Stock Total amount in add expenses view
  const [amount, setAmount] = useState<number>(productDataTmp.amount);
  const [coefficient, setCoefficient] = useState<number>(
    productDataTmp.coefficient
  );

  // Error handler
  let [errorMessage, setErrorMessage] = useState<Array<string>>([]);

  let [modalShown, setModalShown] = useState<Array<boolean>>([false]);

  useEffect(() => {
    const getProduct = async () => {
      const products = await retrieveProduct(category);
      let productsCount = 0;
      let buttonActionDiplay: ViewStyle[] = [];

      setProductData(products);

      while (productsCount < products.length) {
        buttonActionDiplay.push({ display: "none" });
        productsCount += 1;
      }
      setShowActionButton(buttonActionDiplay);
    };

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

    getProduct();
    getListDayNumber();
    setChange(false);
  }, [change]);

  return (
    <KeyboardAvoidingView style={[GloblalStyles.container]}>
      <View style={styles.header}>
        <View style={styles.top}>
          <Text style={styles.categoryLabel}>{category.label}</Text>
          <Text style={styles.amountRemain}>
            Income remains: {category.income} Ar
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
              <TouchableOpacity style={{ marginRight: 10 }}>
                <Image
                  source={require("@/assets/images/filter.png")}
                  style={GloblalStyles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowAddListField({ display: "flex" });
                }}
              >
                <Image
                  source={require("@/assets/images/plus.png")}
                  style={GloblalStyles.icon}
                />
              </TouchableOpacity>
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
        setIsCategoryFilterSelected={setIsCategoryFilterSelected}
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
                value={1}
                onValueChange={(dayFieldValue) => {
                  let productTmp = { ...productDataTmp };
                  productTmp.coefficient = parseInt(dayFieldValue);
                  setCoefficient(dayFieldValue);
                  setProductDataTmp(productDataTmp);
                }}
                items={dayNumber ? dayNumber : []}
              ></RNPickerSelect>
            </View>
          </View>
        </View>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmount}>
            Total amount: {amount * coefficient} Ar
          </Text>
        </View>

        <ErrorMessageModal
          modalShown={modalShown[0]}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setModalShown={setModalShown}
        />
      </Popup>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    height: 200,
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

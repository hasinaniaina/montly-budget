import DonutChart from "@/components/donutChart";
import ListProduct from "@/components/listProduct";
import TextInputAddList from "@/components/textInputAddList";
import { TextColor, TitleColor } from "@/constants/Colors";
import { retrieveProduct } from "@/constants/Controller";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { getMonthById } from "@/constants/db";
import { Product } from "@/constants/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Styles } from "react-native-svg";

export default function MonthBudget() {
  const { monthId } = useLocalSearchParams();
  const { year } = useLocalSearchParams();

  const idMonth = monthId as string;
  const yearNumber = year as string;

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(year as string);

  const [showActionButton, setShowActionButton] = useState<Array<Styles>>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [indexOfActionButtonShowed, setIndexOfActionButtonShowed] =
    useState<number>(-1);
  const [selectProductForEdit, setSelectProductForEdit] =
    useState<number>(-1);

  const [showAddListField, setShowAddListField] = useState<Styles>({
    display: "none",
  });
  const [productData, setProductData] = useState<Product[]>([]);

  useEffect(() => {

    const getMonth = async () => {
      const month = await getMonthById(idMonth);
      setSelectedMonth(month[0].name);
    };

    const getProduct = async () => {
      const user: any = await AsyncStorage.getItem("userCredentials");
      const products = await retrieveProduct(
        JSON.parse(user).id,
        idMonth,
        yearNumber
      );
      let productsCount = 0;
      let buttonActionDiplay = [];

      setProductData(products);

      while (productsCount < products.length) {
        buttonActionDiplay.push({ display: "none" });
        productsCount += 1;
      }
      setShowActionButton(buttonActionDiplay);
    };

    getMonth();
    getProduct();
    setRefresh(false);

    if (selectProductForEdit > -1) {
      setShowAddListField({display: "flex"});
    }
  }, [refresh]);

  return (
    <KeyboardAvoidingView style={[GloblalStyles.container]}>
      <View style={styles.header}>
        <View style={styles.top}>
          <Text style={styles.myexpenses}>My Expenses</Text>
          <Text style={styles.summary}>Summary</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.headerBottomLeft}>
            <Image
              style={styles.scheduleIcon}
              source={require("@/assets/images/schedule.png")}
            />
          </View>
          <View style={styles.headerBottomRight}>
            <Text style={styles.date}>
              {selectedMonth}, {selectedYear}
            </Text>
            <Text style={styles.percentage}>18% more than last month</Text>
          </View>
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
          <View>
            <Text style={styles.chartText}>Chart</Text>
          </View>

          <View style={styles.chartImageContainer}>
            <DonutChart productData={productData}/>
          </View>

          <View style={styles.listProductContainer}>
            <ListProduct
              showActionButton={showActionButton}
              setShowActionButton={setShowActionButton}
              indexOfActionButtonShowed={indexOfActionButtonShowed}
              setIndexOfActionButtonShowed={setIndexOfActionButtonShowed}
              setRefresh={setRefresh}
              selectProductForEdit={selectProductForEdit}
              setSelectProductForEdit={setSelectProductForEdit}
              productData={productData}
            />
          </View>
        </View>

        <TextInputAddList
          showAddList={showAddListField}
          month={idMonth}
          year={selectedYear}
          setShowAddListField={setShowAddListField}
          selectProductForEdit={selectProductForEdit}
          setSelectProductForEdit={setSelectProductForEdit}
          productData={productData}
          setRefresh={setRefresh}
        />

        <View style={styles.buttonAddListContainer}>
          <TouchableOpacity
            onPress={() => {
              setShowAddListField({ display: "flex" });
            }}
          >
            <Image source={require("@/assets/images/plus.png")} />
          </TouchableOpacity>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    height: 200,
    padding: 20,
  },
  top: {
    marginTop: 20,
  },
  myexpenses: {
    color: TitleColor,
    fontFamily: "k2d-bold",
    fontSize: 16,
  },
  summary: {
    color: TextColor,
    fontFamily: "k2d-regular",
  },
  bottom: {
    flexDirection: "row",
    flex: 2,
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
    flex: 1
  },
  buttonAddListContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    position: "absolute",
    right: 5,
    bottom: 0,
  },
});

import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  FlatList,
  ViewStyle,
} from "react-native";
import { TextColor, green, red } from "@/constants/Colors";
import { Styles } from "react-native-svg";
import { Product } from "@/constants/interface";
import {
  removeProduct,
  retrieveProduct,
  retrieveProductByCategory,
} from "@/constants/Controller";
import { useEffect, useState } from "react";

export default function ListProduct({
  showActionButton,
  setShowActionButton,
  indexOfActionButtonShowed,
  setIndexOfActionButtonShowed,
  setChange,
  setShowAddListField,
  setSelectProductForEdit,
  productData,
  setShowLoading,
}: {
  showActionButton: ViewStyle[];
  setShowActionButton: (val: ViewStyle[]) => void;
  indexOfActionButtonShowed: number;
  setIndexOfActionButtonShowed: (val: number) => void;
  setChange: (val: boolean) => void;
  setShowAddListField: (val: ViewStyle) => void;
  setSelectProductForEdit: (val: Product) => void;
  productData: Product[];
  setShowLoading?: (val: ViewStyle) => void;
}) {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  let totalAmountTmp = 0;

  productData?.forEach((data) => {
    totalAmountTmp += (data.amount * data.coefficient);
  });

  return (
    <FlatList
      data={productData}
      renderItem={({ item, index }) => (
        <TouchableHighlight
          onLongPress={() => {
            let showActionButtonTmp = [...showActionButton];
            showActionButtonTmp[index] = { display: "flex" };

            setShowActionButton(showActionButtonTmp);

            setIndexOfActionButtonShowed(index);
          }}
          onPressIn={() => {
            setShowActionButton([]);
            setIndexOfActionButtonShowed(-1);
          }}
          underlayColor="white"
          style={styles.listProduct}
        >
          <View
            style={[
              styles.itemsContainer,
              indexOfActionButtonShowed == index && {
                backgroundColor: "#fff",
                borderRadius: 5,
              },
            ]}
          >
            <View style={styles.itemLeftContent}>
              <View
                style={[styles.itemColor, { backgroundColor: item.color }]}
              ></View>
              <View>
                <Text
                  style={[
                    styles.productName,
                    indexOfActionButtonShowed == index && {
                      fontFamily: "k2d-bold",
                      color: "#000",
                    },
                  ]}
                >
                  {item.designation}
                </Text>
                <Text style={styles.productCreatedDate}>
                  {new Date(item.createdDate!).toLocaleDateString(
                    "en-US",
                    options
                  )}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.itemRightContent,
                indexOfActionButtonShowed == index && {
                  display: "none",
                },
              ]}
            >
              <Text style={styles.price}>{item.amount * item.coefficient} Ariary - </Text>
              <Text style={styles.percentage}>
                {Number(
                  ((item.coefficient * item.amount) * 100) / totalAmountTmp
                ).toFixed(2)}
                %
              </Text>
            </View>

            <View style={[styles.buttonsAction, showActionButton[index]]}>
              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={() => {
                  setSelectProductForEdit(item);
                  setIndexOfActionButtonShowed(-1);
                  setShowAddListField({ display: "flex" });
                }}
              >
                <Image
                  style={styles.editIcon}
                  source={require("@/assets/images/pencil.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteIconContainer}
                onPress={async () => {
                  setShowLoading!({ display: "flex" });
                  const deleted = await removeProduct(item.id);
                  if (deleted) {
                    setIndexOfActionButtonShowed(-1);
                    setChange(true);

                    setTimeout(() => {
                      setShowLoading!({ display: "none" });
                    }, 2000);
                  }
                }}
              >
                <Image
                  style={styles.deleteIcon}
                  source={require("@/assets/images/close.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableHighlight>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listProduct: {
    padding: 6,
    borderRadius: 5,
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    padding: 6,
    borderRadius: 10,
  },
  itemLeftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemColor: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 5,
  },
  productName: {
    fontFamily: "k2d-bold",
    color: TextColor,
  },
  productCreatedDate: {
    fontFamily: "k2d-regular",
    color: TextColor,
    fontSize: 8
  },
  itemRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontFamily: "k2d-regular",
    color: TextColor,
  },
  buttonsAction: {
    position: "absolute",
    flexDirection: "row",
    right: 0,
    zIndex: 20,
    marginRight: 5,
    // backgroundColor: "#FFF",
    paddingVertical: 6,
    borderRadius: 5,
    display: "none",
  },
  editIconContainer: {
    backgroundColor: green,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  editIcon: {
    width: 15,
    height: 15,
  },
  deleteIconContainer: {
    backgroundColor: red,
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  deleteIcon: {
    width: 15,
    height: 15,
  },
  percentage: {
    color: TextColor,
    fontFamily: "k2d-regular",
  },
});

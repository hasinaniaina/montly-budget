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
import { CreationProduct, Product } from "@/constants/interface";
import { removeProduct } from "@/constants/Controller";
import { useState } from "react";
import ConfirmationMessageModal from "./message/confirmationMessageModal";
import { GloblalStyles } from "@/constants/GlobalStyles";

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
  productDataWithoutFilter,
}: {
  showActionButton: ViewStyle[];
  setShowActionButton: (val: ViewStyle[]) => void;
  indexOfActionButtonShowed: number;
  setIndexOfActionButtonShowed: (val: number) => void;
  setChange: (val: boolean) => void;
  setShowAddListField: (val: ViewStyle) => void;
  setSelectProductForEdit: (val: Product) => void;
  productData: Product[] & CreationProduct[];
  setShowLoading: (val: ViewStyle) => void;
  productDataWithoutFilter: Product[] | CreationProduct[];
}) {
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  let totalAmountTmp = 0;
  let price: string[] = [];
  let coefficient: string[] = [];

  productDataWithoutFilter?.forEach((data) => {
    totalAmountTmp +=
      (data as CreationProduct).productAmount *
      (data as CreationProduct).productCoefficient;
  });

  for (let data of productData) {
    const priceTmp = data.productAmount * data.productCoefficient;
    price.push(priceTmp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

    const coefficientTmp = (priceTmp * 100) / totalAmountTmp
    coefficient.push(coefficientTmp.toString())
  }

  // Confirmation delete confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const removeItem = async () => {
    const result = await removeProduct(indexOfActionButtonShowed);
    return result;
  };

  return (
    <>
      <FlatList
        data={productData}
        renderItem={({ item, index }) => (
          <TouchableHighlight
            onLongPress={() => {
              let showActionButtonTmp = [...showActionButton];
              showActionButtonTmp[index] = { display: "flex" };

              setShowActionButton(showActionButtonTmp);

              setIndexOfActionButtonShowed(
                (item as CreationProduct).idCreationProduct
              );
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
                indexOfActionButtonShowed ==
                  (item as CreationProduct).idCreationProduct && {
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
                      indexOfActionButtonShowed ==
                        (item as CreationProduct).idCreationProduct && {
                        fontFamily: "k2d-bold",
                        color: "#000",
                      },
                    ]}
                  >
                    {item.designation}
                  </Text>
                  <Text style={GloblalStyles.CreatedDate}>
                    {new Date(
                      (item as CreationProduct).createdDate!
                    ).toLocaleDateString("en-US", options)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.itemRightContent,
                  indexOfActionButtonShowed == (item as CreationProduct).idCreationProduct && {
                    display: "none",
                  },
                ]}
              >
                <Text style={styles.price}>{price[index]}{" "}Ar-{" "}</Text>
                <Text style={styles.percentage}>{Number(coefficient[index]).toFixed(2)}%</Text>
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
                    setShowConfirmationModal(true);
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

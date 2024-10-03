import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { TextColor, green, red } from "@/constants/Colors";
import { Styles } from "react-native-svg";
import { Product } from "@/constants/interface";
import {  removeProduct } from "@/constants/Controller";

export default function ListProduct({
  showActionButton,
  setShowActionButton,
  indexOfActionButtonShowed,
  setIndexOfActionButtonShowed,
  setRefresh,
  selectProductForEdit,
  setSelectProductForEdit,
  productData,
}: {
  showActionButton: Styles[];
  setShowActionButton: (val: Styles[]) => void;
  indexOfActionButtonShowed: number;
  setIndexOfActionButtonShowed: (val: number) => void;
  setRefresh: (val: boolean) => void;
  selectProductForEdit: number;
  setSelectProductForEdit: (val: number) => void;
  productData: Product[];
}) {
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
              (indexOfActionButtonShowed == index && selectProductForEdit == -1) && {
                backgroundColor: "#fff",
                borderRadius: 5,
              },
            ]}
          >
            <View style={styles.itemLeftContent}>
              <View
                style={[styles.itemColor, { backgroundColor: item.color }]}
              ></View>
              <Text
                style={[
                  styles.productName,
                  (indexOfActionButtonShowed == index && selectProductForEdit == -1)  && {
                    fontFamily: "k2d-bold",
                    color: "#000",
                  },
                ]}
              >
                {item.designation}
              </Text>
            </View>
            <View
              style={[
                styles.itemRightContent,
                (indexOfActionButtonShowed == index && selectProductForEdit == -1)  && {
                  display: "none",
                },
              ]}
            >
              <Text style={styles.price}>{item.amount} Ariary - </Text>
              <Text style={styles.percentage}>
                {Number(item.percentage * 100).toFixed(2)}%
              </Text>
            </View>

            <View style={[styles.buttonsAction, showActionButton[index]]}>
              <TouchableOpacity style={styles.editIconContainer} 
              onPress={() => {
                setSelectProductForEdit(index);
                setIndexOfActionButtonShowed(-1);
                setRefresh(true);

              }}>
                <Image
                  style={styles.editIcon}
                  source={require("@/assets/images/pencil.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteIconContainer}
                onPress={async () => {
                  const deleted = await removeProduct(item.id, productData);
                  if (deleted) {
                    setIndexOfActionButtonShowed(-1);
                    setRefresh(true);
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
    fontFamily: "k2d-regular",
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

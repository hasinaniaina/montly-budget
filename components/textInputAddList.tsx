import { editProduct, saveProduct } from "@/constants/Controller";
import ColorPickerView from "@/components/colorPicker";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Styles } from "react-native-svg";
import { green, red } from "@/constants/Colors";
import ErrorMessageModal from "./message/errorMessageModal";
import { Product } from "@/constants/interface";

export default function TextInputAddList({
  showAddList,
  month,
  year,
  setShowAddListField,
  selectProductForEdit,
  setSelectProductForEdit,
  productData,
  setRefresh,
}: {
  showAddList: Styles;
  month: string;
  year: string;
  setShowAddListField: (val: Styles) => void;
  selectProductForEdit: number;
  setSelectProductForEdit: (val: number) => void;
  productData: Product[];
  setRefresh: (val: boolean) => void;
}) {
  const [productColor, setProductColor] = useState<string>("#000");
  const [productName, setProductName] = useState<string>("");
  const [productAmount, setProductAmount] = useState<string>("");

  const [editProductName, setEditProductName] = useState<string>("");
  const [editProductAmount, setEditProductAmount] = useState<number | string>(0);

  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  let [modalShown, setModalShown] = useState<boolean[]>([false]);

  useEffect(() => {
    const editProductNameTmp = productData[selectProductForEdit]
      ? productData[selectProductForEdit].designation
      : "";
    const editProductAmountTmp = productData[selectProductForEdit]
      ? productData[selectProductForEdit].amount
      : 0;

    setEditProductName(editProductNameTmp);
    setEditProductAmount(editProductAmountTmp);
  }, [selectProductForEdit]);
  
  return (
    <View style={[styles.textInputAddListContainer, showAddList]}>
      <ColorPickerView
        setColor={setProductColor}
        selectProductForEdit={selectProductForEdit}
        productData={productData}
      />

      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Product"
          value={selectProductForEdit > -1 ? editProductName : productName}
          style={styles.textInput}
          onChangeText={(val) => {
            selectProductForEdit > -1
              ? setEditProductName(val)
              : setProductName(val);
          }}
        />
      </View>

      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          value={
            selectProductForEdit > -1
              ? editProductAmount.toString()
              : productAmount
          }
          style={styles.textInput}
          onChangeText={(val) => {
            selectProductForEdit > -1
              ? setEditProductAmount(val)
              : setProductAmount(val);
          }}
        />
      </View>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.saveContainer, styles.buttonAddList]}
          onPress={async () => {
            setProductAmount("");
            setProductName("");

            let result: any = false;

            if (selectProductForEdit == -1) {
              result = await saveProduct(
                productColor,
                productName,
                productAmount,
                month,
                year,
                setErrorMessage,
                setModalShown
              );
            
            } else {
              result = await editProduct(
                productColor,
                editProductName,
                editProductAmount.toString(),
                selectProductForEdit,
                productData,
                setErrorMessage,
                setModalShown
              );

              if (result) { 
                setShowAddListField({ display: "none" });
              }
            }

            if (result) {
              setRefresh(true);
              setSelectProductForEdit(-1);
            }
          }}
        >
          <Text style={styles.textSave}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.closeContainer, styles.buttonAddList]}
          onPress={() => {
            setShowAddListField({ display: "none" });
            setRefresh(true);
            setSelectProductForEdit(-1);
          }}
        >
          <Text style={styles.textSave}>Close</Text>
        </TouchableOpacity>
      </View>

      <ErrorMessageModal
        modalShown={modalShown[0]}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setModalShown={setModalShown}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  textInputAddListContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    zIndex: 12,
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
});

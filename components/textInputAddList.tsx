import { editProduct, saveProduct } from "@/constants/Controller";
import ColorPickerView from "@/components/colorPicker";
import { useEffect, useState } from "react";
import {
  Dimensions,
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
import ColorPickerViewNew from "./colorPickerNew";

export default function TextInputAddList({
  setShowAddListField,
  selectProductForEdit,
  setSelectProductForEdit,
  productData,
  setRefresh,
}: {
  setShowAddListField: (val: Styles) => void;
  selectProductForEdit: Product;
  setSelectProductForEdit: (val: Product) => void;
  productData: Product[];
  setRefresh: (val: boolean) => void;
}) {
  const productDataInit = {
    id: -1,
    designation: "string",
    amount: 0,
    color: "string",
    idCategory: -1,
    percentage: 0
  };

  const [productColor, setProductColor] = useState<string>("#000");
  const [productName, setProductName] = useState<string>("");
  const [productAmount, setProductAmount] = useState<string>("");

  const [editProductName, setEditProductName] = useState<string>("");
  const [editProductAmount, setEditProductAmount] = useState<number | string>(0);

  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  let [modalShown, setModalShown] = useState<boolean[]>([false]);

  useEffect(() => {
    const editProductNameTmp = selectProductForEdit ? selectProductForEdit.designation
      : "";
    const editProductAmountTmp = selectProductForEdit
      ? selectProductForEdit.amount
      : 0;

    setEditProductName(editProductNameTmp);
    setEditProductAmount(editProductAmountTmp);
  }, [selectProductForEdit]);
  
  return (
    <View style={[styles.textInputAddListContainer]}>
      <ColorPickerViewNew
        data={selectProductForEdit}
        setData={setSelectProductForEdit}
      />

      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Product"
          value={selectProductForEdit ? editProductName : productName}
          style={styles.textInput}
          onChangeText={(val) => {
            selectProductForEdit 
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
            selectProductForEdit
              ? editProductAmount.toString()
              : productAmount
          }
          style={styles.textInput}
          onChangeText={(val) => {
            selectProductForEdit
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

            if (selectProductForEdit ) {
              // result = await saveProduct(
              //   productColor,
              //   productName,
              //   productAmount,
              //   setErrorMessage,
              //   setModalShown
              // );
            
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
              setSelectProductForEdit(productDataInit);
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
            setSelectProductForEdit(productDataInit);
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

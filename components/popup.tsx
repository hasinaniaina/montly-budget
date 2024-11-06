import ColorPickerView from "@/components/colorPicker";
import { TitleColor, green } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { ReactNode, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ViewStyle,
  Keyboard,
} from "react-native";
import ColorPickerViewNew from "./colorPickerNew";
import {
  createCategory,
  editProduct,
  filterCategory,
  filterProduct,
  retrieveCategoryAccordingToDate,
  retrieveProduct,
  saveProduct,
  upgradeCategory,
} from "@/constants/Controller";
import ErrorMessageModal from "./message/errorMessageModal";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "@/constants/interface";
import {
  amountRemainingProduct,
  checkIfCategorylabelAlreadyStored,
  checkIfProductCategoryExistAndAmountNotLessProduct,
  isFilteredActivate,
} from "@/constants/utils";

export default function Popup({
  title,
  buttonTitle,
  visible,
  setVisible,
  viewType,
  datas,
  setData,
  setChange,
  thereIsFilter,
  setThereIsFilter,
  categoryDateFilter,
  setshowLoading,
  category,
  confirmAddExistingCategory,
  children,
}: {
  title: string;
  buttonTitle: string;
  visible: ViewStyle;
  setVisible: (val: ViewStyle) => void;
  viewType: string;
  datas?: any;
  setData: (val: any) => void;
  setChange: (val: boolean) => void;
  thereIsFilter?: boolean[];
  setThereIsFilter: (val: boolean[]) => void;
  categoryDateFilter?: Date[];
  setshowLoading: (val: ViewStyle) => void;
  category?: Category & CreationCategory;
  confirmAddExistingCategory?: () => void;
  children: ReactNode;
}) {
  const categoryDataInit = {
    id: -1,
    color: "#000",
    income: "",
    label: "",
    idUser: 1,
  };

  // Get product for edit
  const productDataInit: Product & CreationProduct = {
    idProduct: -1,
    idCreationProduct: -1,
    designation: "",
    productAmount: 0,
    color: "#000",
    idCreationCategory: (datas as CreationCategory)?.idCreationCategory!,
    productCoefficient: 1,
  };

  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  let [modalShown, setModalShown] = useState<boolean[]>([false]);

  // Hide add button When keyboard is showing
  const [hidePopupAddButton, setHidePopupAddButton] = useState<ViewStyle>({
    display: "flex",
  });

  const addOrUpdateCategory = async () => {
    if (datas?.idCategory! > 0) {
      const categoryAmount =
        await checkIfProductCategoryExistAndAmountNotLessProduct(datas);

      if (categoryAmount.notLess) {
        const result = upgradeCategory({
          datas,
          setErrorMessage,
          setModalShown,
        });

        if (await result) {
          setData(categoryDataInit);
          setVisible({ display: "none" });
          setshowLoading({ display: "none" });
          setChange(true);
        }
      } else {
        setErrorMessage([
          datas.label +
            " amount should not be less than " +
            categoryAmount.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
            " Ar",
        ]);
        setModalShown([true]);
        setshowLoading({ display: "none" });
      }
    } else {
      const isCategoryLabelNotExist = await checkIfCategorylabelAlreadyStored(
        datas
      );

      if (isCategoryLabelNotExist) {
        const result = createCategory({
          datas,
          setErrorMessage,
          setModalShown,
        });

        result.then((success) => {
          if (success) {
            setData(categoryDataInit);
            setshowLoading({ display: "none" });
            setChange(true);
          }
        });
      } else {
        setErrorMessage([datas.label + " category already exist!"]);
        setModalShown([true]);
        setshowLoading({ display: "none" });
      }
    }
  };

  const filterByCategory = async () => {
    if (datas) {
      let datasTmp = Array.isArray(datas) ? datas : [datas];
      
      const datasAfterFilter = await filterCategory(
        datasTmp,
        categoryDateFilter!
      );

      setData(datasAfterFilter);
      setVisible({ display: "none" });

      const isFiltered = isFilteredActivate(thereIsFilter!, 0, true);
      setThereIsFilter!(isFiltered);

      setChange(true);
      setshowLoading({ display: "none" });
    }
  };

  const filterByDate = async () => {
    let categories = await retrieveCategoryAccordingToDate(categoryDateFilter!);

    let datasTmp = thereIsFilter![0] ? datas : categories;

    const datasAfterFilter = await filterCategory(
      datasTmp,
      categoryDateFilter!
    );

    setData(datasAfterFilter);
    setVisible({ display: "none" });

    const isFiltered = isFilteredActivate(thereIsFilter!, 1, true);
    setThereIsFilter!(isFiltered);

    setChange(true);
    setshowLoading({ display: "none" });
  };

  const expenses = async () => {
    const products = await retrieveProduct(category!);

    let productAmountTmp = 0;

    for (let product of products) {
      productAmountTmp +=
        (product as CreationProduct).productAmount *
        (product as CreationProduct).productCoefficient;
    }

    // Get Product Amount remaining for the category
    const productAmountRemaining =
      (category as CreationCategory)?.categoryIncome! - productAmountTmp;

    if (datas.idCreationProduct == -1) {
      // Get if Amount insert by user exceed product amount remaining
      const isNotExceedAmountRemaining = amountRemainingProduct(
        datas,
        productAmountRemaining,
        setErrorMessage,
        setModalShown,
        setshowLoading
      );

      if (isNotExceedAmountRemaining) {
        const insertProduct = await saveProduct(
          datas,
          setErrorMessage,
          setModalShown
        );

        if (insertProduct) {
          setData(productDataInit);
          setChange(true);

          setTimeout(() => {
            setshowLoading({ display: "none" });
          }, 2000);
        }
      }
    } else {
      let oldAmount = 0;

      for (let product of products) {
        if (
          (product as CreationProduct).idCreationProduct ==
          datas.idCreationProduct
        ) {
          oldAmount =
            (product as CreationProduct).productAmount *
            (product as CreationProduct).productCoefficient;
        }
      }

      let amountRemaining = productAmountRemaining + oldAmount;

      // Get if Amount insert by user exceed product amount remaining
      const isNotExceedAmountRemaining = amountRemainingProduct(
        datas,
        amountRemaining,
        setErrorMessage,
        setModalShown,
        setshowLoading
      );

      if (isNotExceedAmountRemaining) {
        const updateProduct = await editProduct(
          datas,
          setErrorMessage,
          setModalShown
        );

        if (updateProduct) {
          setData(productDataInit);
          setChange(true);
          setVisible({ display: "none" });

          setTimeout(() => {
            setshowLoading({ display: "none" });
          }, 2000);
        }
      }
    }
  };

  const filterProducts = async () => {    
    const productsFiltered = await filterProduct(datas);

    setThereIsFilter([true]);
    setData(productsFiltered);
    setVisible({ display: "none" });
    setChange(true);

    setTimeout(() => {
      setshowLoading({ display: "none" });
    }, 2000);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setHidePopupAddButton({ display: "none" });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setHidePopupAddButton({ display: "flex" });
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={[styles.popupContainer, visible]}>
      {/* popup top */}
      <View style={styles.popupTop}></View>

      {/* popup bottom */}
      <View style={styles.popupBottom}>
        {/* popup header */}
        <View style={styles.popupHeader}>
          <View style={styles.popupHeaderTitle}>
            <Text style={[GloblalStyles.titleSection]}>{title}</Text>
          </View>
          <TouchableOpacity
            style={[styles.popupIconClose]}
            onPress={() => {
              if (viewType == "category") {
                setData(categoryDataInit);
              }

              setVisible({ display: "none" });
            }}
          >
            <Image
              style={GloblalStyles.icon}
              source={require("@/assets/images/close1.png")}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            height: "70%",
            marginBottom: 10,
          }}
        >
          {/* popup content */}
          <View style={styles.popupContent}>{children}</View>
        </View>
        <TouchableOpacity
          style={[styles.popupButton, hidePopupAddButton]}
          onPress={async () => {
            setshowLoading({ display: "flex" });
            switch (viewType) {
              case "category":
                addOrUpdateCategory();
                break;
              case "categoryExisting":
                confirmAddExistingCategory!();
                break;
              case "filterByCategory":
                filterByCategory();
                break;
              case "filterByDate":
                filterByDate();
                break;
              case "expenses":
                expenses();
                break;
              case "filterProduct":
                filterProducts();
                break;
            }
          }}
        >
          <Text style={styles.popupButtonTitle}>{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
      <ErrorMessageModal
        modalShown={modalShown[0]}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setModalShown={setModalShown}
        setShowLoading={setshowLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    position: "absolute",
    top: 0,
    height: "100%",
  },
  popupTop: {
    backgroundColor: "#000",
    flex: 2,
    opacity: 0.6,
  },
  popupBottom: {
    backgroundColor: "#FFF",
    padding: 20,
    flex: 2,
  },
  popupHeader: {
    flexDirection: "row",
    position: "relative",
    width: Dimensions.get("screen").width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  popupHeaderTitle: {},
  popupIconClose: {
    position: "absolute",
    right: 20,
  },
  popupButton: {
    backgroundColor: green,
    marginHorizontal: 40,
    width: Dimensions.get("screen").width - 40,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
  },
  popupContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  popupButtonTitle: {
    fontFamily: "k2d-bold",
    color: "#fff",
  },
});

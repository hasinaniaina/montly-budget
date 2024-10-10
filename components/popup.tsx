import ColorPickerView from "@/components/colorPicker";
import { TitleColor, green } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { ReactNode, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  ViewStyle,
  Alert,
} from "react-native";
import ColorPickerViewNew from "./colorPickerNew";
import {
  createCategory,
  editProduct,
  filterCategory,
  filterProduct,
  retrieveCategoryAccordingToDate,
  retrieveProduct,
  retrieveUserCategory,
  saveProduct,
  upgradeCategory,
} from "@/constants/Controller";
import ErrorMessageModal from "./message/errorMessageModal";
import { Category, Product } from "@/constants/interface";
import {
  amountRemainingProduct,
  checkIfCategorylabelAlreadyStored,
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
  category?: Category;
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
  const productDataInit: Product = {
    id: -1,
    designation: "",
    amount: 0,
    color: "#000",
    idCategory: datas?.idCategory!,
    coefficient: 1,
  };

  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  let [modalShown, setModalShown] = useState<boolean[]>([false]);

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
              setVisible({ display: "none" });
            }}
          >
            <Image
              style={GloblalStyles.icon}
              source={require("@/assets/images/close1.png")}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            {/* popup colorPicker */}
            {(viewType == "category" || viewType == "expenses") && (
              <ColorPickerViewNew data={datas} setData={setData} />
            )}

            {/* popup content */}
            <View style={styles.popupContent}>{children}</View>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={async () => {
                setshowLoading({ display: "flex" });
                switch (viewType) {
                  case "category":
                    if (datas?.id! > 0) {
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
                      const isCategoryLabelNotExist =
                        await checkIfCategorylabelAlreadyStored(datas);

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
                        setErrorMessage([
                          datas.label + " category already exist!",
                        ]);
                        setModalShown([true]);
                        setshowLoading({ display: "none" });
                      }
                    }

                    break;
                  case "filterByCategory":
                    if (datas) {
                      let datasTmp = Array.isArray(datas) ? datas : [datas];

                      const datasAfterFilter = await filterCategory(
                        datasTmp,
                        categoryDateFilter!
                      );

                      setData(datasAfterFilter);
                      setVisible({ display: "none" });

                      const isFiltered = isFilteredActivate(
                        thereIsFilter!,
                        0,
                        true
                      );
                      setThereIsFilter!(isFiltered);

                      setChange(true);
                      setshowLoading({ display: "none" });
                    }
                    break;
                  case "filterByDate":
                    let categories = await retrieveCategoryAccordingToDate(
                      categoryDateFilter!
                    );

                    let datasTmp = thereIsFilter![0] ? datas : categories;

                    const datasAfterFilter = await filterCategory(
                      datasTmp,
                      categoryDateFilter!
                    );

                    setData(datasAfterFilter);
                    setVisible({ display: "none" });

                    const isFiltered = isFilteredActivate(
                      thereIsFilter!,
                      1,
                      true
                    );
                    setThereIsFilter!(isFiltered);

                    setChange(true);
                    setshowLoading({ display: "none" });
                    break;
                  case "expenses":
                    const products = await retrieveProduct(category!);

                    let productAmountTmp = 0;

                    products?.forEach((product) => {
                      productAmountTmp += product.amount * product.coefficient;
                    });

                    // Get Product Amount remaining for the category
                    const productAmountRemaining =
                      parseFloat(category?.income!) - productAmountTmp;

                    if (datas.id == -1) {
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

                      products?.forEach((product) => {
                        if (product.id == datas.id) {
                          oldAmount = product.amount;
                        }
                      });

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
                    break;
                  case "filterProduct":
                    const productsFiltered = await filterProduct(datas);

                    setThereIsFilter([true]);
                    setData(productsFiltered);
                    setVisible({ display: "none" });
                    setChange(true);

                    setTimeout(() => {
                      setshowLoading({ display: "none" });
                    }, 2000);
                    break;
                }
              }}
            >
              <Text style={styles.popupButtonTitle}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    alignSelf: "stretch",
    height: "50%",
    opacity: 0.6,
  },
  popupBottom: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
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

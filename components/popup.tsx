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
} from "react-native";
import ColorPickerViewNew from "./colorPickerNew";
import {
  createCategory,
  editProduct,
  filterCategory,
  filterProduct,
  saveProduct,
  upgradeCategory,
} from "@/constants/Controller";
import ErrorMessageModal from "./message/errorMessageModal";
import { Category, Product } from "@/constants/interface";

export default function Popup({
  title,
  buttonTitle,
  visible,
  setVisible,
  viewType,
  datas,
  setData,
  setChange,
  setIsFilterSelected,
  categoryDateFilter,
  setshowLoading,
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
  setIsFilterSelected?: (val: boolean | any) => void;
  categoryDateFilter?: Date[];
  setshowLoading: (val: ViewStyle) => void;
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

  const [color, setColor] = useState<String>("#FFF");

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
                      }
                    } else {
                      const result = createCategory({
                        datas,
                        setErrorMessage,
                        setModalShown,
                      });

                      if (await result) {
                        setData(categoryDataInit);
                        setshowLoading({ display: "none" });
                      }
                    }

                    setChange(true);
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
                      setIsFilterSelected!(true);
                      setChange(true);
                      setshowLoading({ display: "none" });
                    }
                    break;
                  case "filterByDate":
                    let datasTmp = Array.isArray(datas) ? datas : [datas];
                    datasTmp =
                      datasTmp.length == 0 || !datas[0]
                        ? [categoryDataInit]
                        : datasTmp;

                    const datasAfterFilter = await filterCategory(
                      datasTmp as Category[],
                      categoryDateFilter!
                    );
                    setData(datasAfterFilter);
                    setVisible({ display: "none" });
                    setIsFilterSelected!(true);
                    setChange(true);
                    setshowLoading({ display: "none" });
                    break;
                  case "expenses":
                    if (datas.id == -1) {
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
                    } else {
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
                    break;
                  case "filterProduct":
                    const productsFiltered =  filterProduct(datas);

                    productsFiltered.then((datasFiltered) => {
                      setData(datasFiltered);
                      setIsFilterSelected!(true);
                      setVisible({ display: "none" });
  
                      setTimeout(() => {
                        setshowLoading({ display: "none" });
                      }, 2000);
                    });
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

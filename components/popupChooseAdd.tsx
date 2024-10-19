import { TextColor, TitleColor, green } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";

export default function PopupChooseAdd({
  modalShown,
  setOpenCloseModalChooseAdd,
  openPopupAddNewCategoryVisible,
  openPopupAddExistingCategoryVisible,
  getAllCurrentUserCategory
}: {
  modalShown: boolean;
  setOpenCloseModalChooseAdd: (val: boolean) => void;
  openPopupAddNewCategoryVisible: () => void;
  openPopupAddExistingCategoryVisible: () => void;
  getAllCurrentUserCategory: () => void;
}) {
  const [addChooseFirst, setAddChooseFirst] = useState<boolean>(true);
  return (
    <Modal animationType="fade" transparent={true} visible={modalShown}>
      {/* Black transparent background */}
      <View style={styles.backgroundBlackTransparent}></View>

      <View style={styles.listAddcontainer}>
        <View style={{ backgroundColor: "#FFF", borderRadius: 20 }}>
          <View style={styles.listAddHeader}>
            <Text style={{ color: TitleColor, fontFamily: "k2d-bold" }}>
              Add Category
            </Text>
            <TouchableOpacity
              style={styles.closeImageCountainer}
              onPress={() => {setOpenCloseModalChooseAdd(false)}}
            >
              <Image
                style={GloblalStyles.icon}
                source={require("@/assets/images/close1.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.listChooseContent}>
            <Pressable
              style={styles.listItemChoose}
              onPress={() => {
                setAddChooseFirst(!addChooseFirst);
              }}
            >
              <TouchableOpacity activeOpacity={0.7} style={styles.checkbox}>
                <View
                  style={[
                    styles.checkboxChecked,
                    addChooseFirst
                      ? { backgroundColor: TextColor }
                      : { backgroundColor: "transparent" },
                  ]}
                ></View>
              </TouchableOpacity>
              <Text style={styles.text}>Add new category?</Text>
            </Pressable>

            <Pressable
              style={styles.listItemChoose}
              onPress={() => {
                setAddChooseFirst(!addChooseFirst);
              }}
            >
              <TouchableOpacity activeOpacity={0.7} style={styles.checkbox}>
                <View
                  style={[
                    styles.checkboxChecked,
                    !addChooseFirst
                      ? { backgroundColor: TextColor }
                      : { backgroundColor: "transparent" },
                  ]}
                ></View>
              </TouchableOpacity>
              <Text style={styles.text}>Add existing categories?</Text>
            </Pressable>
            <View>
              <TouchableOpacity
                style={[styles.modalButtonPopup, styles.modalButton]}
                onPress={() => {
                  if (addChooseFirst) {
                    openPopupAddNewCategoryVisible();
                  } else {
                    openPopupAddExistingCategoryVisible();
                    // getAllCurrentUserCategory();
                  }
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "k2d-regular",
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  listAddcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundBlackTransparent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    opacity: 0.5,
  },
  listAddHeader: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    width: 250,
  },
  closeImageCountainer: {
    position: "absolute",
    right: 10,
  },
  listChooseContent: {
    padding: 20,
    width: "70%",
    alignSelf: "center",
  },
  listItemChoose: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    height: 15,
    width: 15,
    backgroundColor: "transparent",
    borderColor: TextColor,
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    height: 8,
    width: 8,
    backgroundColor: "transparent",
    borderRadius: 50,
  },
  text: {
    textAlign: "center",
    fontFamily: "k2d-regular",
    color: TextColor,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    width: 100,
    alignSelf: "center",
    borderRadius: 10,
    marginHorizontal: 4,
  },

  modalButtonPopup: {
    backgroundColor: green,
  },
});

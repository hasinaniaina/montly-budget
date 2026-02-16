import { Dimensions, StyleSheet } from "react-native";
import { TextColor, TitleColor, green, orange, red } from "./Colors";

export const GloblalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingVertical: 40,
  },

  avatarEmailContainer: {
    paddingVertical: 40,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 35,
    height: 35,
  },
  email: {
    textAlign: "center",
    marginTop: 20,
    color: TitleColor,
    fontFamily: "k2d-bold",
    fontSize: 16,
  },
  authentificationIcon: {
    width: 100,
    height: 100,
    margin: 5,
  },
  authentificationTitle: {
    fontSize: 40,
    color: TitleColor,
    fontFamily: "k2d-bold",
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    width: 184,
  },
  iconLeftTextInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderColor: "#E5E4E4",
    borderWidth: 1,
    margin: 12,
    padding: 6,
    width: 250,
  },
  iconLeftTextInput: {
    width: 20,
    height: 20,
    marginRight: 8,
    fontFamily: "k2d-regular",
  },
  iconRightTextInput: {
    width: 20,
    height: 20,
  },
  iconRightTextInputNotVisible: {
    display: "none",
  },
  authentificationButtonContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD056",
    padding: 10,
    width: 250,
    borderRadius: 8,
  },
  authentificationButton: {
    color: "#fff",
    fontFamily: "k2d-bold",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  titleSection: {
    fontFamily: "k2d-regular",
    color: TitleColor,
    fontSize: 20,
  },
  titleFlexAlignement: {
    flexDirection: "row",
    alignItems: "center",
  },
  appLabel: {
    fontFamily: "k2d-bold",
    color: TitleColor,
    alignSelf: "flex-start",
  },
  appInput: {
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "#F0F0F0",
    backgroundColor: "#FFF",
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 7,
    paddingVertical: 10,
  },
  action: {
    position: "absolute",
    flexDirection: "row",
    right: 0,
    zIndex: 20,
    backgroundColor: "#FFF",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    width: 15,
    height: 15,
  },
  CreatedDate: {
    fontFamily: "k2d-regular",
    color: TextColor,
    fontSize: 8,
  },
  popupLabelInput: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    width: Dimensions.get("screen").width,
    alignItems: "center",
    justifyContent: "center",
  },

  exportImportContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 10,
  },

  exportImportTitle: {
    fontSize: 20,
    fontFamily: "k2d-bold",
    marginBottom: 20,
  },

  exportImportText: {
    color: TextColor,
    fontFamily: "k2d-regular",
    marginBottom: 20,
  },

  buttonExportImport: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: orange,
    borderRadius: 10,
  },
  buttonTitle: {
    fontFamily: "k2d-bold",
    color: "white",
  },

  popupButton: {
    backgroundColor: green,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 120,
    borderRadius: 10,
    marginVertical: 20,
  },

  popupButtonTitle: {
    fontFamily: "k2d-bold",
    color: "#fff",
  },

  deleteButtonAndActionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  noList: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  textNoList: {
    fontFamily: "k2d-regular",
    color: "red",
    fontSize: 15,
  },
});

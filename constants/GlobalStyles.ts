import { StyleSheet } from "react-native";
import { TextColor, TitleColor, green, red } from "./Colors";

export const GloblalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    position: "relative",
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
    fontFamily: "k2d-bold",
    color: TitleColor,
    fontSize: 16,
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
    paddingHorizontal: 5,
    borderRadius: 7,
    paddingVertical: 5,
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
    display: "none"
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
  CreatedDate: {
    fontFamily: "k2d-regular",
    color: TextColor,
    fontSize: 8,
  },
});

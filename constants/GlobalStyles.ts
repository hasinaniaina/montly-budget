

import { StyleSheet} from "react-native";

export const TitleColor = "#717171";
export const TextColor = "#C8C8C8";

export const  GloblalStyles =  StyleSheet.create({
    authentificationIcon: {
        width: 100,
        height: 100,
        margin: 5
    },
    authentificationTitle: {
        fontSize: 40,
        color: TitleColor,
        fontFamily: "k2d-bold",
        marginBottom: 5

    },
    textInput: {
        height: 40,
        width: 184
    },
    iconLeftTextInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        borderColor: "#E5E4E4",
        borderWidth: 1,
        margin: 12,
        padding: 6,
        width: 250
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
        display: "none"
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
    }
})
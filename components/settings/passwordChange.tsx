import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { green } from "@/constants/Colors";
import { changePassword } from "@/constants/Controller";
import { settingsPassword } from "@/constants/interface";
import ErrorMessageModal from "../message/errorMessageModal";
import Loading from "../loading";

export default function PasswordChange() {
  const router = useRouter();

  const [passwordShowing, setPasswordShowing] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const initialPasswords = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [passwords, setPasswords] =
    useState<settingsPassword>(initialPasswords);

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  let [modalShown, setModalShown] = useState<boolean[]>([false]);

  const togglePasswordShowing = (indexInput: number) => {
    let passwordShowingTmp = [...passwordShowing];
    passwordShowingTmp[indexInput] = !passwordShowing[indexInput];
    setPasswordShowing(passwordShowingTmp);
  };

  return (
    <>
      <View style={GloblalStyles.popupLabelInput}>
        <Text style={GloblalStyles.appLabel}>Current Password</Text>
        <View style={GloblalStyles.appInput}>
          <TextInput
            secureTextEntry={!passwordShowing[0]}
            onChangeText={(val) => {
              let passwordTmp = { ...passwords };
              passwordTmp.currentPassword = val;
              setPasswords(passwordTmp as settingsPassword);
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.eyesIcon}
          onPress={() => {
            togglePasswordShowing(0);
          }}
        >
          <Image
            style={[
              !passwordShowing[0]
                ? GloblalStyles.iconRightTextInput
                : GloblalStyles.iconRightTextInputNotVisible,
            ]}
            source={require("@/assets/images/visible.png")}
          />
          <Image
            style={[
              passwordShowing[0]
                ? GloblalStyles.iconRightTextInput
                : GloblalStyles.iconRightTextInputNotVisible,
            ]}
            source={require("@/assets/images/hide.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={GloblalStyles.popupLabelInput}>
        <Text style={GloblalStyles.appLabel}>New Password</Text>
        <View style={GloblalStyles.appInput}>
          <TextInput
            secureTextEntry={!passwordShowing[1]}
            onChangeText={(val) => {
              let passwordTmp = { ...passwords };
              passwordTmp.newPassword = val;
              setPasswords(passwordTmp as settingsPassword);
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.eyesIcon}
          onPress={() => togglePasswordShowing(1)}
        >
          <Image
            style={[
              !passwordShowing[1]
                ? GloblalStyles.iconRightTextInput
                : GloblalStyles.iconRightTextInputNotVisible,
            ]}
            source={require("@/assets/images/visible.png")}
          />
          <Image
            style={[
              passwordShowing[1]
                ? GloblalStyles.iconRightTextInput
                : GloblalStyles.iconRightTextInputNotVisible,
            ]}
            source={require("@/assets/images/hide.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={GloblalStyles.popupLabelInput}>
        <Text style={GloblalStyles.appLabel}>Confirm new Password</Text>
        <View style={GloblalStyles.appInput}>
          <TextInput
            secureTextEntry={!passwordShowing[2]}
            onChangeText={(val) => {
              let passwordTmp = { ...passwords };
              passwordTmp.confirmNewPassword = val;
              setPasswords(passwordTmp as settingsPassword);
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.eyesIcon}
          onPress={() => togglePasswordShowing(2)}
        >
          <Image
            style={[
              !passwordShowing[2]
                ? GloblalStyles.iconRightTextInput
                : GloblalStyles.iconRightTextInputNotVisible,
            ]}
            source={require("@/assets/images/visible.png")}
          />
          <Image
            style={[
              passwordShowing[2]
                ? GloblalStyles.iconRightTextInput
                : GloblalStyles.iconRightTextInputNotVisible,
            ]}
            source={require("@/assets/images/hide.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={GloblalStyles.popupLabelInput}>
        <TouchableOpacity
          style={[styles.settingsButton]}
          onPress={async () => {
            const result = await changePassword({
              passwords,
              setErrorMessage,
              setModalShown,
            });

            if (result) {
              setShowLoading({ display: "flex" });
              setPasswords(initialPasswords);

              setTimeout(() => {
                setShowLoading({ display: "none" });
                router.push("/");
              }, 2000);
            }
          }}
        >
          <Text style={styles.settingsButtonTitle}>Confirm</Text>
        </TouchableOpacity>
      </View>


      <ErrorMessageModal
        modalShown={modalShown[0]}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setModalShown={setModalShown}
        setShowLoading={setShowLoading}
      />

      {/* Loading view */}
      <Loading showLoading={showLoading} />
    </>
  );
}

const styles = StyleSheet.create({
  eyesIcon: {
    position: "absolute",
    right: 30,
    top: 43,
  },
  settingsButton: {
    backgroundColor: green,
    marginHorizontal: 40,
    width: Dimensions.get("screen").width - 40,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  settingsButtonTitle: {
    fontFamily: "k2d-bold",
    color: "#fff",
  },
});

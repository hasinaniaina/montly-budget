import { GloblalStyles } from "@/constants/GlobalStyles";
import React, { SetStateAction, useState } from "react";
import { Image, TextInput, TouchableOpacity } from "react-native";

export default function AuthentificationPasswordInput({title, handleChange}: {
    title: string,
    handleChange: (value: string) => void
}) {
  let [passwordShowing, setPasswordShowing] = useState<boolean>(false);

  return (
    <>
      <Image
        style={GloblalStyles.iconLeftTextInput}
        source={require("@/assets/images/key.png")}
      />
      <TextInput
        placeholder={title}
        secureTextEntry={!passwordShowing}
        style={GloblalStyles.textInput}
        onChangeText={(val) => handleChange(val)}
      />
      <TouchableOpacity onPress={() => setPasswordShowing(!passwordShowing)}>
        <Image
          style={[
            !passwordShowing
              ? GloblalStyles.iconRightTextInput
              : GloblalStyles.iconRightTextInputNotVisible,
          ]}
          source={require("@/assets/images/visible.png")}
        />
        <Image
          style={[
            passwordShowing
              ? GloblalStyles.iconRightTextInput
              : GloblalStyles.iconRightTextInputNotVisible,
          ]}
          source={require("@/assets/images/hide.png")}
        />
      </TouchableOpacity>
    </>
  );
}
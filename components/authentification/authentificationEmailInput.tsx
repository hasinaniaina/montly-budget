import { GloblalStyles } from "@/constants/GlobalStyles";
import React, { SetStateAction } from "react";
import {
    Image,
    TextInput,
  } from "react-native";

export default function AuthentificationEmailInput({handleChange}: {
  handleChange: (value: string) => void
}) {
  return (
    <>
      <Image
        style={GloblalStyles.iconLeftTextInput}
        source={require("@/assets/images/email.png")}
      />
      <TextInput
        placeholder="example@mail.com"
        keyboardType="email-address"
        style={GloblalStyles.textInput}
        onChangeText={(val) => handleChange(val)}
      />
    </>
  );
}

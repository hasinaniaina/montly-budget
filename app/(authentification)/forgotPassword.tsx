import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { GloblalStyles, TextColor } from "@/constants/GlobalStyles";
import {  useState } from "react";
import AuthentificationButton from "@/components/authentification/authentificationButton";
import AuthentificationEmailInput from "@/components/authentification/authentificationEmailInput";

export default function ForgotPassword() {

  let [passwordShowing, setPasswordShowing] = useState<boolean>(false);


  return (
    <View style={styles.container}>
      <View>
        <Image
          style={GloblalStyles.authentificationIcon}
          source={require("@/assets/images/budget.png")}
        />
      </View>
      <View>
        <Text style={GloblalStyles.authentificationTitle}>Forgot Password</Text>
      </View>
      <SafeAreaView>
        <View style={GloblalStyles.iconLeftTextInputContainer}>
          <AuthentificationEmailInput />
        </View>
        <AuthentificationButton title="Retrieve"></AuthentificationButton>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginVertical: 5,
    fontFamily: "k2d-regular",
    color: TextColor,
  },
});
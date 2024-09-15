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
import AuthentificationPasswordInput from "@/components/authentification/authentificationPasswordInput";

export default function Login() {

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
        <Text style={GloblalStyles.authentificationTitle}>Login</Text>
      </View>
      <SafeAreaView>
        <View style={GloblalStyles.iconLeftTextInputContainer}>
          <AuthentificationEmailInput />
        </View>
        <View style={GloblalStyles.iconLeftTextInputContainer}>
          <AuthentificationPasswordInput title="Password" />
        </View>
        <AuthentificationButton title="Login"></AuthentificationButton>
      </SafeAreaView>
      <View>
        <Text style={styles.text}>
          No account yet?
          <Link href={"/signup"}>Create new One</Link>
        </Text>
        <Text style={styles.text}>
          <Link href={"/forgotPassword"}>Did you forget your password?</Link>
        </Text>
      </View>
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

import { Link, Redirect, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, SafeAreaView, ViewStyle } from "react-native";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useEffect, useState } from "react";
import AuthentificationButton from "@/components/authentification/authentificationButton";
import AuthentificationEmailInput from "@/components/authentification/authentificationEmailInput";
import AuthentificationPasswordInput from "@/components/authentification/authentificationPasswordInput";
import { login } from "@/constants/Controller";
import ErrorMessageModal from "@/components/message/errorMessageModal";
import { TextColor } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "@/components/loading";

export default function Login() {
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");

  let [errorMessage, setErrorMessage] = useState<Array<string>>([]);

  let [modalShown, setModalShown] = useState<Array<boolean>>([false, false]);

  const [isUserLogged, setIsUSerLogged] = useState<boolean>(false);

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  const router = useRouter();

  useEffect(() => {
    const checkUserSigned = async () => {
      let user: any = await AsyncStorage.getItem("userCredentials");
      let userLogged = user ? true : false;
      setIsUSerLogged(userLogged);
    };

    checkUserSigned();
  }, []);

  if (isUserLogged) {
    return <Redirect href={"/statistics"} />;
  }

  return (
    <View style={[{justifyContent: "center", alignItems: "center"}, GloblalStyles.container]}>
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
          <AuthentificationEmailInput handleChange={setEmail} />
        </View>
        <View style={GloblalStyles.iconLeftTextInputContainer}>
          <AuthentificationPasswordInput
            title="Password"
            handleChange={setPassword}
          />
        </View>
        <AuthentificationButton
          title="Login"
          retrieve={() => {
            login({
              email,
              password,
              setErrorMessage,
              setModalShown,
              router,
            });
          }}
        ></AuthentificationButton>
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

      <ErrorMessageModal
        modalShown={modalShown[0]}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setModalShown={setModalShown}
        setShowLoading={setShowLoading}
      />

      <Loading showLoading={showLoading} />
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

import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ViewStyle,
} from "react-native";
import { TextColor } from "@/constants/Colors";
import { GloblalStyles } from "@/constants/GlobalStyles";
import { useState } from "react";
import AuthentificationButton from "@/components/authentification/authentificationButton";
import AuthentificationEmailInput from "@/components/authentification/authentificationEmailInput";
import AuthentificationPasswordInput from "@/components/authentification/authentificationPasswordInput";
import { saveUser } from "@/constants/Controller";
import ErrorMessageModal from "@/components/message/errorMessageModal";
import { useRouter } from "expo-router";
import Loading from "@/components/loading";

export default function Singup() {
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [confirmationPassword, setConfirmationPassword] = useState<string>("");

  let [errorMessage, setErrorMessage] = useState<Array<string>>([]);

  let [modalShown, setModalShown] = useState<Array<boolean>>([false]);

  // Show loading when add category or product
  const [showLoading, setShowLoading] = useState<ViewStyle>({
    display: "none",
  });

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={GloblalStyles.authentificationIcon}
          source={require("@/assets/images/budget.png")}
        />
      </View>
      <View>
        <Text style={GloblalStyles.authentificationTitle}>Sign Up</Text>
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

        <View style={GloblalStyles.iconLeftTextInputContainer}>
          <AuthentificationPasswordInput
            title="Confirmation password"
            handleChange={setConfirmationPassword}
          />
        </View>
        <AuthentificationButton
          title="Sign up"
          retrieve={() => {
            saveUser({
              email,
              password,
              confirmationPassword,
              setErrorMessage,
              setModalShown,
              router
            });
          }}
        ></AuthentificationButton>
      </SafeAreaView>
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
  errorMessage: {},
  errorMessageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorMessageHeader: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorMessageContent: {
    padding: 20,
  },
  ModalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    backgroundColor: "#dc2626",
    width: 100,
    alignSelf: "center",
    borderRadius: 10,
  },
});

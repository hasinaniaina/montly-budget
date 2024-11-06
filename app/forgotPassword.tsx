import { useRouter } from "expo-router";
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
import {   useState } from "react";
import AuthentificationButton from "@/components/authentification/authentificationButton";
import AuthentificationEmailInput from "@/components/authentification/authentificationEmailInput";
import { sendEMail } from "@/constants/Controller";
import RetrievedPasswordMessageModal from "@/components/message/retrievedPasswordMessageModal";
import ErrorMessageModal from "@/components/message/errorMessageModal";
import Loading from "@/components/loading";

export default function ForgotPassword() {
  let [email, setEmail] = useState<string>("");
  let [message, setMessage] = useState<string>("");
  let [errorMessage, setErrorMessage] = useState<Array<string>>([]);
  let [modalShown, setModalShown] = useState<Array<boolean>>([false, false]);

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
        <Text style={GloblalStyles.authentificationTitle}>Forgot Password</Text>
      </View>
      <SafeAreaView>
        <View style={GloblalStyles.iconLeftTextInputContainer}>
          <AuthentificationEmailInput handleChange={setEmail} />
        </View>
        <AuthentificationButton title="Retrieve" retrieve={() => sendEMail({
          email,
          setErrorMessage,
          setMessage,
          setModalShown,
          router 
        })}></AuthentificationButton>
      </SafeAreaView>
      <ErrorMessageModal
        modalShown={modalShown[0]}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setModalShown={setModalShown}
        setShowLoading={setShowLoading}
      />
      <RetrievedPasswordMessageModal
        modalShown={modalShown[1]}
        message={message}
        setMessage={setMessage}
        setModalShown={setModalShown}
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

import { green } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";

export default function RetrievedPasswordMessageModal({
  modalShown,
  message,
  setMessage,
  setModalShown,
}: {
  modalShown: boolean;
  message: string;
  setMessage: (val: string) => void;
  setModalShown: (val: boolean[]) => void;
}) {
  const router = useRouter();

  return (
    <Modal animationType="fade" transparent={true} visible={modalShown}>
      <View style={styles.backgroundBlackTransparent}></View>
      <View style={styles.errorMessageContainer}>
        <View style={{ backgroundColor: "#FFF" , borderRadius: 20 }}>
          <View style={[styles.errorMessageHeader, {borderTopRightRadius: 20, borderTopLeftRadius: 20}]}>
            <Text style={{ color: "#FFF", fontFamily: "k2d-bold" }}>
              Forgot password!
            </Text>
          </View>
          <View style={styles.errorMessageContent}>
            <Text style={{ fontFamily: "k2d-regular", textAlign: "center" }}>
              {message}
            </Text>
            <Pressable
              style={styles.ModalButton}
              onPress={() => {
                setMessage("");
                setModalShown([false, false]);
                router.push("/");
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "k2d-regular",
                }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  errorMessageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backgroundBlackTransparent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    opacity: .5
  },
  errorMessageHeader: {
    backgroundColor: green,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: 250,
  },
  errorMessageContent: {
    padding: 20,
    width: 250,
  },
  ModalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    backgroundColor: "#7DE05B",
    width: 100,
    alignSelf: "center",
    borderRadius: 10,
  },
});

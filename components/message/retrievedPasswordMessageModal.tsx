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
      <View style={styles.errorMessageContainer}>
        <View style={{ backgroundColor: "#FFF" }}>
          <View style={styles.errorMessageHeader}>
            <Text style={{ color: "#FFF" }}>Forgot password!</Text>
          </View>
          <View style={styles.errorMessageContent}>
            <Text>{message}</Text>
            <Pressable
              style={styles.ModalButton}
              onPress={() => {
                setMessage("");
                setModalShown([false, false]);
                router.navigate("/(authentification)");
              }}
            >
              <Text
                style={{
                  color: "#fff",
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

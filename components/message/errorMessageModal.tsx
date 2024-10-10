import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

function ErrorMessageModal({
  modalShown,
  errorMessage,
  setErrorMessage,
  setModalShown,
  setShowLoading,
}: {
  modalShown: boolean;
  errorMessage: string[];
  setErrorMessage: (val: string[]) => void;
  setModalShown: (val: boolean[]) => void;
  setShowLoading?: (val: ViewStyle) => void;
}) {
  return (
    <Modal animationType="fade" transparent={true} visible={modalShown}>
       <View style={styles.backgroundBlackTransparent}></View>
      <View style={styles.errorMessageContainer}>
        <View style={{ backgroundColor: "#FFF" , borderRadius: 20}}>
          <View style={styles.errorMessageHeader}>
            <Text style={{ color: "#FFF" }}>Oopss!</Text>
          </View>
          <View style={styles.errorMessageContent}>
            {errorMessage.map((message, index) => {
              return <Text key={index}>- {message}</Text>;
            })}
            <TouchableOpacity
              style={styles.ModalButton}
              onPress={() => {
                setErrorMessage([]);
                setModalShown([false, false]);
                setShowLoading!({ display: "none" });
              }}
            >
              <Text
                style={{
                  color: "#fff",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ErrorMessageModal;

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
    backgroundColor: "#dc2626",
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
    backgroundColor: "#dc2626",
    width: 100,
    alignSelf: "center",
    borderRadius: 10,
  },
});



import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";

function ErrorMessageModal({modalShown, errorMessage, setErrorMessage, setModalShown}: {
  modalShown: boolean,
  errorMessage: Array<string>,
  setErrorMessage: (val: Array<string>) => void,
  setModalShown: (val: boolean) => void
}) {
  return (

    <Modal
    animationType="fade"
    transparent={true}
    visible={modalShown}
  >
    <View style={styles.errorMessageContainer}>
      <View style={{ backgroundColor: "#FFF" }}>
        <View style={styles.errorMessageHeader}>
          <Text style={{ color: "#FFF" }}>Oopss!</Text>
        </View>
        <View style={styles.errorMessageContent}>
          {errorMessage.map((message, index) => {
              return <Text key={index}>- {message}</Text>;
          })}
          <Pressable
            style={styles.ModalButton}
            onPress={() => {
              setErrorMessage([]);
              setModalShown(false);
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
  )
}

export default ErrorMessageModal;

const styles = StyleSheet.create({
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
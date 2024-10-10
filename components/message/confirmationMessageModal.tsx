import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

function ConfirmationMessageModal({
  modalShown,
  removeItem,
  setModalShown,
  setShowLoading,
  setChange
}: {
  modalShown: boolean;
  removeItem: () => Promise<boolean>;
  setModalShown: (val: boolean) => void;
  setShowLoading: (val: ViewStyle) => void;
  setChange: (val: boolean) => void;

}) {
  return (
    <Modal animationType="fade" transparent={true} visible={modalShown}>
      <View style={styles.backgroundBlackTransparent}></View>
      <View style={styles.confirmationMessageContainer}>
        <View style={{ backgroundColor: "#FFF", borderRadius: 20 }}>
          <View style={styles.confirmationMessageHeader}>
            <Text style={{ color: "#FFF" }}>Confirmation!</Text>
          </View>
          <View style={styles.errorMessageContent}>
            <Text style={{ textAlign: "center" }}>Are you sure to delete?</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.ModalButtonYes, styles.modalButton]}
                onPress={async () => {
                  setShowLoading({ display: "flex" });
                  setModalShown(false);

                  const result = await removeItem();

                  if (result) {
                    setChange(true);
                    setTimeout(() => {
                      setShowLoading({ display: "none" });
                    }, 2000);
                  }
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ModalButtonNo, styles.modalButton]}
                onPress={() => {
                  setModalShown(false);
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmationMessageModal;

const styles = StyleSheet.create({
  confirmationMessageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundBlackTransparent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    opacity: 0.5,
  },
  confirmationMessageHeader: {
    backgroundColor: "#FFD056",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: 250,
  },
  errorMessageContent: {
    padding: 20,
    width: 250,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    width: 100,
    alignSelf: "center",
    borderRadius: 10,
    marginHorizontal: 4,
  },
  ModalButtonNo: {
    backgroundColor: "#dc2626",
  },

  ModalButtonYes: {
    backgroundColor: "#FFD056",
  },
});

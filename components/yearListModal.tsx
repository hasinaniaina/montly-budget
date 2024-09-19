import { orange } from "@/constants/Colors";
import { getYear } from "@/constants/db";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function YearListModal({
  modalShow,
  setModalShow,
  selectedYear
}: {
  modalShow: boolean;
  setModalShow: (val: boolean) => void;
  selectedYear: (val: number) => void;
}) {
  const [years, setYears] = useState<Array<{number: number}>>([]);

  useEffect(() => {
    const getYearFordisplay = async () => {
      const yearstmp = await getYear();
      setYears(yearstmp);
    };

    getYearFordisplay();
  }, []);

  return (
    <Modal animationType="fade" transparent={true} visible={modalShow}>
      <View style={styles.yearContainer}>
        <View style={{ backgroundColor: "#FFF" }}>
          <View style={styles.yearHeader}>
            <Text style={{ color: "#FFF", fontFamily: "k2d-bold" }}>
              Choose Year:
            </Text>
          </View>
          <View style={styles.yearContent}>
            {years.map((year, index) => {
              return (
                <TouchableOpacity
                  style={styles.ModalButton}
                  onPress={() => {
                    selectedYear(year.number)
                    setModalShow(false);
                  }}
                  key={index}
                >
                  <Text style={styles.yearNumber}>{year.number}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  yearContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  yearHeader: {
    backgroundColor: orange,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: 250,
  },
  yearContent: {
    padding: 20,
    width: 250,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ModalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: orange,
    alignSelf: "center",
    borderRadius: 10,
    marginHorizontal: 3,
  },
  yearNumber: {
    fontFamily: "k2d-regular",
    color: "#fff"
  }
});

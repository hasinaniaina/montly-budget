import React, { useState } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TitleColor } from "@/constants/Colors";
import { BARCHARTMONTH } from "@/constants/constant";
import WheelPicker from "react-native-wheel-scrollview-picker";

interface DatePickerProps {
  visible: boolean;
  mode: "year" | "month-year";
  onClose: () => void;
  dateFilter: Date,
  onConfirm: (month: string, year: string) => void;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  visible,
  mode,
  onClose,
  dateFilter,
  onConfirm,
}) => {
  const [selectedMonth, setSelectedMonth] = useState("Jan");
  const [selectedYear, setSelectedYear] = useState("2026");

  const months = BARCHARTMONTH;
  const years = Array.from({ length: 20 }, (_, i) => (2016 + i).toString());

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Date Picker</Text>

          <View style={styles.pickerContainer}>
            {mode == "month-year" && (
              <WheelPicker
                dataSource={months}
                selectedIndex={months.indexOf(months[dateFilter.getMonth()])}
                itemHeight={50}
                wrapperHeight={200}
                onValueChange={(month, index) => setSelectedMonth(month!)}
              />
            )}

            <WheelPicker
              dataSource={years}
              selectedIndex={years.indexOf(String(dateFilter.getFullYear()))}
              itemHeight={50}
              wrapperHeight={200}
              onValueChange={(year, index) =>setSelectedYear(year!)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                onConfirm(selectedMonth, selectedYear);
                onClose();
              }}
            >
              <Text style={styles.confirm}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    paddingBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "k2d-regular",
    backgroundColor: TitleColor,
    paddingVertical: 20,
    color: "#FFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  picker: { width: "40%", fontFamily: "k2d-light" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancel: {
    color: TitleColor,
    fontSize: 13,
    fontFamily: "k2d-light",
    borderWidth: 1,
    borderColor: TitleColor,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  confirm: {
    color: "white",
    fontSize: 13,
    fontFamily: "k2d-light",
    backgroundColor: TitleColor,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});

export default CustomDatePicker;

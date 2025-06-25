import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { TextColor, orange } from "@/constants/Colors";
import { exportCSV, importCSV } from "@/constants/utils";
import { GloblalStyles } from "@/constants/GlobalStyles";

export default function ImportDatabase() {
  return (
    <View style={GloblalStyles.exportImportContainer}>
      <Text style={GloblalStyles.exportImportTitle}>Import Database</Text>
      <Text style={GloblalStyles.exportImportText}>
        Select a CSV file to load your information into the application.
      </Text>
      <TouchableOpacity
        style={GloblalStyles.buttonExportImport}
        onPress={importCSV}
      >
        <Text style={GloblalStyles.buttonTitle}>Import</Text>
      </TouchableOpacity>
    </View>
  );
}

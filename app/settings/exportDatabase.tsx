import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { TextColor, orange } from "@/constants/Colors";
import {
  exportCSV
} from "@/constants/utils";
import { ExportDatas } from "@/constants/interface";
import { GloblalStyles } from "@/constants/GlobalStyles";

export default function ExportDatabase() {
  return (
    <View style={GloblalStyles.exportImportContainer}>
      <Text style={GloblalStyles.exportImportTitle}>Export Database</Text>
      <Text style={GloblalStyles.exportImportText}>
        Generate a CSV file and save it in the folder of your choice.
      </Text>
      <TouchableOpacity style={GloblalStyles.buttonExportImport} onPress={exportCSV}>
        <Text style={GloblalStyles.buttonTitle}>Export</Text>
      </TouchableOpacity>
    </View>
  );
}

import { Product } from "@/constants/interface";
import { StyleSheet, View } from "react-native";
import ColorPicker, {
  Panel5,
} from "reanimated-color-picker";

export default function ColorPickerView({setColor, selectProductForEdit, productData}: {
    setColor: (val:string) => void;
    selectProductForEdit: number;
    productData: Product[];
}) {
  const onSelectColor = ({ hex }: {hex: string}) => {
    setColor(hex);
  };
  return (
    <View style={styles.container}>
        <ColorPicker
          style={{ width: "100%" }}
          value={
            selectProductForEdit > -1
              ? productData[selectProductForEdit].color
              : "#000"}
          onComplete={onSelectColor}
          onChange={onSelectColor}
        >
          <Panel5 />
        </ColorPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "50%",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 10
  },
});

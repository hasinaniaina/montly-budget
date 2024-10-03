import { Category, Product } from "@/constants/interface";
import { StyleSheet, View } from "react-native";
import ColorPicker, {
  Panel5,
} from "reanimated-color-picker";

export default function ColorPickerViewNew({data, setData}: {
    data?: Category;
    setData: (val: Category) => void;
}) {
  const onSelectColor = ({ hex }: {hex: string}) => {
    let dataTmp = {...data};
    dataTmp.color = hex;
    setData(dataTmp);
  };
  return (
    <View style={styles.container}>
        <ColorPicker
          style={{ width: "100%" }}
          value={data?.color}
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
    padding: 10,
  },
});

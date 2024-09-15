
import {
  Text,
  TouchableOpacity,
} from "react-native";
import { GloblalStyles } from "@/constants/GlobalStyles";

export default function AuthentificationButton({title, retrieve}: {
  title: string,
  retrieve: () => void
}) {
  return (
    <TouchableOpacity style={GloblalStyles.authentificationButtonContainer} onPress={retrieve}>
      <Text style={GloblalStyles.authentificationButton}>{title}</Text>
    </TouchableOpacity>
  )
}

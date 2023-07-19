import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 5 }}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
}

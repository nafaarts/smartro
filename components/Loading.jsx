import { ActivityIndicator } from "react-native-paper"
import Colors from "../constants/Colors"
import { View } from "./Themed"

export default function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={Colors.dark.primary} />
    </View>
  )
}

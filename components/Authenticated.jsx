import { useNavigation } from "@react-navigation/native"
import { Button, Text } from "react-native-paper"
import Colors from "../constants/Colors"
import { View } from "./Themed"

export default function Authenticated() {
  const navigation = useNavigation()
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="titleLarge">Kamu belum Login</Text>
      <Text variant="titleSmall" style={{ marginVertical: 10 }}>
        Silahkan login terlebih dahulu!
      </Text>
      <Button
        mode="contained"
        icon="login"
        buttonColor={Colors.dark.primary}
        style={{ borderRadius: 5, marginTop: 10 }}
        onPress={() => navigation.navigate("Login")}
      >
        Login
      </Button>
    </View>
  )
}

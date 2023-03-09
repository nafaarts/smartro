import { Image } from "react-native"
import { Button, Text } from "react-native-paper"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"

export default function FinishOrderScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          marginBottom: 10,
          fontWeight: "bold",
          color: Colors.dark.primary,
        }}
        variant="titleLarge"
      >
        Terima Kasih
      </Text>
      <Text>pesanan telah berhasil dibuat.</Text>
      <Image
        source={require("../../assets/images/logo.png")}
        style={{ width: 200, height: 50, marginVertical: 120 }}
      />
      <Button
        icon="arrow-left"
        textColor={Colors.dark.primary}
        onPress={() => navigation.replace("Root")}
      >
        Kembali
      </Button>
    </View>
  )
}

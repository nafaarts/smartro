import { StatusBar } from "expo-status-bar"
import { Image, Platform, StyleSheet } from "react-native"
import { Button } from "react-native-paper"

import EditScreenInfo from "../../components/EditScreenInfo"
import { Text, View } from "../../components/Themed"
import Colors from "../../constants/Colors"

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={{ width: 250, height: 55 }}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <EditScreenInfo path="/screens/ModalScreen.tsx" /> */}
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
      <Text style={styles.paragraph}>
        SmartTro merupakan singkatan dari smart dan elektro. Aplikasi SmartTro
        bertujuan untuk menciptakan peluang pekerjaan yang berkhusus pada alumni
        program pendidikan teknik elektro.
      </Text>
      <Text style={{ ...styles.paragraph, marginTop: 25 }}>
        Aplikasi ini dikembangkan oleh Miftahul jannah sebagai tugas skripsi,
        hubungi di kembangkan oleh Miftahul jannah, untuk informasi lebih lanjut
        email ke <Text style={{ fontWeight: "bold" }}>mtah767@gmail.com</Text>
      </Text>

      <Button
        icon="arrow-left"
        textColor={Colors.dark.primary}
        style={{ marginTop: 40 }}
        onPress={() => navigation.goBack()}
      >
        Kembali
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 40,
  },
  paragraph: {
    fontSize: 16,
    marginHorizontal: 30,
    textAlign: "justify",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})

import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import {
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  Alert,
} from "react-native"
import { Text, TextInput } from "react-native-paper"
import ButtonFlex from "../../components/ButtonFlex"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth } from "../../firebase/firebase"
import { useNotification } from "../../hooks/useNotification"

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setLoading] = useState(false)
  const { toogleNotification } = useNotification()

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Email atau Password tidak boleh kosong!")
      return
    }
    setLoading(true)
    signInWithEmailAndPassword(fireAuth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        await toogleNotification(user.uid)
        navigation.replace("Root")
      })
      .catch((error) => {
        Alert.alert(error.message)
        setLoading(false)
      })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ height: 40, width: 200, marginBottom: 20 }}
          />
          <Text variant="titleLarge" style={{ marginBottom: 10 }}>
            LOGIN
          </Text>
          <Text variant="titleSmall" style={{ marginBottom: 20 }}>
            Masuk ke akun anda.
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Masukan Email"
            style={{
              backgroundColor: "#fff",
              textAlign: "center",
              width: "100%",
              marginBottom: 10,
            }}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            mode="outlined"
            placeholder="Masukan Password"
            secureTextEntry={true}
            style={{
              backgroundColor: "#fff",
              textAlign: "center",
              width: "100%",
              marginBottom: 20,
            }}
            onChangeText={(text) => setPassword(text)}
          />
          <ButtonFlex
            mode="contained"
            title="Masuk"
            icon="login"
            color={Colors.dark.primary}
            style={{ width: "100%", marginBottom: 10 }}
            disabled={isLoading}
            onPress={handleLogin}
          />
          <View style={{ flexDirection: "row" }}>
            <Text>Belum punya akun? </Text>
            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={{ color: Colors.dark.primary, fontWeight: "bold" }}>
                Daftar
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

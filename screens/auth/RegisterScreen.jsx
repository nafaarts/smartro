import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
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
import { fireAuth, fireStore } from "../../firebase/firebase"
import { useNotification } from "../../hooks/useNotification"

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setLoading] = useState(false)
  const { toogleNotification } = useNotification()

  const handleRegister = () => {
    if (!name || !email || !phone || !password) {
      Alert.alert("Data tidak boleh ada yang kosong!")
      return
    }
    setLoading(true)
    createUserWithEmailAndPassword(fireAuth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        try {
          await setDoc(doc(fireStore, "users", user.uid), {
            name,
            phone,
          })
          await toogleNotification(user.uid)
          navigation.replace("Root")
        } catch (error) {
          Alert.alert(error.message)
        }
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
            REGISTRASI
          </Text>
          <Text variant="titleSmall" style={{ marginBottom: 20 }}>
            Daftarkan akun anda.
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Masukan Nama Lengkap"
            style={{
              backgroundColor: "#fff",
              textAlign: "center",
              width: "100%",
              marginBottom: 10,
            }}
            onChangeText={(text) => setName(text)}
          />
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
            keyboardType="numeric"
            placeholder="Masukan Nomor Telpon Anda"
            style={{
              backgroundColor: "#fff",
              textAlign: "center",
              width: "100%",
              marginBottom: 10,
            }}
            onChangeText={(text) => setPhone(text)}
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
            title="Daftar"
            icon="login"
            color={Colors.dark.primary}
            style={{ width: "100%", marginBottom: 10 }}
            disabled={isLoading}
            onPress={handleRegister}
          />
          <View style={{ flexDirection: "row" }}>
            <Text>Sudah punya akun! </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: Colors.dark.primary, fontWeight: "bold" }}>
                Masuk
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

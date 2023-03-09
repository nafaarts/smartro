import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { TextInput } from "react-native-paper"
import ButtonFlex from "../../components/ButtonFlex"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"

export default function CreateStoreScreen({ navigation }) {
  const [nim, setNim] = useState("")
  const [hasStore, setHasStore] = useState(false)

  const validateNIM = () => {
    if (!nim) {
      Alert.alert("Mohon isi NIM anda!")
      return
    }

    fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1awGj1TfsantgP_eNO0AEQTOpGV_jTh0QlQzCuhnk9cw/values/A2%3AD?key=AIzaSyBhjrNvDHhd7drPKdbXWkCtmoUvLw5egzM",
    )
      .then((response) => response.json())
      .then((data) => {
        const filter = data.values.filter((item) => item[0] === nim)
        if (filter.length > 0) {
          Alert.alert("NIM terdaftar!", `Lanjutkan sebagai ${filter[0][1]}?`, [
            {
              text: "Tidak",
              onPress: () => navigation.goBack(),
            },
            {
              text: "Ya",
              onPress: async () => {
                if (!hasStore) {
                  navigation.replace("RegisterStore", {
                    alumni: {
                      nim: filter[0][0],
                      name: filter[0][1],
                    },
                  })
                } else {
                  try {
                    await updateDoc(
                      doc(fireStore, "users", fireAuth?.currentUser.uid),
                      {
                        has_store: true,
                      },
                    )
                    await updateDoc(
                      doc(fireStore, "workshops", fireAuth?.currentUser.uid),
                      {
                        is_active: true,
                      },
                    )
                    navigation.replace("StoreScreen")
                  } catch (error) {
                    console.error(error)
                  }
                }
              },
            },
          ])
        } else {
          Alert.alert("Oops", "Mohon maaf NIM anda belum terdaftar!")
          setNim("")
        }
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getDoc(doc(fireStore, "workshops", fireAuth?.currentUser.uid))
      .then((data) => {
        if (data.data()) {
          setHasStore(true)
        }
      })
      .catch((error) => console.error(error.message))
  }, [])

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        mode="outlined"
        keyboardType="numeric"
        placeholder="Masukan NIM Universitas UIN Arraniry anda"
        style={{
          marginBottom: 10,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
        value={nim}
        onChangeText={(text) => setNim(text)}
      />
      <ButtonFlex
        mode="contained"
        title="Validasi NIM"
        icon="arrow-right"
        color={Colors.dark.primary}
        onPress={validateNIM}
      />
    </View>
  )
}

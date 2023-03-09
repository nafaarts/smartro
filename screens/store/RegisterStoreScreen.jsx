import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { fireAuth, fireStore } from "../../firebase/firebase"

import { TextInput } from "react-native-paper"
import ButtonFlex from "../../components/ButtonFlex"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import Loading from "../../components/Loading"
import { Alert } from "react-native"

export default function RegisterStoreScreen({ route, navigation }) {
  const { alumni } = route.params

  const [isLoading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [workingHour, setWorkingHour] = useState("")
  const [street, setStreet] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")

  const handleRegister = async () => {
    if ((!name, !phone, !street, !district, !city)) {
      Alert.alert("Data tidak boleh ada yang kosong!")
      return
    }
    try {
      await setDoc(doc(fireStore, "workshops", userId), {
        name,
        phone,
        owner: alumni.name,
        workingHour,
        address: {
          street,
          district,
          city,
        },
        is_active: true,
      })
      await updateDoc(doc(fireStore, "users", userId), {
        nim: alumni.nim,
        has_store: true,
      })
      navigation.replace("StoreScreen")
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        navigation.replace("Root")
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        mode="outlined"
        placeholder="Masukan Nama Toko Anda"
        style={{ backgroundColor: "#fff", marginBottom: 10 }}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        mode="outlined"
        keyboardType="numeric"
        placeholder="Masukan Nomor Telepon Toko Anda"
        style={{ backgroundColor: "#fff", marginBottom: 10 }}
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      <TextInput
        mode="outlined"
        placeholder="Masukan Jam Kerja (cth: 08.00 - 16.00 WIB)"
        style={{ backgroundColor: "#fff", marginBottom: 10 }}
        value={workingHour}
        onChangeText={(text) => setWorkingHour(text)}
      />
      <TextInput
        mode="outlined"
        placeholder="Masukan Alamat Toko Anda"
        style={{ backgroundColor: "#fff", marginBottom: 10 }}
        value={street}
        onChangeText={(text) => setStreet(text)}
      />
      <TextInput
        mode="outlined"
        placeholder="Masukan Kecamatan Toko Anda"
        style={{ backgroundColor: "#fff", marginBottom: 10 }}
        value={district}
        onChangeText={(text) => setDistrict(text)}
      />
      <TextInput
        mode="outlined"
        placeholder="Masukan Kabupaten / Kota Toko Anda"
        style={{ backgroundColor: "#fff", marginBottom: 15 }}
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      <ButtonFlex
        mode="contained"
        title="Daftarkan Toko"
        color={Colors.dark.primary}
        icon="arrow-right"
        onPress={handleRegister}
      />
    </View>
  )
}

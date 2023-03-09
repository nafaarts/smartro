import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { TextInput } from "react-native-paper"
import ButtonFlex from "../../components/ButtonFlex"
import Loading from "../../components/Loading"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"

export default function ProfilEdit({ navigation }) {
  const [isLoading, setLoading] = useState(true)
  const [uid, setUid] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")

  const handleUpdate = () => {
    if (!name || !phone || !street || !district || !city) {
      Alert.alert("Data tidak boleh ada yang kosong!")
      return
    }

    const user = {
      name,
      phone,
      address: {
        street,
        district,
        city,
      },
    }

    if (uid) {
      updateDoc(doc(fireStore, "users", uid), user)
        .then(() => {
          Alert.alert("Data berhasil diubah!")
          navigation.goBack()
        })
        .catch((error) => {
          Alert.alert(error)
          navigation.replace("Root")
        })
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      if (user) {
        const uid = user.uid
        setUid(uid)
        const docSnap = await getDoc(doc(fireStore, "users", uid))
        if (docSnap.exists()) {
          setName(docSnap.data().name)
          setPhone(docSnap.data().phone)
          setStreet(docSnap.data()?.address?.street)
          setDistrict(docSnap.data()?.address?.district)
          setCity(docSnap.data()?.address?.city)
        }
        setLoading(false)
      } else {
        navigation.replace("Root")
      }
    })
    return unsubscribe
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <KeyboardAwareScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        <TextInput
          mode="outlined"
          placeholder="Masukan Nama Lengkap Anda"
          style={{ backgroundColor: "#fff", marginBottom: 10 }}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          mode="outlined"
          placeholder="Masukan Nomor Telepon Anda"
          style={{ backgroundColor: "#fff", marginBottom: 10 }}
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          mode="outlined"
          placeholder="Masukan Alamat Rumah Anda"
          style={{ backgroundColor: "#fff", marginBottom: 10 }}
          value={street}
          onChangeText={(text) => setStreet(text)}
        />
        <TextInput
          mode="outlined"
          placeholder="Masukan Kecamatan Anda"
          style={{ backgroundColor: "#fff", marginBottom: 10 }}
          value={district}
          onChangeText={(text) => setDistrict(text)}
        />
        <TextInput
          mode="outlined"
          placeholder="Masukan Kota / Kabupaten Anda"
          style={{ backgroundColor: "#fff", marginBottom: 15 }}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <ButtonFlex
          mode="contained"
          title="Simpan Perubahan"
          color={Colors.dark.primary}
          icon="arrow-right"
          onPress={handleUpdate}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

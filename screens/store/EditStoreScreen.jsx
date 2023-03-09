import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { TextInput } from "react-native-paper"
import ButtonFlex from "../../components/ButtonFlex"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"
import Loading from "../../components/Loading"
import { Alert } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default function EditStoreScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true)
  const [userUid, setUserUid] = useState("")

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [workingHour, setWorkingHour] = useState("")
  const [street, setStreet] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")

  const handleUpdate = () => {
    if (!name || !phone || !workingHour || !street || !district || !city) {
      Alert.alert("Data tidak boleh ada yang kosong!")
      return
    }

    const workshops = {
      name,
      phone,
      workingHour,
      address: {
        street,
        district,
        city,
      },
    }

    if (userUid) {
      updateDoc(doc(fireStore, "workshops", userUid), workshops)
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
    const getStoreData = (id) => {
      return onSnapshot(doc(fireStore, "workshops", id), (doc) => {
        if (doc.exists()) {
          setName(doc.data().name)
          setPhone(doc.data().phone)
          setWorkingHour(doc.data().workingHour)
          setStreet(doc.data().address.street)
          setDistrict(doc.data().address.district)
          setCity(doc.data().address.city)
        }
      })
    }

    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      if (user) {
        getStoreData(user.uid)
        setUserUid(user.uid)
      } else {
        navigation.replace("Root")
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <KeyboardAwareScrollView>
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
          placeholder="Masukan Kota Toko Anda"
          style={{ backgroundColor: "#fff", marginBottom: 15 }}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <ButtonFlex
          mode="contained"
          title="Ubah Toko"
          color={Colors.dark.primary}
          icon="arrow-right"
          onPress={handleUpdate}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

import { onAuthStateChanged } from "firebase/auth"
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { StyleSheet, Linking, Alert } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Card, Text, TextInput } from "react-native-paper"

import ButtonFlex from "../../components/ButtonFlex"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"
import { useNotification } from "../../hooks/useNotification"

export default function BookOrderScreen({ route, navigation }) {
  const { store, service } = route.params
  const [description, setDescription] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const { sendPushNotification } = useNotification()

  const handleOrder = async () => {
    if (!description) {
      Alert.alert("Harap masukan deskripsi!")
      return
    }

    const orderData = {
      userUid: user.id,
      costumer: user.data.name,
      workshopid: store.id,
      workshopName: store.name,
      serviceName: service.name,
      price: service.price,
      description,
      isOffer: false,
      status: "MENUNGGU",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    try {
      setLoading(true)
      const docRef = await addDoc(collection(fireStore, "orders"), orderData)
      await sendPushNotification(
        orderData.workshopid,
        "Ada Pesanan baru!",
        `Anda memiliki pesanan baru dari ${orderData.costumer}`,
        {
          url: `/storeorderdetail/${docRef.id}`,
        },
      )
      navigation.replace("FinishOrder")
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    const getUserData = (id) => {
      return onSnapshot(
        doc(fireStore, "users", id),
        (snapshot) => {
          setUser({
            id: id,
            data: snapshot.data(),
          })
        },
        (error) => console.error(error),
      )
    }

    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      if (user) {
        getUserData(user.uid)
      } else {
        navigation.replace("Root")
      }
    })

    return unsubscribe
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Card
            mode="outlined"
            style={{ backgroundColor: Colors.dark.primary, marginBottom: 20 }}
          >
            <Card.Content>
              <Text style={{ color: "#fff" }}>Detail Pesanan</Text>
              <Text
                style={{ marginTop: 10, color: "#fff", fontWeight: "bold" }}
                variant="titleLarge"
              >
                {store.name}
              </Text>
              <Text style={{ marginTop: 10, color: "#fff" }}>
                Service{" "}
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {service.name}
                </Text>{" "}
                dengan biaya mulai{" "}
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Rp {service.price}
                </Text>
              </Text>
              <Text style={{ marginTop: 2, color: "gray" }}>
                harga tidak termasuk sparepart dan dapat berubah tergantung
                jenis kerusakan.
              </Text>
            </Card.Content>
          </Card>
          <Text>Deskripsi Kerusakan : </Text>
          <TextInput
            mode="outlined"
            placeholder="Masukan deskripsi kerusakan"
            multiline={true}
            activeOutlineColor={Colors.dark.primary}
            style={{
              marginTop: 5,
              backgroundColor: "#fff",
              height: 300,
            }}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.floatingBottomContainer}>
        {store.phone && (
          <ButtonFlex
            title="Telepon"
            mode="outlined"
            icon="phone"
            color={Colors.dark.primary}
            disabled={isLoading}
            onPress={() => Linking.openURL(`tel:${store.phone}`)}
            style={{ flex: 1, marginRight: 5 }}
          />
        )}
        <ButtonFlex
          title="Buat Pesanan"
          mode="contained"
          icon="arrow-right"
          color={Colors.dark.primary}
          disabled={isLoading}
          onPress={handleOrder}
          style={{ flex: 1, marginLeft: store.phone ? 5 : 0 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  floatingBottomContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
})

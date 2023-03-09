import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { TextInput } from "react-native-paper"
import ButtonFlex from "../../components/ButtonFlex"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireStore } from "../../firebase/firebase"
import { useNotification } from "../../hooks/useNotification"

export default function OfferScreen({ route, navigation }) {
  const { orderId } = route.params
  const [order, setOrder] = useState(null)
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const { sendPushNotification } = useNotification()

  const handleOffer = () => {
    Alert.alert("Konfirmasi", "konfirmasi pengiriman penawaran anda?", [
      {
        text: "Tidak",
        style: "cancel",
      },
      {
        text: "Kirim",
        onPress: () => {
          updateDoc(doc(fireStore, "orders", orderId), {
            isOffer: true,
            price,
            offerDescription: description,
          })
            .then(async () => {
              try {
                await sendPushNotification(
                  order.userUid,
                  "Teknisi membuat penawaran.",
                  `${order.workshopName} membuat penawaran pada pesanan layanan ${order.serviceName} anda`,
                  {
                    url: `/orderdetail/${orderId}`,
                  },
                )
                navigation.navigate("StoreOrderDetail", {
                  orderId,
                })
              } catch (error) {
                console.log(error)
              }
            })
            .catch((error) => console.error(error))
        },
      },
    ])
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(fireStore, "orders", orderId),
      (snapshot) => {
        setOrder(snapshot.data())
        setPrice(snapshot.data().price)
        setDescription(snapshot.data().offerDescription)
      },
      (error) => console.error(error),
    )

    return unsubscribe
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <View style={{ flex: 1, padding: 20 }}>
          <TextInput
            mode="outlined"
            keyboardType="number"
            placeholder="Masukan Harga Penawaran"
            style={{ backgroundColor: "#fff", marginBottom: 20 }}
            value={price}
            onChangeText={(text) => setPrice(text)}
          />
          <TextInput
            mode="outlined"
            placeholder="Masukan Deskripsi Penawaran"
            multiline={true}
            style={{ backgroundColor: "#fff", marginBottom: 20, height: 300 }}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <ButtonFlex
            mode="contained"
            title="Kirim Penawaran"
            icon="arrow-right"
            color={Colors.dark.primary}
            onPress={handleOffer}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

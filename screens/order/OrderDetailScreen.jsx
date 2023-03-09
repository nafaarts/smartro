import { useEffect, useState } from "react"
import { Alert, Linking, ScrollView } from "react-native"
import { Badge, Card, Text } from "react-native-paper"
import ButtonCard from "../../components/ButtonCard"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { fireStore } from "../../firebase/firebase"
import Loading from "../../components/Loading"
import { useNotification } from "../../hooks/useNotification"

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params

  const [order, setOrder] = useState(null)
  const [store, setStore] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const { sendPushNotification } = useNotification()

  const handleCancel = () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah anda yakin untuk membatalkan pesanan ini?",
      [
        {
          text: "Tidak",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Ya",
          onPress: async () => {
            try {
              await updateDoc(doc(fireStore, "orders", orderId), {
                status: "DIBATALKAN",
              })
              await sendPushNotification(
                order.workshopid,
                "Pesanan dibatalkan!",
                `${order.costumer} membatalkan pesanan layanan ${order.serviceName}-nya`,
                {
                  url: `/storeorderdetail/${orderId}`,
                },
              )
            } catch (error) {
              console.error(error)
            }
          },
        },
      ],
    )
  }

  const handleApprove = () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah anda yakin untuk menyetujui penawaran ini?",
      [
        {
          text: "Tidak",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Ya",
          onPress: async () => {
            try {
              await updateDoc(doc(fireStore, "orders", orderId), {
                status: "DISETUJUI",
              })
              await sendPushNotification(
                order.workshopid,
                "Penawaran disetujui!",
                `${order.costumer} menyetujui penawaran anda pada layanan ${order.serviceName}`,
                {
                  url: `/storeorderdetail/${orderId}`,
                },
              )
            } catch (error) {
              console.error(error)
            }
          },
        },
      ],
    )
  }

  useEffect(() => {
    const getStoreData = (id) => {
      return onSnapshot(
        doc(fireStore, "workshops", id),
        (snapshot) => {
          setStore(snapshot.data())
        },
        (error) => console.error(error),
      )
    }

    const unsubscribe = onSnapshot(
      doc(fireStore, "orders", orderId),
      (snapshot) => {
        getStoreData(snapshot.data().workshopid)
        setOrder(snapshot.data())
        setLoading(false)
      },
      (error) => console.error(error.message),
    )

    return unsubscribe
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card
          mode="contained"
          style={{ backgroundColor: Colors.dark.primary, marginVertical: 20 }}
        >
          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ textAlign: "center", color: "#fff" }}
            >
              {order.workshopName}
            </Text>
          </Card.Content>
        </Card>
        <Card
          mode="outlined"
          style={{ backgroundColor: "#fff", marginBottom: 20 }}
        >
          <Card.Content>
            <Text>Jenis Layanan :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {order.serviceName}
            </Text>
            <Text style={{ marginTop: 20 }}>Alamat Toko :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {`${store?.address?.street}, ${store?.address?.district}, ${store?.address?.city}`}
            </Text>
            <Text style={{ marginTop: 20 }}>Status :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {order.status}
            </Text>
            {order.status === "DISETUJUI" && (
              <Text variant="bodySmall" style={{ marginTop: 2 }}>
                Silahkan antar barang anda ke alamat teknisi.
              </Text>
            )}
            <Text style={{ marginTop: 20 }}>Harga :</Text>
            <View
              style={{
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleMedium">Rp {order.price}</Text>
              {order.isOffer && (
                <Badge
                  style={{ backgroundColor: "orange", paddingHorizontal: 5 }}
                >
                  Penawaran
                </Badge>
              )}
            </View>
            {order.isOffer && (
              <>
                <Text style={{ marginTop: 20 }}>Deskripsi Penawaran :</Text>
                <Text variant="titleMedium" style={{ marginTop: 5 }}>
                  {order.offerDescription}
                </Text>
              </>
            )}
            <Text style={{ marginTop: 20 }}>Deskripsi Kerusakan :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {order.description}
            </Text>
          </Card.Content>
        </Card>
        <ButtonCard
          icon="phone"
          title="Telepon"
          color={Colors.dark.primary}
          style={{
            marginBottom: 15,
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: "#fff",
          }}
          onPress={() => Linking.openURL(`tel:${store.phone}`)}
        />
        {order.status === "MENUNGGU" && order.isOffer && (
          <ButtonCard
            icon="check"
            title="Terima Penawaran"
            color="green"
            style={{
              marginBottom: 15,
              borderColor: "green",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#fff",
            }}
            onPress={handleApprove}
          />
        )}
        {order.status === "MENUNGGU" && (
          <ButtonCard
            icon="close"
            title="Batalkan Pesanan"
            color="#8B0000"
            style={{
              marginBottom: 15,
              borderColor: "#8B0000",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#fff",
            }}
            onPress={handleCancel}
          />
        )}
      </ScrollView>
    </View>
  )
}

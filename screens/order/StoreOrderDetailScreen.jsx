import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Alert, Linking, ScrollView } from "react-native"
import { Badge, Card, Text } from "react-native-paper"
import ButtonCard from "../../components/ButtonCard"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"
import { useNotification } from "../../hooks/useNotification"

export default function StoreOrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params
  const [order, setOrder] = useState(null)
  const [costumer, setCostumer] = useState(null)
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
                order.userUid,
                "Pesanan dibatalkan!",
                `${order.workshopName} membatalkan pesanan layanan ${order.serviceName} anda`,
                {
                  url: `/orderdetail/${orderId}`,
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
      "Apakah anda yakin untuk menyetujui pesanan ini?",
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
                order.userUid,
                "Pesanan disetujui!",
                `${order.workshopName} menyetujui pesanan layanan ${order.serviceName} anda`,
                {
                  url: `/orderdetail/${orderId}`,
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
    const getCostumerData = (id) => {
      return onSnapshot(
        doc(fireStore, "users", id),
        (snapshot) => {
          setCostumer(snapshot.data())
        },
        (error) => console.error(error),
      )
    }

    const unsubscribe = onSnapshot(
      doc(fireStore, "orders", orderId),
      (snapshot) => {
        getCostumerData(snapshot.data()?.userUid)
        // console.log(snapshot.data())
        setOrder(snapshot.data())
      },
      (error) => console.error(error),
    )

    return unsubscribe
  }, [])

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card
          mode="outlined"
          style={{ backgroundColor: "#fff", marginVertical: 20 }}
        >
          <Card.Content>
            <Text>Jenis Layanan :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {order?.serviceName}
            </Text>
            <Text style={{ marginTop: 20 }}>Nama :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {order?.costumer}
            </Text>
            <Text style={{ marginTop: 20 }}>Status :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {order?.status}
            </Text>
            <Text style={{ marginTop: 20 }}>Alamat :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {`${costumer?.address?.street}, ${costumer?.address?.district}, ${costumer?.address?.city}`}
            </Text>
            <Text style={{ marginTop: 20 }}>Harga :</Text>
            <View
              style={{
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text variant="titleMedium">Rp {order?.price}</Text>
              {order?.isOffer && (
                <Badge
                  style={{ backgroundColor: "orange", paddingHorizontal: 5 }}
                >
                  Penawaran
                </Badge>
              )}
            </View>
            {order?.isOffer && (
              <>
                <Text style={{ marginTop: 20 }}>Deskripsi Penawaran :</Text>
                <Text variant="titleMedium" style={{ marginTop: 5 }}>
                  {order?.offerDescription}
                </Text>
              </>
            )}
            <Text style={{ marginTop: 20 }}>Deskripsi Kerusakan :</Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {order?.description}
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
          onPress={() => Linking.openURL(`tel:${costumer?.phone}`)}
        />

        {order?.status === "MENUNGGU" && (
          <>
            <ButtonCard
              icon="book-refresh-outline"
              title={order?.isOffer ? "Ubah Penawaran" : "Buat Penawaran"}
              color="purple"
              style={{
                marginBottom: 15,
                borderColor: "purple",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "#fff",
              }}
              onPress={() =>
                navigation.navigate("Offer", {
                  orderId,
                })
              }
            />
            {!order?.isOffer && (
              <ButtonCard
                icon="check"
                title="Terima Pesanan"
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
          </>
        )}
      </ScrollView>
    </View>
  )
}

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore"

import { Alert, ScrollView } from "react-native"
import { Badge, Card, Text } from "react-native-paper"
import ButtonCard from "../../components/ButtonCard"
import Loading from "../../components/Loading"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"

export default function StoreScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true)
  const [store, setStore] = useState("")
  const [orders, setOrders] = useState([])

  const handleDisableStore = () => {
    Alert.alert("Konfirmasi", "Apakah anda yakin untuk menghapus toko anda?", [
      {
        text: "Tidak",
        style: "cancel",
      },
      {
        text: "Ya",
        onPress: async () => {
          const id = store.id
          try {
            await updateDoc(doc(fireStore, "workshops", id), {
              is_active: false,
            })
            await updateDoc(doc(fireStore, "users", id), {
              has_store: false,
            })
            Alert.alert("Berhasil", "Toko anda berhasil dihapus!")
            navigation.replace("Root")
          } catch (error) {
            console.error(error)
          }
        },
      },
    ])
  }

  useEffect(() => {
    const getStoreData = (id) => {
      return onSnapshot(doc(fireStore, "workshops", id), (doc) => {
        if (doc.exists()) {
          setStore({ ...doc.data(), id })
        }
      })
    }

    const getStoreOrder = (id) => {
      return onSnapshot(
        query(collection(fireStore, "orders"), where("workshopid", "==", id)),
        (querySnapshot) => {
          setOrders(
            querySnapshot.docs.map((doc) => {
              return {
                data: doc.data(),
                id: doc.id,
              }
            }),
          )
          setLoading(false)
        },
      )
    }

    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      if (user) {
        getStoreData(user.uid)
        getStoreOrder(user.uid)
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
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        <Card
          mode="contained"
          style={{
            backgroundColor: Colors.dark.primary,
            marginBottom: 20,
            paddingVertical: 20,
          }}
        >
          <Card.Content>
            <Text variant="titleSmall" style={{ color: "lightgray" }}>
              {store?.owner}
            </Text>
            <Text
              variant="titleLarge"
              style={{ marginVertical: 5, color: "#fff" }}
            >
              {store?.name}
            </Text>
            <Text variant="titleMedium" style={{ color: "#fff" }}>
              {store?.phone}
            </Text>
          </Card.Content>
        </Card>
        <ButtonCard
          title="Pesanan"
          icon="card-multiple-outline"
          style={{
            marginBottom: 15,
            backgroundColor: "#fff",
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("StoreOrders")}
        >
          {orders.length > 0 && (
            <Badge style={{ marginLeft: 10 }}>{orders.length}</Badge>
          )}
        </ButtonCard>
        <ButtonCard
          title="Edit Toko"
          icon="store-edit-outline"
          style={{
            marginBottom: 15,
            backgroundColor: "#fff",
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("EditStore")}
        />
        <ButtonCard
          title="Layanan"
          icon="room-service-outline"
          style={{
            marginBottom: 15,
            backgroundColor: "#fff",
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("Service")}
        >
          {store?.services && (
            <Badge style={{ marginLeft: 10 }}>{store?.services.length}</Badge>
          )}
        </ButtonCard>
        <ButtonCard
          title="Laporan"
          icon="file-document"
          style={{
            marginBottom: 15,
            backgroundColor: "#fff",
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("Report")}
        />
        <ButtonCard
          title="Hapus Toko"
          icon="store-remove-outline"
          color="#8B0000"
          style={{
            marginBottom: 15,
            borderColor: "#8B0000",
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={handleDisableStore}
        />
      </ScrollView>
    </View>
  )
}

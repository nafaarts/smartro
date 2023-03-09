import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  onSnapshot,
  orderBy,
  Query,
  query,
  where,
} from "firebase/firestore"
import { useEffect, useState } from "react"

import { ScrollView, TouchableOpacity, StyleSheet, View } from "react-native"
import { Badge, Card, Text } from "react-native-paper"
import Authenticated from "../../components/Authenticated"
import Loading from "../../components/Loading"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"

export default function OrdersScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [isAuthenticated, setAutheticated] = useState(false)

  useEffect(() => {
    const getOrdersData = (id) => {
      return onSnapshot(
        query(
          collection(fireStore, "orders"),
          where("userUid", "==", id),
          orderBy("createdAt", "desc"),
        ),
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

    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        getOrdersData(user.uid)
        setAutheticated(true)
      } else {
        setAutheticated(false)
      }
    })

    return unsubscribe
  }, [])

  if (!isAuthenticated) {
    return <Authenticated />
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
      }}
    >
      {orders.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.map((item, key) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("OrderDetail", {
                    orderId: item.id,
                  })
                }
                key={key}
              >
                <Card mode="outlined" style={styles.cardWrapper}>
                  <Card.Content style={styles.card}>
                    <View>
                      <Text style={styles.store}>{item.data.workshopName}</Text>
                      <Text style={styles.type}>{item.data.serviceName}</Text>
                      <Text style={styles.date}>
                        {new Date(
                          item.data.createdAt?.seconds * 1000,
                        ).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text style={styles.status}>{item.data.status}</Text>
                      {item.data.isOffer && (
                        <Badge
                          visible={true}
                          style={{
                            backgroundColor: "orange",
                            paddingHorizontal: 5,
                          }}
                        >
                          Penawaran
                        </Badge>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Tidak ada data.</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
    backgroundColor: Colors.dark.primary,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 10,
    color: "#fff",
  },
  store: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  type: {
    fontSize: 10,
    fontWeight: "300",
    marginBottom: 10,
    color: "#fff",
  },
  date: {
    fontSize: 12,
    color: "#fff",
  },
  status: {
    fontSize: 14,
    color: "#fff",
  },
})

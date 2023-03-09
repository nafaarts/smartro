import { doc, onSnapshot } from "firebase/firestore"
import React, { useState } from "react"
import { StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { Card, Text, List } from "react-native-paper"
import Loading from "../../components/Loading"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"
import useColorScheme from "../../hooks/useColorScheme"

export default function StoreDetailScreen({ route, navigation }) {
  const { storeId } = route.params
  const colorScheme = useColorScheme()

  const [isLoading, setLoading] = useState(true)
  const [store, setStore] = useState({})

  useState(() => {
    const unsubscribe = onSnapshot(
      doc(fireStore, "workshops", storeId),
      (snapshot) => {
        setStore(snapshot.data())
        setLoading(false)
      },
      (error) => {
        console.log(error.message)
        navigation.replace("Root")
      },
    )

    return unsubscribe
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailWrapper}>
        <Card
          mode="outlined"
          style={{
            ...styles.card,
            marginBottom: 20,
            backgroundColor: Colors[colorScheme].primary,
          }}
        >
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ textAlign: "center", color: "#fff" }}
            >
              {store.name}
            </Text>
          </Card.Content>
        </Card>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.scrollWrapper}
          data={store.services}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "column",
                margin: 5,
                borderRadius: 13,
              }}
              onPress={() => {
                if (!fireAuth.currentUser) {
                  Alert.alert("Opps", "Anda harus login terlebih dahulu!", [
                    {
                      text: "Tidak",
                      onPress: () => {},
                    },
                    {
                      text: "Login",
                      onPress: () => {
                        navigation.navigate("Login")
                      },
                    },
                  ])
                  return
                }

                if (fireAuth?.currentUser?.uid !== storeId) {
                  navigation.navigate("BookOrder", {
                    store: {
                      id: storeId,
                      name: store.name,
                      phone: store.phone,
                    },
                    service: {
                      name: item.name,
                      price: item.price,
                    },
                  })
                } else {
                  Alert.alert(
                    "Maaf",
                    "anda tidak bisa membuat pesanan di toko sendiri!",
                  )
                }
              }}
            >
              <Card mode="outlined">
                <Card.Cover source={{ uri: item.image.uri }} />
                <View
                  style={{
                    position: "absolute",
                    padding: 10,
                    borderTopLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    backgroundColor: Colors.dark.primary,
                  }}
                >
                  <Text style={{ color: "#fff" }}>{item.name}</Text>
                  <Text style={{ fontSize: 10, marginTop: 3, color: "#fff" }}>
                    Mulai Rp {item.price}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          numColumns={2}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={<Text>Tidak ada data!</Text>}
          ListHeaderComponent={
            <>
              <Card mode="outlined" style={styles.card}>
                <Card.Content>
                  <List.Item
                    title="Pemilik"
                    description={store.owner}
                    left={(props) => <List.Icon {...props} icon="account" />}
                  />
                  <List.Item
                    title="Jam Kerja"
                    description={store.workingHour}
                    left={(props) => <List.Icon {...props} icon="clock" />}
                  />
                  <List.Item
                    title="Alamat"
                    description={`${store.address?.street}, ${store.address?.district}, ${store.address?.city}`}
                    left={(props) => (
                      <List.Icon {...props} icon="google-maps" />
                    )}
                  />
                  <List.Item
                    title="No Telepon"
                    description={store.phone}
                    left={(props) => <List.Icon {...props} icon="phone" />}
                  />
                </Card.Content>
              </Card>
              <Text variant="labelMedium" style={{ marginVertical: 10 }}>
                Jenis Layanan
              </Text>
            </>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  detailWrapper: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
  },
  owner: {
    marginVertical: 10,
  },
  scrollWrapper: {
    flex: 1,
  },
})

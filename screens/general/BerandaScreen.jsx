import { collection, onSnapshot, query, where } from "firebase/firestore"
import React, { useState, useEffect } from "react"
import { Alert, FlatList, TouchableOpacity } from "react-native"
import { Card, TextInput } from "react-native-paper"
import Loading from "../../components/Loading"
import { View, Text } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"

export default function BerandaScreen({ navigation }) {
  const [stores, setStores] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const filtered = stores
    .map((store) => {
      return store.data.services?.map((service) => {
        return {
          ...service,
          store: {
            id: store.id,
            name: store.data.name,
            phone: store.data.phone,
          },
        }
      })
    })
    .flat()
    .filter((service) => {
      return (
        service?.name.toLowerCase().includes(search.toLowerCase()) ||
        service?.store.name.toLowerCase().includes(search.toLowerCase())
      )
    })

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(fireStore, "workshops"), where("is_active", "==", true)),
      (snapshot) => {
        setStores(
          snapshot.docs.map((i) => {
            return {
              id: i.id,
              data: {
                ...i.data(),
                lowest_price:
                  i
                    .data()
                    .services?.map((i) => i.price)
                    .sort((a, b) => a - b)[0] || 0,
              },
            }
          }),
        )
        setLoading(false)
      },
      (error) => console.error(error),
    )

    return unsubscribe
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <View style={{ marginBottom: 10 }}>
        <TextInput
          secureTextEntry={false}
          mode="outlined"
          activeOutlineColor={Colors.light.tint}
          outlineStyle={{
            borderRadius: 15,
          }}
          left={<TextInput.Icon icon="magnify" />}
          style={{ backgroundColor: "#fff" }}
          onChangeText={(text) => setSearch(text)}
          placeholder="Cari layanan"
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filtered}
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

              if (fireAuth?.currentUser?.uid !== item.store.id) {
                navigation.navigate("BookOrder", {
                  store: {
                    id: item.store.id,
                    name: item.store.name,
                    phone: item.store.phone,
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
                <Text style={{ fontSize: 10, color: "#fff" }}>
                  {item.store.name}
                </Text>
                <Text style={{ marginTop: 3, color: "#fff" }}>{item.name}</Text>
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
      />
    </View>
  )
}

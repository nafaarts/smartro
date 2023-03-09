import { ScrollView, StyleSheet } from "react-native"

import StoreCard from "../../components/StoreCard"
import { TextInput } from "react-native-paper"
import { Text, View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import useColorScheme from "../../hooks/useColorScheme"
import { useEffect, useState } from "react"
import { collection, doc, onSnapshot, query, where } from "firebase/firestore"
import { fireStore } from "../../firebase/firebase"
import Loading from "../../components/Loading"

export default function StoresScreen({ navigation }) {
  const colorScheme = useColorScheme()
  const [stores, setStores] = useState([])
  const [search, setSearch] = useState("")
  const [isLoading, setLoading] = useState(true)

  const filtered = stores.filter(
    (i) =>
      i.data.name.toLowerCase().includes(search.toLowerCase()) ||
      i.data.owner.toLowerCase().includes(search.toLowerCase()),
  )

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
    <View style={styles.container}>
      <View style={{ marginBottom: 10 }}>
        <TextInput
          secureTextEntry={false}
          mode="outlined"
          activeOutlineColor={Colors[colorScheme].tint}
          outlineStyle={{
            borderRadius: 15,
          }}
          left={<TextInput.Icon icon="magnify" />}
          style={{ backgroundColor: "#fff" }}
          onChangeText={(text) => setSearch(text)}
          placeholder="Cari toko"
        />
      </View>
      {filtered.length > 0 ? (
        <ScrollView
          style={{
            padding: 5,
          }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((item, key) => {
            return (
              <StoreCard
                id={item.id}
                store={item.data.name}
                owner={item.data.owner}
                price={item.data.lowest_price}
                service={item.data.services?.length || 0}
                key={key}
              />
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
  container: {
    flex: 1,
    padding: 15,
  },
})

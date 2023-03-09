import { MaterialCommunityIcons } from "@expo/vector-icons"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import React, { useEffect, useState } from "react"

import { FlatList, TouchableOpacity, Alert } from "react-native"
import { Card } from "react-native-paper"
import Loading from "../../components/Loading"
import { View, Text } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStorage, fireStore } from "../../firebase/firebase"

export default function ServiceScreen({ navigation }) {
  const [dataSource, setDataSource] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [uid, setUid] = useState("")

  const handleDelete = (index) => {
    Alert.alert("Konfirmasi", "Apakah anda yakin dihapus?", [
      {
        text: "Tidak",
        onPress: () => {},
        type: "cancel",
      },
      {
        text: "Ya",
        onPress: async () => {
          const deleted = dataSource.splice(index, 1)

          console.log("deleted", deleted)
          console.log("current", dataSource)

          try {
            await deleteObject(ref(fireStorage, deleted[0].image.path))
            await updateDoc(doc(fireStore, "workshops", uid), {
              services: dataSource,
            })

            Alert.alert("Berhasil", `${deleted[0].name} berhasil dihapus!`)
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
          setDataSource(doc.data()?.services)
        }
      })
    }

    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      if (user) {
        getStoreData(user.uid)
        setUid(user.uid)
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
    <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataSource}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              margin: 5,
              borderRadius: 13,
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
              <TouchableOpacity
                onPress={() => {
                  handleDelete(index)
                }}
                style={{
                  position: "absolute",
                  padding: 10,
                  bottom: 0,
                  right: 0,
                  borderTopLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  backgroundColor: "#8B0000",
                }}
              >
                <MaterialCommunityIcons name="delete" size={25} color="#fff" />
              </TouchableOpacity>
            </Card>
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
    </View>
  )
}

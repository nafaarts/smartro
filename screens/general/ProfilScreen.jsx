import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"

import { useState, useEffect } from "react"
import { Alert, ScrollView, StyleSheet } from "react-native"
import { Card, Text } from "react-native-paper"
import Authenticated from "../../components/Authenticated"
import ButtonCard from "../../components/ButtonCard"
import Loading from "../../components/Loading"

import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"
import { useNotification } from "../../hooks/useNotification"

export default function Profil({ navigation }) {
  const [isAuthenticated, setAutheticated] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const { toogleNotification } = useNotification()

  useEffect(() => {
    const getUserData = (id) => {
      return onSnapshot(doc(fireStore, "users", id), (doc) => {
        if (doc.exists()) {
          setUser({ ...doc.data(), id })
        }
        setLoading(false)
      })
    }

    const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
      if (user) {
        getUserData(user.uid)
        setAutheticated(true)
      } else {
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleLogout = () => {
    Alert.alert("Yakin?", "konfirmasi untuk keluar", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Keluar",
        onPress: () => {
          fireAuth
            .signOut()
            .then(async () => {
              try {
                await toogleNotification(user.id, false)
                setUser(null)
                setAutheticated(false)
              } catch (error) {
                console.error(error)
              }
            })
            .catch((error) => Alert.alert(error.message))
        },
      },
    ])
  }

  if (!isAuthenticated) {
    return <Authenticated />
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
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
              {fireAuth.currentUser?.email}
            </Text>
            <Text
              variant="titleLarge"
              style={{ marginVertical: 5, color: "#fff" }}
            >
              {user?.name}
            </Text>
            <Text variant="titleMedium" style={{ color: "#fff" }}>
              {user?.phone}
            </Text>
          </Card.Content>
        </Card>
        <ButtonCard
          title="Ubah Profil"
          icon="account-edit"
          style={{
            marginBottom: 15,
            backgroundColor: "#fff",
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("ProfilEdit")}
        />
        <ButtonCard
          title="Riwayat Pesanan"
          icon="cart-outline"
          style={{
            marginBottom: 15,
            backgroundColor: "#fff",
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("Orders")}
        />
        {!user?.has_store && (
          <ButtonCard
            title="Buat Toko"
            icon="store-plus-outline"
            style={{
              marginBottom: 15,
              backgroundColor: "#fff",
              borderColor: Colors.dark.primary,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate("CreateStore")}
          />
        )}
        {user?.has_store && (
          <ButtonCard
            title="Detail Toko"
            icon="store-outline"
            style={{
              marginBottom: 15,
              backgroundColor: "#fff",
              borderColor: Colors.dark.primary,
              borderWidth: 1,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate("StoreScreen")}
          />
        )}
        <ButtonCard
          title="Pengaturan"
          icon="cog"
          style={{
            marginBottom: 15,
            backgroundColor: "#fff",
            borderColor: Colors.dark.primary,
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("Setting", { userId: user.id })}
        />
        <ButtonCard
          title="Keluar"
          icon="logout"
          color="#8B0000"
          style={{
            marginBottom: 15,
            borderColor: "#8B0000",
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={handleLogout}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
})

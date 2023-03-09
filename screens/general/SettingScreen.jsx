import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Text, Switch } from "react-native-paper"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStore } from "../../firebase/firebase"
import { useNotification } from "../../hooks/useNotification"

export default function SettingScreen({ route, navigation }) {
  const { userId } = route.params
  const [notification, setNotification] = useState(false)
  const { toogleNotification } = useNotification()

  const handleNotification = async (click) => {
    await toogleNotification(userId, click, true)
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(fireStore, "users", userId),
      (snapshot) => {
        setNotification(snapshot.data().notification_allowed)
      },
      (error) => console.error(error),
    )

    return unsubscribe
  }, [])

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text variant="titleMedium">Notifikasi</Text>
        <Switch
          value={notification}
          color={Colors.dark.primary}
          onValueChange={handleNotification}
        />
      </View>
    </View>
  )
}

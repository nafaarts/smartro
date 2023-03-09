import { Alert, Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { useLinkTo } from "@react-navigation/native"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { fireStore } from "../firebase/firebase"
import { openSettings } from "expo-linking"

export const useNotification = () => {
  const linkTo = useLinkTo()

  async function sendPushNotification(client, title, body, data) {
    try {
      let clientCredentials = await getDoc(doc(fireStore, "users", client))
      clientCredentials = clientCredentials.data()

      if (
        clientCredentials?.notification_allowed &&
        clientCredentials?.device_token
      ) {
        const message = {
          to: clientCredentials?.device_token,
          sound: "default",
          title,
          body,
          data,
        }
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function registerForPushNotificationsAsync(alert = false) {
    let token
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        if (alert) {
          Alert.alert(
            "Error!",
            "Silahkan mengaktifkan notifikasi pada pengaturan anda!",
            [
              {
                text: "batal",
              },
              {
                text: "Buka Pengaturan",
                onPress: openSettings,
              },
            ],
          )
        }
        throw new Error("User tidak mengizinkan notifikasi.")
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    } else {
      throw new Error("Must use physical device for Push Notifications")
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    return token
  }

  function handleNotificationResponse(response) {
    const { url } = response.notification.request.content.data
    if (url) linkTo(url)
  }

  async function toogleNotification(userId, enabled = true, alert = false) {
    try {
      let token
      if (enabled) {
        token = await registerForPushNotificationsAsync(alert)
      }
      await updateDoc(doc(fireStore, "users", userId), {
        device_token: enabled ? token : null,
        notification_allowed: enabled,
      })
    } catch (error) {
      console.warn(error)
    }
  }

  return {
    sendPushNotification,
    registerForPushNotificationsAsync,
    handleNotificationResponse,
    toogleNotification,
  }
}

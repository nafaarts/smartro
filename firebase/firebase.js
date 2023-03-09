import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, initializeAuth } from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import { getFirestore } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getStorage } from "firebase/storage"

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBU3my2scXGuuhS0raHbUWtC2hVj6D5qP4",
  authDomain: "finalassigment-mitah.firebaseapp.com",
  projectId: "finalassigment-mitah",
  storageBucket: "finalassigment-mitah.appspot.com",
  messagingSenderId: "484866406061",
  appId: "1:484866406061:web:b99575dcb35f72cb4df824",
  measurementId: "G-SYDT79KY4H",
}

let firebaseApp
let fireAuth
if (getApps().length < 1) {
  firebaseApp = initializeApp(firebaseConfig)
  fireAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} else {
  firebaseApp = getApp()
  fireAuth = getAuth()
}

const fireStore = getFirestore(firebaseApp)
const fireStorage = getStorage(firebaseApp)

export { firebaseApp, fireAuth, fireStore, fireStorage }

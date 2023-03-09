import React, { useState, useEffect } from "react"
import * as ImagePicker from "expo-image-picker"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { Alert, Image, TouchableOpacity } from "react-native"
import { ProgressBar, TextInput } from "react-native-paper"
import ButtonFlex from "../../components/ButtonFlex"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import { fireAuth, fireStorage, fireStore } from "../../firebase/firebase"
import Loading from "../../components/Loading"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"

export default function AddServiceScreen({ navigation }) {
  const [image, setImage] = useState(null)

  const [progress, setProgress] = useState(0)
  const [isUploading, setUploading] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const [uid, setUid] = useState("")
  const [store, setStore] = useState(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [picture, setPicture] = useState({
    path: null,
    uri: null,
  })

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0])
      uploadImage(result.assets[0])
    } else {
      alert("You did not select any image.")
    }
  }

  const uploadImage = async (source) => {
    const response = await fetch(source.uri)
    const blob = await response.blob()
    const filename = "services/" + new Date().getTime() + "-service.jpg"

    const storageRef = ref(fireStorage, filename)
    const uploadTask = uploadBytesResumable(storageRef, blob)
    try {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(progress / 100)
          setUploading(true)
        },
        (error) => {
          console.error(error)
          setUploading(false)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPicture({
              uri: downloadURL,
              path: filename,
            })
          })
          setUploading(false)
        },
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async () => {
    if (!name || !price || !picture.path || !picture.uri) {
      Alert.alert("Data tidak boleh kosong!")
      return
    }

    const services = store?.services || []
    updateDoc(doc(fireStore, "workshops", uid), {
      services: [
        ...services,
        {
          name,
          price,
          image: picture,
        },
      ],
    })
      .then(() => {
        Alert.alert("Data berhasil diubah!")
        navigation.goBack()
      })
      .catch((error) => {
        Alert.alert(error)
        navigation.replace("Root")
      })
  }

  useEffect(() => {
    const getStoreData = (id) => {
      return onSnapshot(doc(fireStore, "workshops", id), (doc) => {
        if (doc.exists()) {
          setStore(doc.data())
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
    <KeyboardAwareScrollView>
      <View style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: Colors.dark.primary,
            borderRadius: 5,
            marginBottom: 10,
            height: 400,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
          onPress={pickImage}
        >
          <Image
            source={image ?? require("../../assets/images/select-image.png")}
            style={{ height: 400, width: 400 }}
          />
        </TouchableOpacity>
        {isUploading && (
          <ProgressBar
            progress={progress}
            color={Colors.dark.primary}
            style={{ marginBottom: 4 }}
          />
        )}
        <TextInput
          mode="outlined"
          placeholder="Masukan Nama Layanan Anda"
          style={{ backgroundColor: "#fff", marginBottom: 10 }}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          mode="outlined"
          keyboardType="numeric"
          placeholder="Masukan Harga Layanan Anda"
          style={{ backgroundColor: "#fff", marginBottom: 15 }}
          value={price}
          onChangeText={(text) => setPrice(text)}
        />
        <ButtonFlex
          mode="contained"
          title="Buat Layanan"
          color={Colors.dark.primary}
          icon="arrow-right"
          disabled={isUploading}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

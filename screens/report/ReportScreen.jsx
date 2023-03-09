import React, { useState, useEffect } from "react"
import { ActivityIndicator, Text } from "react-native"
import { Button } from "react-native-paper"
import { View } from "../../components/Themed"
import Colors from "../../constants/Colors"
import GenerateReport from "../../components/GenerateReport"
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore"
import { fireAuth, fireStore } from "../../firebase/firebase"

export default function ReportScreen() {
  const [data, setData] = useState([])
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [range, setRange] = useState({
    startDate: undefined,
    endDate: undefined,
  })

  const convDate = (timestamp) =>
    new Date(timestamp)
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-")

  const getOrders = async (start, end) => {
    setLoading(true)
    const q = query(
      collection(fireStore, "orders"),
      where("workshopid", "==", store?.uid),
      where("createdAt", ">=", start),
      where("createdAt", "<=", end),
    )
    const querySnapshot = await getDocs(q)
    setData(
      querySnapshot.docs.map((doc) => {
        return doc.data()
      }),
    )
    setLoading(false)
  }

  const handleReport = async (type = "current") => {
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth()
    if (type == "last") m -= 1
    var firstDay = new Date(y, m, 2)
    var lastDay = new Date(y, m + 1, 1)
    setRange({
      startDate: firstDay,
      endDate: lastDay,
    })
    await getOrders(firstDay, lastDay)
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(fireStore, "workshops", fireAuth?.currentUser.uid),
      (snapshot) => {
        setStore({ ...snapshot.data(), uid: snapshot.id })
      },
    )

    return unsubscribe
  }, [])

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        mode="outlined"
        style={{ marginBottom: 10, borderRadius: 5 }}
        textColor={Colors.dark.primary}
        icon="calendar"
        onPress={handleReport}
      >
        Generate Laporan Bulan ini
      </Button>
      <Button
        mode="outlined"
        style={{ marginBottom: 10, borderRadius: 5 }}
        textColor={Colors.dark.primary}
        icon="calendar"
        onPress={() => {
          handleReport("last")
        }}
      >
        Generate Laporan Bulan lalu
      </Button>

      {loading && <ActivityIndicator />}

      {range && !loading && data.length > 0 && (
        <GenerateReport
          title={`Laporan ${store?.name} pada tanggal ${convDate(
            +range.startDate,
          )} sampai dengan tanggal ${convDate(+range.endDate)}.`}
          source={data}
        />
      )}

      {range.startDate && range.endDate && data.length === 0 && (
        <Text style={{ color: "gray", textAlign: "center", marginTop: 20 }}>
          *Tidak ada data pada tanggal yang dipilih
        </Text>
      )}
    </View>
  )
}

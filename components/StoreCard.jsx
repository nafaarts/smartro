import * as React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Card, Text } from "react-native-paper"
import Colors from "../constants/Colors"

export default function StoreCard({ id, store, owner, price, service }) {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("StoreDetail", {
          storeId: id,
        })
      }
    >
      <Card mode="outlined" style={styles.cardWrapper}>
        <Card.Content style={styles.card}>
          <View>
            <Text style={styles.store}>{store}</Text>
            <Text style={styles.owner}>{owner}</Text>
            <Text style={styles.price}>Mulai Rp {price}</Text>
          </View>
          <Text style={styles.service}>{service} Layanan</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
    backgroundColor: Colors.dark.primary,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 10,
    color: "#fff",
  },
  store: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  owner: {
    fontSize: 10,
    fontWeight: "300",
    marginBottom: 10,
    color: "#fff",
  },
  price: {
    fontSize: 12,
    color: "#fff",
  },
  service: {
    fontSize: 12,
    color: "#fff",
  },
})

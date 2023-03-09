import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Pressable } from "react-native"

import useColorScheme from "../hooks/useColorScheme"
import Colors from "../constants/Colors"
import { Text, View } from "../components/Themed"

// screens
import NotFoundScreen from "../screens/general/NotFoundScreen"
import StoreDetailScreen from "../screens/store/StoreDetailScreen"
import AboutScreen from "../screens/general/AboutScreen"
import BerandaScreen from "../screens/general/BerandaScreen"
import ProfilScreen from "../screens/general/ProfilScreen"
import BookOrderScreen from "../screens/order/BookOrderScreen"
import FinishOrderScreen from "../screens/order/FinishOrderScreen"
import ProfilEditScreen from "../screens/general/ProfileEditScreen"
import CreateStoreScreen from "../screens/store/CreateStoreScreen"
import RegisterStoreScreen from "../screens/store/RegisterStoreScreen"
import StoreScreen from "../screens/store/StoreScreen"
import EditStoreScreen from "../screens/store/EditStoreScreen"
import ServiceScreen from "../screens/store/ServiceScreen"
import AddServiceScreen from "../screens/store/AddServiceScreen"
import OrdersScreen from "../screens/order/OrdersScreen"
import OrderDetailScreen from "../screens/order/OrderDetailScreen"
import StoreOrdersScreen from "../screens/order/StoreOrdersScreen"
import StoreOrderDetailScreen from "../screens/order/StoreOrderDetailScreen"
import OfferScreen from "../screens/order/OfferScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"

import { useNotification } from "../hooks/useNotification"
import * as Notifications from "expo-notifications"
import SettingScreen from "../screens/general/SettingScreen"
import ReportScreen from "../screens/report/ReportScreen"
import StoresScreen from "../screens/general/StoresScreen"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const config = {
  screens: {
    Root: {
      screens: {
        Profil: "profil",
      },
    },
    OrderDetail: {
      path: "orderdetail/:orderId",
      parse: {
        orderId: (storeId) => `${storeId}`,
      },
    },
    StoreOrderDetail: {
      path: "storeorderdetail/:orderId",
      parse: {
        orderId: (storeId) => `${storeId}`,
      },
    },
  },
}

const linking = {
  prefixes: ["smarttro://"],
  config,
}

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      fallback={<Text>Loading...</Text>}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator()

function RootNavigator() {
  const { handleNotificationResponse, registerForPushNotificationsAsync } =
    useNotification()

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationResponse(response)
      })

    return () => {
      if (responseListener)
        Notifications.removeNotificationSubscription(responseListener)
    }
  }, [])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        options={{ headerShown: false }}
        component={BottomTabNavigator}
      />
      <Stack.Group
        screenOptions={{
          headerBackTitleVisible: false,
          headerTintColor: Colors.light.primary,
        }}
      >
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{ title: "Pengaturan" }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
        <Stack.Screen
          name="StoreDetail"
          component={StoreDetailScreen}
          options={{ title: "Detail Toko" }}
        />
        <Stack.Screen
          name="BookOrder"
          component={BookOrderScreen}
          options={{ title: "Buat Pesanan" }}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ title: "Pesanan" }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ title: "Detail Order" }}
        />
        <Stack.Screen
          name="ProfilEdit"
          component={ProfilEditScreen}
          options={{ title: "Edit Profil" }}
        />
        <Stack.Screen
          name="CreateStore"
          component={CreateStoreScreen}
          options={{ title: "Buat Toko" }}
        />
        <Stack.Screen
          name="RegisterStore"
          component={RegisterStoreScreen}
          options={{ title: "Daftar Toko" }}
        />
        <Stack.Screen
          name="StoreScreen"
          component={StoreScreen}
          options={{ title: "Detail Toko" }}
        />
        <Stack.Screen
          name="EditStore"
          component={EditStoreScreen}
          options={{ title: "Edit Toko" }}
        />
        <Stack.Screen
          name="StoreOrders"
          component={StoreOrdersScreen}
          options={{ title: "Pesanan Toko" }}
        />
        <Stack.Screen
          name="StoreOrderDetail"
          component={StoreOrderDetailScreen}
          options={{ title: "Detail Pesanan Toko" }}
        />
        <Stack.Screen
          name="Offer"
          component={OfferScreen}
          options={{ title: "Penawaran Pesanan" }}
        />
        <Stack.Screen
          name="Service"
          component={ServiceScreen}
          options={({ navigation }) => ({
            title: "Layanan",
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate("AddService")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <View
                  style={{
                    backgroundColor: Colors.dark.primary,
                    height: 30,
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 15,
                    borderRadius: 15,
                  }}
                >
                  <MaterialCommunityIcons name="plus" size={25} color="#fff" />
                </View>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="AddService"
          component={AddServiceScreen}
          options={{ title: "Tambah Layanan" }}
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{ title: "Buat Laporan" }}
        />
      </Stack.Group>
      <Stack.Screen
        name="FinishOrder"
        component={FinishOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "Tentang Aplikasi" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const BottomTab = createBottomTabNavigator()

function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Beranda"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="Beranda"
        component={BerandaScreen}
        options={({ navigation }) => ({
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("About")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="StoresScreen"
        component={StoresScreen}
        options={{
          title: "Toko",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="store-outline" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="account-outline" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  )
}

function TabBarIcon(props) {
  return (
    <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />
  )
}

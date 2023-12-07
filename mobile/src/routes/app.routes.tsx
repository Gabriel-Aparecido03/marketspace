import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/Home";
import { House, SignOut, Tag } from 'phosphor-react-native'
import { Box, Button, useTheme } from "native-base";
import { MyAnnounced } from "../screens/MyAnnounced";
import { FormAnnounced } from "../screens/FormAnnounced";
import { Loading } from "../components/Loading";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { createStackNavigator } from "@react-navigation/stack";
import { EditAnnounced } from "../screens/EditAnnounced";
import { PreviewOfAnnounced } from "../screens/PreviewOfAnnounced";
import { ViewAnnounced } from "../screens/ViewAnnounced";
const { Navigator, Screen } = createBottomTabNavigator()

function BottomTabsRouter() {

  const { colors } = useTheme()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[200],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[700],
          borderColor: colors.gray[700],
          flexDirection : "row",
          justifyContent : "space-between"
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <House weight="bold" color={color} />
        }}
      />
      <Screen
        name="myAnnounced"
        component={MyAnnounced}
        options={{
          tabBarIcon: ({ color }) => <Tag weight="bold" color={color} />
        }}
      />
      <Screen
        name="signOut"
        component={Loading}
        options={{
          tabBarIcon: () => <Button onPress={handleSignOut} bgColor={"transparent"}><SignOut  weight="bold" color={colors.red[500]} /></Button>
        }}
      />
    </Navigator>
  )
}

export function AppRoutes() {
  const Stack = createStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown : false}} initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={BottomTabsRouter}
      />
      <Stack.Screen
        name="formAnnounced"
        component={FormAnnounced}
      />
      <Stack.Screen
        name="detailsAnnounced"
        component={PreviewOfAnnounced}
      />
      <Stack.Screen
        name="viewAnnounced"
        component={ViewAnnounced}
      />
      <Stack.Screen
        name="editAnnounced"
        component={EditAnnounced}
      />
    </Stack.Navigator>
  )
}
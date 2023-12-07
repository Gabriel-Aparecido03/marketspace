import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import React from "react";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";

export function Routes() {

  const { colors } = useTheme()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[600]
  const { user, isAuthInProgress } = useAuth()

  return (
    <Box flex={1} bg="gray.600">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
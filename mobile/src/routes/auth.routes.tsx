import { createStackNavigator,StackNavigationProp } from "@react-navigation/stack";
import { Login } from "../screens/Login";
import { Register } from "../screens/Register";

type AuthRoutes = {
  login : undefined
  register : undefined
}

export type AppNavigatorStackProps = StackNavigationProp<AuthRoutes>

const { Navigator,Screen } = createStackNavigator<AuthRoutes>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown : false }}>
      <Screen name="login" component={Login} />
      <Screen name="register" component={Register} />
    </Navigator>
  )
}
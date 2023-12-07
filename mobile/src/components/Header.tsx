import { Box, Text } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { Button } from "./Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";

export function Header() {

  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  const navigation = useNavigation()

  return (
    <Box justifyContent={"space-between"} flexDirection={"row"} alignItems={"center"} p={4} pt={top + 1}>
      <Box flexDir={"row"} alignItems={"center"} w={'1/2'}>
        <UserPhoto imageUrl={`${api.defaults.baseURL}/images/${user.avatar}`} width={60} height={60} />
        <Box ml={1}>
          <Text fontSize={"lg"} color={"gray.100"}>Welcome !</Text>
          <Text color={"gray.100"} fontSize={"lg"} fontFamily={"heading"}>{ user.name }</Text>
        </Box>
      </Box>
      <Box flex={1} ml={3}>
        <Button variant="tertiary" text="Make" onPress={()=> { navigation.navigate("formAnnounced" as never) }}/>
      </Box>
    </Box>
  )
}
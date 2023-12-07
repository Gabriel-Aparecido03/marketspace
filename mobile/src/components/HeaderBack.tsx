import { useNavigation } from "@react-navigation/native";
import { Box, Text, useTheme } from "native-base";
import { ArrowLeft } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";

export function HeaderBack() {
  const { colors } = useTheme()

  const navigation = useNavigation()

  return (
    <Box flexDirection={"row"} p="5%" pt="10%">
      <TouchableOpacity onPress={()=>{ navigation.goBack() }} >
        <ArrowLeft color={colors.gray[100]} />
      </TouchableOpacity>
      <Text textAlign={"center"} color={colors.gray[100]}  flex={1} fontFamily={"heading"} fontSize={"2xl"}>Create announceds</Text>
    </Box>
  )
}
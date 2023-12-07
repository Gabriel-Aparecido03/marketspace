import { useNavigation } from "@react-navigation/native";
import { Box, Text, useTheme } from "native-base";
import { Plus } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";

export function AnnouncedHeader() {

  const navigaiton = useNavigation()
  const { colors } = useTheme()

  return (
    <Box flexDirection={"row"} pt="5%" h={70}>
      <Text textAlign={"center"} color={colors.gray[100]}  flex={1} fontFamily={"heading"} fontSize={"2xl"}>My announceds</Text>
      <TouchableOpacity onPress={()=>{ navigaiton.navigate('formAnnounced' as never)}}>
        <Plus color={colors.gray[100]} />
      </TouchableOpacity>
    </Box>
  )
}
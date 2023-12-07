import { Box, Text, useTheme } from "native-base";
import { ArrowRight, Tag } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";

type AnnouncedType = {
  number : number
}

export function Announced({ number }:AnnouncedType) {

  const { colors } = useTheme()

  return (
    <Box>
      <Text color={"gray.300"} fontSize={"md"} mb={3}>Your announced products</Text>
      <Box flexDir={"row"} justifyContent={"space-between"} alignItems={"center"} bg={"purple.100"} rounded={"md"} py={3} px={4}>
        <Box flexDirection={"row"} alignItems={"center"}>
          <Tag color={colors.blue["500"]} weight="bold" />
          <Box ml={3}>
            <Text color={"gray.200"} fontSize={"xl"} fontFamily={"heading"}>{ number }</Text>
            <Text color={"gray.200"} >Actives announced </Text>
          </Box>
        </Box>
        <TouchableOpacity>
          <Box flexDir={"row"}>
            <Text color={"blue.500"} fontFamily={"heading"} fontSize={"lg"}> My announced</Text>
            <ArrowRight weight="bold" color={colors.blue[100]} />
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}
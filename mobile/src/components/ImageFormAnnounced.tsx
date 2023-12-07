import { Box, Image, useTheme } from "native-base";
import { X } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";

type ImageFormannouncedTypeProps = {
  uri : string
  onRemove : () => void
}

export function ImageFormAnnounced({ uri ,onRemove}:ImageFormannouncedTypeProps) {

  const { colors } = useTheme()

  return (
    <Box position={"relative"} h={"24"} w={"24"} mx={3}>
      <Image alt="" w={"full"} h={"full"} rounded={"md"} source={{ uri }} />
      <Box position={"absolute"} top={-12} right={-12} rounded={9999999} bgColor={"gray.200"} p={1}>
        <TouchableOpacity onPress={onRemove}>
          <X color={colors.gray[700]} />
        </TouchableOpacity>
      </Box>
    </Box>
  )
}
import { Box, Center, Icon, Image, useTheme } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { PencilLine, User } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";

type UserPhoto = {
  width?: number
  height?: number
  iconEdit?: boolean
  imageUrl?: string
  onPress?: () => void
}

export function UserPhoto({ width = 88, height = 88, iconEdit = false, imageUrl,onPress }: UserPhoto) {

  const { colors } = useTheme()

  return (
    <Box alignItems={"center"} rounded={"full"} borderWidth={2} justifyContent={"center"} borderColor={"blue.500"}>
      <TouchableOpacity activeOpacity={0.8}>
        {
          !imageUrl ?
            <Center w={width} h={height} rounded={"full"} bgColor={"gray.500"}>
              <User color={colors.gray[700]} />
            </Center> :
            <Image alt="" w={width} rounded={"full"} h={height} source={{ uri: imageUrl }} />
        }
        {iconEdit && <Center bottom={0} right={0} rounded={99999999} w={9} h={9} position={"absolute"} bg={"blue.500"}>
          <TouchableOpacity onPress={onPress}>
           <PencilLine color={colors.gray[700]} weight="bold" size={16} />
          </TouchableOpacity>
        </Center>
        }
      </TouchableOpacity>
    </Box>
  )
}
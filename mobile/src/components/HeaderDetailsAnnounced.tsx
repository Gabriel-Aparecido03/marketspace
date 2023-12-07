import { useNavigation } from "@react-navigation/native"
import { Box, Heading, Text, useTheme } from "native-base"
import { ArrowLeft,PencilLine } from "phosphor-react-native"
import { TouchableOpacity } from "react-native"

type HeaderDetailsAnnouncedProps = {
  isPreview?: boolean
  isMyAnnounced?: boolean
  onPressToEdit?: () => void
}

export function HeaderDetailsAnnounced({ isMyAnnounced = false, isPreview = false,onPressToEdit }: HeaderDetailsAnnouncedProps) {

  const { colors } = useTheme()

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    isPreview ? 
    <Box flexDir={"column"} p="5%" pt="10%" alignItems={"center"} justifyContent={"center"} bgColor={"blue.100"} padding={"5%"}>
      <Heading color={"white"} textAlign={"center"} fontFamily={"heading"} mb={1}>Ad preview</Heading>
      <Text color={"white"} textAlign={"center"}>This is how your product will appear!</Text>
    </Box> 
  : 
  <Box flexDirection={"row"} p="5%" pt="10%" justifyContent={"space-between"}>
      <TouchableOpacity onPress={handleGoBack}>
        <ArrowLeft color={colors.gray[100]} />
      </TouchableOpacity>
      { !isMyAnnounced && <Text textAlign={"center"} color={colors.gray[100]} flex={1} fontFamily={"heading"} fontSize={"2xl"}>Create announceds</Text> }
      { isMyAnnounced && <TouchableOpacity onPress={onPressToEdit}><PencilLine color={colors.gray[100]} /></TouchableOpacity>}
    </Box>
  )
}
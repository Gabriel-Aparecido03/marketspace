import { Box, Text } from "native-base"
import { TouchableOpacity } from "react-native"

interface ConditionTag {
  text : string
  onPress : () => void
  isSelected : boolean
}

export function ConditionTag({ isSelected,onPress,text }: ConditionTag) {
  return (
    <Box rounded={"2xl"} h={7} px={3} alignItems={"center"} justifyContent={"center"} bgColor={isSelected ? 'blue.100' : 'gray.300'}>
      <TouchableOpacity style={{ flex : 1 , height : "auto"}}>
        <Text flex={1} alignItems={"center"} justifyContent={"center"} color={isSelected ? 'white' : 'gray.500'} fontWeight={"bold"} textTransform={"uppercase"} fontSize={"md"}> { text } </Text>
      </TouchableOpacity>
    </Box>
  )
}
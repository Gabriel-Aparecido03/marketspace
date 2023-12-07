import { Badge, Box, Image, Text } from "native-base"
import { UserPhoto } from "./UserPhoto"
import { TouchableOpacity } from "react-native"
import { useAuth } from "../hooks/useAuth"
import { api } from "../services/api"

type Props = {
  isNew: boolean
  product_images: string[]
  name: string
  price: string
  onPress: (id: string) => Promise<void>
  id : string
  userImageUrl:string
  isActive?: boolean
}

export function ProductCard({ isActive=false, userImageUrl, isNew, name, onPress, price, product_images ,id }: Props) {
  const { user } = useAuth()
  return (
    <TouchableOpacity style={{ flex : 1}} onPress={()=> onPress(id)}>
      <Box flex={1} position={"relative"} justifyContent={"center"} alignItems={"center"} my={3}>
        { !isActive && <Text fontFamily={"heading"} fontSize={"md"} zIndex={99} bottom={10} position={"absolute"} color={"white"}>Announced Disabled</Text>}
        <Box rounded={"lg"}>
          <Image rounded={"lg"} alt="" w={144} h={112} source={{ uri: `${api.defaults.baseURL}/images/${product_images[0].path}` }} />
        </Box>
        <Box w={144} flexDir="row" justifyContent={"space-between"} position={"absolute"} top={0} p={1}>
          <UserPhoto imageUrl={`${api.defaults.baseURL}/images/${userImageUrl}`} height={6} width={6} />
          <Badge
            height={6}
            rounded={"xl"}
            bgColor={isNew ? "blue.100" : "gray.200"}
            textTransform={"uppercase"}
            fontFamily={"heading"}
            _text={{ color: "gray.700" }}
          >
            {isNew ? 'New' : 'Usaded'}
          </Badge>
          { !isActive && <Box w={144} h={112} flex={1} rounded={"lg"} position={"absolute"} bgColor={"black"} opacity={0.3} />}
        </Box>
        <Box>
          <Text color={"gray.200"} fontSize={"md"}>{name}</Text>
          <Text fontFamily={"heading"} fontSize={"sm"}> R$ <Text fontFamily={"heading"} fontSize={"lg"}>{price}</Text></Text>
        </Box>
      </Box>
    </TouchableOpacity>
  )
}
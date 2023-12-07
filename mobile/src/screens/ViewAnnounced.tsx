import { Box, HStack, Heading, Image, ScrollView, Tag, Text, VStack, useToast } from "native-base";
import { Button } from "../components/Button";
import { HeaderDetailsAnnounced } from "../components/HeaderDetailsAnnounced";
import { UserPhoto } from "../components/UserPhoto";
import { useAuth } from "../hooks/useAuth";
import React, { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useAnnounced } from "../hooks/useAnnounced";
import { PaymentMethodBoxView } from "../components/PaymentMethodBoxView";
import { Loading } from "../components/Loading";
import { ImagesCarrousel } from "../components/ImagesCarrousel";

type AnnouncedType = {
  id?: string;
  name: string;
  description: string;
  is_new: boolean;
  accept_trade: boolean;
  payment_methods: (string | undefined)[];
  images: string[]
  userName: string
  userId: string
  userImageUrl: string
  price: number
  is_active: boolean
}

export function ViewAnnounced() {

  const [announcedDetails, setAnnouncedDetails] = useState<AnnouncedType>({} as AnnouncedType)

  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { setAnnounced, changeVisibilityOfAnnounced, removeAnnounced } = useAnnounced()
  const toast = useToast()
  const { params: { id } } = useRoute()

  const navigation = useNavigation()

  async function fetchAnnounced() {
    try {
      setIsLoading(true)
      const res = await api.get(`/products/${id}`)
      if (res.status === 200) {
        const { accept_trade, description, is_new, name, payment_methods, price, user, id, user_id, is_active, product_images } = res.data
        const refactorPaymentMethods = payment_methods.map(item => item.key)
        setAnnouncedDetails({ accept_trade, is_active: is_active ?? true, description, images: product_images, is_new, name, payment_methods, price, userId: user_id, userImageUrl: user.avatar, userName: user.name, id })
        setAnnounced({ accept_trade, is_active: is_active ?? true, description, images: product_images, is_new, name, payment_methods: refactorPaymentMethods, price, userId: user_id, userImageUrl: user.avatar, userName: user.name, id })
      }
    } catch (error) {
      throw error
    }
    finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAnnounced();
      return () => fetchAnnounced();
    }, [])
  );

  async function handleDelete() {
    try {
      await removeAnnounced()
      toast.show({
        title: "Announced removed with success !",
        placement: 'bottom',
        bgColor: 'green.500'
      })
      navigation.navigate('Home' as never)
    } catch (error) {
      toast.show({
        title: "Something is error , try later !",
        placement: 'bottom',
        bgColor: 'red.500'
      })
      throw error
    }
  }

  async function handleToogleActive() {
    try {
      await changeVisibilityOfAnnounced()
      toast.show({
        title: "Visibility changed with success !",
        placement: 'bottom',
        bgColor: 'green.500'
      })
      navigation.navigate('Home' as never)
    } catch (error) {
      toast.show({
        title: "Something is error , try later !",
        placement: 'bottom',
        bgColor: 'red.500'
      })
    }
  }

  function handleNavigateToEdit() {
    navigation.navigate('editAnnounced', { id: announcedDetails.id })
  }
  if (!announcedDetails || isLoading) return <Loading />
  return (
    <VStack flex={1}>
      <HeaderDetailsAnnounced onPressToEdit={handleNavigateToEdit} isMyAnnounced={announcedDetails.userId === user.id} />
      <ScrollView>
        <ImagesCarrousel isActive={announcedDetails.is_active} images={announcedDetails.images} />
        <VStack paddingRight={"5%"} paddingLeft={"5%"}>
          <Box mt={3}>
            <HStack alignItems={"center"}>
               <UserPhoto imageUrl={`${api.defaults.baseURL}/images/${announcedDetails.userImageUrl}`} height={6} width={6} />
              <Text ml={1}>{announcedDetails.userName}</Text>
            </HStack>
          </Box>
          <Box>
            <HStack mb={3} mt={3} justifyContent={"space-between"}>
              <Heading fontSize={"xl"}> {announcedDetails.name} </Heading>
              <Text fontSize={"lg"} color={"blue.500"} > {announcedDetails.price}</Text>
            </HStack>
            <Text mb={3} fontSize={"md"}>{announcedDetails.description}</Text>
            <HStack mb={3}>
              <Text fontFamily={"heading"} color={"gray.200"} >Accept Trade ?</Text>
              <Text textTransform={"capitalize"} color={"gray.200"} ml={3} >{String(announcedDetails.accept_trade)}</Text>
            </HStack>
            <VStack mb={3}>
              <Text fontFamily={"heading"} color={"gray.200"} >Payment Methods ?</Text>
              {announcedDetails.payment_methods?.map(item => <PaymentMethodBoxView key={item.key} methods={item.key} />)}
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
      {announcedDetails.userId === user.id &&
        <Box w={"full"} position={"absolute"} bottom={0} justifyContent={"space-between"} p={"5%"} >
          <Button
            w="full"
            onPress={handleToogleActive}
            text={announcedDetails.is_active ? 'Disable Announced' : 'Active Announced'}
            variant={announcedDetails.is_active ? "tertiary" : "primary"}
          />
          <Box mt={3} />
          <Button onPress={handleDelete} w="full" text="Delete Announced" variant="secondary" />
        </Box>
      }
      {announcedDetails.userId !== user.id &&
        <Box alignItems={"center"} w={"full"} position={"absolute"} bottom={0} justifyContent={"space-between"} flexDir={"row"} p={"5%"} >
          <Box>
            <Text color={"blue.500"} fontSize={"md"}>R${" "}<Text color={"blue.500"} fontWeight={"bold"} fontSize={"2xl"}>{announcedDetails.price} </Text></Text></Box>
          <Button onPress={handleDelete} w="50%" text="Delete Announced" variant="primary" />
        </Box>
      }
    </VStack>
  )
}
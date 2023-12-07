import { Box, HStack, Heading, Image, ScrollView, Tag, Text, VStack } from "native-base";
import { Button } from "../components/Button";
import { HeaderDetailsAnnounced } from "../components/HeaderDetailsAnnounced";
import { UserPhoto } from "../components/UserPhoto";
import { Bank } from "phosphor-react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useAnnounced } from "../hooks/useAnnounced";
import { ImagesCarrousel } from "../components/ImagesCarrousel";

export function PreviewOfAnnounced() {
  
  const navigation = useNavigation()

  const { announced,publishAnnounced,resetAnnounced } = useAnnounced()

  async function handleCreateAnnounced() {
    try {
      await publishAnnounced()
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }

  function handleGoBack() {
    navigation.goBack()
  }

  if(announced === null) return null

  return (
    <VStack flex={1}>
      <HeaderDetailsAnnounced isPreview />
      <ScrollView paddingRight={"5%"} paddingLeft={"5%"}>
      <ImagesCarrousel isActive={announced.is_active} images={announced.images} />
        <Box mt={3}>
          <HStack alignItems={"center"}>
            <UserPhoto imageUrl="https://github.com/Gabriel-Aparecido03.png" height={6} width={6} />
            <Text ml={1}> { announced.userName } </Text>
          </HStack>
        </Box>
        <Box>
          <HStack mb={3} mt={3} justifyContent={"space-between"}>
            <Heading fontSize={"xl"}>{ announced.name }  </Heading>
            <Text fontSize={"lg"} color={"blue.500"} >{ announced.price }</Text>
          </HStack>
          <Text mb={3} fontSize={"md"}>{ announced.description }</Text>
          <HStack mb={3}>
            <Text fontFamily={"heading"} color={"gray.200"} >Accept Trade ?</Text>
            <Text textTransform={"capitalize"} color={"gray.200"} ml={3} >{ String(announced.accept_trade) }</Text>
          </HStack>
          <VStack mb={3}>
              <Text fontFamily={"heading"} color={"gray.200"} >Payment Methods ?</Text>
              { announced.payment_methods.map( item => 
              <HStack key={item} mt={2} alignItems={"center"}>
                <Bank />
                <Text ml={3}>{ item }</Text>
              </HStack> )}
          </VStack>
        </Box>
      </ScrollView>
      <Box w={"full"} position={"absolute"} bottom={0} justifyContent={"space-between"} p={"5%"} >
        <Button w="full" text="Cancel" variant="secondary" onPress={handleGoBack} />
        <Box mt={3} />
        <Button w="full" onPress={handleCreateAnnounced} text="Confirm" variant="tertiary" />
      </Box>
    </VStack>
  )
}
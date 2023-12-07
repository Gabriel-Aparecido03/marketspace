import { Box, Center, Checkbox, FlatList, HStack, Heading, ScrollView, Switch, Text, VStack } from "native-base";
import { Header } from "../components/Header";
import { Announced } from "../components/Announced";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../components/Input";
import { ProductCard } from "../components/ProductCard";
import { api } from "../services/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Faders } from "phosphor-react-native";
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ConditionTag } from "../components/ConditionTag";

const paymentsMethodsAvailables = ['boleto', 'pix', 'cash', 'deposit', 'card']

export function Home() {

  const [numberOfMyAnnounced, setNumberOfMYAnnounced] = useState(0)
  const [listOfAnnounceds, setListOfAnnounceds] = useState<any>()

  const bottomSheetModalRef = useRef(null);

  const [acceptTrade, setAcceptTrade] = useState(true)
  const [paymentMethods, setPaaymentMethods] = useState([])
  const [isNew, setIsNew] = useState(true)

  const navigation = useNavigation()

  async function fetchMyAnnounced() {
    try {
      const res = await api.get('/users/products/')
      if (res.status === 200) {
        setNumberOfMYAnnounced(res.data.length)
      }
    } catch (error) { }
  }

  async function fetchListOfAnnounceds() {
    try {
      const res = await api.get(`/products/?is_new=${isNew}&accept_trade=${acceptTrade}&${paymentMethods.length > 0 ? paymentMethods.map( item => `payment_methods=${item}&`) : undefined}`)
      if (res.status === 200) {
        console.log(res.data)
        setListOfAnnounceds(res.data)
      }
    } catch (error) {

    }
  }

  async function handleOpenDetailsOfAnnounced(id: string) {
    navigation.navigate("viewAnnounced", { id })
  }

  useFocusEffect(
    useCallback(() => {
      fetchMyAnnounced()
      fetchListOfAnnounceds()
    }, [])
  );


  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  return (
    <VStack>
      <BottomSheetModal snapPoints={snapPoints} ref={bottomSheetModalRef} index={1}>
        <VStack p={"5%"}>
          <Heading textAlign={"center"}>Filter Content</Heading>
          <VStack>
            <Box >
              <Text fontFamily={"heading"} fontSize={"md"}>Condition</Text>
              <Box mt={2} flexDir={"row"} >
                <ConditionTag text="New" isSelected={isNew} onPress={() => { setIsNew(true) }} />
                <Box w={2} />
                <ConditionTag text="Usaded" isSelected={!isNew} onPress={() => { setIsNew(false) }} />
              </Box>
            </Box>
            <Box mt={4} justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text fontFamily={"heading"} fontSize={"md"}>Aceept trade ?</Text>
              <Box><Switch value={acceptTrade} onChange={e => console.log(e)}/></Box>
            </Box>
            <Box>
              <Text fontFamily={"heading"} fontSize={"md"}>Payment method</Text>
              <VStack mt={2}>
                <VStack>
                  {paymentsMethodsAvailables.map(item =>
                    <Checkbox
                      key={item}
                      mb={2}
                      value={item}
                      isChecked={paymentsMethodsAvailables.includes(item)}
                      onChange={() => {
                        paymentMethods.includes(item) ? setPaaymentMethods(prev => prev.filter(i => i !== item)) : setPaaymentMethods(prev => prev.concat(item))
                      }}
                    >
                      <Text textTransform={"capitalize"}>{item}</Text>
                    </Checkbox>
                  )}
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </BottomSheetModal>
      <Header />
      <Box px={"5%"}>
        <Announced number={numberOfMyAnnounced} />
        <Box mt={4}>
          <Text color={"gray.300"} fontSize={"md"} mb={3}>Buy a lot of products</Text>
          <Input placeholder="Search for products name" >
            <TouchableOpacity onPress={handlePresentModalPress}>
              <Faders />
            </TouchableOpacity>
          </Input>
        </Box>
        <FlatList
          data={listOfAnnounceds}
          renderItem={({ item }: any) => <ProductCard id={item.id} userImageUrl={item.user.avatar} isNew name={item.name} onPress={() => { handleOpenDetailsOfAnnounced(item.id) }} price={item.price} product_images={item.product_images} isActive key={item.id} />}
          numColumns={2}
          ListEmptyComponent={() => <Center flex={1}><Text>The announced will be appear here !</Text></Center>}
        />
      </Box>
    </VStack>
  )
}
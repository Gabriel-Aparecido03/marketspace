import { Box, Center, FlatList, Text } from "native-base";
import { AnnouncedHeader } from "../components/AnnouncedHeader";
import { AnnouncedFilter } from "../components/AnnouncedFilter";
import { ProductCard } from "../components/ProductCard";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AnnouncedView } from "../interfaces/Announceds";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";

export function MyAnnounced() {

  const [ listOfMyAnnounceds, setListOfMyAnnounceds ] = useState<AnnouncedView[]>([])
  const [ filter,setFilter ] = useState('all')
  const [ isLoading ,setIsLoading ] = useState(false)

  const navigation = useNavigation()

  const { user } = useAuth()

  async function fetchMyAnnounceds() {
    try {
      setIsLoading(true)
      const res = await api.get('/users/products')
      if(res.status === 200 ) {
        setListOfMyAnnounceds(res.data)
      }
    } catch (error) {}
    finally {
      setIsLoading(false)
    }
  }

  async function handleOpenEditAnnounced(id:string) {
    navigation.navigate("viewAnnounced",{ id })
  }

  useFocusEffect(
    useCallback(()=>{
      fetchMyAnnounceds()
    },[])
  );

  const filteredAnnounced = filter === "all" ? listOfMyAnnounceds : listOfMyAnnounceds.filter(item => item.is_active === ( filter === "actived" ?? "disabled" ))
  return (
    isLoading ? <Loading /> : <Box p="5%">
    <AnnouncedHeader />
    <AnnouncedFilter  numberOfAnnounceds={listOfMyAnnounceds.length} onChange={setFilter}/>
    <FlatList 
      data={filteredAnnounced}
      renderItem={({ item })=> 
        <ProductCard 
          key={item.id}
          isNew={item.is_new}
          id={item.id}
          name={item.name}
          onPress={handleOpenEditAnnounced}
          price={String(item.price)}
          product_images={item.product_images}
          isActive={item.is_active}
          userImageUrl={user.avatar}
        />
        }
      numColumns={2}
      ListEmptyComponent={()=> <Center flex={1}><Text>You dont have any announceds register ! Let go make your fist announceds </Text></Center>}
    />

  </Box>
  )
}
import { Box, Checkbox, HStack, Radio, ScrollView, Switch, Text, VStack, useToast } from "native-base";
import { HeaderBack } from "../components/HeaderBack";
import { ImageFormAnnounced } from "../components/ImageFormAnnounced";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";

import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { api } from "../services/api";
import { useAnnounced } from "../hooks/useAnnounced";
import { TouchableOpacity } from "react-native";
import { Plus } from "phosphor-react-native";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";
import { position } from "native-base/lib/typescript/theme/styled-system";

const editAnnouncedYup = yup.object({
  name: yup.string().required('The name is required !'),
  description: yup.string().required('The description is required'),
  is_new: yup.bool().default(false),
  accept_trade: yup.bool().default(false),
  payment_methods: yup.array(yup.string()).required(),
  price : yup.number().min(0).required('The price is required'),
  is_active : yup.bool().default(true)
})

type FormDataEditAnnounced = yup.InferType<typeof editAnnouncedYup>

const paymentsMethodsAvailables = ['boleto', 'pix', 'cash', 'deposit', 'card']

export function EditAnnounced() {

  const navigation = useNavigation()

  const { params : { id } } = useRoute()

  const { announced,editAnnounced,resetAnnounced } = useAnnounced()
  const { user } = useAuth()

  const [ announcedDetails, setAnnouncedDetails ] = useState({} as any)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ newImages, setNewImages ] = useState([] as any)
  const [ deletedImages,setDeletedImages ] = useState([] as any)
  const [ images,setImages ] = useState(announced?.images ?? [])

  const toast = useToast()

  if(!announced ) return <Loading />

  const { control ,handleSubmit, formState: { errors } } = useForm<FormDataEditAnnounced>({
    defaultValues: {
      accept_trade: announced.accept_trade ,
      description: announced.description ,
      is_new: announced.is_new ,
      name: announced.name ,
      payment_methods: announced.payment_methods,
      price : announced.price,
      is_active: announced.is_active
    },
    resolver: yupResolver(editAnnouncedYup)
  })


  async function handleSelectedPhotos() {
    try {
      setIsLoading(true)
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      });

      if (photoSelected.canceled) return
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)

        if (photoInfo.exists && (photoInfo.size / 1024 / 1024 >= 5)) {
          return toast.show({
            title: 'That images size cant be pass 5 mbs',
            placement: 'bottom',
            bgColor: 'red.500'
          })
        }
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const image = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        }
        console.log(image)
        setNewImages(prev => [...prev, image])

        toast.show({
          title: 'Photo updated with success',
          placement: 'bottom',
          bgColor: 'green.500'
        })
      }
    } catch (error) { 
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  async function handleSaveEditOfAnnounced(data :FormDataEditAnnounced ) {
    const dto = {...data , images : announced!.images }

    if(deletedImages.length > 0 ) await fetchRemoveFiles()
    if(newImages.length > 0 ) await fetchAddNewFiles()

    await editAnnounced(dto)
    resetAnnounced()
    navigation.navigate('Home' as never)
  }

  async function fetchAnnounced() {
    try {
      const res = await api.get(`/products/${id}`)
      if(res.status === 200 ) {
        setAnnouncedDetails(res.data)
      }
    } catch (error) {}
  }

  useFocusEffect(
    useCallback(() => {
      fetchAnnounced();
      return () => fetchAnnounced();
    }, [])
  );

  function handleCancel() {
    resetAnnounced()
    navigation.navigate('Home' as never)
  }

  function handleRemoveMedia(position) {
    setDeletedImages(prev => [...prev , images[position].id])
    setImages(prev => prev.filter((item,index) => index !== position))
  }

  function handleRemoveNewMedia(position) {
    setNewImages(prev => prev.filter((item,index) => index !== position))
  }

  async function fetchRemoveFiles() {
    try {
      await api.delete('/products/images',{ data : { productImagesIds : deletedImages }})
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }

  async function fetchAddNewFiles() {
    try {
      const formData = new FormData()
      newImages.map( item => formData.append('images',item))
      formData.append("product_id",announced?.id!)
      await api.post('/products/images',formData , {headers : { 'Content-Type':'multipart/form-data' }} )
    } catch (error) {
      
    }
  }
  
  return (
    <VStack flex={1}>
      <HeaderBack />
      <ScrollView p={"5%"}>
        <Box>
          <Box>
            <Text color={"gray.200"} fontFamily={"heading"} fontSize={"md"}>Images</Text>
            <Text color={"gray.300"} fontSize={"sm"} mb={3}>Choose up to 3 images to show how incredible your product is!</Text>
          </Box>
          <HStack>
            {images.map((item, index) => <ImageFormAnnounced onRemove={() => { handleRemoveMedia(index) }} uri={`${api.defaults.baseURL}/images/${item.path}`} />)}
            {newImages.map((item, index) => <ImageFormAnnounced onRemove={() => { handleRemoveNewMedia(index) }} uri={item.uri} />)}
            {(images.length + newImages.length ) < 3 &&
              <Box
                w={24}
                h={24}
                bgColor={"gray.400"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <TouchableOpacity onPress={handleSelectedPhotos}>
                  <Plus />
                </TouchableOpacity>
              </Box>
            }
          </HStack>
        </Box>
        <Box>
          <Box>
            <Text color={"gray.200"} fontFamily={"heading"} fontSize={"md"}>About the product</Text>
          </Box>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => <Input placeholder="Name" value={value} onChangeText={onChange} mt={5} />}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => <Input placeholder="Description" value={value} numberOfLines={5} onChangeText={onChange} mt={5} />}
          />
          <VStack mt={4}>
            <Controller
              control={control}
              name="is_new"
              render={({ field: { onChange,value } }) =>
                <Radio.Group defaultValue={value ? "new" : "usaded"} onChange={e => onChange(e === "new")} name="myRadioGroup" accessibilityLabel="favorite number">
                  <HStack justifyContent={"space-between"} >
                    <Radio value="new" ml={"10%"}> New product</Radio>
                    <Radio value="usaded"> Usaded product</Radio>
                  </HStack>
                </Radio.Group>}
            />
          </VStack>
        </Box>
        <Box mt={4}>
          <Box>
            <Text color={"gray.200"} fontFamily={"heading"} fontSize={"md"}>Sell</Text>
          </Box>
          <Controller 
            control={control}
            name="price"
            render={({ field : { value, onChange} }) => <Input onChangeText={onChange} value={String(value)} placeholder="price" mt={2} />}
          />
        </Box>
        <Box mt={4} justifyContent={"flex-start"} alignItems={"flex-start"}>
          <Text fontFamily={"heading"} fontSize={"md"}>Aceept trade ?</Text>
          <Controller
            control={control}
            name="accept_trade"
            render={({ field: { onChange, value } }) => <Box><Switch onChange={onChange} value={value} /></Box>}
          />
        </Box>
        <Box>
          <Text>Payment method</Text>
          <VStack mt={2}>
            <Controller
              control={control}
              render={({ field: { value, onChange } }) => (
                <VStack>
                  {paymentsMethodsAvailables.map(item =>
                    <Checkbox
                      key={item}
                      mb={2}
                      value={item}
                      onChange={() => {
                        value.includes(item) ? onChange(value.filter(i => i !== item)) : onChange(value.concat(item))
                      }}
                      isChecked={value.includes(item)}
                    >
                      <Text textTransform={"capitalize"}>{item}</Text>
                    </Checkbox>
                  )}
                </VStack>
              )}
              name="payment_methods"
            />
          </VStack>
        </Box>
      </ScrollView>
      <Box w={"full"} position={"absolute"} bottom={0} bg={"gray.700"} flexDir={"row"} justifyContent={"space-between"} p={"5%"}>
        <Button w="48%" text="Cancel" variant="secondary" onPress={handleCancel} />
        <Button w="48%" text="Confirm" variant="tertiary" onPress={handleSubmit(handleSaveEditOfAnnounced)}/>
      </Box>
    </VStack>
  )
}
import { Box, Checkbox, HStack, Radio, ScrollView, Switch, Text, VStack, useToast } from "native-base";
import { HeaderBack } from "../components/HeaderBack";
import { ImageFormAnnounced } from "../components/ImageFormAnnounced";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from "../hooks/useAuth";
import { Plus } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAnnounced } from "../hooks/useAnnounced";

const paymentsMethodsAvailables = ['boleto', 'pix', 'cash', 'deposit', 'card']

const formAnnounced = yup.object({
  name: yup.string().required('The name is required !'),
  description: yup.string().required('The description is required'),
  is_new: yup.bool().default(false),
  accept_trade: yup.bool().default(false),
  paymentMethods: yup.array(yup.string()).required(),
  price : yup.number().min(0).required('The price is required')
})

type FormAnnouncedDataProps = yup.InferType<typeof formAnnounced>

type ImageFile = {
  name: string;
  uri: string;
  type: string;
}

export function FormAnnounced() {

  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  const { setAnnounced,resetAnnounced } = useAnnounced()
  const navigation = useNavigation()

  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<FormAnnouncedDataProps>({
    defaultValues: {
      accept_trade: false ,
      description: "" ,
      is_new: false ,
      name: "" ,
      paymentMethods: [],
      price :0 
    },
    resolver: yupResolver(formAnnounced)
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

        setImages(prev => [...prev, image])

        toast.show({
          title: 'Photo updated with success',
          placement: 'bottom',
          bgColor: 'green.500'
        })
      }
    } catch (error) { }
    finally {
      setIsLoading(false)
    }
  }

  function handleRemoveMedia(position: number) {
    setImages(prev => prev.splice(position, 1))
  }

  async function handleNavigateToPreview({ price,accept_trade, description, is_new, name, paymentMethods }: FormAnnouncedDataProps) {
    setAnnounced({accept_trade,description, images,is_new,name,payment_methods : paymentMethods ,price,userId: user.id ,userImageUrl : user.avatar,userName: user.name , is_active : true })
    navigation.navigate('detailsAnnounced' as never)
  }
  
  async function handleCancel() {
    navigation.navigate('Home' as never)
    resetAnnounced()
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
            {images.map((item, index) => <ImageFormAnnounced onRemove={() => { handleRemoveMedia(index) }} uri={item.uri} />)}
            {images.length !== 3 &&
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
              render={({ field: { onChange } }) =>
                <Radio.Group onChange={e => onChange(e === "new")} name="myRadioGroup" accessibilityLabel="favorite number">
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
            render={({ field : { value, onChange} }) => <Input keyboardType="number-pad" onChangeText={onChange} value={String(value)} placeholder="price" mt={2} />}
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
                    >
                      <Text textTransform={"capitalize"}>{item}</Text>
                    </Checkbox>
                  )}
                </VStack>
              )}
              name="paymentMethods"
            />
          </VStack>
        </Box>
      </ScrollView>
      <Box w={"full"} position={"absolute"} bottom={0} bg={"gray.700"} flexDir={"row"} justifyContent={"space-between"} p={"5%"}>
        <Button w="48%" text="Cancel" variant="secondary" onPress={handleCancel}/>
        <Button w="48%" text="Confirm" variant="tertiary" onPress={handleSubmit(handleNavigateToPreview)} />
      </Box>
    </VStack>
  )
}
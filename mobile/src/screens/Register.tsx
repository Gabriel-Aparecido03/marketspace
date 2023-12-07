import { Box, ScrollView, Text, useToast } from "native-base";
import LogoSvg from '../assets/logo.svg'
import { UserPhoto } from "../components/UserPhoto";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import * as yup from 'yup'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { api } from "../services/api";
import { Loading } from "../components/Loading";

const schemaRegister = yup.object({
  name: yup.string().trim().required('The name can be empty !'),
  email: yup.string().required().email('Invalid email!'),
  phone: yup.number().required('Invalid phone !'),
  password: yup.string().trim().required('Invalid password !'),
  confirmPassword: yup.string().required('Invalid password').oneOf([yup.ref('password')], 'The password need to be equals !')
})

type FormData = yup.InferType<typeof schemaRegister>

export function Register() {

  const [ image, setImage ] = useState<any>(null)
  const [ isLoading,setIsLoading ] = useState(false)

  const navigation = useNavigation()
  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
      phone: undefined
    },
    resolver: yupResolver(schemaRegister),

  })

  async function handleSelectedImage() {
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
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const image = {
          name: `${photoSelected.assets[0].fileName ?? "a1" }.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        }
        
        if (photoInfo.exists && (photoInfo.size / 1024 / 1024 >= 5)) {
          return toast.show({
            title: 'That images size cant be pass 5 mbs',
            placement: 'bottom',
            bgColor: 'red.500'
          })
        }

        setImage(image)

        toast.show({
          title: 'Photo updated with success',
          placement: 'bottom',
          bgColor: 'green.500'
        })
      }
    } catch (error) {}
    finally {
      setIsLoading(false)
    }
  }

  async function handleMakeRegister({ email,name,password,phone }: FormData) {

    const formData = new FormData()

    formData.append('avatar',image as any)
    formData.append('name',name)
    formData.append('email',email)
    formData.append('tel',String(phone))
    formData.append('password',password)

    try {
      const res = await api.post('/users',formData,{ headers : {
        'Content-Type':'multipart/form-data'
      }})

      if(res.status === 201) {
        toast.show({
          title: 'User craeted with success',
          placement: 'bottom',
          bgColor: 'green.500'
        })
        navigation.navigate("login" as never)
      }

    } catch (error) {
      console.log(JSON.stringify(error))
      toast.show({
        title: 'Cant create user, try later !',
        placement: 'bottom',
        bgColor: 'red.500'
      })
    } finally {}
  }

  return (
  <ScrollView flex={1} pt="20%" >
    <Box alignItems={"center"} justifyContent={"center"}>
      <LogoSvg />
      <Text fontFamily={"heading"} color={"gray.100"} fontSize={"4xl"} mt={2} >Welcome !</Text>
      <Text w="80%" my={"auto"} textAlign={"center"} color={"gray.300"} fontSize={"lg"}>Create your account and use the space to buy different items and sell your products</Text>
    </Box>
    <Box alignItems={"center"} mt={4}>
      <UserPhoto onPress={handleSelectedImage} iconEdit imageUrl={image?.uri} />
    </Box>
    <Box mt={"10%"} w={"80%"} mx={"auto"}>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) =>
          <Input
            value={value}
            onChangeText={onChange}
            mb={5}
            placeholder="Name"
          />
        }
      />
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value } }) =>
          <Input
            value={value}
            onChangeText={onChange}
            mb={5}
            placeholder="Email"
          />
        }
      />
      <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, value } }) =>
          <Input
            value={value ? String(value) : ""}
            onChangeText={onChange}
            mb={5}
            placeholder="Phone"
          />
        }
      />
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) =>
          <Input
            value={value}
            onChangeText={onChange}
            mb={5}
            secureTextEntry
            placeholder="Password"
          />
        }
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field: { onChange, value } }) =>
          <Input
            value={value}
            onChangeText={onChange}
            mb={5}
            secureTextEntry
            placeholder="Confirm password"
          />
        }
      />
      <Button onPress={handleSubmit(handleMakeRegister)} variant="tertiary" text="Create" />
    </Box>
    <Box mt={"5%"} w="80%" mx="auto" flex={1} alignItems={"center"} justifyContent={"center"}>
      <Text mb={2}>Do have account </Text>
      <Button variant="secondary" text="Go to login" onPress={() => { navigation.navigate("login" as never) }} />
    </Box>
  </ScrollView>
  )
}
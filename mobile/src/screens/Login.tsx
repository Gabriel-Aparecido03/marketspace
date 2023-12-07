import { Box, Heading, ScrollView, Text, useToast } from "native-base";
import LogoSvg from '../assets/logo.svg'
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as yup from 'yup'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../hooks/useAuth";

const schemaLogin = yup.object({
  email: yup.string().required().email('Email is invalid'),
  password: yup.string().required('The password is required')
})

type LoginFormDataProps = yup.InferType<typeof schemaLogin>

export function Login() {

  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()

  const navigation = useNavigation()
  const toast = useToast()

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormDataProps>({
    resolver: yupResolver(schemaLogin),
    defaultValues: {
      email: "teste@gmail.com",
      password: "123mudar"
    }
  })

  async function handleMakeLogin({ password, email }: LoginFormDataProps) {
    try {
      setIsLoading(true)
      await signIn({ email , password })
      toast.show({
        title: 'Login make with sucess !',
        placement: 'bottom',
        bgColor: 'green.500'
      })
    } catch (error) {
      toast.show({
        title: "Email ou password is incorrect",
        placement: 'bottom',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box flex={1} bgColor={"gray.700"}>
      <Box py={"15%"} height={"70%"} pt={"20%"} alignItems={"center"} justifyContent={"space-between"} roundedBottom={"md"} bgColor={"gray.600"} >
        <Box alignItems={"center"}>
          <LogoSvg />
          <Heading fontFamily={"heading"} color={"gray.100"} fontSize={"4xl"} mt={2} >Marketspace</Heading>
          <Text color={"gray.300"} fontSize={"lg"}>Your space to sell and buy</Text>
        </Box>
        <Box w={"80%"} alignItems={"center"} justifyItems={"center"}>
          <Text mb={4} fontSize={"md"} color={"gray.200"}>Access your account </Text>
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) =>
              <Input
                placeholder="E-mail"
                mb={2}
                value={value}
                onChangeText={onChange}
              />
            }
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) =>
              <Input
                placeholder="Password"
                mb={2}
                value={value}
                onChangeText={onChange}
              />
            }
          />
          <Button isLoading={isSubmitting}  text="Sign in" variant="primary" onPress={handleSubmit(handleMakeLogin)} />
        </Box>
      </Box>
      <Box w="80%" mx="auto" flex={1} alignItems={"center"} justifyContent={"center"}>
        <Text mb={2}>Do have account</Text>
        <Button variant="secondary" text="Create account" onPress={() => { navigation.navigate("register" as never) }} />
      </Box>
    </Box>
  )
}
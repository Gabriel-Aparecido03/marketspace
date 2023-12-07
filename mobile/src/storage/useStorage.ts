import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../utils/storage_keys";

export async function setUserJWT({ jwt , refreshToken  }: { jwt: string,refreshToken:string }) {
  await AsyncStorage.setItem(StorageKeys.user , JSON.stringify({ jwt , refreshToken}))
}

export async function getUserJWT() {
  const storage = await AsyncStorage.getItem(StorageKeys.user)
  const jwtInformations = storage ? JSON.parse(storage) : null
  return jwtInformations
}

export async function removeUserJWT() {
  await AsyncStorage.removeItem(StorageKeys.user)
}
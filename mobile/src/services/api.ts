import axios from "axios";
import { getUserJWT } from "../storage/useStorage";

export const api = axios.create({
  baseURL : 'http://192.168.1.35:3333'
})

api.interceptors.request.use(
  async config => {
    const userTokens = await getUserJWT()
    config.headers.Authorization = "Bearer "+ userTokens?.jwt ?? ""
    return config
  },
  error => {
    return Promise.reject(error)
  }
);
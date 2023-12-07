import { ReactNode, createContext, useEffect, useState } from "react"
import { User } from "../interfaces/User"
import { api } from "../services/api"
import { getUserJWT, removeUserJWT, setUserJWT } from "../storage/useStorage"

type SignInProps = {
  email : string
  password : string
}

interface AuthContextProviderType { 
  children : ReactNode
}

interface AuthContextType {
  signIn : ({ email , password }:SignInProps) => Promise<void>
  signOut : () => Promise<void>
  user : User
  isAuthInProgress: boolean
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }:AuthContextProviderType) {

  const [ user, setUser ] = useState<User>({} as User)
  const [ isAuthInProgress, setIsAuthInProgress ] = useState(false)

  async function signIn({ email,password }:SignInProps) {
    try {
      setIsAuthInProgress(true)
      const res = await api.post('/sessions/',{ email,password })
      if( res.status === 201 ) {
        const  { token , refresh_token } = res.data
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        await setUserJWT({ jwt : token , refreshToken : refresh_token })
         
        const { id,avatar,name,email,tel } = res.data.user
        setUser({ id,avatar,name,email,tel  })

      }
    } catch (error) {
      console.log(error)
      throw error 
    } finally {
      setIsAuthInProgress(false)
    }
  }

  async function signOut() {
    try {
      setUser({} as User)
      await removeUserJWT()
    } catch (error) {
      throw error
    }
  }

  async function makeAutoLogin() {
    setIsAuthInProgress(true)
    const hasTokenSaved = await getUserJWT()
    if(!hasTokenSaved?.jwt) return await signOut()
    try {
      const responseNewRefreshToken = await api.post('/sessions/refresh-token',{refresh_token : hasTokenSaved.refreshToken })
      if(responseNewRefreshToken.status === 200 ) {
        api.defaults.headers.common['Authorization'] = `Bearer ${responseNewRefreshToken.data.token}`
        await setUserJWT({ jwt :responseNewRefreshToken.data.token , refreshToken : hasTokenSaved.refreshToken })
        const res = await api.get('/users/me') 
        const { id,avatar,name,email,tel } = res.data
        setUser({ id,avatar,name,email,tel })
      } 
      else { 
        await signOut()
      }
    } catch (error) {
      console.log(JSON.stringify(error))
      throw error
    } 
    finally {
      setIsAuthInProgress(false)
    }
  }

  useEffect(()=>{ 
    makeAutoLogin()
  },[])

  return (
    <AuthContext.Provider value={{ user, signIn ,signOut, isAuthInProgress }}>
      { children }
    </AuthContext.Provider>
  )
}
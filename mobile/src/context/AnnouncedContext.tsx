import { ReactNode, createContext, useState } from "react";
import { api } from "../services/api";

type AnnouncedType = {
  id?: string;
  name: string;
  description: string;
  is_new: boolean;
  accept_trade: boolean;
  payment_methods: (string | undefined)[];
  images: any[]
  userName : string
  userId : string
  userImageUrl : string
  price : number
  is_active : boolean
}

type EditAnnouncedParamsType = {
  id?: string;
  name: string;
  description: string;
  is_new: boolean;
  accept_trade: boolean;
  payment_methods: (string | undefined)[];
  images: any[]
  price : number
  is_active : boolean
}

interface AnnouncedContextType {
  announced : AnnouncedType | null,
  isProcessing : boolean
  setAnnounced : (data : AnnouncedType) => void
  removeAnnounced : () => Promise<void>
  changeVisibilityOfAnnounced : () => Promise<void>
  publishAnnounced : () => Promise<void>
  resetAnnounced : () => void
  editAnnounced : (data : EditAnnouncedParamsType) => Promise<void>
}

interface AnnouncedContextProviderType {
  children : ReactNode
}

export const AnnouncedContext = createContext({} as AnnouncedContextType)

export function AnnouncedContextProvider({ children }:AnnouncedContextProviderType) {

  const [ announced , setAnnounced ] = useState<AnnouncedType | null>(null)
  const [ isProcessing, setIsProcessing ] = useState(false)

  async function removeAnnounced() {
    try {
      setIsProcessing(true)
      await api.delete(`/products/${announced?.id}`)
    } catch (error) {
      console.log(JSON.stringify(error))
    } finally {
      setIsProcessing(false)
    }
  }

  async function changeVisibilityOfAnnounced() {
    try {
      setIsProcessing(true)
      await api.patch(`/products/${announced?.id}`,{ is_active : !announced?.is_active})
    } catch (error) {
      console.log(JSON.stringify(error))
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  async function publishAnnounced() {
    const { accept_trade,description,images,is_new,name,payment_methods,price  } = announced!
    try {
      setIsProcessing(true)
      const resProduct = await api.post('/products/',{ name, description,is_new,price, accept_trade, payment_methods })
      if(resProduct.status === 201 ) {
        const { id } = resProduct.data
        const formData = new FormData()
        
        images.map( item => formData.append('images',item as any))

        formData.append("product_id",id)
        await api.post('/products/images/',formData,{ headers : { 'Content-Type':'multipart/form-data' }})
      }
    } catch (error) {
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  async function editAnnounced(data:EditAnnouncedParamsType) {
    try {
      setIsProcessing(true)
      await api.put(`/products/${announced!.id}`, data )
    } catch (error) {
      console.log(JSON.stringify(error))
    } finally {
      setIsProcessing(false)
    }
  }

  function resetAnnounced() {
    setAnnounced(null)
  }

  return (
    <AnnouncedContext.Provider value={{ editAnnounced , isProcessing , announced,changeVisibilityOfAnnounced,publishAnnounced,removeAnnounced,setAnnounced, resetAnnounced}}>
      { children }
    </AnnouncedContext.Provider>
  )
}
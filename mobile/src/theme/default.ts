import { extendTheme } from "native-base";

export const theme = extendTheme({
  colors : {
    blue : {
      100 : '#647AC7',
      500 : '#364D9D'
    },
    red : {
      500 : '#EE7979'
    },
    gray : {
      100: "#1A181B" ,
      200: "#3E3A40" ,
      300: "#5F5B62" ,
      400: "#9F9BA1" ,
      500: "#D9D8DA" ,
      600: "#EDECEE" ,
      700: "#F7F7F8" ,
    }
  },
  fontSizes : {
    sm : 12,
    md : 14,
    lg : 16,
    xl : 20,
    "2xl": 24
  },
  fonts: {
    heading: 'Karla_700Bold',
    body: 'Karla_400Regular',
  },
})
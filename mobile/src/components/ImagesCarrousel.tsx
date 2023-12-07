import { Box, Center, Image, Text } from "native-base";
import Carousel from "react-native-reanimated-carousel";
import { api } from "../services/api";
import { useSafeAreaFrame } from "react-native-safe-area-context";

interface ImagesCarrousel {
  images: string[]
  isActive: boolean
}

export function ImagesCarrousel({ images, isActive }: ImagesCarrousel) {

  const { width } = useSafeAreaFrame()

  return (
    <Center position={"relative"}>
      <Carousel
        loop={false}
        data={images}
        style={{ position: "relative" }}
        renderItem={({ item, index }) =>
          <Box position={"relative"} justifyContent={"center"} alignItems={"center"}>
            <Box width={width} key={index} height={340}>
              <Image opacity={ isActive ? 1 : 0.2} backgroundColor={"black"} zIndex={9} alt="" width={width} source={{ uri: `${api.defaults.baseURL}/images/${item.path}` }} flex={1} />
            </Box>
            { !isActive && <Center position={"absolute"}><Text color={"white"} fontSize={"2xl"} fontWeight={"bold"} textTransform={"uppercase"}>Announced Disabled</Text></Center>}
          </Box>
        }
        width={width}
        height={360}
      />
    </Center>
  )
}
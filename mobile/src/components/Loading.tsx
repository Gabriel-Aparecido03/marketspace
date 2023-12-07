import { Box, Spinner } from "native-base";

export function Loading() {
  return (
    <Box flex={1} bg={"gray.600"} justifyContent={"center"} alignItems={"center"}>
      <Spinner color={"blue.500"}/>
    </Box>
  )
}
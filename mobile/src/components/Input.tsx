import { FormControl, Input as InputBase, IInputProps, Box } from "native-base"
import { ReactNode } from "react"

type Props = IInputProps & {
  errorMessage?: string | null
  children ?: ReactNode
}

export function Input({ errorMessage, children ,isInvalid,mb, ...rest }: Props) {
  return (
    <FormControl>
      <Box
        backgroundColor={"gray.700"}
        borderRadius={"md"}
        borderWidth={"1"}
        borderColor={isInvalid ? "red.500" : "gray.700"}
        flexDir={"row"}
        alignItems={"center"}
        mb={mb}
      >
        <InputBase
          minH={10}
          paddingX={4}
          paddingY={3}
          borderWidth={0}
          flex={1}
          {...rest}
        />
        { children && children }
      </Box>
      <FormControl.ErrorMessage>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
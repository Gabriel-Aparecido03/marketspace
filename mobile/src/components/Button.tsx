import { Button as ButtonBase, IContainerProps, Text } from 'native-base'

type Props = {
  variant? : "primary" | "secondary" | "tertiary"
  onPress?: () => void
  text?: string
  w?: string
  isLoading ?: boolean
}

export function Button({ isLoading=false,onPress,w,text,variant="primary" }:Props) {
  const variantSelected = {
    primary : ["blue.100","gray.700"],
    secondary : ["gray.500","gray.200"],
    tertiary : ["gray.100","gray.700"]
  }

  return (
    <ButtonBase
      bgColor={variantSelected[variant][0]}
      padding={3}
      rounded={"md"}
      w={w ?? "full"}
      onPress={onPress}
      isLoading={isLoading}
    >
      <Text 
        fontFamily={"heading"} 
        color={variantSelected[variant][1]}
      > 
        { text } 
      </Text>
    </ButtonBase>
  )
}
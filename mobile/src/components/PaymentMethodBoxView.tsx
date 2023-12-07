import { HStack, Text } from "native-base"
import { Bank, Barcode, CreditCard, Money, QrCode } from "phosphor-react-native"

type PaymentMethodBoxView = {
  methods: "boleto" | "pix" | "money" | "card" | "deposit"
}

export function PaymentMethodBoxView({ methods  }:PaymentMethodBoxView ){

  const objMappingMethods = {
    boleto: { icon: <Barcode />, text: "Bolet" },
    pix: { icon: <QrCode />, text: "Pix" },
    money: { icon: <Money />, text: "Cash" },
    card: { icon: <CreditCard />, text: "Card" },
    deposit: { icon: <Bank />, text: "Deposit" }
  } as const
  return (
    <HStack mt={2} alignItems={"center"}>
      { objMappingMethods[methods].icon ?? ""}
      <Text ml={3}>{objMappingMethods[methods].text ?? ""}</Text>
    </HStack>
  )
}
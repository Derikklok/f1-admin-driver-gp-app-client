"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { system } from "../../theme"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { ParticipationProvider } from "../../context/ParticipationContext"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ParticipationProvider>
        <ColorModeProvider {...props} />
      </ParticipationProvider>
    </ChakraProvider>
  )
}

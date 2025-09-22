import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Custom teal color palette
        brand: {
          50: { value: "#e6fffa" },
          100: { value: "#b2f5ea" },
          200: { value: "#81e6d9" },
          300: { value: "#4fd1c7" },
          400: { value: "#38b2ac" },
          500: { value: "#319795" },
          600: { value: "#2c7a7b" },
          700: { value: "#285e61" },
          800: { value: "#234e52" },
          900: { value: "#1d4044" },
        },
        // Override Chakra's default teal with our brand colors
        teal: {
          50: { value: "#e6fffa" },
          100: { value: "#b2f5ea" },
          200: { value: "#81e6d9" },
          300: { value: "#4fd1c7" },
          400: { value: "#38b2ac" },
          500: { value: "#319795" },
          600: { value: "#2c7a7b" },
          700: { value: "#285e61" },
          800: { value: "#234e52" },
          900: { value: "#1d4044" },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Set primary color to use our teal palette
        "color-palette.50": { value: "{colors.teal.50}" },
        "color-palette.100": { value: "{colors.teal.100}" },
        "color-palette.200": { value: "{colors.teal.200}" },
        "color-palette.300": { value: "{colors.teal.300}" },
        "color-palette.400": { value: "{colors.teal.400}" },
        "color-palette.500": { value: "{colors.teal.500}" },
        "color-palette.600": { value: "{colors.teal.600}" },
        "color-palette.700": { value: "{colors.teal.700}" },
        "color-palette.800": { value: "{colors.teal.800}" },
        "color-palette.900": { value: "{colors.teal.900}" },
        
        // Define proper semantic tokens for light/dark mode
        "bg": {
          value: { base: "white", _dark: "gray.900" }
        },
        "fg": {
          value: { base: "gray.900", _dark: "gray.100" }
        },
        "border": {
          value: { base: "gray.200", _dark: "gray.700" }
        },
      },
    },
  },
})

// Create the theme system
export const system = createSystem(defaultConfig, customConfig)
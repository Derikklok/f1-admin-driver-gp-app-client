import { Box, HStack, Text, Button } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { useColorMode } from "./ui/color-mode"
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Shield, 
  Moon, 
  Sun,
  Car 
} from "lucide-react"

const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/drivers", label: "Drivers", icon: Users },
    { path: "/races", label: "Races", icon: Trophy },
    { path: "/teams", label: "Teams", icon: Shield },
  ]

  const isActive = (path: string) => location.pathname === path || (path === "/dashboard" && location.pathname === "/")

  return (
    <Box
      as="nav"
      bg={{ base: "white", _dark: "gray.800" }}
      borderBottom="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      px={8}
      py={4}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      <HStack justify="space-between" w="full">
        {/* Logo/Brand - Left */}
        <HStack cursor="pointer" onClick={() => navigate("/dashboard")}>
          <Car size={24} color="#319795" />
          <Text 
            fontSize="2xl" 
            fontWeight="bold" 
            color="teal.600"
          >
            F1 Admin
          </Text>
        </HStack>

        {/* Navigation Links - Center */}
        <HStack gap={6}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              color={
                isActive(path)
                  ? "teal.500"
                  : { base: "gray.700", _dark: "gray.300" }
              }
              bg={
                isActive(path)
                  ? { base: "teal.50", _dark: "teal.900" }
                  : "transparent"
              }
              _hover={{
                color: "teal.500",
                bg: { base: "gray.100", _dark: "gray.700" }
              }}
            >
              <HStack gap={2}>
                <Icon size={16} />
                <Text>{label}</Text>
              </HStack>
            </Button>
          ))}
        </HStack>

        {/* Theme Toggle - Right */}
        <Button 
          onClick={toggleColorMode} 
          variant="outline"
          size="sm"
          colorPalette="teal"
        >
          {colorMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
      </HStack>
    </Box>
  )
}

export default Navbar
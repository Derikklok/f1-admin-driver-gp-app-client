
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react"
import { Users } from "lucide-react"

const Drivers = () => {
  return (
    <Box p={8} display="flex" justifyContent="center" alignItems="flex-start" minH="calc(100vh - 80px)">
      <VStack gap={6} align="center" maxW="4xl" w="full">
        <HStack gap={3}>
          <Users size={32} color="#319795" />
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">
            Drivers
          </Text>
        </HStack>
        
        <Text fontSize="lg" color={{ base: "gray.600", _dark: "gray.400" }} textAlign="center">
          Manage Formula 1 drivers, their profiles, and performance statistics.
        </Text>
        
        <HStack gap={4}>
          <Button colorPalette="teal" variant="solid">
            Add New Driver
          </Button>
          <Button colorPalette="teal" variant="outline">
            View All Drivers
          </Button>
        </HStack>
        
        <Box 
          p={4} 
          bg={{ base: "teal.50", _dark: "teal.900" }} 
          borderRadius="lg" 
          borderLeft="4px" 
          borderColor="teal.500"
          w="full"
          maxW="2xl"
        >
          <Text fontWeight="semibold" color={{ base: "teal.700", _dark: "teal.300" }}>
            Driver Management
          </Text>
          <Text color={{ base: "teal.600", _dark: "teal.400" }}>
            Track driver performance, manage contracts, and update driver information.
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default Drivers
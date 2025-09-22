

import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react"
import { LayoutDashboard } from "lucide-react"

const Dashboard = () => {
  return (
    <Box p={8} display="flex" justifyContent="center" alignItems="flex-start" minH="calc(100vh - 80px)">
      <VStack gap={6} align="center" maxW="4xl" w="full">
        <HStack gap={3}>
          <LayoutDashboard size={32} color="#319795" />
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">
            Dashboard
          </Text>
        </HStack>
        
        <Text fontSize="lg" color={{ base: "gray.600", _dark: "gray.400" }} textAlign="center">
          Welcome to the F1 Admin Dashboard. Monitor and manage your Formula 1 data.
        </Text>
        
        <HStack gap={4}>
          <Button colorPalette="teal" variant="solid">
            View Statistics
          </Button>
          <Button colorPalette="teal" variant="outline">
            Generate Report
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
            Quick Overview
          </Text>
          <Text color={{ base: "teal.600", _dark: "teal.400" }}>
            Your F1 admin dashboard is ready. Navigate to different sections using the navbar above.
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default Dashboard
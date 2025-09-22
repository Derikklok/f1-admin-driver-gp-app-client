
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Table,
  Badge,
  Spinner,
  Alert,
  Flex,
  IconButton,
  Tooltip
} from "@chakra-ui/react"
import { Users, Edit, Trash2, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import type { Driver } from "../types/driver"
import { AddDriverModal } from '../components/models/AddDriverModal'
import { EditDriverModal } from '../components/models/EditDriverModal'
import { ViewDriverModal } from '../components/models/ViewDriverModal'

// Temporary inline API functions until service import is resolved
const API_BASE_URL = 'http://localhost:5251/api'

const getAllDrivers = async (): Promise<Driver[]> => {
  const response = await fetch(`${API_BASE_URL}/drivers`)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  const apiResponse = await response.json()
  return apiResponse.$values || []
}

const deleteDriver = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      setError(null)
      const driversData = await getAllDrivers()
      setDrivers(driversData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drivers')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDriver = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(id)
        await fetchDrivers() // Refresh the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete driver')
      }
    }
  }

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver)
    setIsEditModalOpen(true)
  }

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver)
    setIsViewModalOpen(true)
  }

  const handleDriverAdded = () => {
    fetchDrivers() // Refresh the drivers list
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  if (loading) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="calc(100vh - 80px)">
        <VStack gap={4}>
          <Spinner size="xl" color="teal.500" />
          <Text color={{ base: "gray.600", _dark: "gray.400" }}>Loading drivers...</Text>
        </VStack>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="flex-start" minH="calc(100vh - 80px)">
        <Alert.Root status="error" maxW="2xl">
          <Alert.Indicator />
          <Box>
            <Alert.Title>Error!</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Box>
        </Alert.Root>
      </Box>
    )
  }

  return (
    <Box p={8} display="flex" justifyContent="center" alignItems="flex-start" minH="calc(100vh - 80px)">
      <VStack gap={6} align="center" maxW="6xl" w="full">
        {selectedDriver && (
          <>
            <EditDriverModal 
              driver={selectedDriver} 
              isOpen={isEditModalOpen} 
              onClose={() => setIsEditModalOpen(false)} 
              onDriverUpdated={() => {
                setIsEditModalOpen(false)
                fetchDrivers()
              }} 
            />
            
            <ViewDriverModal
              driver={selectedDriver}
              isOpen={isViewModalOpen}
              onClose={() => setIsViewModalOpen(false)}
            />
          </>
        )}
      
        <HStack gap={3}>
          <Users size={32} color="#319795" />
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">
            Drivers Management
          </Text>
        </HStack>
        
        <Text fontSize="lg" color={{ base: "gray.600", _dark: "gray.400" }} textAlign="center">
          Manage Formula 1 drivers, their profiles, and performance statistics.
        </Text>
        
        <Flex justify="space-between" w="full" align="center">
          <Text fontSize="md" color={{ base: "gray.600", _dark: "gray.400" }}>
            Total Drivers: {drivers.length}
          </Text>
          <AddDriverModal onDriverAdded={handleDriverAdded} />
        </Flex>

        {drivers.length === 0 ? (
          <Box 
            p={8} 
            bg={{ base: "gray.50", _dark: "gray.800" }} 
            borderRadius="lg" 
            textAlign="center"
            w="full"
          >
            <Users size={48} color="#319795" style={{ margin: "0 auto 16px" }} />
            <Text fontSize="xl" fontWeight="semibold" color={{ base: "gray.700", _dark: "gray.300" }} mb={2}>
              No Drivers Found
            </Text>
            <Text color={{ base: "gray.600", _dark: "gray.400" }} mb={4}>
              Get started by adding your first F1 driver to the system.
            </Text>
            <AddDriverModal onDriverAdded={handleDriverAdded} />
          </Box>
        ) : (
          <Box 
            w="full" 
            overflowX="auto" 
            bg={{ base: "white", _dark: "gray.800" }} 
            borderRadius="lg" 
            boxShadow="sm"
            border="1px"
            borderColor={{ base: "gray.200", _dark: "gray.700" }}
          >
            <Table.Root size="md">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Driver #</Table.ColumnHeader>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Acronym</Table.ColumnHeader>
                  <Table.ColumnHeader>Team</Table.ColumnHeader>
                  <Table.ColumnHeader>Participations</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {drivers.map((driver) => (
                  <Table.Row key={driver.id}>
                    <Table.Cell>
                      <Badge colorPalette="teal" variant="solid">
                        #{driver.driverNumber}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="semibold">
                          {driver.firstName} {driver.lastName}
                        </Text>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="gray" variant="outline">
                        {driver.acronym}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color={{ base: "gray.700", _dark: "gray.300" }}>
                        {driver.teamName}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="blue" variant="subtle">
                        {driver.participations?.$values?.length || 0} races
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={1} justify="center">
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <IconButton 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleViewDriver(driver)}
                            >
                              <Eye size={16} />
                            </IconButton>
                          </Tooltip.Trigger>
                          <Tooltip.Positioner>
                            <Tooltip.Content>View Details</Tooltip.Content>
                          </Tooltip.Positioner>
                        </Tooltip.Root>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <IconButton 
                              size="sm" 
                              variant="ghost" 
                              colorPalette="blue"
                              onClick={() => handleEditDriver(driver)}
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip.Trigger>
                          <Tooltip.Positioner>
                            <Tooltip.Content>Edit Driver</Tooltip.Content>
                          </Tooltip.Positioner>
                        </Tooltip.Root>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <IconButton 
                              size="sm" 
                              variant="ghost" 
                              colorPalette="red"
                              onClick={() => handleDeleteDriver(driver.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip.Trigger>
                          <Tooltip.Positioner>
                            <Tooltip.Content>Delete Driver</Tooltip.Content>
                          </Tooltip.Positioner>
                        </Tooltip.Root>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default Drivers
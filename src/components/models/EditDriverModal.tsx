import { useState } from 'react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogBackdrop,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Box
} from '@chakra-ui/react'
import { Edit } from 'lucide-react'
import type { Driver } from '../../types/driver'

// Temporary inline service until import issue is resolved
const API_BASE_URL = 'http://localhost:5251/api'

const updateDriver = async (id: number, driverData: any) => {
  const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(driverData),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorText}`)
  }
  
  return response.json()
}

interface EditDriverModalProps {
  driver: Driver
  isOpen: boolean
  onClose: () => void
  onDriverUpdated: () => void
}

interface DriverFormData {
  driverNumber: string
  firstName: string
  lastName: string
  acronym: string
  teamName: string
}

export const EditDriverModal = ({ driver, isOpen, onClose, onDriverUpdated }: EditDriverModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<DriverFormData>({
    driverNumber: driver.driverNumber.toString(),
    firstName: driver.firstName,
    lastName: driver.lastName,
    acronym: driver.acronym,
    teamName: driver.teamName
  })

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = (): boolean => {
    if (!formData.driverNumber.trim()) {
      setError('Driver number is required')
      return false
    }
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!formData.acronym.trim()) {
      setError('Acronym is required')
      return false
    }
    if (!formData.teamName.trim()) {
      setError('Team name is required')
      return false
    }
    
    // Validate driver number is numeric
    if (isNaN(Number(formData.driverNumber))) {
      setError('Driver number must be a valid number')
      return false
    }

    // Validate acronym length (typically 3 characters)
    if (formData.acronym.length !== 3) {
      setError('Acronym must be exactly 3 characters')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const driverData = {
        id: driver.id,
        driverNumber: Number(formData.driverNumber),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        acronym: formData.acronym.trim().toUpperCase(),
        teamName: formData.teamName.trim()
      }

      await updateDriver(driver.id, driverData)
      
      onClose()
      onDriverUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update driver')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogBackdrop style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 50,
        backdropFilter: 'blur(4px)'
      }} />
      
      <DialogContent 
        position="fixed" 
        top="50%" 
        left="50%" 
        style={{ 
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          width: '95%',
          maxWidth: '500px',
          zIndex: 51,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderTop: '4px solid',
          borderColor: '#3182ce'
        }}
        bg={{ base: "white", _dark: "gray.800" }}
      >
        <DialogHeader borderBottom="1px" borderColor={{ base: "gray.100", _dark: "gray.700" }} pb={3}>
          <HStack gap={2} align="center">
            <Box color="blue.500">
              <Edit size={20} />
            </Box>
            <DialogTitle fontSize="xl" fontWeight="bold">Edit Driver</DialogTitle>
          </HStack>
        </DialogHeader>
        
        <DialogBody>
          <VStack gap={4} align="stretch">
            {error && (
              <Box 
                p={3} 
                bg="red.50" 
                border="1px solid" 
                borderColor="red.200" 
                borderRadius="md"
                color="red.700"
              >
                {error}
              </Box>
            )}
            
            <VStack gap={3} align="stretch">
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Driver Number</Text>
                <Input
                  placeholder="e.g., 85"
                  value={formData.driverNumber}
                  onChange={(e) => handleInputChange('driverNumber', e.target.value)}
                  type="number"
                  borderColor={{ _focus: "blue.400" }}
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">First Name</Text>
                <Input
                  placeholder="e.g., Charles"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  borderColor={{ _focus: "blue.400" }}
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Last Name</Text>
                <Input
                  placeholder="e.g., Leclerc"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  borderColor={{ _focus: "blue.400" }}
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Acronym (3 letters)</Text>
                <Input
                  placeholder="e.g., CHL"
                  value={formData.acronym}
                  onChange={(e) => handleInputChange('acronym', e.target.value)}
                  maxLength={3}
                  style={{ textTransform: 'uppercase' }}
                  borderColor={{ _focus: "blue.400" }}
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Team Name</Text>
                <Input
                  placeholder="e.g., Ferrari"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  borderColor={{ _focus: "blue.400" }}
                />
              </VStack>
            </VStack>
          </VStack>
        </DialogBody>
        
        <DialogFooter borderTop="1px" borderColor={{ base: "gray.100", _dark: "gray.700" }} p={4}>
          <HStack gap={3} justify="flex-end" w="full">
            <DialogActionTrigger asChild>
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button 
              colorPalette="blue" 
              onClick={handleSubmit}
              loading={isLoading}
              loadingText="Updating..."
            >
              Update Driver
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
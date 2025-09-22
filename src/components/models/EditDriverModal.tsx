import { useState, useEffect } from 'react'
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
  
  // Update form data when driver changes
  useEffect(() => {
    if (driver) {
      setFormData({
        driverNumber: driver.driverNumber.toString(),
        firstName: driver.firstName,
        lastName: driver.lastName,
        acronym: driver.acronym,
        teamName: driver.teamName
      })
    }
  }, [driver])

  const [activeField, setActiveField] = useState<keyof DriverFormData | null>(null)
  
  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Set active field for enhanced focus styles
    setActiveField(field)
    // Clear error when user starts typing
    if (error) setError(null)
  }
  
  const handleInputFocus = (field: keyof DriverFormData) => {
    setActiveField(field)
  }
  
  const handleInputBlur = () => {
    setActiveField(null)
  }
  
  // Add global styles for animations
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes dialogSlideIn {
        from { opacity: 0; transform: translate(-50%, -45%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }
      @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.02); opacity: 0.95; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes borderGlow {
        0% { box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.3); }
        70% { box-shadow: 0 0 0 6px rgba(49, 130, 206, 0); }
        100% { box-shadow: 0 0 0 0 rgba(49, 130, 206, 0); }
      }
      .active-input {
        animation: borderGlow 2s ease-out;
      }
    `
    // Check if the style already exists to prevent duplicates
    const existingStyle = document.getElementById('f1-admin-animations')
    if (!existingStyle) {
      style.id = 'f1-admin-animations'
      document.head.appendChild(style)
    }
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
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        zIndex: 50,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
        WebkitBackdropFilter: 'blur(4px)', // For Safari support
        transition: 'opacity 0.2s ease'
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          borderTop: '4px solid',
          borderColor: '#3182ce',
          animation: 'dialogSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: '8px',
          opacity: 1
        }}
        bg={{ base: "white", _dark: "gray.800" }}
      >
        <DialogHeader 
          borderBottom="1px" 
          borderColor={{ base: "gray.100", _dark: "gray.700" }} 
          pb={4} 
          pt={4} 
          px={5} 
          style={{
            background: 'linear-gradient(to right, rgba(49, 130, 206, 0.05), transparent)',
          }}
        >
          <HStack gap={2} align="center">
            <Box 
              color="blue.500" 
              p={2} 
              borderRadius="full" 
              bg="blue.50" 
              _dark={{ bg: "blue.900" }}
              style={{ animation: 'pulse 0.5s ease-out' }}
            >
              <Edit size={20} />
            </Box>
            <DialogTitle fontSize="xl" fontWeight="bold">Edit Driver</DialogTitle>
          </HStack>
        </DialogHeader>
        
        <DialogBody px={5} py={4}>
          <VStack gap={4} align="stretch">
            {error && (
              <Box 
                p={4} 
                bg="red.50" 
                border="1px solid" 
                borderColor="red.200" 
                borderRadius="md"
                color="red.700"
                style={{ 
                  animation: 'pulse 0.3s ease-out',
                  boxShadow: '0 2px 4px rgba(255, 0, 0, 0.06)'
                }}
                _dark={{
                  bg: 'rgba(254, 178, 178, 0.15)',
                  color: 'red.300',
                  borderColor: 'red.400'
                }}
              >
                <HStack gap={2} align="flex-start">
                  <Box mt={0.5}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </Box>
                  <Text fontWeight="medium">{error}</Text>
                </HStack>
              </Box>
            )}
            
            <VStack gap={3} align="stretch">
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Driver Number</Text>
                <Input
                  placeholder="e.g., 85"
                  value={formData.driverNumber}
                  onChange={(e) => handleInputChange('driverNumber', e.target.value)}
                  onFocus={() => handleInputFocus('driverNumber')}
                  onBlur={handleInputBlur}
                  type="number"
                  borderColor={activeField === 'driverNumber' ? "blue.500" : { _focus: "blue.400" }}
                  boxShadow={activeField === 'driverNumber' ? "0 0 0 1px var(--chakra-colors-blue-500)" : "none"}
                  aria-label="Driver number"
                  aria-required="true"
                  className={activeField === 'driverNumber' ? 'active-input' : ''}
                  _hover={{ borderColor: 'blue.300' }}
                  transition="all 0.2s"
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">First Name</Text>
                <Input
                  placeholder="e.g., Charles"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onFocus={() => handleInputFocus('firstName')}
                  onBlur={handleInputBlur}
                  borderColor={activeField === 'firstName' ? "blue.500" : { _focus: "blue.400" }}
                  boxShadow={activeField === 'firstName' ? "0 0 0 1px var(--chakra-colors-blue-500)" : "none"}
                  aria-label="First name"
                  aria-required="true"
                  className={activeField === 'firstName' ? 'active-input' : ''}
                  _hover={{ borderColor: 'blue.300' }}
                  transition="all 0.2s"
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Last Name</Text>
                <Input
                  placeholder="e.g., Leclerc"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onFocus={() => handleInputFocus('lastName')}
                  onBlur={handleInputBlur}
                  borderColor={activeField === 'lastName' ? "blue.500" : { _focus: "blue.400" }}
                  boxShadow={activeField === 'lastName' ? "0 0 0 1px var(--chakra-colors-blue-500)" : "none"}
                  aria-label="Last name"
                  aria-required="true"
                  className={activeField === 'lastName' ? 'active-input' : ''}
                  _hover={{ borderColor: 'blue.300' }}
                  transition="all 0.2s"
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Acronym (3 letters)</Text>
                <Input
                  placeholder="e.g., CHL"
                  value={formData.acronym}
                  onChange={(e) => handleInputChange('acronym', e.target.value)}
                  onFocus={() => handleInputFocus('acronym')}
                  onBlur={handleInputBlur}
                  maxLength={3}
                  style={{ textTransform: 'uppercase' }}
                  borderColor={activeField === 'acronym' ? "blue.500" : { _focus: "blue.400" }}
                  boxShadow={activeField === 'acronym' ? "0 0 0 1px var(--chakra-colors-blue-500)" : "none"}
                  aria-label="Acronym"
                  aria-required="true"
                  aria-description="Must be exactly 3 letters"
                  className={activeField === 'acronym' ? 'active-input' : ''}
                  _hover={{ borderColor: 'blue.300' }}
                  transition="all 0.2s"
                  fontWeight="medium"
                />
              </VStack>
              
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="medium">Team Name</Text>
                <Input
                  placeholder="e.g., Ferrari"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  onFocus={() => handleInputFocus('teamName')}
                  onBlur={handleInputBlur}
                  borderColor={activeField === 'teamName' ? "blue.500" : { _focus: "blue.400" }}
                  boxShadow={activeField === 'teamName' ? "0 0 0 1px var(--chakra-colors-blue-500)" : "none"}
                  aria-label="Team name"
                  aria-required="true"
                  className={activeField === 'teamName' ? 'active-input' : ''}
                  _hover={{ borderColor: 'blue.300' }}
                  transition="all 0.2s"
                />
              </VStack>
            </VStack>
          </VStack>
        </DialogBody>
        
        <DialogFooter 
          borderTop="1px" 
          borderColor={{ base: "gray.100", _dark: "gray.700" }} 
          p={4}
          px={5}
          bg={{ base: "gray.50", _dark: "gray.900" }}
        >
          <HStack gap={3} justify="flex-end" w="full">
            <DialogActionTrigger asChild>
              <Button 
                variant="outline" 
                onClick={onClose}
                _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
                transition="all 0.2s"
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button 
              colorPalette="blue" 
              onClick={handleSubmit}
              loading={isLoading}
              loadingText="Updating..."
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
              transition="all 0.2s"
            >
              Update Driver
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
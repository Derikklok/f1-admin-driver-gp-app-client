import { useState } from 'react'
import {
  DialogRoot,
  DialogTrigger,
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
import { Plus } from 'lucide-react'

// Temporary inline service until import issue is resolved
const API_BASE_URL = 'http://localhost:5251/api'

const createDriver = async (driverData: any) => {
  const response = await fetch(`${API_BASE_URL}/drivers`, {
    method: 'POST',
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

interface AddDriverModalProps {
  onDriverAdded: () => void
}

interface DriverFormData {
  driverNumber: string
  firstName: string
  lastName: string
  acronym: string
  teamName: string
}

export const AddDriverModal = ({ onDriverAdded }: AddDriverModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeField, setActiveField] = useState<keyof DriverFormData | null>(null)
  const [formData, setFormData] = useState<DriverFormData>({
    driverNumber: '',
    firstName: '',
    lastName: '',
    acronym: '',
    teamName: ''
  })
  
  // Add global styles for animations
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes dialogSlideIn {
        from { opacity: 0; transform: translate(-50%, -48%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }
      @keyframes pulse {
        0% { transform: scale(0.6); opacity: 0.4; }
        100% { transform: scale(1); opacity: 1; }
      }
    `
    // Check if the style already exists to prevent duplicates
    const existingStyle = document.getElementById('f1-admin-animations')
    if (!existingStyle) {
      style.id = 'f1-admin-animations'
      document.head.appendChild(style)
    }
  }

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

  const validateForm = (): boolean => {
    // Required fields validation
    if (!formData.driverNumber.trim()) {
      setError('Driver number is required')
      setActiveField('driverNumber')
      return false
    }
    if (!formData.firstName.trim()) {
      setError('First name is required')
      setActiveField('firstName')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      setActiveField('lastName')
      return false
    }
    if (!formData.acronym.trim()) {
      setError('Acronym is required')
      setActiveField('acronym')
      return false
    }
    if (!formData.teamName.trim()) {
      setError('Team name is required')
      setActiveField('teamName')
      return false
    }
    
    // Format validation
    if (isNaN(Number(formData.driverNumber))) {
      setError('Driver number must be a valid number')
      setActiveField('driverNumber')
      return false
    }
    
    // Range validation for driver number (typically 1-99)
    const driverNum = Number(formData.driverNumber)
    if (driverNum < 1 || driverNum > 99) {
      setError('Driver number must be between 1 and 99')
      setActiveField('driverNumber')
      return false
    }

    // Validate acronym length and format
    if (formData.acronym.length !== 3) {
      setError('Acronym must be exactly 3 characters')
      setActiveField('acronym')
      return false
    }
    
    // Acronym should only contain letters
    if (!/^[A-Za-z]+$/.test(formData.acronym)) {
      setError('Acronym must contain only letters')
      setActiveField('acronym')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)
    setActiveField(null)

    try {
      const driverData = {
        driverNumber: Number(formData.driverNumber),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        acronym: formData.acronym.trim().toUpperCase(),
        teamName: formData.teamName.trim()
      }

      // Add timeout to ensure the request doesn't hang indefinitely
      await Promise.race([
        createDriver(driverData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout. Please try again.')), 10000)
        )
      ]);
      
      // Reset form
      setFormData({
        driverNumber: '',
        firstName: '',
        lastName: '',
        acronym: '',
        teamName: ''
      })
      
      setIsOpen(false)
      onDriverAdded()
    } catch (err) {
      console.error('Error creating driver:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create driver. Please try again.';
      
      setError(errorMessage);
      
      // If it's a network error, provide more helpful message
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      driverNumber: '',
      firstName: '',
      lastName: '',
      acronym: '',
      teamName: ''
    })
    setError(null)
    setIsOpen(false)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette="teal" size="sm">
          <Plus size={16} />
          Add New Driver
        </Button>
      </DialogTrigger>
      
      <DialogBackdrop 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 50,
          backdropFilter: 'blur(4px)',
          animation: isOpen ? 'fadeIn 0.2s ease-out' : 'none',
        }} 
      />
      
      <DialogContent 
        position="fixed" 
        top="50%" 
        left="50%" 
        style={{ 
          maxHeight: '90vh',
          overflowY: 'auto',
          width: '95%',
          maxWidth: '500px',
          zIndex: 51,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderTop: '4px solid',
          borderColor: '#319795',
          animation: isOpen ? 'dialogSlideIn 0.3s ease-out forwards' : 'none',
          opacity: 0,
          transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, -48%)'
        }}
        bg={{ base: "white", _dark: "gray.800" }}
        aria-labelledby="add-driver-dialog-title"
        aria-describedby="add-driver-dialog-description"
      >
        <DialogHeader borderBottom="1px" borderColor={{ base: "gray.100", _dark: "gray.700" }} pb={3}>
          <HStack gap={2} align="center">
            <Box color="teal.500">
              <Plus size={20} />
            </Box>
            <DialogTitle id="add-driver-dialog-title" fontSize="xl" fontWeight="bold">Add New Driver</DialogTitle>
          </HStack>
        </DialogHeader>
        
        <DialogBody>
          <Text id="add-driver-dialog-description" mb={4} color={{ base: "gray.600", _dark: "gray.400" }}>
            Enter the driver details to add a new Formula 1 driver to the database.
          </Text>
        
          <VStack gap={4} align="stretch">
            {error && (
              <Box 
                p={3} 
                bg="red.50" 
                border="1px solid" 
                borderColor="red.200" 
                borderRadius="md"
                color="red.700"
                role="alert"
                aria-live="assertive"
              >
                <HStack>
                  <Text fontWeight="medium">Error:</Text>
                  <Text>{error}</Text>
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
                  borderColor={activeField === 'driverNumber' ? "teal.500" : { _focus: "teal.400" }}
                  boxShadow={activeField === 'driverNumber' ? "0 0 0 1px var(--chakra-colors-teal-500)" : "none"}
                  aria-label="Driver number"
                  aria-required="true"
                  autoFocus
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
                  borderColor={activeField === 'firstName' ? "teal.500" : { _focus: "teal.400" }}
                  boxShadow={activeField === 'firstName' ? "0 0 0 1px var(--chakra-colors-teal-500)" : "none"}
                  aria-label="First name"
                  aria-required="true"
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
                  borderColor={activeField === 'lastName' ? "teal.500" : { _focus: "teal.400" }}
                  boxShadow={activeField === 'lastName' ? "0 0 0 1px var(--chakra-colors-teal-500)" : "none"}
                  aria-label="Last name"
                  aria-required="true"
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
                  borderColor={activeField === 'acronym' ? "teal.500" : { _focus: "teal.400" }}
                  boxShadow={activeField === 'acronym' ? "0 0 0 1px var(--chakra-colors-teal-500)" : "none"}
                  aria-label="Acronym"
                  aria-required="true"
                  aria-description="Must be exactly 3 letters"
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
                  borderColor={activeField === 'teamName' ? "teal.500" : { _focus: "teal.400" }}
                  boxShadow={activeField === 'teamName' ? "0 0 0 1px var(--chakra-colors-teal-500)" : "none"}
                  aria-label="Team name"
                  aria-required="true"
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
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button 
              colorPalette="teal" 
              onClick={handleSubmit}
              disabled={isLoading}
              position="relative"
            >
              <Box opacity={isLoading ? 0 : 1}>Create Driver</Box>
              {isLoading && (
                <HStack 
                  position="absolute" 
                  inset={0} 
                  justify="center" 
                  align="center" 
                  gap={2}
                >
                  <Box as="span" display="inline-block" w="4px" h="4px" bg="currentColor" borderRadius="full" animation="pulse 1s infinite ease-in-out alternate" style={{ animationDelay: "0ms" }} />
                  <Box as="span" display="inline-block" w="4px" h="4px" bg="currentColor" borderRadius="full" animation="pulse 1s infinite ease-in-out alternate" style={{ animationDelay: "200ms" }} />
                  <Box as="span" display="inline-block" w="4px" h="4px" bg="currentColor" borderRadius="full" animation="pulse 1s infinite ease-in-out alternate" style={{ animationDelay: "400ms" }} />
                </HStack>
              )}
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
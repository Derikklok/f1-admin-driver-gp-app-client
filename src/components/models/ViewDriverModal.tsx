import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Grid,
  GridItem,
  Badge,
  Separator
} from '@chakra-ui/react'
import { Eye } from 'lucide-react'
import type { Driver } from '../../types/driver'

interface ViewDriverModalProps {
  driver: Driver
  isOpen: boolean
  onClose: () => void
}

interface DriverDetail {
  label: string
  value: string | number
  type?: 'badge' | 'text'
}

export const ViewDriverModal = ({ driver, isOpen, onClose }: ViewDriverModalProps) => {
  const driverDetails: DriverDetail[] = [
    { label: 'Driver Number', value: driver.driverNumber, type: 'badge' },
    { label: 'First Name', value: driver.firstName },
    { label: 'Last Name', value: driver.lastName },
    { label: 'Acronym', value: driver.acronym, type: 'badge' },
    { label: 'Team', value: driver.teamName },
    { label: 'Races Participated', value: driver.participations?.$values?.length || 0, type: 'badge' }
  ]
  
  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => {
      if (!e.open) {
        onClose()
      }
    }}>
      <DialogBackdrop onClick={() => onClose()} style={{
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
        className="f1-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          width: '95%',
          maxWidth: '500px',
          zIndex: 51,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderTop: '4px solid',
          borderColor: '#805AD5'
        }}
        bg={{ base: "white", _dark: "gray.800" }}
      >
        <DialogHeader className="f1-modal-header" pb={3}>
          <HStack gap={2} align="center">
            <Box color="purple.500">
              <Eye size={20} />
            </Box>
            <DialogTitle fontSize="xl" fontWeight="bold">Driver Details</DialogTitle>
          </HStack>
        </DialogHeader>
        
        <DialogBody>
          <VStack align="center" gap={5}>
            <Box
              w={24}
              h={24}
              borderRadius="full"
              bg="purple.500"
              color="white"
              fontSize="4xl"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {driver.firstName[0]}{driver.lastName[0]}
            </Box>
            
            <Text fontSize="2xl" fontWeight="bold">
              {driver.firstName} {driver.lastName}
            </Text>
            
            <Separator />
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
              {driverDetails.map((detail, index) => (
                <GridItem key={index} colSpan={detail.label === 'Team' ? 2 : 1}>
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" color="gray.500">
                      {detail.label}
                    </Text>
                    
                    {detail.type === 'badge' ? (
                      <Badge 
                        colorPalette={
                          detail.label === 'Driver Number' 
                            ? 'teal' 
                            : detail.label === 'Acronym'
                              ? 'gray'
                              : 'purple'
                        }
                        variant={detail.label === 'Acronym' ? 'outline' : 'solid'}
                      >
                        {detail.label === 'Driver Number' ? `#${detail.value}` : detail.value}
                      </Badge>
                    ) : (
                      <Text fontSize="md" fontWeight="medium">
                        {detail.value}
                      </Text>
                    )}
                  </VStack>
                </GridItem>
              ))}
            </Grid>
            
            {driver.participations && driver.participations.$values && driver.participations.$values.length > 0 ? (
              <>
                <Separator />
                
                <VStack align="start" w="100%" gap={3}>
                  <Text fontSize="lg" fontWeight="bold">
                    Recent Races
                  </Text>
                  
                  <VStack align="start" w="100%" gap={2}>
                    {driver.participations.$values.slice(0, 3).map((participation, index) => (
                      <Box 
                        key={index} 
                        p={3} 
                        borderRadius="md"
                        border="1px"
                        borderColor={{ base: "gray.200", _dark: "gray.700" }}
                        w="100%"
                      >
                        <HStack justify="space-between">
                          <Text fontWeight="medium">
                            {participation.grandPrix?.name || 'Unknown GP'}
                          </Text>
                          <Badge colorPalette="purple" variant="subtle">
                            {participation.grandPrix?.location || 'Unknown Location'}
                          </Badge>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </>
            ) : null}
          </VStack>
        </DialogBody>
        
        <DialogFooter className="f1-modal-footer" p={4}>
          <HStack gap={3} justify="center" w="full">
            <Button 
              colorPalette="purple" 
              onClick={onClose}
            >
              Close
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
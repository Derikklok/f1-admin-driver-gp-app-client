
import { useEffect, useState } from "react"
import { Box, Text, VStack, HStack, Button, Spinner, SimpleGrid } from "@chakra-ui/react"
import { Trophy } from "lucide-react"
import type { GrandPrix as GrandPrixType } from "../types/driver"
import "../styles/gp.css"
import AddGrandPrixModal from "../components/models/AddGrandPrixModal"

const API = "http://localhost:5251/api/grandprix"

const GrandPrix = () => {
  const [gps, setGps] = useState<GrandPrixType[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

  useEffect(() => {
    let mounted = true
    const fetchGP = async () => {
      setLoading(true)
      try {
        const res = await fetch(API)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        // Response has { $id, $values: [] }
        const values = Array.isArray(data?.$values) ? data.$values : []
        if (mounted) setGps(values)
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchGP()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Box p={8} display="flex" justifyContent="center" alignItems="flex-start" minH="calc(100vh - 80px)">
      <VStack gap={6} align="center" maxW="6xl" w="full">
        <HStack gap={3}>
          <Trophy size={32} color="#319795" />
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">
            Grand Prix Races
          </Text>
        </HStack>

        <Text fontSize="lg" color={{ base: "gray.600", _dark: "gray.400" }} textAlign="center">
          Manage race schedules, track information, and race results for all Grand Prix events.
        </Text>

        <HStack gap={4}>
          <AddGrandPrixModal onCreate={(gp) => setGps(prev => (prev ? [gp, ...prev] : [gp]))} />
          <Button colorPalette="teal" variant="outline">View Race Calendar</Button>
        </HStack>

        <Box w="full">
          {loading && (
            <HStack gap={3} justify="center" w="full">
              <Spinner />
              <Text>Loading Grand Prix...</Text>
            </HStack>
          )}

          {error && (
            <Box className="gp-alert">
              <Text color="red.600">{error}</Text>
            </Box>
          )}

          {!loading && !error && gps && gps.length === 0 && (
            <Box className="gp-empty">
              <Text>No Grand Prix events found.</Text>
            </Box>
          )}

          {!loading && !error && gps && gps.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mt={4}>
              {gps.map((gp) => (
                <Box key={gp.id} className="gp-card" p={4} borderRadius="md" bg={{ base: 'white', _dark: 'gray.800' }}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold" fontSize="lg">{gp.name}</Text>
                      <Box as="span" className="gp-location">{gp.location}</Box>
                    </HStack>
                    <Text color={{ base: 'gray.600', _dark: 'gray.400' }} fontSize="sm">Laps: {gp.laps} • Length: {gp.length}</Text>
                    <Box borderTopWidth={1} borderColor={{ base: 'gray.100', _dark: 'gray.700' }} my={2} />
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Participants</Text>
                      {gp.participations?.$values && gp.participations.$values.length > 0 ? (
                        <HStack gap={2} style={{ flexWrap: 'wrap' }}>
                          {gp.participations.$values.map((p) => (
                            <Box key={p.id} className="gp-participant" p={2} borderRadius="md" bg={{ base: 'gray.50', _dark: 'gray.900' }}>
                              <Text fontSize="sm">{p.driver?.firstName} {p.driver?.lastName} <Box as="span" color="gray.500">(#{p.driver?.driverNumber})</Box></Text>
                              <Text fontSize="xs" color="gray.500">{p.driver?.teamName}</Text>
                            </Box>
                          ))}
                        </HStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500">No participants yet</Text>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Box>
  )
}

export default GrandPrix
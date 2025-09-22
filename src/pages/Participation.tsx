
import { useEffect, useState } from "react"
import { Box, Text, VStack, HStack, Button, Spinner } from "@chakra-ui/react"
import { toaster } from "../components/ui/toaster"
import { Shield } from "lucide-react"
import type { Driver, GrandPrix } from "../types/driver"
import "../styles/participation.css"
import { useParticipations } from "../context/ParticipationContext"

const API_PARTICIPATION = "http://localhost:5251/api/participation"
const API_DRIVERS = "http://localhost:5251/api/drivers"
const API_GP = "http://localhost:5251/api/grandprix"

const Participation = () => {
  const [drivers, setDrivers] = useState<Driver[] | null>(null)
  const [gps, setGps] = useState<GrandPrix[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<number | ''>('')
  const [selectedGP, setSelectedGP] = useState<number | ''>('')
  const [result, setResult] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        const [dRes, gRes] = await Promise.all([fetch(API_DRIVERS), fetch(API_GP)])
        const dData = dRes.ok ? await dRes.json() : null
        const gData = gRes.ok ? await gRes.json() : null
        const driversVals = dData?.$values ?? []
        const gpVals = gData?.$values ?? []
        if (mounted) {
          setDrivers(Array.isArray(driversVals) ? driversVals : [])
          setGps(Array.isArray(gpVals) ? gpVals : [])
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  // Get refreshParticipations function from context
  const { refreshParticipations } = useParticipations();

  const handleAssign = async () => {
    setError(null)
    setResult(null)
    if (!selectedDriver || !selectedGP) {
      setError('Please select both a driver and a Grand Prix')
      return
    }
    setCreating(true)
    try {
      const res = await fetch(API_PARTICIPATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: selectedDriver, grandPrixId: selectedGP })
      })
      if (!res.ok) {
        // Try to extract meaningful message from the response body
        const text = await res.text()
        if (res.status === 409) {
          // Show conflict (already assigned) using the app toaster
          toaster.create({
            title: 'Assignment conflict',
            description: text || 'Driver already assigned to this Grand Prix.',
            type: 'error',
            duration: 6000,
            closable: true,
          })
          return
        }
        
        // Check if it's a foreign key constraint error
        if (text.includes("foreign key constraint fails")) {
          toaster.create({
            title: 'Invalid selection',
            description: 'The driver or Grand Prix you selected does not exist in the database.',
            type: 'error',
            duration: 6000,
            closable: true,
          })
          return
        }
        
        throw new Error(text || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
      
      // Refresh the global participation data to update all views
      await refreshParticipations();
      
      toaster.create({
        title: 'Success!',
        description: `${data.driver?.firstName} ${data.driver?.lastName} has been assigned to ${data.grandPrix?.name}`,
        type: 'success',
        duration: 4000,
        closable: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box p={8} display="flex" justifyContent="center" alignItems="flex-start" minH="calc(100vh - 80px)">
      <VStack gap={6} align="center" maxW="6xl" w="full">
        <HStack gap={3}>
          <Shield size={32} color="#319795" />
          <Text fontSize="3xl" fontWeight="bold" color="teal.600">Teams & Participation</Text>
        </HStack>

        <Text fontSize="lg" color={{ base: "gray.600", _dark: "gray.400" }} textAlign="center">
          Assign drivers to Grand Prix events.
        </Text>

        <Box className="participation-form" w="full" maxW="4xl" p={6}>
          {loading ? (
            <HStack><Spinner /><Text>Loading options...</Text></HStack>
          ) : (
            <HStack gap={4} align="center">
              <div className="field">
                <label>Driver</label>
                <select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">Select driver</option>
                  {drivers?.map(d => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName} (#{d.driverNumber})</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Grand Prix</label>
                <select value={selectedGP} onChange={(e) => setSelectedGP(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">Select Grand Prix</option>
                  {gps?.map(g => (
                    <option key={g.id} value={g.id}>{g.name} — {g.location}</option>
                  ))}
                </select>
              </div>

              <Button colorPalette="teal" onClick={handleAssign} disabled={creating}>{creating ? 'Assigning...' : 'Assign Driver'}</Button>
            </HStack>
          )}

          {error && <Box className="gp-alert" mt={4}><Text color="red.600">{error}</Text></Box>}

          {result && (
            <Box className="participation-result" mt={4} p={4}>
              <Text fontWeight="semibold">Assignment successful</Text>
              <Text>Driver: {result.driver?.firstName} {result.driver?.lastName} (#{result.driver?.driverNumber})</Text>
              <Text>Grand Prix: {result.grandPrix?.name} — {result.grandPrix?.location}</Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  )
}

export default Participation
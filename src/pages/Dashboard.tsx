

import { useState, useEffect } from "react"
import { 
  Box, Text, VStack, HStack, Button, Grid, GridItem, Spinner, 
  Flex, Heading
} from "@chakra-ui/react"
import { 
  LayoutDashboard, Users, Flag, TrendingUp, Award, 
  MapPin, Calendar, ChevronRight
} from "lucide-react"
import "../styles/dashboard.css"

// API endpoints
const API_DRIVERS = "http://localhost:5251/api/drivers"
const API_GP = "http://localhost:5251/api/grandprix"
const API_PARTICIPATION = "http://localhost:5251/api/participation"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<{
    driverCount: number;
    gpCount: number;
    participationCount: number;
    recentDrivers: any[];
    recentGPs: any[];
    upcomingGPs: any[];
    recentParticipations: any[];
  }>({
    driverCount: 0,
    gpCount: 0, 
    participationCount: 0,
    recentDrivers: [],
    recentGPs: [],
    upcomingGPs: [],
    recentParticipations: []
  })
  const [error, setError] = useState<string | null>(null)

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch each type of data independently to ensure partial display if any one fails
      let driversData = { $values: [] };
      let gpsData = { $values: [] };
      let participationsData = { $values: [] };
      
      try {
        const driversRes = await fetch(API_DRIVERS);
        if (driversRes.ok) {
          driversData = await driversRes.json();
        } else {
          console.warn("Failed to fetch drivers data");
        }
      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
      
      try {
        const gpsRes = await fetch(API_GP);
        if (gpsRes.ok) {
          gpsData = await gpsRes.json();
        } else {
          console.warn("Failed to fetch Grand Prix data");
        }
      } catch (err) {
        console.error("Error fetching GPs:", err);
      }
      
      try {
        // Try both GET and POST methods for participation endpoint
        let participationsRes;
        
        // First try GET method
        participationsRes = await fetch(API_PARTICIPATION);
        
        if (!participationsRes.ok) {
          console.log("GET method failed for participations, trying POST...");
          // If GET fails, try POST method
          participationsRes = await fetch(API_PARTICIPATION, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });
        }
        
        if (participationsRes.ok) {
          participationsData = await participationsRes.json();
        } else {
          console.warn("Both GET and POST methods failed for participation data");
        }
      } catch (err) {
        console.error("Error fetching participations:", err);
      }

      // If we have at least some data, display the dashboard
      if (driversData.$values?.length || gpsData.$values?.length || participationsData.$values?.length) {
        const drivers = driversData.$values || [];
        const gps = gpsData.$values || [];
        const participations = participationsData.$values || [];
        
        // Sort GPs by date to get actual upcoming events
        const sortedGPs = [...gps].sort((a: any, b: any) => {
          if (a.date && b.date) {
            return Number(new Date(a.date)) - Number(new Date(b.date));
          }
          return 0;
        });
        
        setDashboardData({
          driverCount: drivers.length,
          gpCount: gps.length,
          participationCount: participations.length,
          recentDrivers: drivers.slice(0, 5),
          recentGPs: gps.slice(0, 3),
          upcomingGPs: sortedGPs.slice(0, 3),
          recentParticipations: participations.slice(0, 5)
        });
      } else {
        // If we have no data at all, show an error
        throw new Error("Could not load any dashboard data");
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchDashboardData when the component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Utility function for formatting dates if needed later
  /*const formatDate = (dateStr: string) => {
    if (!dateStr) return "TBD"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }*/

  return (
    <Box p={{ base: 4, md: 8 }} className="dashboard-container">
      {/* Dashboard Header */}
      <Flex className="dashboard-header" mb={6} wrap="wrap">
        <HStack gap={3} mb={{ base: 4, md: 0 }}>
          <LayoutDashboard size={32} color="#319795" />
          <Heading as="h1" fontSize="3xl" fontWeight="bold" color="teal.600">
            F1 Admin Dashboard
          </Heading>
        </HStack>
        
        <HStack gap={4} ml="auto">
          <Button variant="outline" size="sm">
            <Calendar size={16} style={{ marginRight: '6px' }} /> This Season
          </Button>
          <Button colorScheme="teal" size="sm">
            <TrendingUp size={16} style={{ marginRight: '6px' }} /> Generate Report
          </Button>
        </HStack>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="300px">
          <VStack>
            <Spinner size="xl" color="teal.500" />
            <Text mt={4}>Loading dashboard data...</Text>
          </VStack>
        </Flex>
      ) : error ? (
        <Box className="dashboard-error-card">
          <Text fontSize="lg">Error loading dashboard: {error}</Text>
          <Button 
            mt={4} 
            onClick={() => {
              setError(null);
              setLoading(true);
              // Retry data fetching
              fetchDashboardData();
            }} 
            colorScheme="teal"
          >
            Retry
          </Button>
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid 
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} 
            gap={6} 
            mb={8}
          >
            <GridItem>
              <Box className="dashboard-stat-card drivers-card">
                <Flex justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.500">Total Drivers</Text>
                    <Text fontSize="3xl" fontWeight="bold">{dashboardData.driverCount}</Text>
                    <Text fontSize="sm" color="gray.500">Active F1 Drivers</Text>
                  </Box>
                  <Box className="stat-icon drivers-icon">
                    <Users size={24} />
                  </Box>
                </Flex>
              </Box>
            </GridItem>

            <GridItem>
              <Box className="dashboard-stat-card gps-card">
                <Flex justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.500">Grand Prix Events</Text>
                    <Text fontSize="3xl" fontWeight="bold">{dashboardData.gpCount}</Text>
                    <Text fontSize="sm" color="gray.500">This Season</Text>
                  </Box>
                  <Box className="stat-icon gps-icon">
                    <Flag size={24} />
                  </Box>
                </Flex>
              </Box>
            </GridItem>

            <GridItem>
              <Box className="dashboard-stat-card participations-card">
                <Flex justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.500">Participations</Text>
                    <Text fontSize="3xl" fontWeight="bold">{dashboardData.participationCount}</Text>
                    <Text fontSize="sm" color="gray.500">Driver Registrations</Text>
                  </Box>
                  <Box className="stat-icon participations-icon">
                    <Award size={24} />
                  </Box>
                </Flex>
              </Box>
            </GridItem>
          </Grid>

          {/* Main Content Area */}
          <Grid 
            templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={8}
          >
            {/* Upcoming Grand Prix */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Box className="dashboard-card upcoming-gp">
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h2" size="md">
                    <Flag size={18} className="inline-icon" /> Upcoming Grand Prix
                  </Heading>
                  <Button variant="ghost" size="sm">
                    View all <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>

                <Box className="gp-schedule">
                  {dashboardData.upcomingGPs.length > 0 ? (
                    dashboardData.upcomingGPs.map((gp: any) => (
                      <Box key={gp.id} className="gp-schedule-item">
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="bold">{gp.name}</Text>
                            <HStack gap={2} mt={1} color="gray.500">
                              <MapPin size={14} />
                              <Text fontSize="sm">{gp.location}</Text>
                            </HStack>
                          </Box>
                          <Box>
                            <Text className="gp-laps">
                              {gp.laps} <span>Laps</span>
                            </Text>
                            <Text fontSize="sm" className="gp-length">
                              {gp.length}km
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Text>No upcoming Grand Prix events found.</Text>
                  )}
                </Box>
              </Box>
            </GridItem>

            {/* Recent Drivers */}
            <GridItem colSpan={1}>
              <Box className="dashboard-card recent-drivers">
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h2" size="md">
                    <Users size={18} className="inline-icon" /> Recent Drivers
                  </Heading>
                  <Button variant="ghost" size="sm">
                    View all <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>
                
                <Box className="drivers-list">
                  {dashboardData.recentDrivers.length > 0 ? (
                    dashboardData.recentDrivers.map((driver: any) => (
                      <Box key={driver.id} className="driver-list-item">
                        <Flex align="center">
                          <Box className="driver-number">{driver.driverNumber}</Box>
                          <Box ml={3}>
                            <Text fontWeight="semibold">
                              {driver.firstName} {driver.lastName}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {driver.team || "No team"}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Text>No drivers found.</Text>
                  )}
                </Box>
              </Box>
            </GridItem>

            {/* Recent Participations */}
            <GridItem colSpan={{ base: 1, lg: 3 }}>
              <Box className="dashboard-card participations-card">
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h2" size="md">
                    <Award size={18} className="inline-icon" /> Recent Participations
                  </Heading>
                  <Button variant="ghost" size="sm">
                    View all <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                  </Button>
                </Flex>
                
                <Box className="participation-table-container">
                  <table className="participation-table">
                    <thead>
                      <tr>
                        <th>Driver</th>
                        <th>Grand Prix</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentParticipations.length > 0 ? (
                        dashboardData.recentParticipations.map((p: any) => (
                          <tr key={p.id}>
                            <td>
                              <Flex align="center">
                                <span className="driver-number-sm">{p.driver?.driverNumber || '??'}</span>
                                <span className="driver-name">
                                  {p.driver ? `${p.driver.firstName} ${p.driver.lastName}` : 'Unknown Driver'}
                                </span>
                              </Flex>
                            </td>
                            <td>{p.grandPrix?.name || 'Unknown GP'}</td>
                            <td>{p.grandPrix?.location || '-'}</td>
                            <td><span className="status-active">Active</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="empty-table">No participations found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </>
      )}
    </Box>
  )
}

export default Dashboard
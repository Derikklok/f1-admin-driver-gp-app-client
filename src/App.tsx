import { Box } from "@chakra-ui/react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Drivers from "./pages/Drivers"
import GrandPrix from "./pages/GrandPrix"
import Participation from "./pages/Participation"

const App = () => {
  return (
    <Box bg="bg" color="fg" minH="100vh">
      <Navbar />
      
      <Box>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/races" element={<GrandPrix />} />
          <Route path="/teams" element={<Participation />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
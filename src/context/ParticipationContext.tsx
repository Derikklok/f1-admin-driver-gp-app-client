import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

// Define types for our participation data
type Driver = {
  id: number;
  firstName: string;
  lastName: string;
  driverNumber: string;
  teamName?: string;
};

type GrandPrix = {
  id: number;
  name: string;
  location: string;
  laps: number;
  length: number;
  participations?: {
    $values: Participation[];
  };
};

type Participation = {
  id: number;
  driverId: number;
  grandPrixId: number;
  driver?: Driver;
  grandPrix?: GrandPrix;
};

// Context type definitions
type ParticipationContextType = {
  participations: Participation[];
  addParticipation: (participation: Participation) => void;
  refreshParticipations: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

// Create the context with default values
const ParticipationContext = createContext<ParticipationContextType>({
  participations: [],
  addParticipation: () => {},
  refreshParticipations: async () => {},
  isLoading: false,
  error: null,
});

// API endpoint
const API_PARTICIPATION = "http://localhost:5251/api/participation";

// Provider component
export const ParticipationProvider = ({ children }: { children: ReactNode }) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh participations from API
  const refreshParticipations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let participationsRes;
      
      // Try GET first
      participationsRes = await fetch(API_PARTICIPATION);
      
      // If GET fails, try POST as fallback
      if (!participationsRes.ok) {
        participationsRes = await fetch(API_PARTICIPATION, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
      }
      
      if (!participationsRes.ok) {
        throw new Error(`Failed to fetch participations: ${participationsRes.status}`);
      }
      
      const data = await participationsRes.json();
      const values = data?.$values || [];
      setParticipations(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load participations on initial mount
  React.useEffect(() => {
    refreshParticipations();
  }, [refreshParticipations]);

  // Function to add a new participation
  const addParticipation = (participation: Participation) => {
    setParticipations((prevParticipations) => [...prevParticipations, participation]);
  };

  return (
    <ParticipationContext.Provider
      value={{
        participations,
        addParticipation,
        refreshParticipations,
        isLoading,
        error,
      }}
    >
      {children}
    </ParticipationContext.Provider>
  );
};

// Custom hook to use the participation context
export const useParticipations = () => useContext(ParticipationContext);
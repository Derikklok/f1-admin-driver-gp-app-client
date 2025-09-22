// Types for the API response structure
export interface ApiResponse<T> {
  $id: string
  $values: T[]
}

export interface GrandPrix {
  $id?: string
  id: number
  name: string
  location: string
  laps: number
  length: number
  participations?: ApiResponse<Participation>
}

export interface Participation {
  $id?: string
  $ref?: string
  id: number
  driverId: number
  driver?: Driver
  grandPrixId: number
  grandPrix?: GrandPrix
}

export interface Driver {
  $id?: string
  $ref?: string
  id: number
  driverNumber: number
  firstName: string
  lastName: string
  acronym: string
  teamName: string
  participations?: ApiResponse<Participation>
}

// Simplified types for forms and components
export interface DriverFormData {
  driverNumber: number
  firstName: string
  lastName: string
  acronym: string
  teamName: string
}

export interface DriverCreateRequest extends DriverFormData {}

export interface DriverUpdateRequest extends DriverFormData {
  id: number
}
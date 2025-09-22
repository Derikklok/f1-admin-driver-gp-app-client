import type { Driver, ApiResponse, DriverCreateRequest, DriverUpdateRequest } from '../types/driver'

const API_BASE_URL = 'http://localhost:5251/api'

export class DriversService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as unknown as T
  }

  async getAllDrivers(): Promise<Driver[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`)
      const apiResponse: ApiResponse<Driver> = await this.handleResponse(response)
      return apiResponse.$values
    } catch (error) {
      console.error('Error fetching drivers:', error)
      throw error
    }
  }

  async getDriverById(id: number): Promise<Driver> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`)
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error)
      throw error
    }
  }

  async createDriver(driver: DriverCreateRequest): Promise<Driver> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driver),
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error('Error creating driver:', error)
      throw error
    }
  }

  async updateDriver(id: number, driver: DriverUpdateRequest): Promise<Driver> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(driver),
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error)
      throw error
    }
  }

  async deleteDriver(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: 'DELETE',
      })
      await this.handleResponse(response)
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error)
      throw error
    }
  }
}

// Export an instance for easier usage
export const driversService = new DriversService()

// Export default for alternative import syntax
export default driversService
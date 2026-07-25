export interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  totalBudget: number | null
  notes: string
  destinationIds: string[]
  createdAt: string
}

export interface CreateTripBody {
  name: string
  startDate: string
  endDate: string
  totalBudget?: number
  notes?: string
  destinationIds?: string[]
}

export interface UpdateTripBody {
  name?: string
  startDate?: string
  endDate?: string
  totalBudget?: number | null
  notes?: string
  destinationIds?: string[]
}

export interface TripListResponse {
  data: Trip[]
}

export interface TripResponse {
  data: Trip
}

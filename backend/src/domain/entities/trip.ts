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

export interface CreateTripInput {
  name: string
  startDate: string
  endDate: string
  totalBudget?: number
  notes?: string
  destinationIds?: string[]
}

export interface UpdateTripInput {
  name?: string
  startDate?: string
  endDate?: string
  totalBudget?: number | null
  notes?: string
  destinationIds?: string[]
}

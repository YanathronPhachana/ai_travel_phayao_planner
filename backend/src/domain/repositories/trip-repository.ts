import type { CreateTripInput, Trip, UpdateTripInput } from '../entities/trip'

export interface TripRepository {
  findAll(): Promise<Trip[]>
  findById(id: string): Promise<Trip | null>
  create(input: CreateTripInput): Promise<Trip>
  update(id: string, input: UpdateTripInput): Promise<Trip | null>
  delete(id: string): Promise<boolean>
}

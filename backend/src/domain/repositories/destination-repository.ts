import type { CreateDestinationInput, Destination, UpdateDestinationInput } from '../entities/destination'

export interface DestinationRepository {
  findAll(): Promise<Destination[]>
  findById(id: string): Promise<Destination | null>
  findByCategory(category: string): Promise<Destination[]>
  create(input: CreateDestinationInput): Promise<Destination>
  update(id: string, input: UpdateDestinationInput): Promise<Destination | null>
  delete(id: string): Promise<boolean>
}

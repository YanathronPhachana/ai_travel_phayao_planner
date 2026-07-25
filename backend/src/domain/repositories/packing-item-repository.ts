import type { CreatePackingItemInput, PackingItem, UpdatePackingItemInput } from '../entities/packing-item'

export interface PackingItemRepository {
  findByTripId(tripId: string): Promise<PackingItem[]>
  findById(id: string): Promise<PackingItem | null>
  create(input: CreatePackingItemInput): Promise<PackingItem>
  update(id: string, input: UpdatePackingItemInput): Promise<PackingItem | null>
  delete(id: string): Promise<boolean>
}

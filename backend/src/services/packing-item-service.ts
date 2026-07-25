import type { CreatePackingItemInput, PackingItem, UpdatePackingItemInput } from '../domain/entities/packing-item'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { PackingItemRepository } from '../domain/repositories/packing-item-repository'
import type { TripRepository } from '../domain/repositories/trip-repository'

const VALID_CATEGORIES = ['clothing', 'toiletries', 'electronics', 'documents', 'medical', 'other']

export class PackingItemService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly packingItemRepository: PackingItemRepository
  ) {}

  async listItems(tripId: string): Promise<PackingItem[]> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    return this.packingItemRepository.findByTripId(tripId)
  }

  async getItem(tripId: string, id: string): Promise<PackingItem> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const item = await this.packingItemRepository.findById(id)
    if (!item || item.tripId !== tripId) throw new NotFoundError('PackingItem')
    return item
  }

  async createItem(tripId: string, input: CreatePackingItemInput): Promise<PackingItem> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')

    if (!input.itemName?.trim()) throw new ValidationError('itemName is required')
    if (!input.category || !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }

    return this.packingItemRepository.create({
      tripId,
      category: input.category,
      itemName: input.itemName.trim(),
      quantity: input.quantity,
      notes: input.notes?.trim() ?? '',
    })
  }

  async updateItem(tripId: string, id: string, input: UpdatePackingItemInput): Promise<PackingItem> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const item = await this.packingItemRepository.findById(id)
    if (!item || item.tripId !== tripId) throw new NotFoundError('PackingItem')

    if (input.category !== undefined && !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }

    const updated = await this.packingItemRepository.update(id, input)
    if (!updated) throw new NotFoundError('PackingItem')
    return updated
  }

  async deleteItem(tripId: string, id: string): Promise<void> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const item = await this.packingItemRepository.findById(id)
    if (!item || item.tripId !== tripId) throw new NotFoundError('PackingItem')

    const deleted = await this.packingItemRepository.delete(id)
    if (!deleted) throw new NotFoundError('PackingItem')
  }
}

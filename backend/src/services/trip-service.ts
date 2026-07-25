import type { CreateTripInput, Trip, UpdateTripInput } from '../domain/entities/trip'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { CacheRepository } from '../domain/repositories/cache-repository'
import type { TripRepository } from '../domain/repositories/trip-repository'

const CACHE_TTL_SECONDS = 300
const cacheKey = (id: string) => `trip:${id}`

export class TripService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly cache: CacheRepository
  ) {}

  async listTrips(): Promise<Trip[]> {
    return this.tripRepository.findAll()
  }

  async getTrip(id: string): Promise<Trip> {
    const cached = await this.cache.get<Trip>(cacheKey(id))
    if (cached) return cached

    const trip = await this.tripRepository.findById(id)
    if (!trip) throw new NotFoundError('Trip')

    await this.cache.set(cacheKey(id), trip, CACHE_TTL_SECONDS)
    return trip
  }

  async createTrip(input: CreateTripInput): Promise<Trip> {
    if (!input.name?.trim()) throw new ValidationError('name is required')
    if (!input.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) {
      throw new ValidationError('startDate must be in YYYY-MM-DD format')
    }
    if (!input.endDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.endDate)) {
      throw new ValidationError('endDate must be in YYYY-MM-DD format')
    }
    if (input.startDate > input.endDate) {
      throw new ValidationError('startDate must be before endDate')
    }

    return this.tripRepository.create({
      name: input.name.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      totalBudget: input.totalBudget,
      notes: input.notes?.trim() ?? '',
      destinationIds: input.destinationIds ?? [],
    })
  }

  async updateTrip(id: string, input: UpdateTripInput): Promise<Trip> {
    if (input.startDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(input.startDate)) {
      throw new ValidationError('startDate must be in YYYY-MM-DD format')
    }
    if (input.endDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(input.endDate)) {
      throw new ValidationError('endDate must be in YYYY-MM-DD format')
    }

    const updated = await this.tripRepository.update(id, input)
    if (!updated) throw new NotFoundError('Trip')

    await this.cache.delete(cacheKey(id))
    return updated
  }

  async deleteTrip(id: string): Promise<void> {
    const deleted = await this.tripRepository.delete(id)
    if (!deleted) throw new NotFoundError('Trip')
    await this.cache.delete(cacheKey(id))
  }
}

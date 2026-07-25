import type { CreateDestinationInput, Destination, UpdateDestinationInput } from '../domain/entities/destination'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { CacheRepository } from '../domain/repositories/cache-repository'
import type { DestinationRepository } from '../domain/repositories/destination-repository'

const CACHE_TTL_SECONDS = 300
const cacheKey = (id: string) => `destination:${id}`
const VALID_CATEGORIES = [
  'nature', 'temple', 'landmark', 'restaurant', 'activity',
  'waterfall', 'mountain', 'market', 'other',
]

export class DestinationService {
  constructor(
    private readonly destinationRepository: DestinationRepository,
    private readonly cache: CacheRepository
  ) {}

  async listDestinations(category?: string): Promise<Destination[]> {
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
      }
      return this.destinationRepository.findByCategory(category)
    }
    return this.destinationRepository.findAll()
  }

  async getDestination(id: string): Promise<Destination> {
    const cached = await this.cache.get<Destination>(cacheKey(id))
    if (cached) return cached

    const destination = await this.destinationRepository.findById(id)
    if (!destination) throw new NotFoundError('Destination')

    await this.cache.set(cacheKey(id), destination, CACHE_TTL_SECONDS)
    return destination
  }

  async createDestination(input: CreateDestinationInput): Promise<Destination> {
    if (!input.name?.trim()) throw new ValidationError('name is required')
    if (!input.category || !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }

    return this.destinationRepository.create({
      name: input.name.trim(),
      category: input.category,
      description: input.description?.trim() ?? '',
      location: input.location?.trim() ?? '',
      imageUrl: input.imageUrl?.trim() ?? undefined,
    })
  }

  async updateDestination(id: string, input: UpdateDestinationInput): Promise<Destination> {
    if (input.category !== undefined && !VALID_CATEGORIES.includes(input.category)) {
      throw new ValidationError(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }

    const updated = await this.destinationRepository.update(id, input)
    if (!updated) throw new NotFoundError('Destination')

    await this.cache.delete(cacheKey(id))
    return updated
  }

  async deleteDestination(id: string): Promise<void> {
    const deleted = await this.destinationRepository.delete(id)
    if (!deleted) throw new NotFoundError('Destination')
    await this.cache.delete(cacheKey(id))
  }
}

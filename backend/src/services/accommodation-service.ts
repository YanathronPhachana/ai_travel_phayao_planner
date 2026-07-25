import type { Accommodation, CreateAccommodationInput, UpdateAccommodationInput } from '../domain/entities/accommodation'
import { NotFoundError, ValidationError } from '../domain/errors'
import type { AccommodationRepository } from '../domain/repositories/accommodation-repository'
import type { TripRepository } from '../domain/repositories/trip-repository'

const VALID_TYPES = ['hotel', 'resort', 'guesthouse', 'hostel', 'other']

export class AccommodationService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly accommodationRepository: AccommodationRepository
  ) {}

  async listAccommodations(tripId: string): Promise<Accommodation[]> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    return this.accommodationRepository.findByTripId(tripId)
  }

  async getAccommodation(tripId: string, id: string): Promise<Accommodation> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const accommodation = await this.accommodationRepository.findById(id)
    if (!accommodation || accommodation.tripId !== tripId) throw new NotFoundError('Accommodation')
    return accommodation
  }

  async createAccommodation(tripId: string, input: CreateAccommodationInput): Promise<Accommodation> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')

    if (!input.name?.trim()) throw new ValidationError('name is required')
    if (!input.type || !VALID_TYPES.includes(input.type)) {
      throw new ValidationError(`type must be one of: ${VALID_TYPES.join(', ')}`)
    }

    return this.accommodationRepository.create({
      tripId,
      name: input.name.trim(),
      type: input.type,
      pricePerNight: input.pricePerNight,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      totalCost: input.totalCost,
      address: input.address?.trim() ?? '',
      phone: input.phone?.trim() ?? '',
      notes: input.notes?.trim() ?? '',
    })
  }

  async updateAccommodation(tripId: string, id: string, input: UpdateAccommodationInput): Promise<Accommodation> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const accommodation = await this.accommodationRepository.findById(id)
    if (!accommodation || accommodation.tripId !== tripId) throw new NotFoundError('Accommodation')

    if (input.type !== undefined && !VALID_TYPES.includes(input.type)) {
      throw new ValidationError(`type must be one of: ${VALID_TYPES.join(', ')}`)
    }

    const updated = await this.accommodationRepository.update(id, input)
    if (!updated) throw new NotFoundError('Accommodation')
    return updated
  }

  async deleteAccommodation(tripId: string, id: string): Promise<void> {
    const trip = await this.tripRepository.findById(tripId)
    if (!trip) throw new NotFoundError('Trip')
    const accommodation = await this.accommodationRepository.findById(id)
    if (!accommodation || accommodation.tripId !== tripId) throw new NotFoundError('Accommodation')

    const deleted = await this.accommodationRepository.delete(id)
    if (!deleted) throw new NotFoundError('Accommodation')
  }
}

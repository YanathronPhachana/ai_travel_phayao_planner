import type { Context } from 'hono'
import type { CreateAccommodationInput, UpdateAccommodationInput } from '../domain/entities/accommodation'
import { ValidationError } from '../domain/errors'
import type { AccommodationService } from '../services/accommodation-service'

export class AccommodationHandler {
  constructor(private readonly accommodationService: AccommodationService) {}

  list = async (c: Context) => {
    const accommodations = await this.accommodationService.listAccommodations(this.param(c, 'tripId'))
    return c.json({ data: accommodations })
  }

  create = async (c: Context) => {
    const body = await this.parseJson<CreateAccommodationInput>(c)
    const accommodation = await this.accommodationService.createAccommodation(this.param(c, 'tripId'), body)
    return c.json({ data: accommodation }, 201)
  }

  update = async (c: Context) => {
    const body = await this.parseJson<UpdateAccommodationInput>(c)
    const accommodation = await this.accommodationService.updateAccommodation(this.param(c, 'tripId'), this.param(c, 'id'), body)
    return c.json({ data: accommodation })
  }

  delete = async (c: Context) => {
    await this.accommodationService.deleteAccommodation(this.param(c, 'tripId'), this.param(c, 'id'))
    return c.body(null, 204)
  }

  private param(c: Context, name: string): string {
    const value = c.req.param(name)
    if (!value) throw new ValidationError(`${name} param is required`)
    return value
  }

  private async parseJson<T>(c: Context): Promise<T> {
    try {
      return await c.req.json<T>()
    } catch {
      throw new ValidationError('Invalid JSON body')
    }
  }
}

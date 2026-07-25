import type { Context } from 'hono'
import type { CreateTripInput, UpdateTripInput } from '../domain/entities/trip'
import { ValidationError } from '../domain/errors'
import type { TripService } from '../services/trip-service'

export class TripHandler {
  constructor(private readonly tripService: TripService) {}

  list = async (c: Context) => {
    const trips = await this.tripService.listTrips()
    return c.json({ data: trips })
  }

  get = async (c: Context) => {
    const trip = await this.tripService.getTrip(this.param(c, 'id'))
    return c.json({ data: trip })
  }

  create = async (c: Context) => {
    const body = await this.parseJson<CreateTripInput>(c)
    const trip = await this.tripService.createTrip(body)
    return c.json({ data: trip }, 201)
  }

  update = async (c: Context) => {
    const body = await this.parseJson<UpdateTripInput>(c)
    const trip = await this.tripService.updateTrip(this.param(c, 'id'), body)
    return c.json({ data: trip })
  }

  delete = async (c: Context) => {
    await this.tripService.deleteTrip(this.param(c, 'id'))
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

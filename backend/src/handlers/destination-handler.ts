import type { Context } from 'hono'
import type { CreateDestinationInput, UpdateDestinationInput } from '../domain/entities/destination'
import { ValidationError } from '../domain/errors'
import type { DestinationService } from '../services/destination-service'

export class DestinationHandler {
  constructor(private readonly destinationService: DestinationService) {}

  list = async (c: Context) => {
    const category = c.req.query('category')
    const destinations = await this.destinationService.listDestinations(category ?? undefined)
    return c.json({ data: destinations })
  }

  get = async (c: Context) => {
    const destination = await this.destinationService.getDestination(this.param(c, 'id'))
    return c.json({ data: destination })
  }

  create = async (c: Context) => {
    const body = await this.parseJson<CreateDestinationInput>(c)
    const destination = await this.destinationService.createDestination(body)
    return c.json({ data: destination }, 201)
  }

  update = async (c: Context) => {
    const body = await this.parseJson<UpdateDestinationInput>(c)
    const destination = await this.destinationService.updateDestination(this.param(c, 'id'), body)
    return c.json({ data: destination })
  }

  delete = async (c: Context) => {
    await this.destinationService.deleteDestination(this.param(c, 'id'))
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

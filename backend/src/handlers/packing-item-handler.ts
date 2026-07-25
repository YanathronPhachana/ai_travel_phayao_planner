import type { Context } from 'hono'
import type { CreatePackingItemInput, UpdatePackingItemInput } from '../domain/entities/packing-item'
import { ValidationError } from '../domain/errors'
import type { PackingItemService } from '../services/packing-item-service'

export class PackingItemHandler {
  constructor(private readonly packingItemService: PackingItemService) {}

  list = async (c: Context) => {
    const items = await this.packingItemService.listItems(this.param(c, 'tripId'))
    return c.json({ data: items })
  }

  create = async (c: Context) => {
    const body = await this.parseJson<CreatePackingItemInput>(c)
    const item = await this.packingItemService.createItem(this.param(c, 'tripId'), body)
    return c.json({ data: item }, 201)
  }

  update = async (c: Context) => {
    const body = await this.parseJson<UpdatePackingItemInput>(c)
    const item = await this.packingItemService.updateItem(this.param(c, 'tripId'), this.param(c, 'id'), body)
    return c.json({ data: item })
  }

  delete = async (c: Context) => {
    await this.packingItemService.deleteItem(this.param(c, 'tripId'), this.param(c, 'id'))
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

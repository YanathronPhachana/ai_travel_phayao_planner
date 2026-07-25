import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { AppEnv } from '../types'
import {
  createPackingItemSchema,
  errorResponseSchema,
  packingItemIdParamSchema,
  packingItemListResponseSchema,
  packingItemResponseSchema,
  tripIdParamSchema,
  updatePackingItemSchema,
} from '../schemas/packing-item-schemas'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createPackingItemRouter() {
  const router = new Hono<AppEnv>()

  router.get(
    '/',
    describeRoute({
      tags: ['Packing Items'],
      summary: 'List packing items for a trip',
      responses: {
        200: { description: 'Packing items', content: jsonContent(packingItemListResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', tripIdParamSchema),
    (c) => c.get('container').packingItemHandler.list(c)
  )

  router.post(
    '/',
    describeRoute({
      tags: ['Packing Items'],
      summary: 'Create a packing item',
      responses: {
        201: { description: 'Packing item created', content: jsonContent(packingItemResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', tripIdParamSchema),
    validator('json', createPackingItemSchema),
    (c) => c.get('container').packingItemHandler.create(c)
  )

  router.patch(
    '/:id',
    describeRoute({
      tags: ['Packing Items'],
      summary: 'Update a packing item',
      responses: {
        200: { description: 'Packing item updated', content: jsonContent(packingItemResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Packing item not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', packingItemIdParamSchema),
    validator('json', updatePackingItemSchema),
    (c) => c.get('container').packingItemHandler.update(c)
  )

  router.delete(
    '/:id',
    describeRoute({
      tags: ['Packing Items'],
      summary: 'Delete a packing item',
      responses: {
        204: { description: 'Packing item deleted' },
        404: { description: 'Packing item not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', packingItemIdParamSchema),
    (c) => c.get('container').packingItemHandler.delete(c)
  )

  return router
}

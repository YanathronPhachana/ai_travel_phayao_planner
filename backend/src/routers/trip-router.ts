import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { AppEnv } from '../types'
import {
  createTripSchema,
  errorResponseSchema,
  idParamSchema,
  tripListResponseSchema,
  tripResponseSchema,
  updateTripSchema,
} from '../schemas/trip-schemas'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createTripRouter() {
  const router = new Hono<AppEnv>()

  router.get(
    '/',
    describeRoute({
      tags: ['Trips'],
      summary: 'List all trips',
      responses: {
        200: { description: 'All trips', content: jsonContent(tripListResponseSchema) },
      },
    }),
    (c) => c.get('container').tripHandler.list(c)
  )

  router.post(
    '/',
    describeRoute({
      tags: ['Trips'],
      summary: 'Create a trip',
      responses: {
        201: { description: 'Trip created', content: jsonContent(tripResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('json', createTripSchema),
    (c) => c.get('container').tripHandler.create(c)
  )

  router.get(
    '/:id',
    describeRoute({
      tags: ['Trips'],
      summary: 'Get a trip by id',
      responses: {
        200: { description: 'Trip found', content: jsonContent(tripResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').tripHandler.get(c)
  )

  router.patch(
    '/:id',
    describeRoute({
      tags: ['Trips'],
      summary: 'Update a trip',
      responses: {
        200: { description: 'Trip updated', content: jsonContent(tripResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    validator('json', updateTripSchema),
    (c) => c.get('container').tripHandler.update(c)
  )

  router.delete(
    '/:id',
    describeRoute({
      tags: ['Trips'],
      summary: 'Delete a trip',
      responses: {
        204: { description: 'Trip deleted' },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').tripHandler.delete(c)
  )

  return router
}

import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { AppEnv } from '../types'
import {
  accommodationIdParamSchema,
  accommodationListResponseSchema,
  accommodationResponseSchema,
  createAccommodationSchema,
  errorResponseSchema,
  tripIdParamSchema,
  updateAccommodationSchema,
} from '../schemas/accommodation-schemas'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createAccommodationRouter() {
  const router = new Hono<AppEnv>()

  router.get(
    '/',
    describeRoute({
      tags: ['Accommodations'],
      summary: 'List accommodations for a trip',
      responses: {
        200: { description: 'Accommodations', content: jsonContent(accommodationListResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', tripIdParamSchema),
    (c) => c.get('container').accommodationHandler.list(c)
  )

  router.post(
    '/',
    describeRoute({
      tags: ['Accommodations'],
      summary: 'Create an accommodation',
      responses: {
        201: { description: 'Accommodation created', content: jsonContent(accommodationResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', tripIdParamSchema),
    validator('json', createAccommodationSchema),
    (c) => c.get('container').accommodationHandler.create(c)
  )

  router.patch(
    '/:id',
    describeRoute({
      tags: ['Accommodations'],
      summary: 'Update an accommodation',
      responses: {
        200: { description: 'Accommodation updated', content: jsonContent(accommodationResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Accommodation not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', accommodationIdParamSchema),
    validator('json', updateAccommodationSchema),
    (c) => c.get('container').accommodationHandler.update(c)
  )

  router.delete(
    '/:id',
    describeRoute({
      tags: ['Accommodations'],
      summary: 'Delete an accommodation',
      responses: {
        204: { description: 'Accommodation deleted' },
        404: { description: 'Accommodation not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', accommodationIdParamSchema),
    (c) => c.get('container').accommodationHandler.delete(c)
  )

  return router
}

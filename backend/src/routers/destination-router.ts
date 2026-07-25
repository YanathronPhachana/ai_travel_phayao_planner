import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { AppEnv } from '../types'
import {
  createDestinationSchema,
  destinationListResponseSchema,
  destinationResponseSchema,
  errorResponseSchema,
  idParamSchema,
  updateDestinationSchema,
} from '../schemas/destination-schemas'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createDestinationRouter() {
  const router = new Hono<AppEnv>()

  router.get(
    '/',
    describeRoute({
      tags: ['Destinations'],
      summary: 'List all destinations',
      description: 'Filter by ?category=nature|temple|landmark|...',
      responses: {
        200: { description: 'All destinations', content: jsonContent(destinationListResponseSchema) },
      },
    }),
    (c) => c.get('container').destinationHandler.list(c)
  )

  router.post(
    '/',
    describeRoute({
      tags: ['Destinations'],
      summary: 'Create a destination',
      responses: {
        201: { description: 'Destination created', content: jsonContent(destinationResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('json', createDestinationSchema),
    (c) => c.get('container').destinationHandler.create(c)
  )

  router.get(
    '/:id',
    describeRoute({
      tags: ['Destinations'],
      summary: 'Get a destination by id',
      responses: {
        200: { description: 'Destination found', content: jsonContent(destinationResponseSchema) },
        404: { description: 'Destination not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').destinationHandler.get(c)
  )

  router.patch(
    '/:id',
    describeRoute({
      tags: ['Destinations'],
      summary: 'Update a destination',
      responses: {
        200: { description: 'Destination updated', content: jsonContent(destinationResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Destination not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    validator('json', updateDestinationSchema),
    (c) => c.get('container').destinationHandler.update(c)
  )

  router.delete(
    '/:id',
    describeRoute({
      tags: ['Destinations'],
      summary: 'Delete a destination',
      responses: {
        204: { description: 'Destination deleted' },
        404: { description: 'Destination not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').destinationHandler.delete(c)
  )

  return router
}

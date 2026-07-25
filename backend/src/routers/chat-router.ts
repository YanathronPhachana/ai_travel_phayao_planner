import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { AppEnv } from '../types'
import {
  chatMessageRequestSchema,
  chatMessageResponseSchema,
  generatePlanRequestSchema,
  generatePlanResponseSchema,
  errorResponseSchema,
} from '../schemas/chat-schemas'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createChatRouter() {
  const router = new Hono<AppEnv>()

  router.post(
    '/message',
    describeRoute({
      tags: ['Chat'],
      summary: 'Send a chat message to AI',
      responses: {
        200: { description: 'AI response', content: jsonContent(chatMessageResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('json', chatMessageRequestSchema),
    (c) => c.get('container').chatHandler.message(c)
  )

  router.post(
    '/generate-plan',
    describeRoute({
      tags: ['Chat'],
      summary: 'Generate trip plan from chat history',
      responses: {
        200: { description: 'Trip created', content: jsonContent(generatePlanResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('json', generatePlanRequestSchema),
    (c) => c.get('container').chatHandler.generatePlan(c)
  )

  return router
}

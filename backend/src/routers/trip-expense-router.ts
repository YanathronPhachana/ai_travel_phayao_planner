import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { AppEnv } from '../types'
import {
  createTripExpenseSchema,
  errorResponseSchema,
  expenseIdParamSchema,
  expenseSummaryResponseSchema,
  tripExpenseListResponseSchema,
  tripExpenseResponseSchema,
  tripIdParamSchema,
  updateTripExpenseSchema,
} from '../schemas/trip-expense-schemas'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createTripExpenseRouter() {
  const router = new Hono<AppEnv>()

  router.get(
    '/',
    describeRoute({
      tags: ['Trip Expenses'],
      summary: 'List expenses for a trip',
      responses: {
        200: { description: 'Trip expenses', content: jsonContent(tripExpenseListResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', tripIdParamSchema),
    (c) => c.get('container').tripExpenseHandler.list(c)
  )

  router.get(
    '/summary',
    describeRoute({
      tags: ['Trip Expenses'],
      summary: 'Get expense summary for a trip',
      responses: {
        200: { description: 'Expense summary', content: jsonContent(expenseSummaryResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', tripIdParamSchema),
    (c) => c.get('container').tripExpenseHandler.summary(c)
  )

  router.post(
    '/',
    describeRoute({
      tags: ['Trip Expenses'],
      summary: 'Create a trip expense',
      responses: {
        201: { description: 'Expense created', content: jsonContent(tripExpenseResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Trip not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', tripIdParamSchema),
    validator('json', createTripExpenseSchema),
    (c) => c.get('container').tripExpenseHandler.create(c)
  )

  router.patch(
    '/:id',
    describeRoute({
      tags: ['Trip Expenses'],
      summary: 'Update a trip expense',
      responses: {
        200: { description: 'Expense updated', content: jsonContent(tripExpenseResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Expense not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', expenseIdParamSchema),
    validator('json', updateTripExpenseSchema),
    (c) => c.get('container').tripExpenseHandler.update(c)
  )

  router.delete(
    '/:id',
    describeRoute({
      tags: ['Trip Expenses'],
      summary: 'Delete a trip expense',
      responses: {
        204: { description: 'Expense deleted' },
        404: { description: 'Expense not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', expenseIdParamSchema),
    (c) => c.get('container').tripExpenseHandler.delete(c)
  )

  return router
}

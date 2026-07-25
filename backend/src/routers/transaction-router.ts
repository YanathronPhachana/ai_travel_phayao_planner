import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import type { AppEnv } from '../types'
import {
  createTransactionSchema,
  errorResponseSchema,
  idParamSchema,
  summaryResponseSchema,
  transactionListResponseSchema,
  transactionResponseSchema,
  transactionTypeSchema,
  updateTransactionSchema,
} from '../schemas/transaction-schemas'

const jsonContent = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

export function createTransactionRouter() {
  const router = new Hono<AppEnv>()

  // GET / — list all transactions, optionally filter by ?type=income|expense
  router.get(
    '/',
    describeRoute({
      tags: ['Transactions'],
      summary: 'List transactions',
      description: 'Filter by ?type=income or ?type=expense. Returns all if no filter.',
      responses: {
        200: { description: 'All transactions', content: jsonContent(transactionListResponseSchema) },
      },
    }),
    (c) => c.get('container').transactionHandler.list(c)
  )

  // GET /summary — income, expense totals, balance, and breakdown by category
  router.get(
    '/summary',
    describeRoute({
      tags: ['Transactions'],
      summary: 'Get financial summary',
      description: 'Total income, total expense, balance, and category breakdown.',
      responses: {
        200: { description: 'Financial summary', content: jsonContent(summaryResponseSchema) },
      },
    }),
    (c) => c.get('container').transactionHandler.summary(c)
  )

  // POST / — create a new transaction
  router.post(
    '/',
    describeRoute({
      tags: ['Transactions'],
      summary: 'Create a transaction',
      responses: {
        201: { description: 'Transaction created', content: jsonContent(transactionResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('json', createTransactionSchema),
    (c) => c.get('container').transactionHandler.create(c)
  )

  // GET /:id — get a single transaction
  router.get(
    '/:id',
    describeRoute({
      tags: ['Transactions'],
      summary: 'Get a transaction by id',
      responses: {
        200: { description: 'Transaction found', content: jsonContent(transactionResponseSchema) },
        404: { description: 'Transaction not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').transactionHandler.get(c)
  )

  // PATCH /:id — update a transaction
  router.patch(
    '/:id',
    describeRoute({
      tags: ['Transactions'],
      summary: 'Update a transaction',
      responses: {
        200: { description: 'Transaction updated', content: jsonContent(transactionResponseSchema) },
        400: { description: 'Invalid input', content: jsonContent(errorResponseSchema) },
        404: { description: 'Transaction not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    validator('json', updateTransactionSchema),
    (c) => c.get('container').transactionHandler.update(c)
  )

  // DELETE /:id — delete a transaction
  router.delete(
    '/:id',
    describeRoute({
      tags: ['Transactions'],
      summary: 'Delete a transaction',
      responses: {
        204: { description: 'Transaction deleted' },
        404: { description: 'Transaction not found', content: jsonContent(errorResponseSchema) },
      },
    }),
    validator('param', idParamSchema),
    (c) => c.get('container').transactionHandler.delete(c)
  )

  return router
}

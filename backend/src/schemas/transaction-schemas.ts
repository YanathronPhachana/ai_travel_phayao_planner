import z from 'zod'

// HTTP contract schemas — used by routers for validation (hono-openapi
// validator) and OpenAPI spec generation. Keep in sync with domain entities.

const validCategories = [
  'food', 'transport', 'utilities', 'housing', 'entertainment',
  'health', 'education', 'shopping', 'salary', 'freelance',
  'investment', 'other',
] as const

export const transactionTypeSchema = z.enum(['income', 'expense'])
export const categorySchema = z.enum(validCategories)

export const transactionSchema = z.object({
  id: z.uuid(),
  type: transactionTypeSchema,
  amount: z.number().positive(),
  category: categorySchema,
  description: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  createdAt: z.iso.datetime(),
})

export const createTransactionSchema = z.object({
  type: transactionTypeSchema,
  amount: z.number().positive(),
  category: categorySchema,
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
})

export const updateTransactionSchema = z.object({
  type: transactionTypeSchema.optional(),
  amount: z.number().positive().optional(),
  category: categorySchema.optional(),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
})

export const idParamSchema = z.object({
  id: z.string().min(1),
})

export const dateRangeQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const typeQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
})

export const transactionResponseSchema = z.object({ data: transactionSchema })
export const transactionListResponseSchema = z.object({ data: z.array(transactionSchema) })
export const summaryResponseSchema = z.object({
  data: z.object({
    totalIncome: z.number(),
    totalExpense: z.number(),
    balance: z.number(),
    byCategory: z.record(z.string(), z.number()),
  }),
})

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

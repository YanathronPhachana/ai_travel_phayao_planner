import z from 'zod'

const validCategories = ['transport', 'food', 'accommodation', 'activities', 'other'] as const

export const expenseCategorySchema = z.enum(validCategories)

export const tripExpenseSchema = z.object({
  id: z.uuid(),
  tripId: z.uuid(),
  category: expenseCategorySchema,
  itemName: z.string(),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  notes: z.string(),
  createdAt: z.iso.datetime(),
})

export const createTripExpenseSchema = z.object({
  tripId: z.uuid(),
  category: expenseCategorySchema,
  itemName: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  notes: z.string().optional(),
})

export const updateTripExpenseSchema = z.object({
  category: expenseCategorySchema.optional(),
  itemName: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  notes: z.string().optional(),
})

export const tripIdParamSchema = z.object({
  tripId: z.string().min(1),
})

export const expenseIdParamSchema = z.object({
  tripId: z.string().min(1),
  id: z.string().min(1),
})

export const tripExpenseResponseSchema = z.object({ data: tripExpenseSchema })
export const tripExpenseListResponseSchema = z.object({ data: z.array(tripExpenseSchema) })
export const expenseSummaryResponseSchema = z.object({
  data: z.object({
    total: z.number(),
    byCategory: z.record(z.string(), z.number()),
  }),
})

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

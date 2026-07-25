import z from 'zod'

export const tripSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  totalBudget: z.number().nullable(),
  notes: z.string(),
  destinationIds: z.array(z.string()),
  createdAt: z.iso.datetime(),
})

export const createTripSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  totalBudget: z.number().positive().optional(),
  notes: z.string().optional(),
  destinationIds: z.array(z.string()).optional(),
})

export const updateTripSchema = createTripSchema.partial().extend({
  totalBudget: z.number().positive().nullable().optional(),
})

export const idParamSchema = z.object({
  id: z.string().min(1),
})

export const tripResponseSchema = z.object({ data: tripSchema })
export const tripListResponseSchema = z.object({ data: z.array(tripSchema) })

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

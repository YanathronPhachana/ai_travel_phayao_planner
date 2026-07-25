import z from 'zod'
import { tripSchema } from './trip-schemas'

export const chatMessageRequestSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
})

export const chatMessageResponseSchema = z.object({
  data: z.object({
    reply: z.string(),
    suggestions: z.array(z.string()).optional(),
    sessionId: z.string(),
  }),
})

export const generatePlanRequestSchema = z.object({
  sessionId: z.string().min(1),
  tripName: z.string().optional(),
})

export const generatePlanResponseSchema = z.object({
  data: z.object({
    tripId: z.string(),
    trip: tripSchema,
  }),
})

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

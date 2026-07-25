import z from 'zod'

const validTypes = ['hotel', 'resort', 'guesthouse', 'hostel', 'other'] as const

export const accommodationTypeSchema = z.enum(validTypes)

export const accommodationSchema = z.object({
  id: z.uuid(),
  tripId: z.uuid(),
  name: z.string(),
  type: accommodationTypeSchema,
  pricePerNight: z.number().positive().nullable(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  totalCost: z.number().positive().nullable(),
  address: z.string(),
  phone: z.string(),
  notes: z.string(),
  createdAt: z.iso.datetime(),
})

export const createAccommodationSchema = z.object({
  tripId: z.uuid(),
  name: z.string().min(1),
  type: accommodationTypeSchema,
  pricePerNight: z.number().positive().optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  totalCost: z.number().positive().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

export const updateAccommodationSchema = z.object({
  name: z.string().min(1).optional(),
  type: accommodationTypeSchema.optional(),
  pricePerNight: z.number().positive().nullable().optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  totalCost: z.number().positive().nullable().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

export const tripIdParamSchema = z.object({
  tripId: z.string().min(1),
})

export const accommodationIdParamSchema = z.object({
  tripId: z.string().min(1),
  id: z.string().min(1),
})

export const accommodationResponseSchema = z.object({ data: accommodationSchema })
export const accommodationListResponseSchema = z.object({ data: z.array(accommodationSchema) })

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

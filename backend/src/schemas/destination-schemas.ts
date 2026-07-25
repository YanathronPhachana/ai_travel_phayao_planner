import z from 'zod'

const validCategories = [
  'nature', 'temple', 'landmark', 'restaurant', 'activity',
  'waterfall', 'mountain', 'market', 'other',
] as const

export const destinationCategorySchema = z.enum(validCategories)

export const destinationSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category: destinationCategorySchema,
  description: z.string(),
  location: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.iso.datetime(),
})

export const createDestinationSchema = z.object({
  name: z.string().min(1),
  category: destinationCategorySchema,
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
})

export const updateDestinationSchema = createDestinationSchema.partial()

export const idParamSchema = z.object({
  id: z.string().min(1),
})

export const destinationResponseSchema = z.object({ data: destinationSchema })
export const destinationListResponseSchema = z.object({ data: z.array(destinationSchema) })

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

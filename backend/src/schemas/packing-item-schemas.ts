import z from 'zod'

const validCategories = ['clothing', 'toiletries', 'electronics', 'documents', 'medical', 'other'] as const

export const packingCategorySchema = z.enum(validCategories)

export const packingItemSchema = z.object({
  id: z.uuid(),
  tripId: z.uuid(),
  category: packingCategorySchema,
  itemName: z.string(),
  quantity: z.number().positive().nullable(),
  isChecked: z.boolean(),
  notes: z.string(),
  createdAt: z.iso.datetime(),
})

export const createPackingItemSchema = z.object({
  tripId: z.uuid(),
  category: packingCategorySchema,
  itemName: z.string().min(1),
  quantity: z.number().positive().optional(),
  notes: z.string().optional(),
})

export const updatePackingItemSchema = z.object({
  category: packingCategorySchema.optional(),
  itemName: z.string().min(1).optional(),
  quantity: z.number().positive().nullable().optional(),
  isChecked: z.boolean().optional(),
  notes: z.string().optional(),
})

export const tripIdParamSchema = z.object({
  tripId: z.string().min(1),
})

export const packingItemIdParamSchema = z.object({
  tripId: z.string().min(1),
  id: z.string().min(1),
})

export const packingItemResponseSchema = z.object({ data: packingItemSchema })
export const packingItemListResponseSchema = z.object({ data: z.array(packingItemSchema) })

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

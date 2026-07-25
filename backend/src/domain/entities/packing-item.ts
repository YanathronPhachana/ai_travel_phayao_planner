export interface PackingItem {
  id: string
  tripId: string
  category: PackingCategory
  itemName: string
  quantity: number | null
  isChecked: boolean
  notes: string
  createdAt: string
}

export type PackingCategory =
  | 'clothing'
  | 'toiletries'
  | 'electronics'
  | 'documents'
  | 'medical'
  | 'other'

export interface CreatePackingItemInput {
  tripId: string
  category: PackingCategory
  itemName: string
  quantity?: number
  notes?: string
}

export interface UpdatePackingItemInput {
  category?: PackingCategory
  itemName?: string
  quantity?: number | null
  isChecked?: boolean
  notes?: string
}

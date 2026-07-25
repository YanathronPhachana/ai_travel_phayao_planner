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

export interface CreatePackingItemBody {
  tripId: string
  category: PackingCategory
  itemName: string
  quantity?: number
  notes?: string
}

export interface UpdatePackingItemBody {
  category?: PackingCategory
  itemName?: string
  quantity?: number | null
  isChecked?: boolean
  notes?: string
}

export interface PackingItemListResponse {
  data: PackingItem[]
}

export interface PackingItemResponse {
  data: PackingItem
}

export const packingCategoryLabels: Record<PackingCategory, string> = {
  clothing: 'เสื้อผ้า',
  toiletries: 'ของใช้ส่วนตัว',
  electronics: 'อุปกรณ์อิเล็กทรอนิกส์',
  documents: 'เอกสาร',
  medical: 'ยา/อุปกรณ์การแพทย์',
  other: 'อื่นๆ',
}

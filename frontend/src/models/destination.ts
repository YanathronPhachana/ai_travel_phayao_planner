export interface Destination {
  id: string
  name: string
  category: DestinationCategory
  description: string
  location: string
  imageUrl: string | null
  createdAt: string
}

export type DestinationCategory =
  | 'nature'
  | 'temple'
  | 'landmark'
  | 'restaurant'
  | 'activity'
  | 'waterfall'
  | 'mountain'
  | 'market'
  | 'other'

export interface CreateDestinationBody {
  name: string
  category: DestinationCategory
  description?: string
  location?: string
  imageUrl?: string
}

export interface UpdateDestinationBody {
  name?: string
  category?: DestinationCategory
  description?: string
  location?: string
  imageUrl?: string
}

export interface DestinationListResponse {
  data: Destination[]
}

export interface DestinationResponse {
  data: Destination
}

export const destinationCategoryLabels: Record<DestinationCategory, string> = {
  nature: 'ธรรมชาติ',
  temple: 'วัด',
  landmark: 'แลนด์มาร์ก',
  restaurant: 'ร้านอาหาร',
  activity: 'กิจกรรม',
  waterfall: 'น้ำตก',
  mountain: 'ภูเขา',
  market: 'ตลาด',
  other: 'อื่นๆ',
}

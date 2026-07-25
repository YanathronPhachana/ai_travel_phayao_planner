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

export interface CreateDestinationInput {
  name: string
  category: DestinationCategory
  description?: string
  location?: string
  imageUrl?: string
}

export interface UpdateDestinationInput {
  name?: string
  category?: DestinationCategory
  description?: string
  location?: string
  imageUrl?: string
}

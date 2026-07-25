export interface Accommodation {
  id: string
  tripId: string
  name: string
  type: AccommodationType
  pricePerNight: number | null
  checkIn: string | null
  checkOut: string | null
  totalCost: number | null
  address: string
  phone: string
  notes: string
  createdAt: string
}

export type AccommodationType =
  | 'hotel'
  | 'resort'
  | 'guesthouse'
  | 'hostel'
  | 'other'

export interface CreateAccommodationInput {
  tripId: string
  name: string
  type: AccommodationType
  pricePerNight?: number
  checkIn?: string
  checkOut?: string
  totalCost?: number
  address?: string
  phone?: string
  notes?: string
}

export interface UpdateAccommodationInput {
  name?: string
  type?: AccommodationType
  pricePerNight?: number | null
  checkIn?: string | null
  checkOut?: string | null
  totalCost?: number | null
  address?: string
  phone?: string
  notes?: string
}

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

export interface CreateAccommodationBody {
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

export interface UpdateAccommodationBody {
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

export interface AccommodationListResponse {
  data: Accommodation[]
}

export interface AccommodationResponse {
  data: Accommodation
}

export const accommodationTypeLabels: Record<AccommodationType, string> = {
  hotel: 'โรงแรม',
  resort: 'รีสอร์ท',
  guesthouse: 'เกสต์เฮาส์',
  hostel: 'โฮสเทล',
  other: 'อื่นๆ',
}

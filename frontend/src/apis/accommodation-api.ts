import type { AccommodationListResponse, AccommodationResponse, CreateAccommodationBody, UpdateAccommodationBody } from '@/models'
import { request } from './request'

const base = (tripId: string) => `${import.meta.env.VITE_BACKEND_URL}/api/v1/trips/${tripId}/accommodations`

export const accommodationApi = {
  list: (tripId: string) => request<AccommodationListResponse>(base(tripId)),
  create: (tripId: string, body: CreateAccommodationBody) =>
    request<AccommodationResponse>(base(tripId), { method: 'POST', body: JSON.stringify(body) }),
  update: (tripId: string, id: string, body: UpdateAccommodationBody) =>
    request<AccommodationResponse>(`${base(tripId)}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (tripId: string, id: string) => request<void>(`${base(tripId)}/${id}`, { method: 'DELETE' }),
}

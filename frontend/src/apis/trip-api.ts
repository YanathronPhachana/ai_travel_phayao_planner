import type { CreateTripBody, TripListResponse, TripResponse, UpdateTripBody } from '@/models'
import { request } from './request'

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/trips`

export const tripApi = {
  list: () => request<TripListResponse>(BASE),
  get: (id: string) => request<TripResponse>(`${BASE}/${id}`),
  create: (body: CreateTripBody) =>
    request<TripResponse>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: UpdateTripBody) =>
    request<TripResponse>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
}

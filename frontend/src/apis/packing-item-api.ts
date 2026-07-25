import type { CreatePackingItemBody, PackingItemListResponse, PackingItemResponse, UpdatePackingItemBody } from '@/models'
import { request } from './request'

const base = (tripId: string) => `${import.meta.env.VITE_BACKEND_URL}/api/v1/trips/${tripId}/packing`

export const packingItemApi = {
  list: (tripId: string) => request<PackingItemListResponse>(base(tripId)),
  create: (tripId: string, body: CreatePackingItemBody) =>
    request<PackingItemResponse>(base(tripId), { method: 'POST', body: JSON.stringify(body) }),
  update: (tripId: string, id: string, body: UpdatePackingItemBody) =>
    request<PackingItemResponse>(`${base(tripId)}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (tripId: string, id: string) => request<void>(`${base(tripId)}/${id}`, { method: 'DELETE' }),
}

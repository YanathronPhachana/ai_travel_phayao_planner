import type { CreateDestinationBody, DestinationListResponse, DestinationResponse, UpdateDestinationBody } from '@/models'
import { request } from './request'

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/destinations`

export const destinationApi = {
  list: (category?: string) =>
    request<DestinationListResponse>(category ? `${BASE}?category=${category}` : BASE),
  get: (id: string) => request<DestinationResponse>(`${BASE}/${id}`),
  create: (body: CreateDestinationBody) =>
    request<DestinationResponse>(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: UpdateDestinationBody) =>
    request<DestinationResponse>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
}

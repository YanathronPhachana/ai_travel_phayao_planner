import type { CreateTripExpenseBody, ExpenseSummaryResponse, TripExpenseListResponse, TripExpenseResponse, UpdateTripExpenseBody } from '@/models'
import { request } from './request'

const base = (tripId: string) => `${import.meta.env.VITE_BACKEND_URL}/api/v1/trips/${tripId}/expenses`

export const tripExpenseApi = {
  list: (tripId: string) => request<TripExpenseListResponse>(base(tripId)),
  summary: (tripId: string) => request<ExpenseSummaryResponse>(`${base(tripId)}/summary`),
  create: (tripId: string, body: CreateTripExpenseBody) =>
    request<TripExpenseResponse>(base(tripId), { method: 'POST', body: JSON.stringify(body) }),
  update: (tripId: string, id: string, body: UpdateTripExpenseBody) =>
    request<TripExpenseResponse>(`${base(tripId)}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (tripId: string, id: string) => request<void>(`${base(tripId)}/${id}`, { method: 'DELETE' }),
}

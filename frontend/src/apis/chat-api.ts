import type { ChatResponse, GeneratePlanResponse } from '@/models'
import { request } from './request'

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat`

export const chatApi = {
  sendMessage: (text: string, sessionId?: string) =>
    request<{ data: ChatResponse }>(`${BASE}/message`, {
      method: 'POST',
      body: JSON.stringify({ message: text, sessionId }),
    }),
  generatePlan: (sessionId: string, tripName?: string) =>
    request<GeneratePlanResponse>(`${BASE}/generate-plan`, {
      method: 'POST',
      body: JSON.stringify({ sessionId, tripName }),
    }),
}

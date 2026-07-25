import type { Trip } from './trip'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  timestamp: string
}

export interface ChatResponse {
  reply: string
  suggestions?: string[]
  sessionId?: string
}

export interface GeneratePlanResponse {
  data: {
    tripId: string
    trip: Trip
  }
}

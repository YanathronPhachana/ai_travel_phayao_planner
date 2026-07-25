import type { Context } from 'hono'
import { ValidationError } from '../domain/errors'
import type { ChatService } from '../services/chat-service'

export class ChatHandler {
  constructor(private readonly chatService: ChatService) {}

  message = async (c: Context) => {
    const body = await this.parseJson<{ message: string; sessionId?: string }>(c)
    if (!body.message?.trim()) {
      throw new ValidationError('message is required')
    }
    const response = await this.chatService.respond(body.message.trim(), body.sessionId)
    return c.json({ data: response })
  }

  generatePlan = async (c: Context) => {
    const body = await this.parseJson<{ sessionId: string; tripName?: string }>(c)
    if (!body.sessionId?.trim()) {
      throw new ValidationError('sessionId is required')
    }
    const result = await this.chatService.generatePlan(body.sessionId.trim(), body.tripName)
    return c.json({ data: { tripId: result.trip.id, trip: result.trip } })
  }

  private async parseJson<T>(c: Context): Promise<T> {
    try {
      return await c.req.json<T>()
    } catch {
      throw new ValidationError('Invalid JSON body')
    }
  }
}

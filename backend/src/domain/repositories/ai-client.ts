export interface AiMessage {
  role: 'user' | 'model'
  text: string
}

export interface AiClient {
  generateReply(systemPrompt: string, history: AiMessage[]): Promise<string>
}

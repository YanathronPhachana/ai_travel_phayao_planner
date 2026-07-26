import type { AiClient, AiMessage } from '../../domain/repositories/ai-client'

const DEFAULT_MODEL = 'gemini-2.5-flash'

export class GeminiClient implements AiClient {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = DEFAULT_MODEL
  ) {}

  async generateReply(systemPrompt: string, history: AiMessage[]): Promise<string> {
    if (!this.apiKey) throw new Error('GEMINI_API_KEY is not configured')

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error ${response.status}: ${await response.text()}`)
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Gemini API returned no content')
    return text
  }
}

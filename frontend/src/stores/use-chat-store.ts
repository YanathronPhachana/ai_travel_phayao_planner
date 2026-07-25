import { defineStore } from 'pinia'
import { chatApi } from '@/apis/chat-api'
import type { ChatMessage } from '@/models'

function generateId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export const useChatStore = defineStore('ChatStore', () => {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const sessionId = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function sendMessage(text: string) {
    if (!text.trim()) return
    isLoading.value = true
    error.value = null

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    }
    messages.value.push(userMsg)

    try {
      const res = await chatApi.sendMessage(text.trim(), sessionId.value ?? undefined)
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'ai',
        text: res.data.reply,
        timestamp: new Date().toISOString(),
      }
      messages.value.push(aiMsg)
      sessionId.value = res.data.sessionId
    }
    catch (e: any) {
      error.value = e.message || 'เกิดข้อผิดพลาด'
      const errMsg: ChatMessage = {
        id: generateId(),
        role: 'ai',
        text: 'ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
        timestamp: new Date().toISOString(),
      }
      messages.value.push(errMsg)
    }
    finally {
      isLoading.value = false
    }
  }

  async function generatePlan(tripName?: string) {
    if (!sessionId.value) {
      error.value = 'ยังไม่มีบทสนทนา กรุณาส่งข้อความก่อน'
      return null
    }
    isLoading.value = true
    error.value = null
    try {
      const res = await chatApi.generatePlan(sessionId.value, tripName)
      return res.data.tripId
    }
    catch (e: any) {
      error.value = e.message || 'เกิดข้อผิดพลาดในการสร้างแผน'
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  function resetChat() {
    messages.value = []
    sessionId.value = null
    error.value = null
  }

  return { messages, isLoading, sessionId, error, sendMessage, generatePlan, resetChat }
})

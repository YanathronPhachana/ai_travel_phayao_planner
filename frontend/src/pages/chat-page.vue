<script setup lang="ts">
import { onMounted, ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSEO } from '@/composables/useSEO'
import { useChatStore } from '@/stores/use-chat-store'
import type { ChatMessage } from '@/models'

useSEO({
  title: 'AI วางแผนเที่ยว - AI Travel Phayao Planner',
  description: 'แชทกับ AI เพื่อวางแผนท่องเที่ยวพะเยา',
  keywords: ['AI', 'chat', 'travel planner', 'phayao'],
})

const router = useRouter()
const chatStore = useChatStore()
const inputText = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const isTyping = ref(false)
const showSummary = ref(false)

onMounted(() => {
  if (chatStore.messages.length === 0) {
    chatStore.sendMessage('สวัสดี')
  }
})

watch(() => chatStore.messages.length, async () => {
  await nextTick()
  scrollToBottom()
})

watch(() => chatStore.isLoading, (val) => {
  isTyping.value = val
})

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function sendMessage() {
  if (!inputText.value.trim() || chatStore.isLoading) return
  chatStore.sendMessage(inputText.value.trim())
  inputText.value = ''
}

function sendSuggestion(text: string) {
  if (chatStore.isLoading) return
  chatStore.sendMessage(text)
}

const latestAiMessage = computed<ChatMessage | null>(() => {
  for (let i = chatStore.messages.length - 1; i >= 0; i--) {
    if (chatStore.messages[i]!.role === 'ai') return chatStore.messages[i]!
  }
  return null
})

const latestSuggestions = computed(() => {
  const msgs = chatStore.messages
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]!.role === 'ai') {
      // suggestions come from API response but aren't stored per message
      // We'll show generic suggestions based on content
      return buildSuggestions(msgs[i]!.text)
    }
  }
  return []
})

function buildSuggestions(aiText: string): string[] {
  const s: string[] = []
  if (!/งบ|ค่าใช้จ่าย|ราคา/.test(aiText)) s.push('คำนวณงบประมาณ')
  if (!/ที่พัก|โรงแรม/.test(aiText)) s.push('แนะนำที่พัก')
  if (!/อาหาร|กิน|ร้าน/.test(aiText)) s.push('ร้านอาหารแนะนำ')
  if (s.length === 0) s.push('สรุปแผนเที่ยว')
  return s.slice(0, 3)
}

const canGeneratePlan = computed(() => {
  return chatStore.messages.filter(m => m.role === 'user').length >= 2
})

const summaryInfo = computed(() => {
  const allText = chatStore.messages.map(m => m.text).join(' ')
  const dayMatch = allText.match(/(\d+)\s*วัน/)
  const nightMatch = allText.match(/(\d+)\s*คืน/)
  const places = extractPlaces(allText)
  return {
    days: dayMatch ? `${dayMatch[1]} วัน ${nightMatch ? nightMatch[1] : Math.max(1, parseInt(dayMatch[1], 10) - 1)} คืน` : 'ยังไม่ระบุ',
    places: places.length > 0 ? places.join(' และ ') : 'พะเยา',
    budget: allText.match(/งบ|ค่าใช้จ่าย|ราคา|฿/) ? 'มีการประมาณงบแล้ว' : 'ยังไม่ประมาณงบ',
  }
})

function extractPlaces(text: string): string[] {
  const places: string[] = []
  const p = ['กว๊านพะเยา', 'วัดติโลกอาราม', 'วัดอนาลโย', 'น้ำตกธารทิพย์', 'ดอยบุษราคัม', 'ภูชี้ฟ้า', 'ตลาดเช้าพะเยา']
  for (const place of p) {
    if (text.includes(place)) places.push(place)
  }
  return places
}

async function onGeneratePlan() {
  const tripId = await chatStore.generatePlan()
  if (tripId) {
    router.push({ name: 'trip-detail-page', params: { tripId } })
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div>
    <VAlert v-if="chatStore.error" type="error" class="mb-4" :text="chatStore.error" closable @click:close="chatStore.error = null" />

    <VCard class="mb-4 chat-card" elevation="1">
      <div class="chat-banner">
        <div class="chat-banner-overlay" />
        <div class="chat-banner-content">
          <VIcon icon="ri-robot-2-line" size="26" />
          <div>
            <div class="chat-banner-title">AI Travel Phayao Plan</div>
            <div class="chat-banner-subtitle">คุยกับ AI เพื่อวางแผนเที่ยวกว๊านพะเยา</div>
          </div>
        </div>
      </div>

      <div ref="chatContainer" class="chat-container pa-4">
        <div
          v-for="msg in chatStore.messages"
          :key="msg.id"
          class="d-flex mb-3"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="chat-bubble px-4 py-3"
            :class="msg.role === 'user' ? 'user-bubble' : 'ai-bubble'"
          >
            <div class="text-pre-wrap" style="white-space: pre-wrap;">
              {{ msg.text }}
            </div>
            <div
              class="text-caption mt-1"
              :class="msg.role === 'user' ? 'text-medium-emphasis text-end' : 'text-medium-emphasis'"
            >
              {{ formatTime(msg.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="d-flex justify-start mb-3">
          <div class="chat-bubble ai-bubble px-4 py-3">
            <div class="d-flex align-center gap-1">
              <div class="typing-dot" />
              <div class="typing-dot" style="animation-delay: 0.15s" />
              <div class="typing-dot" style="animation-delay: 0.3s" />
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div v-if="canGeneratePlan" class="px-4 pb-3">
        <VExpandTransition>
          <VCard
            v-show="showSummary || true"
            class="mb-3 summary-card"
            variant="flat"
          >
            <VCardText class="py-3">
              <div class="d-flex align-center gap-2 mb-2">
                <VIcon icon="ri-file-list-3-line" color="#1f9d78" />
                <span class="font-weight-medium">สรุปแผนเที่ยว</span>
              </div>
              <div class="text-body-2">
                <div>ระยะเวลา: {{ summaryInfo.days }}</div>
                <div>สถานที่: {{ summaryInfo.places }}</div>
                <div>งบประมาณ: {{ summaryInfo.budget }}</div>
              </div>
              <VBtn
                class="mt-3 generate-btn"
                variant="flat"
                prepend-icon="ri-magic-line"
                :loading="chatStore.isLoading"
                @click="onGeneratePlan"
              >
                ✨ สร้างแผนเที่ยว
              </VBtn>
            </VCardText>
          </VCard>
        </VExpandTransition>
      </div>

      <!-- Suggestion chips -->
      <div v-if="latestSuggestions.length > 0 && !isTyping" class="px-4 pb-2">
        <div class="d-flex flex-wrap gap-2">
          <VChip
            v-for="s in latestSuggestions"
            :key="s"
            color="#1f9d78"
            variant="tonal"
            size="small"
            class="cursor-pointer"
            @click="sendSuggestion(s)"
          >
            {{ s }}
          </VChip>
        </div>
      </div>

      <!-- Input area -->
      <VDivider />
      <div class="d-flex align-center pa-3 gap-2">
        <VTextField
          v-model="inputText"
          placeholder="พิมพ์ข้อความ..."
          variant="outlined"
          density="comfortable"
          hide-details
          class="flex-grow-1"
          @keydown.enter.prevent="sendMessage"
        />
        <VBtn
          class="send-btn"
          icon
          variant="flat"
          :disabled="!inputText.trim() || chatStore.isLoading"
          @click="sendMessage"
        >
          <VIcon icon="ri-send-plane-line" />
        </VBtn>
      </div>
    </VCard>
  </div>
</template>

<style scoped>
.chat-card {
  overflow: hidden;
  /* Subtle green/blue tint layered over the theme's own surface color
     (not a fixed light color) so text fields and default card text keep
     correct contrast in both light and dark mode. */
  background:
    linear-gradient(180deg, rgb(31 157 120 / 8%) 0%, rgb(53 167 201 / 8%) 100%),
    rgb(var(--v-theme-surface));
}

.chat-banner {
  position: relative;
  height: 110px;
  background-image: url('/image-proxy.png');
  background-size: cover;
  background-position: center 65%;
}

.chat-banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgb(15 64 52 / 78%) 0%, rgb(25 100 110 / 68%) 100%);
}

.chat-banner-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-inline: 20px;
  color: #ffffff;
}

.chat-banner-title {
  font-size: 1.125rem;
  font-weight: 700;
}

.chat-banner-subtitle {
  font-size: 0.8125rem;
  opacity: 0.9;
}

.chat-container {
  max-height: 60vh;
  min-height: 300px;
  overflow-y: auto;
}

.summary-card {
  background: linear-gradient(180deg, rgb(31 157 120 / 12%) 0%, rgb(53 167 201 / 12%) 100%), rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

.generate-btn,
.send-btn {
  background: linear-gradient(135deg, #1f9d78, #35a7c9) !important;
  color: #ffffff !important;
}

.chat-bubble {
  max-width: 80%;
  border-radius: 16px;
  word-break: break-word;
}

.user-bubble {
  background: linear-gradient(135deg, #1f9d78, #35a7c9);
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-bubble {
  background-color: #e3f5ef;
  color: #0f4034;
  border-bottom-left-radius: 4px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  background-color: #1f9d78;
  border-radius: 50%;
  animation: typingBounce 0.6s infinite alternate;
}

@keyframes typingBounce {
  0% { transform: translateY(0); opacity: 0.4; }
  100% { transform: translateY(-4px); opacity: 1; }
}

.text-pre-wrap {
  white-space: pre-wrap;
}
</style>

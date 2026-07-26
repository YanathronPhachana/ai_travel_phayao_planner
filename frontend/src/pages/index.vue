<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'

definePage({
  meta: {
    layout: 'blank',
  },
})

useSEO({
  title: 'AI Travel Phayao Plan',
  description: 'เริ่มต้นวางแผนเที่ยวพะเยากับ AI Travel Phayao Plan',
  keywords: ['welcome', 'phayao', 'travel', 'kwan phayao'],
})

const router = useRouter()
const revealed = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    revealed.value = true
  })
})

function go(name: string) {
  router.push({ name })
}
</script>

<template>
  <div class="welcome-hero">
    <div class="hero-bg" />
    <div class="hero-overlay" />

    <!-- Content -->
    <div class="hero-content">
      <div class="hero-badge" :class="{ 'is-in': revealed }">
        <VIcon icon="ri-map-pin-2-line" size="16" class="mr-1" />
        กว๊านพะเยา · จังหวัดพะเยา
      </div>

      <h1 class="hero-title" :class="{ 'is-in': revealed }">
        Welcome to <span class="hero-title-accent">Phayao</span>
      </h1>

      <p class="hero-subtitle" :class="{ 'is-in': revealed }">
        Click any button
      </p>

      <div class="hero-actions" :class="{ 'is-in': revealed }">
        <VBtn
          size="large"
          rounded="pill"
          color="primary"
          prepend-icon="ri-magic-line"
          class="hero-btn"
          @click="go('chat-page')"
        >
          เริ่มวางแผนเที่ยวกับ AI
        </VBtn>
        <VBtn
          size="large"
          rounded="pill"
          variant="tonal"
          color="primary"
          prepend-icon="ri-suitcase-3-line"
          class="hero-btn"
          @click="go('trip-page')"
        >
          จัดการทริปของฉัน
        </VBtn>
      </div>

      <div class="scroll-hint" :class="{ 'is-in': revealed }">
        <VIcon icon="ri-arrow-down-line" size="20" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/image-proxy.png');
  background-size: cover;
  background-position: center;
  animation: kenBurns 24s ease-in-out infinite alternate;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(6 40 34 / 35%) 0%,
    rgb(8 46 40 / 45%) 45%,
    rgb(6 35 30 / 75%) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 720px;
  margin-inline: auto;
  padding: 32px 24px 56px;
  text-align: center;
  color: #ffffff;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 18%);
  backdrop-filter: blur(6px);
  border: 1px solid rgb(255 255 255 / 30%);
  font-size: 0.8125rem;
  font-weight: 600;
  color: #eafff6;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.hero-title {
  margin-block: 20px 12px;
  font-size: clamp(2.25rem, 6vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 0 4px 28px rgb(0 0 0 / 35%);
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease 0.08s, transform 0.7s ease 0.08s;
}

.hero-title-accent {
  background: linear-gradient(90deg, #6ee7b7, #7dd3fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  margin-bottom: 32px;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #eafff6;
  text-shadow: 0 2px 12px rgb(0 0 0 / 30%);
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease 0.28s, transform 0.7s ease 0.28s;
}

.hero-btn {
  text-transform: none;
  font-weight: 600;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgb(0 0 0 / 25%);
}

.hero-badge.is-in,
.hero-title.is-in,
.hero-subtitle.is-in,
.hero-actions.is-in {
  opacity: 1;
  transform: translateY(0);
}

.scroll-hint {
  margin-top: 40px;
  color: #ffffff;
  opacity: 0;
  animation: bob 2.2s ease-in-out infinite;
  transition: opacity 0.7s ease 0.4s;
}

.scroll-hint.is-in {
  opacity: 0.75;
}

@keyframes kenBurns {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.08) translate(-1%, -1%); }
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg, .scroll-hint {
    animation: none !important;
  }
}
</style>

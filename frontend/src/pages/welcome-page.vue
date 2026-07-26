<route lang="json">
{
  "name": "welcome-page"
}
</route>

<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'

definePage({
  meta: {
    layout: 'blank',
  },
})

useSEO({
  title: 'ยินดีต้อนรับ - AI Travel Phayao Planner',
  description: 'เริ่มต้นวางแผนเที่ยวพะเยากับ AI Travel Phayao Planner',
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
    <!-- Background illustration -->
    <svg
      class="hero-svg"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#eaf9f4" />
          <stop offset="55%" stop-color="#dcf3ee" />
          <stop offset="100%" stop-color="#bfe8f2" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#d6f5ec" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#d6f5ec" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#a9d8c9" />
          <stop offset="100%" stop-color="#8fcdba" />
        </linearGradient>
        <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4f9c7f" />
          <stop offset="100%" stop-color="#357a63" />
        </linearGradient>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#bfe9ea" />
          <stop offset="100%" stop-color="#9adfe0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1600" height="900" fill="url(#sky)" />
      <circle class="hero-sun" cx="1260" cy="200" r="230" fill="url(#sun)" />
      <circle cx="1260" cy="200" r="60" fill="#ffffff" opacity="0.9" />

      <!-- clouds -->
      <g class="cloud cloud-a" fill="#ffffff" opacity="0.85">
        <ellipse cx="230" cy="150" rx="90" ry="30" />
        <ellipse cx="300" cy="140" rx="65" ry="26" />
        <ellipse cx="170" cy="140" rx="55" ry="22" />
      </g>
      <g class="cloud cloud-b" fill="#ffffff" opacity="0.75">
        <ellipse cx="820" cy="110" rx="70" ry="24" />
        <ellipse cx="875" cy="102" rx="50" ry="20" />
      </g>

      <!-- far mountains -->
      <path
        d="M0,560 L120,470 L260,540 L420,430 L600,540 L760,460 L940,550 L1120,440 L1300,540 L1460,470 L1600,540 L1600,650 L0,650 Z"
        fill="url(#mtnFar)"
        opacity="0.7"
      />

      <!-- near mountains -->
      <path
        d="M0,620 L180,510 L360,610 L560,500 L780,620 L1000,520 L1220,620 L1400,540 L1600,610 L1600,700 L0,700 Z"
        fill="url(#mtnNear)"
        opacity="0.85"
      />

      <!-- lake -->
      <rect x="0" y="660" width="1600" height="240" fill="url(#lake)" />

      <!-- water ripples -->
      <g class="ripple ripple-1" stroke="#eafaf6" stroke-width="6" fill="none" opacity="0.6">
        <path d="M-200,720 Q100,700 400,720 T1000,720 T1600,720 T2200,720" />
      </g>
      <g class="ripple ripple-2" stroke="#eafaf6" stroke-width="5" fill="none" opacity="0.45">
        <path d="M-200,790 Q100,770 400,790 T1000,790 T1600,790 T2200,790" />
      </g>
      <g class="ripple ripple-3" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.4">
        <path d="M-200,850 Q100,835 400,850 T1000,850 T1600,850 T2200,850" />
      </g>

      <!-- boat -->
      <g class="boat">
        <path d="M760,760 q40,-14 80,0 l-10,16 h-60 z" fill="#2f6f5b" />
        <line x1="800" y1="760" x2="800" y2="722" stroke="#2f6f5b" stroke-width="3" />
        <path d="M800,724 L830,748 L800,748 Z" fill="#ffffff" opacity="0.9" />
      </g>

      <!-- birds -->
      <g class="birds" stroke="#2f6f5b" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7">
        <path d="M120,240 q10,-14 20,0 q10,-14 20,0" />
        <path d="M170,270 q8,-11 16,0 q8,-11 16,0" />
        <path d="M1000,180 q9,-12 18,0 q9,-12 18,0" />
      </g>
    </svg>

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
          prepend-icon="ri-compass-3-line"
          class="hero-btn"
          @click="go('destination-page')"
        >
          ดูสถานที่ท่องเที่ยว
        </VBtn>
        <VBtn
          size="large"
          rounded="pill"
          variant="outlined"
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

.hero-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(255 255 255 / 10%) 0%, rgb(10 40 35 / 10%) 60%, rgb(6 35 30 / 30%) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 720px;
  margin-inline: auto;
  padding: 32px 24px 56px;
  text-align: center;
  color: #0d3b2e;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(6px);
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1f6d54;
  box-shadow: 0 4px 16px rgb(15 60 45 / 12%);
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.hero-title {
  margin-block: 20px 12px;
  font-size: clamp(2.25rem, 6vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  color: #0f4034;
  text-shadow: 0 2px 24px rgb(255 255 255 / 60%);
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease 0.08s, transform 0.7s ease 0.08s;
}

.hero-title-accent {
  background: linear-gradient(90deg, #1f9d78, #35a7c9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  margin-bottom: 32px;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #1c5c4a;
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
  box-shadow: 0 10px 24px rgb(15 60 45 / 18%);
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
  color: #1f6d54;
  opacity: 0;
  animation: bob 2.2s ease-in-out infinite;
  transition: opacity 0.7s ease 0.4s;
}

.scroll-hint.is-in {
  opacity: 0.75;
}

/* Background animations */
.cloud {
  animation: driftCloud 40s linear infinite;
}

.cloud-b {
  animation-duration: 55s;
  animation-direction: reverse;
}

.hero-sun {
  animation: glow 6s ease-in-out infinite;
  transform-origin: 1260px 200px;
}

.ripple {
  animation: ripple 9s ease-in-out infinite;
}

.ripple-2 {
  animation-duration: 11s;
  animation-delay: -3s;
}

.ripple-3 {
  animation-duration: 7.5s;
  animation-delay: -1.5s;
}

.boat {
  animation: bobBoat 4.5s ease-in-out infinite;
  transform-origin: 800px 760px;
}

.birds {
  animation: fly 14s linear infinite;
}

@keyframes driftCloud {
  0% { transform: translateX(-10%); }
  100% { transform: translateX(10%); }
}

@keyframes glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.04); }
}

@keyframes ripple {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(60px); }
}

@keyframes bobBoat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(-1.5deg); }
}

@keyframes fly {
  0% { transform: translateX(-5%) translateY(0); }
  100% { transform: translateX(110%) translateY(-30px); }
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

@media (prefers-reduced-motion: reduce) {
  .cloud, .hero-sun, .ripple, .boat, .birds, .scroll-hint {
    animation: none !important;
  }
}
</style>

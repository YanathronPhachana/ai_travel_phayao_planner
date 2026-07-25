export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  author: string
  siteUrl: string
  siteName: string
  twitterHandle?: string
  locale: string
  themeColor: string
  ogImage?: string
  twitterImage?: string
}

export interface PageSEO {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noIndex?: boolean
}

// Default SEO Configuration
export const defaultSEO: SEOConfig = {
  title: 'AI Travel Phayao Planner',
  description: 'AI Travel Planner for Phayao - plan trips, destinations, accommodations, expenses, and packing lists. Built with Vue 3 + Hono + Cloudflare.',
  keywords: [
    'phayao',
    'travel',
    'planner',
    'thailand',
    'tourism',
    'trips',
    'accommodation',
    'packing',
    'destinations',
    'budget',
    'vue3',
    'vuetify',
  ],
  author: 'AI Travel Phayao Planner',
  siteUrl: import.meta.env.VITE_APP_URL || 'https://ai-travel-phayao-planner.pages.dev',
  siteName: 'AI Travel Phayao Planner',
  twitterHandle: import.meta.env.VITE_TWITTER_HANDLE || '@aitravelphayao',
  locale: 'th_TH',
  themeColor: '#3B82F6',
  ogImage: '/og-image.png',
  twitterImage: '/twitter-image.png',
}

// Generate full title
export function generateTitle(pageTitle?: string): string {
  if (!pageTitle)
    return defaultSEO.title

  return `${pageTitle} | ${defaultSEO.siteName}`
}

// Generate full URL
export function generateUrl(path?: string): string {
  const baseUrl = defaultSEO.siteUrl.replace(/\/$/, '')
  if (!path)
    return baseUrl

  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${cleanPath}`
}

// Generate full image URL
export function generateImageUrl(image?: string): string {
  if (!image)
    return generateUrl(defaultSEO.ogImage)

  // If image is already a full URL, return it
  if (image.startsWith('http://') || image.startsWith('https://'))
    return image

  return generateUrl(image)
}

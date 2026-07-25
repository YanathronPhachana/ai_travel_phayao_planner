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
  title: 'NgernNgern ThongThong - Personal Finance',
  description: 'Personal finance tracking app for monitoring income and expenses. Built with Vue 3 + Hono + Cloudflare.',
  keywords: [
    'vue3',
    'vuetify',
    'personal finance',
    'income',
    'expenses',
    'tracking',
    'ngernngern',
    'thongthong',
    'budget',
  ],
  author: 'NgernNgern ThongThong',
  siteUrl: import.meta.env.VITE_APP_URL || 'https://ngernngern-thongthong.pages.dev',
  siteName: 'NgernNgern ThongThong',
  twitterHandle: import.meta.env.VITE_TWITTER_HANDLE || '@ngernngern',
  locale: 'th_TH',
  themeColor: '#10B981',
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

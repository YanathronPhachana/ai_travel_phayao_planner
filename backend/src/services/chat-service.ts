import type { Trip, CreateTripInput } from '../domain/entities/trip'
import type { CreateTripExpenseInput } from '../domain/entities/trip-expense'
import type { CreateAccommodationInput } from '../domain/entities/accommodation'
import type { CreatePackingItemInput } from '../domain/entities/packing-item'
import { ValidationError } from '../domain/errors'
import type { TripRepository } from '../domain/repositories/trip-repository'
import type { TripExpenseRepository } from '../domain/repositories/trip-expense-repository'
import type { AccommodationRepository } from '../domain/repositories/accommodation-repository'
import type { PackingItemRepository } from '../domain/repositories/packing-item-repository'

export interface ChatMessage {
  role: 'user' | 'ai'
  text: string
  timestamp: string
}

export interface ChatResponse {
  reply: string
  suggestions?: string[]
  sessionId: string
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
}

export interface GeneratePlanResult {
  trip: Trip
}

// ─── Knowledge Base ───

interface DestinationInfo {
  name: string
  category: string
  description: string
  activities: string[]
}

interface AccommodationInfo {
  name: string
  type: string
  priceRange: string
  location: string
  description: string
}

interface RestaurantInfo {
  name: string
  description: string
}

const destinations: DestinationInfo[] = [
  {
    name: 'กว๊านพะเยา',
    category: 'ธรรมชาติ',
    description: 'ทะเลสาบน้ำจืดขนาดใหญ่ที่สุดในภาคเหนือ มีบรรยากาศเงียบสงบ น้ำใสสะอาด มีเรือพายให้เช่า และกิจกรรมทางน้ำ',
    activities: ['พายเรือคายัค', 'ปั่นจักรยานรอบกว๊าน', 'ถ่ายรูปพระอาทิตย์ตก', 'ป้อนอาหารนก'],
  },
  {
    name: 'วัดติโลกอาราม',
    category: 'วัด',
    description: 'วัดกลางน้ำเก่าแก่บนกว๊านพะเยา สร้างในปี พ.ศ. 2068 มีพระวิหารและเจดีย์ตั้งอยู่กลางทะเลสาบ',
    activities: ['ไหว้พระ', 'ถ่ายรูปวิวกว๊าน', 'นั่งสมาธิ'],
  },
  {
    name: 'วัดอนาลโยทิพยาราม',
    category: 'วัด',
    description: 'วัดบนเขาเหนือกว๊านพะเยา มีพระพุทธรูปใหญ่สีขาวคู่สวยงาม วิวกว๊านพะเยาแบบพาโนรามา',
    activities: ['ไหว้พระ', 'ชมวิวกว๊าน', 'ถ่ายรูปพระใหญ่'],
  },
  {
    name: 'น้ำตกธารทิพย์',
    category: 'น้ำตก',
    description: 'น้ำตกชั้นเดียวในวนอุทยานแห่งชาติภูซาง น้ำใสเย็นสบาย เหมาะแก่การเล่นน้ำ',
    activities: ['เล่นน้ำ', 'เที่ยวป่า', 'พักผ่อนสายน้ำ'],
  },
  {
    name: 'ดอยบุษราคัม',
    category: 'ภูเขา',
    description: 'จุดชมพระอาทิตย์ขึ้นและทะเลหมอกชื่อดังของพะเยา อากาศหนาวเย็นตลอดปี',
    activities: ['ชมพระอาทิตย์ขึ้น', 'ถ่ายรูปทะเลหมอก', 'กางเต็นท์'],
  },
  {
    name: 'ภูชี้ฟ้า',
    category: 'ภูเขา',
    description: 'จุดชมวิวเชียงรายที่อยู่ใกล้พะเยา หน้าผาสูงชัน วิวพาโนรามาสวยงาม',
    activities: ['ชมพระอาทิตย์ขึ้น', 'ถ่ายรูปหน้าผา', 'กางเต็นท์'],
  },
  {
    name: 'ตลาดเช้าพะเยา',
    category: 'ตลาด',
    description: 'ตลาดเช้าริมกว๊านพะเยา มีของกินเยอะ ราคาถูก อาหารพื้นเมืองหลากหลาย',
    activities: ['ชิมอาหารพื้นเมือง', 'ซื้อของฝาก', 'เที่ยวชมวิถีชุมชน'],
  },
]

const accommodations: AccommodationInfo[] = [
  {
    name: 'โรงแรมริมกว๊าน',
    type: 'hotel',
    priceRange: '800-1,500 บาท/คืน',
    location: 'ริมกว๊านพะเยา',
    description: 'โรงแรมวิวสวยริมทะเลสาบ ห้องพักสะอาด มีสระว่ายน้ำ ใกล้แหล่งท่องเที่ยว',
  },
  {
    name: 'The Lake Resort',
    type: 'resort',
    priceRange: '1,200-2,500 บาท/คืน',
    location: 'ริมกว๊านพะเยา',
    description: 'รีสอร์ทติดน้ำหรูหรา มีวิลล่าส่วนตัว บริการครบวงจร บรรยากาศเงียบสงบ',
  },
  {
    name: 'บ้านพักรับรองกว๊านพะเยา',
    type: 'guesthouse',
    priceRange: '500-800 บาท/คืน',
    location: 'ใกล้กว๊านพะเยา',
    description: 'ที่พักราคาประหยัด บรรยากาศเป็นกันเอง เหมาะสำหรับครอบครัวและกลุ่มเพื่อน',
  },
]

const restaurants: RestaurantInfo[] = [
  { name: 'ร้านเจ๊ซี๊ดข้าวซอย', description: 'ข้าวซอยชื่อดังของพะเยา รสชาติกลมกล่อม เผ็ดกำลังดี' },
  { name: 'ร้านครัวเรือนเก่า', description: 'ร้านอาหารพื้นเมืองสไตล์โฮมคุก บรรยากาศอบอุ่น เมนูหลากหลาย' },
  { name: 'ร้านส้มตำแม่น้อง', description: 'ส้มตำและอาหารอีสานรสเด็ด ราคาถูก บรรยากาศเป็นกันเอง' },
]

// ─── Session Store (in-memory) ───

const sessions = new Map<string, ChatSession>()

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

// ─── Budget Calculator ───

function estimateBudget(nights: number, travelers: number, preferences: string[]): { total: number; breakdown: string[] } {
  const isBudget = preferences.some(p => /ถูก|ประหยัด|งบน้อย|budget/.test(p))
  const isLuxury = preferences.some(p => /หรู|luxury|พิเศษ/.test(p))

  const accPerNight = isBudget ? 500 : isLuxury ? 2000 : 1000
  const foodPerDay = isBudget ? 300 : isLuxury ? 800 : 500
  const transportPerPerson = isBudget ? 200 : isLuxury ? 1000 : 500
  const activityPerPerson = isBudget ? 100 : isLuxury ? 500 : 300

  const totalAcc = accPerNight * nights * Math.ceil(travelers / 2)
  const totalFood = foodPerDay * (nights + 1) * travelers
  const totalTransport = transportPerPerson * travelers
  const totalActivity = activityPerPerson * travelers * (nights + 1)
  const total = totalAcc + totalFood + totalTransport + totalActivity

  const breakdown = [
    `ที่พัก ${nights} คืน: ~฿${totalAcc.toLocaleString()}`,
    `อาหาร ${nights + 1} วัน: ~฿${totalFood.toLocaleString()}`,
    `ค่าเดินทาง: ~฿${totalTransport.toLocaleString()}`,
    `กิจกรรม: ~฿${totalActivity.toLocaleString()}`,
    `รวมประมาณ ~฿${total.toLocaleString()}`,
  ]

  return { total, breakdown }
}

// ─── Keyword Matching ───

function extractKeywords(text: string): { places: string[]; days: number; nights: number; travelers: number; preferences: string[] } {
  const lower = text.toLowerCase()
  const places: string[] = []
  const preferences: string[] = []

  for (const d of destinations) {
    if (lower.includes(d.name.toLowerCase()) || lower.includes(d.name.replace('พะเยา', '').toLowerCase())) {
      places.push(d.name)
    }
  }

  // Specific keyword matches for places
  if (/กว๊าน|ทะเลสาบ/.test(lower)) places.push('กว๊านพะเยา')
  if (/ติโลก|วัดกลางน้ำ/.test(lower)) places.push('วัดติโลกอาราม')
  if (/อนาลโย|พระใหญ่/.test(lower)) places.push('วัดอนาลโยทิพยาราม')
  if (/ธารทิพย์|น้ำตก/.test(lower)) places.push('น้ำตกธารทิพย์')
  if (/บุษราคัม|ดอย/.test(lower)) places.push('ดอยบุษราคัม')
  if (/ชี้ฟ้า/.test(lower)) places.push('ภูชี้ฟ้า')
  if (/ตลาด|ตลาดเช้า/.test(lower)) places.push('ตลาดเช้าพะเยา')

  const dayMatch = lower.match(/(\d+)\s*วัน/)
  const days = dayMatch ? parseInt(dayMatch[1]!, 10) : 2

  const nightMatch = lower.match(/(\d+)\s*คืน/)
  const nights = nightMatch ? parseInt(nightMatch[1]!, 10) : Math.max(1, days - 1)

  const travelerMatch = lower.match(/(\d+)\s*(คน|ท่าน)/)
  const travelers = travelerMatch ? parseInt(travelerMatch[1]!, 10) : 1

  if (/ถูก|ประหยัด|งบน้อย|budget/.test(lower)) preferences.push('budget')
  if (/หรู|luxury|พิเศษ/.test(lower)) preferences.push('luxury')
  if (/ธรรมชาติ|น้ำตก|ภูเขา/.test(lower)) preferences.push('nature')
  if (/วัด|ไหว้พระ|สักการะ/.test(lower)) preferences.push('temple')
  if (/กิน|อาหาร|ร้าน/.test(lower)) preferences.push('food')

  return { places: [...new Set(places)], days, nights: Math.max(1, nights), travelers: Math.max(1, travelers), preferences }
}

// ─── Service ───

export class ChatService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly tripExpenseRepository: TripExpenseRepository,
    private readonly accommodationRepository: AccommodationRepository,
    private readonly packingItemRepository: PackingItemRepository
  ) {}

  private getOrCreateSession(sessionId?: string): ChatSession {
    if (sessionId && sessions.has(sessionId)) {
      return sessions.get(sessionId)!
    }
    const newSession: ChatSession = { id: generateId(), messages: [] }
    sessions.set(newSession.id, newSession)
    return newSession
  }

  async respond(userMessage: string, sessionId?: string): Promise<ChatResponse> {
    const session = this.getOrCreateSession(sessionId)
    session.messages.push({ role: 'user', text: userMessage, timestamp: new Date().toISOString() })

    const { places, days, nights, travelers, preferences } = extractKeywords(userMessage)
    const reply = this.buildReply(userMessage, places, days, nights, travelers, preferences)

    session.messages.push({ role: 'ai', text: reply, timestamp: new Date().toISOString() })

    const suggestions = this.buildSuggestions(session.messages, places)

    return { reply, suggestions, sessionId: session.id }
  }

  private buildReply(
    userMessage: string,
    places: string[],
    days: number,
    nights: number,
    travelers: number,
    preferences: string[]
  ): string {
    const lower = userMessage.toLowerCase()

    // Budget inquiry
    if (/งบ|ค่าใช้จ่าย|ราคา|budget|cost|เท่าไร/.test(lower)) {
      const { breakdown } = estimateBudget(nights, travelers, preferences)
      const placeText = places.length > 0
        ? `สำหรับการเที่ยว ${places.join(' และ ')}`
        : 'สำหรับการเที่ยวพะเยา'
      return `${placeText} ${days} วัน ${nights} คืน สำหรับ ${travelers} คน ประมาณการค่าใช้จ่ายดังนี้ครับ:\n\n${breakdown.join('\n')}\n\nหากต้องการปรับแผนให้ประหยัดขึ้นหรือหรูขึ้น บอกผมได้เลยครับ!`
    }

    // Accommodation inquiry
    if (/ที่พัก|โรงแรม|รีสอร์ท|เกสต์เฮาส์|hostel|hotel|resort/.test(lower)) {
      let reply = 'แนะนำที่พักในพะเยาครับ:\n\n'
      for (const acc of accommodations) {
        reply += `🏨 ${acc.name} (${acc.type === 'hotel' ? 'โรงแรม' : acc.type === 'resort' ? 'รีสอร์ท' : 'เกสต์เฮาส์'})\n`
        reply += `   💰 ${acc.priceRange} | 📍 ${acc.location}\n`
        reply += `   ${acc.description}\n\n`
      }
      reply += `💡 ถ้าอยากพักริมกว๊านแนะนำ ${accommodations[0]!.name} หรือ ${accommodations[1]!.name} ครับ`
      return reply
    }

    // Restaurant / food inquiry
    if (/กิน|อาหาร|ร้าน|อร่อย|ส้มตำ|ข้าวซอย/.test(lower)) {
      let reply = 'ร้านอาหารแนะนำในพะเยาครับ:\n\n'
      for (const r of restaurants) {
        reply += `🍽️ ${r.name}\n   ${r.description}\n\n`
      }
      reply += 'อีกทางเลือกคือไปเที่ยวตลาดเช้าพะเยา มีของกินเยอะและราคาถูกครับ!'
      return reply
    }

    // Specific place info
    if (places.length > 0) {
      const place = destinations.find(d => d.name === places[0])!
      let reply = `เกี่ยวกับ${place.name}ครับ:\n\n${place.description}\n\nกิจกรรมที่ทำได้:`
      for (const act of place.activities) {
        reply += `\n  • ${act}`
      }
      reply += `\n\nหากต้องการเที่ยว ${days} วัน ${nights} คืน ผมสามารถช่วยประมาณงบประมาณและแนะนำที่พักได้ครับ`
      return reply
    }

    // General / greeting
    if (/สวัสดี|หวัด|hi|hello|help|ช่วย/.test(lower)) {
      return `สวัสดีครับ! ผมเป็น AI ผู้ช่วยวางแผนเที่ยวพะเยา 🌄\n\nสามารถถามผมได้เลยครับ เช่น:\n  • "อยากไปเที่ยวกว๊านพะเยา 2 วัน 1 คืน"\n  • "แนะนำที่พักริมกว๊าน"\n  • "ค่าใช้จ่ายเที่ยวพะเยา 3 วัน 2 คืน"\n  • "ร้านอาหารอร่อยๆ ในพะเยา"\n\nเมื่อคุยกันจนมีแผนเที่ยวชัดเจนแล้ว สามารถกด "✨ สร้างแผนเที่ยว" ได้เลยครับ!`
    }

    // Fallback
    return `ผมเข้าใจว่าคุณสนใจเที่ยวพะเยาครับ 🌿\n\nสถานที่เที่ยวยอดนิยมในพะเยา:\n  • กว๊านพะเยา – ทะเลสาบน้ำจืด พายเรือ ปั่นจักรยาน\n  • วัดติโลกอาราม – วัดกลางน้ำเก่าแก่\n  • วัดอนาลโยทิพยาราม – วัดบนเขา พระใหญ่ วิวสวย\n  • น้ำตกธารทิพย์ – น้ำตกในวนอุทยาน\n  • ดอยบุษราคัม – ชมพระอาทิตย์ขึ้นและทะเลหมอก\n  • ตลาดเช้าพะเยา – อาหารพื้นเมืองราคาถูก\n\nบอกผมได้เลยครับว่าอยากเที่ยวแบบไหน กี่วัน งบประมาณเท่าไร!`
  }

  private buildSuggestions(messages: ChatMessage[], places: string[]): string[] {
    const lowerTexts = messages.map(m => m.text.toLowerCase()).join(' ')
    const suggestions: string[] = []

    if (places.length === 0) {
      suggestions.push('อยากไปเที่ยวกว๊านพะเยา')
      suggestions.push('แนะนำวัดในพะเยา')
    }

    if (!/งบ|ค่าใช้จ่าย|ราคา/.test(lowerTexts)) {
      suggestions.push('คำนวณงบประมาณ')
    }

    if (!/ที่พัก|โรงแรม/.test(lowerTexts)) {
      suggestions.push('แนะนำที่พักริมกว๊าน')
    }

    if (!/อาหาร|กิน|ร้าน/.test(lowerTexts)) {
      suggestions.push('ร้านอาหารแนะนำ')
    }

    return suggestions.slice(0, 3)
  }

  async generatePlan(sessionId: string, tripName?: string): Promise<GeneratePlanResult> {
    const session = sessions.get(sessionId)
    if (!session || session.messages.length === 0) {
      throw new ValidationError('No chat history found for this session')
    }

    // Build full history text
    const historyText = session.messages.map(m => `${m.role}: ${m.text}`).join('\n')
    const { places, days, nights, travelers, preferences } = extractKeywords(historyText)

    // Default dates
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() + 7) // trip starts next week
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Math.max(0, days - 1))

    const fmt = (d: Date): string => d.toISOString().split('T')[0] as string

    const { total } = estimateBudget(nights, travelers, preferences)

    const name = tripName?.trim() || `เที่ยวพะเยา ${places[0] || ''} ${days} วัน ${nights} คืน`.trim()

    // Create trip
    const tripInput: CreateTripInput = {
      name,
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      totalBudget: total,
      notes: `สร้างจากแชท AI\nสถานที่: ${places.join(', ') || 'พะเยา'}\nจำนวนคน: ${travelers} คน\nประเภท: ${preferences.join(', ') || 'ทั่วไป'}`,
      destinationIds: [],
    }

    const trip = await this.tripRepository.create(tripInput)

    // Create expenses
    const { breakdown } = estimateBudget(nights, travelers, preferences)
    const expenseInputs: CreateTripExpenseInput[] = [
      {
        tripId: trip.id,
        category: 'accommodation',
        itemName: 'ค่าที่พักโดยประมาณ',
        amount: Math.round(total * 0.4),
        date: fmt(startDate),
        notes: `ที่พัก ${nights} คืน`,
      },
      {
        tripId: trip.id,
        category: 'food',
        itemName: 'ค่าอาหารโดยประมาณ',
        amount: Math.round(total * 0.3),
        date: fmt(startDate),
        notes: `อาหาร ${days} วัน`,
      },
      {
        tripId: trip.id,
        category: 'transport',
        itemName: 'ค่าเดินทางโดยประมาณ',
        amount: Math.round(total * 0.2),
        date: fmt(startDate),
        notes: 'ค่าน้ำมัน/รถ/เครื่องบิน',
      },
      {
        tripId: trip.id,
        category: 'activities',
        itemName: 'ค่ากิจกรรม/เข้าสถานที่',
        amount: Math.round(total * 0.1),
        date: fmt(startDate),
        notes: 'ค่าเรือ/ค่าเข้าวนอุทยาน',
      },
    ]

    for (const exp of expenseInputs) {
      await this.tripExpenseRepository.create(exp)
    }

    // Create accommodations
    const accName = preferences.includes('luxury')
      ? 'The Lake Resort'
      : preferences.includes('budget')
        ? 'บ้านพักรับรองกว๊านพะเยา'
        : 'โรงแรมริมกว๊าน'

    const accPrice = preferences.includes('luxury') ? 2000 : preferences.includes('budget') ? 600 : 1200

    await this.accommodationRepository.create({
      tripId: trip.id,
      name: accName,
      type: 'hotel',
      pricePerNight: accPrice,
      checkIn: fmt(startDate),
      checkOut: fmt(endDate),
      totalCost: accPrice * nights,
      address: 'ริมกว๊านพะเยา',
      phone: '',
      notes: 'แนะนำจาก AI',
    })

    // Create packing items
    const packingItems: CreatePackingItemInput[] = [
      { tripId: trip.id, category: 'clothing', itemName: 'เสื้อผ้าเบาสบาย', quantity: days + 1, notes: 'พะเยาอากาศร้อน' },
      { tripId: trip.id, category: 'clothing', itemName: 'เสื้อกันหนาวบาง', quantity: 1, notes: 'ถ้าขึ้นดอยบุษราคัม' },
      { tripId: trip.id, category: 'toiletries', itemName: 'ยากันยุง', quantity: 1, notes: '' },
      { tripId: trip.id, category: 'toiletries', itemName: 'ครีมกันแดด', quantity: 1, notes: '' },
      { tripId: trip.id, category: 'electronics', itemName: 'แบตสำรอง / สายชาร์จ', quantity: 1, notes: '' },
      { tripId: trip.id, category: 'documents', itemName: 'บัตรประชาชน / ใบขับขี่', quantity: 1, notes: '' },
      { tripId: trip.id, category: 'medical', itemName: 'ยาพาราเซตามอล / ยาท้องเสีย', quantity: 1, notes: '' },
    ]

    for (const item of packingItems) {
      await this.packingItemRepository.create(item)
    }

    return { trip }
  }
}

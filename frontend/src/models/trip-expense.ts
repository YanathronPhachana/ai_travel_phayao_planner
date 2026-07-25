export interface TripExpense {
  id: string
  tripId: string
  category: ExpenseCategory
  itemName: string
  amount: number
  date: string
  notes: string
  createdAt: string
}

export type ExpenseCategory =
  | 'transport'
  | 'food'
  | 'accommodation'
  | 'activities'
  | 'other'

export interface CreateTripExpenseBody {
  tripId: string
  category: ExpenseCategory
  itemName: string
  amount: number
  date: string
  notes?: string
}

export interface UpdateTripExpenseBody {
  category?: ExpenseCategory
  itemName?: string
  amount?: number
  date?: string
  notes?: string
}

export interface TripExpenseListResponse {
  data: TripExpense[]
}

export interface TripExpenseResponse {
  data: TripExpense
}

export interface ExpenseSummaryResponse {
  data: {
    total: number
    byCategory: Record<string, number>
  }
}

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  transport: 'ค่าเดินทาง',
  food: 'อาหาร',
  accommodation: 'ที่พัก',
  activities: 'กิจกรรม',
  other: 'อื่นๆ',
}

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

export interface CreateTripExpenseInput {
  tripId: string
  category: ExpenseCategory
  itemName: string
  amount: number
  date: string
  notes?: string
}

export interface UpdateTripExpenseInput {
  category?: ExpenseCategory
  itemName?: string
  amount?: number
  date?: string
  notes?: string
}

export interface ExpenseSummary {
  total: number
  byCategory: Record<string, number>
}

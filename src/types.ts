export interface Activity {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:mm，可留空
  title: string
  place: string
  note: string
}

export type ExpenseCategory = '交通' | '住宿' | '餐飲' | '門票' | '購物' | '其他'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = ['交通', '住宿', '餐飲', '門票', '購物', '其他']

export interface Expense {
  id: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number
}

export interface PackingItem {
  id: string
  name: string
  packed: boolean
}

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  currency: string
  activities: Activity[]
  expenses: Expense[]
  packing: PackingItem[]
  createdAt: number
}

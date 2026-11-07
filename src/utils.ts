export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)

/** 回傳 start ~ end（含）之間每一天的 YYYY-MM-DD 字串 */
export function daysBetween(start: string, end: string): string[] {
  if (!start || !end) return []
  const days: string[] = []
  const d = new Date(start + 'T00:00:00')
  const last = new Date(end + 'T00:00:00')
  while (d <= last && days.length < 366) {
    days.push(toISODate(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）`
}

export function formatMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('zh-TW', { maximumFractionDigits: 2 })}`
}

export const DEFAULT_PACKING = [
  '護照 / 身分證件',
  '機票 / 車票',
  '錢包、信用卡、外幣',
  '手機與充電器',
  '行動電源',
  '轉接插頭',
  '換洗衣物',
  '盥洗用品',
  '常備藥品',
  '雨具',
]

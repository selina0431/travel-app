import { useEffect, useState } from 'react'
import type { Trip } from './types'

const STORAGE_KEY = 'travel-app:trips:v1'

function load(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Trip[]) : []
  } catch {
    return []
  }
}

/** 所有旅程資料存在瀏覽器 localStorage，離線也能用 */
export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
    } catch {
      // 儲存空間不足或被瀏覽器封鎖時，忽略即可（資料仍在記憶體中）
    }
  }, [trips])

  const addTrip = (trip: Trip) => setTrips((ts) => [trip, ...ts])
  const updateTrip = (id: string, patch: (t: Trip) => Trip) =>
    setTrips((ts) => ts.map((t) => (t.id === id ? patch(t) : t)))
  const deleteTrip = (id: string) => setTrips((ts) => ts.filter((t) => t.id !== id))

  return { trips, addTrip, updateTrip, deleteTrip }
}

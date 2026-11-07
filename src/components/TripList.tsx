import { useState } from 'react'
import type { Trip } from '../types'
import { DEFAULT_PACKING, daysBetween, formatDate, toISODate, uid } from '../utils'

interface Props {
  trips: Trip[]
  onAdd: (trip: Trip) => void
  onOpen: (id: string) => void
}

export default function TripList({ trips, onAdd, onOpen }: Props) {
  const [showForm, setShowForm] = useState(trips.length === 0)
  const today = toISODate(new Date())
  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: today,
    endDate: today,
    budget: '',
    currency: 'TWD',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || form.endDate < form.startDate) return
    onAdd({
      id: uid(),
      name: form.name.trim(),
      destination: form.destination.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget) || 0,
      currency: form.currency.trim().toUpperCase() || 'TWD',
      activities: [],
      expenses: [],
      packing: DEFAULT_PACKING.map((name) => ({ id: uid(), name, packed: false })),
      createdAt: Date.now(),
    })
    setForm({ ...form, name: '', destination: '', budget: '' })
    setShowForm(false)
  }

  const sorted = [...trips].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const upcoming = sorted.filter((t) => t.endDate >= today)
  const past = sorted.filter((t) => t.endDate < today).reverse()

  return (
    <>
      <header className="topbar">
        <h1>✈️ 旅遊手帳</h1>
        <button className="btn primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? '取消' : '＋ 新旅程'}
        </button>
      </header>

      <main className="content">
        {showForm && (
          <form className="card form" onSubmit={submit}>
            <h2>建立新旅程</h2>
            <label>
              旅程名稱
              <input
                required
                placeholder="例如：京都賞楓之旅"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              目的地
              <input
                placeholder="例如：日本京都"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
            </label>
            <div className="row">
              <label>
                出發日
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startDate: e.target.value,
                      endDate: form.endDate < e.target.value ? e.target.value : form.endDate,
                    })
                  }
                />
              </label>
              <label>
                回程日
                <input
                  type="date"
                  required
                  min={form.startDate}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </label>
            </div>
            <div className="row">
              <label>
                預算
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  placeholder="0"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </label>
              <label>
                幣別
                <input
                  value={form.currency}
                  maxLength={4}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                />
              </label>
            </div>
            <button className="btn primary block" type="submit">
              建立
            </button>
          </form>
        )}

        {trips.length === 0 && !showForm && (
          <p className="empty">還沒有旅程，點右上角「新旅程」開始規劃吧！</p>
        )}

        {upcoming.length > 0 && <TripSection title="即將出發" trips={upcoming} onOpen={onOpen} today={today} />}
        {past.length > 0 && <TripSection title="過去的旅程" trips={past} onOpen={onOpen} today={today} />}
      </main>
    </>
  )
}

function TripSection({
  title,
  trips,
  onOpen,
  today,
}: {
  title: string
  trips: Trip[]
  onOpen: (id: string) => void
  today: string
}) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      {trips.map((t) => {
        const days = daysBetween(t.startDate, t.endDate).length
        const countdown = daysBetween(today, t.startDate).length - 1
        return (
          <button key={t.id} className="card trip-card" onClick={() => onOpen(t.id)}>
            <div className="trip-card-main">
              <strong>{t.name}</strong>
              <span className="muted">
                {t.destination && `📍 ${t.destination} · `}
                {formatDate(t.startDate)} – {formatDate(t.endDate)} · {days} 天
              </span>
            </div>
            {countdown > 0 && <span className="badge">還有 {countdown} 天</span>}
            {t.startDate <= today && t.endDate >= today && <span className="badge live">旅行中</span>}
          </button>
        )
      })}
    </section>
  )
}

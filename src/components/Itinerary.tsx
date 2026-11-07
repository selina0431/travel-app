import { useState } from 'react'
import type { Activity, Trip } from '../types'
import { formatDate, uid } from '../utils'

interface Props {
  trip: Trip
  days: string[]
  onChange: (patch: (t: Trip) => Trip) => void
}

export default function Itinerary({ trip, days, onChange }: Props) {
  const [day, setDay] = useState(days[0] ?? '')
  const [form, setForm] = useState({ time: '', title: '', place: '', note: '' })

  const activities = trip.activities
    .filter((a) => a.date === day)
    .sort((a, b) => (a.time || '99').localeCompare(b.time || '99'))

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const activity: Activity = { id: uid(), date: day, ...form, title: form.title.trim() }
    onChange((t) => ({ ...t, activities: [...t.activities, activity] }))
    setForm({ time: '', title: '', place: '', note: '' })
  }

  const remove = (id: string) =>
    onChange((t) => ({ ...t, activities: t.activities.filter((a) => a.id !== id) }))

  return (
    <>
      <div className="day-chips">
        {days.map((d, i) => (
          <button key={d} className={`chip ${d === day ? 'active' : ''}`} onClick={() => setDay(d)}>
            Day {i + 1}
            <small>{formatDate(d)}</small>
          </button>
        ))}
      </div>

      {activities.length === 0 ? (
        <p className="empty">這天還沒有安排，在下方新增第一個行程吧！</p>
      ) : (
        <ol className="timeline">
          {activities.map((a) => (
            <li key={a.id} className="card">
              <div className="time">{a.time || '—'}</div>
              <div className="grow">
                <strong>{a.title}</strong>
                {a.place && (
                  <a
                    className="muted place"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.place)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📍 {a.place}
                  </a>
                )}
                {a.note && <p className="note">{a.note}</p>}
              </div>
              <button className="icon-btn" onClick={() => remove(a.id)} aria-label="刪除">
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}

      <form className="card form" onSubmit={add}>
        <h2>新增行程</h2>
        <div className="row">
          <label className="narrow">
            時間
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </label>
          <label>
            活動
            <input
              required
              placeholder="例如：清水寺參拜"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
        </div>
        <label>
          地點
          <input
            placeholder="可點擊開啟 Google 地圖"
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
          />
        </label>
        <label>
          備註
          <textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </label>
        <button className="btn primary block" type="submit">
          加入 {formatDate(day)}
        </button>
      </form>
    </>
  )
}

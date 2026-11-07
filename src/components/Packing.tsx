import { useState } from 'react'
import type { Trip } from '../types'
import { uid } from '../utils'

interface Props {
  trip: Trip
  onChange: (patch: (t: Trip) => Trip) => void
}

export default function Packing({ trip, onChange }: Props) {
  const [name, setName] = useState('')
  const done = trip.packing.filter((p) => p.packed).length

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onChange((t) => ({ ...t, packing: [...t.packing, { id: uid(), name: name.trim(), packed: false }] }))
    setName('')
  }

  const toggle = (id: string) =>
    onChange((t) => ({ ...t, packing: t.packing.map((p) => (p.id === id ? { ...p, packed: !p.packed } : p)) }))

  const remove = (id: string) => onChange((t) => ({ ...t, packing: t.packing.filter((p) => p.id !== id) }))

  return (
    <>
      <div className="card summary">
        <div className="summary-row">
          <span className="muted">打包進度</span>
          <strong>
            {done} / {trip.packing.length}
          </strong>
        </div>
        <div className="progress">
          <div className="bar" style={{ width: `${trip.packing.length ? (done / trip.packing.length) * 100 : 0}%` }} />
        </div>
      </div>

      <form className="card inline-form" onSubmit={add}>
        <input placeholder="新增物品…" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn primary" type="submit">
          加入
        </button>
      </form>

      <ul className="list card">
        {trip.packing.map((p) => (
          <li key={p.id} className={p.packed ? 'packed' : ''}>
            <label className="check grow">
              <input type="checkbox" checked={p.packed} onChange={() => toggle(p.id)} />
              <span>{p.name}</span>
            </label>
            <button className="icon-btn" onClick={() => remove(p.id)} aria-label="刪除">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

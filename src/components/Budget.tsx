import { useState } from 'react'
import { EXPENSE_CATEGORIES, type Expense, type ExpenseCategory, type Trip } from '../types'
import { formatDate, formatMoney, toISODate, uid } from '../utils'

interface Props {
  trip: Trip
  days: string[]
  onChange: (patch: (t: Trip) => Trip) => void
}

export default function Budget({ trip, days, onChange }: Props) {
  const today = toISODate(new Date())
  const defaultDay = days.includes(today) ? today : (days[0] ?? today)
  const [form, setForm] = useState({
    date: defaultDay,
    category: '餐飲' as ExpenseCategory,
    description: '',
    amount: '',
  })

  const total = trip.expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = trip.budget - total
  const pct = trip.budget > 0 ? Math.min(100, (total / trip.budget) * 100) : 0

  const byCategory = EXPENSE_CATEGORIES.map((c) => ({
    category: c,
    sum: trip.expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.sum > 0)

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!amount || amount <= 0) return
    const expense: Expense = {
      id: uid(),
      date: form.date,
      category: form.category,
      description: form.description.trim() || form.category,
      amount,
    }
    onChange((t) => ({ ...t, expenses: [...t.expenses, expense] }))
    setForm({ ...form, description: '', amount: '' })
  }

  const remove = (id: string) => onChange((t) => ({ ...t, expenses: t.expenses.filter((x) => x.id !== id) }))

  const sorted = [...trip.expenses].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <div className="card summary">
        <div className="summary-row">
          <div>
            <span className="muted">已花費</span>
            <strong className="big">{formatMoney(total, trip.currency)}</strong>
          </div>
          {trip.budget > 0 && (
            <div className="right">
              <span className="muted">剩餘</span>
              <strong className={remaining < 0 ? 'over' : ''}>{formatMoney(remaining, trip.currency)}</strong>
            </div>
          )}
        </div>
        {trip.budget > 0 && (
          <>
            <div className="progress">
              <div className={`bar ${remaining < 0 ? 'over' : ''}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="muted small">預算 {formatMoney(trip.budget, trip.currency)}</span>
          </>
        )}
        {byCategory.length > 0 && (
          <ul className="cat-list">
            {byCategory.map((c) => (
              <li key={c.category}>
                <span>{c.category}</span>
                <span>{formatMoney(c.sum, trip.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="card form" onSubmit={add}>
        <h2>記一筆</h2>
        <div className="row">
          <label>
            金額（{trip.currency}）
            <input
              required
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </label>
          <label>
            類別
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="row">
          <label>
            說明
            <input
              placeholder="例如：拉麵"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label className="narrow">
            日期
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
        </div>
        <button className="btn primary block" type="submit">
          新增
        </button>
      </form>

      {sorted.length > 0 && (
        <ul className="list card">
          {sorted.map((x) => (
            <li key={x.id}>
              <div className="grow">
                <strong>{x.description}</strong>
                <span className="muted small">
                  {formatDate(x.date)} · {x.category}
                </span>
              </div>
              <span>{formatMoney(x.amount, trip.currency)}</span>
              <button className="icon-btn" onClick={() => remove(x.id)} aria-label="刪除">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

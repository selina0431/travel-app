import { useState } from 'react'
import type { Trip } from '../types'
import { daysBetween, formatDate } from '../utils'
import Itinerary from './Itinerary'
import Budget from './Budget'
import Packing from './Packing'

type Tab = 'itinerary' | 'budget' | 'packing'

interface Props {
  trip: Trip
  onBack: () => void
  onChange: (patch: (t: Trip) => Trip) => void
  onDelete: () => void
}

export default function TripDetail({ trip, onBack, onChange, onDelete }: Props) {
  const [tab, setTab] = useState<Tab>('itinerary')
  const days = daysBetween(trip.startDate, trip.endDate)

  return (
    <>
      <header className="topbar">
        <button className="btn ghost" onClick={onBack} aria-label="返回">
          ‹ 返回
        </button>
        <button
          className="btn ghost danger"
          onClick={() => {
            if (confirm(`確定要刪除「${trip.name}」嗎？此動作無法復原。`)) onDelete()
          }}
        >
          刪除
        </button>
      </header>

      <div className="hero">
        <h1>{trip.name}</h1>
        <p>
          {trip.destination && `📍 ${trip.destination} · `}
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)} · {days.length} 天
        </p>
      </div>

      <main className="content">
        {tab === 'itinerary' && <Itinerary trip={trip} days={days} onChange={onChange} />}
        {tab === 'budget' && <Budget trip={trip} days={days} onChange={onChange} />}
        {tab === 'packing' && <Packing trip={trip} onChange={onChange} />}
      </main>

      <nav className="tabbar">
        <TabButton active={tab === 'itinerary'} onClick={() => setTab('itinerary')} icon="🗓️" label="行程" />
        <TabButton active={tab === 'budget'} onClick={() => setTab('budget')} icon="💰" label="記帳" />
        <TabButton active={tab === 'packing'} onClick={() => setTab('packing')} icon="🧳" label="行李" />
      </nav>
    </>
  )
}

function TabButton(props: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button className={`tab ${props.active ? 'active' : ''}`} onClick={props.onClick}>
      <span aria-hidden>{props.icon}</span>
      {props.label}
    </button>
  )
}

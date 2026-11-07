import { useState } from 'react'
import { useTrips } from './useTrips'
import TripList from './components/TripList'
import TripDetail from './components/TripDetail'

export default function App() {
  const { trips, addTrip, updateTrip, deleteTrip } = useTrips()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = trips.find((t) => t.id === selectedId) ?? null

  return (
    <div className="app">
      {selected ? (
        <TripDetail
          trip={selected}
          onBack={() => setSelectedId(null)}
          onChange={(patch) => updateTrip(selected.id, patch)}
          onDelete={() => {
            deleteTrip(selected.id)
            setSelectedId(null)
          }}
        />
      ) : (
        <TripList trips={trips} onAdd={addTrip} onOpen={setSelectedId} />
      )}
    </div>
  )
}

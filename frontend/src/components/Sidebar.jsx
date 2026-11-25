import { useState } from 'react'
import PlaceCard from './PlaceCard.jsx'
import PlaceDetail from './PlaceDetail.jsx'

const CATEGORIES = ['All', 'Viewpoint', 'Sightseeing', 'Market', 'Park']

// Each option knows how to compare two places. `sort()` expects a negative
// number if `a` goes first, positive if `b` goes first, 0 if they are equal.
const SORT_OPTIONS = {
  rating: {
    label: 'Rating',
    compare: (a, b) => b.rating - a.rating || a.name.localeCompare(b.name, 'cs'),
  },
  name: {
    label: 'Name (A–Z)',
    // localeCompare with 'cs' sorts Czech letters correctly (Č after C, Š after S).
    compare: (a, b) => a.name.localeCompare(b.name, 'cs'),
  },
}

export default function Sidebar({ places, isOpen, selectedPlace, onSelectPlace, onBack }) {
  // Sorting only changes the order of the list (the map doesn't care),
  // so this state can live here instead of in App.
  const [sortBy, setSortBy] = useState('rating')

  // Copy the array first – `sort()` changes the original in place,
  // and props must never be modified.
  const sortedPlaces = [...places].sort(SORT_OPTIONS[sortBy].compare)

  return (
    // `inert` stops keyboard focus from reaching the hidden panel's buttons.
    <aside className={isOpen ? 'sidebar' : 'sidebar sidebar--collapsed'} inert={!isOpen}>
      {selectedPlace ? (
        <PlaceDetail place={selectedPlace} onBack={onBack} />
      ) : (
        // <> … </> is a Fragment: groups elements without adding an extra <div>.
        <>
          <h2 className="sidebar-title">Discover Brno</h2>

          <div className="sidebar-meta">
            <span>{places.length} places</span>
            <label className="sort">
              Sort by
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <input
            className="search"
            type="search"
            placeholder="Search places in Brno…"
            aria-label="Search places"
          />

          <div className="chips">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={category === 'All' ? 'chip chip--active' : 'chip'}
              >
                {category}
              </button>
            ))}
          </div>

          <ul className="place-list">
            {sortedPlaces.map((place) => (
              <li key={place.id}>
                <PlaceCard place={place} onSelect={onSelectPlace} />
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}

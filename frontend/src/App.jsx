import { useState } from 'react'
import Toolbar from './components/Toolbar.jsx'
import CategoryBar from './components/CategoryBar.jsx'
import ResultsBar from './components/ResultsBar.jsx'
import PlaceGrid from './components/PlaceGrid.jsx'
import MapView from './components/MapView.jsx'
import PlaceDetail from './components/PlaceDetail.jsx'
import PlaceListPanel from './components/PlaceListPanel.jsx'
import { samplePlaces } from './data/samplePlaces.js'
import { filterAndSortPlaces, getCategories } from './lib/places.js'

const categories = getCategories(samplePlaces)

export default function App() {
  // --- State: the minimum the app needs to remember ---
  const [view, setView] = useState('map') // 'map' | 'list'
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  // Store only the id; the full place object is derived from the data below.
  // That way the state can never hold an outdated copy of a place.
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)

  // --- Derived values: computed from state on every render ---
  const visiblePlaces = filterAndSortPlaces(samplePlaces, { category, query, sortBy })
  const selectedPlace = samplePlaces.find((place) => place.id === selectedPlaceId)

  function selectPlace(id) {
    setSelectedPlaceId(id)
    setView('map') // clicking a card in the list jumps to the place on the map
  }

  return (
    <div className="app">
      <Toolbar view={view} onViewChange={setView} query={query} onQueryChange={setQuery} />
      <CategoryBar categories={categories} selected={category} onSelect={setCategory} />
      <ResultsBar
        count={visiblePlaces.length}
        category={category}
        query={query}
        sortBy={sortBy}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
        onSortChange={setSortBy}
      />

      <main className="content">
        {view === 'list' && <PlaceGrid places={visiblePlaces} onSelectPlace={selectPlace} />}

        {/* The map stays mounted (only hidden) so it keeps its zoom and position
            when you switch to the list and back. */}
        <div className="map-shell" hidden={view !== 'map'}>
          <MapView
            places={visiblePlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={selectPlace}
            onBackgroundClick={() => setSelectedPlaceId(null)}
          />
          {/* One floating panel: the detail of the selected place, or the list. */}
          {selectedPlace ? (
            <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlaceId(null)} />
          ) : (
            <PlaceListPanel places={visiblePlaces} onSelectPlace={selectPlace} />
          )}
        </div>
      </main>
    </div>
  )
}

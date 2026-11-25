import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import MapView from './components/MapView.jsx'
import { samplePlaces } from './data/samplePlaces.js'

export default function App() {
  const [selected, setSelected] = useState('All')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  // Store only the id; the full place object is derived from the data below.
  // That way the state can never hold an outdated copy of a place.
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)

  const selectedPlace = samplePlaces.find((place) => place.id === selectedPlaceId)

  function selectPlace(id) {
    setSelectedPlaceId(id)
    setIsSidebarOpen(true) // a click on a pin should show the detail even if the panel was hidden
  }

  return (
    <div className="app">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="app-body">
        <Sidebar
          places={samplePlaces}
          isOpen={isSidebarOpen}
          selectedPlace={selectedPlace}
          onSelectPlace={selectPlace}
          onBack={() => setSelectedPlaceId(null)}
        />
        <MapView
          places={samplePlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={selectPlace}
        />
      </main>
    </div>
  )
}

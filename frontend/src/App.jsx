import MapView from './components/MapView.jsx'
import { samplePlaces } from './data/samplePlaces.js'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Brno Spots</h1>
      </header>
      <MapView places={samplePlaces} />
    </div>
  )
}

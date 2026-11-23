import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// --- Fix for invisible default markers -------------------------------------
// Leaflet resolves its marker images from a path that breaks once Vite
// bundles the app. Importing the images lets Vite give us the correct URLs.
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// --- Map configuration -----------------------------------------------------
const BRNO_CENTER = [49.195, 16.608]
const DEFAULT_ZOOM = 14

const MAPY_API_KEY = import.meta.env.VITE_MAPY_API_KEY

// Use Mapy.com tiles when a key is configured, otherwise fall back to
// OpenStreetMap so the app still works for anyone who clones the repo.
const tiles = MAPY_API_KEY
  ? {
      url: `https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${MAPY_API_KEY}`,
      attribution:
        '<a href="https://api.mapy.com/copyright" target="_blank" rel="noreferrer">&copy; Seznam.cz a.s. a další</a>',
    }
  : {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }

export default function MapView({ places }) {
  return (
    <MapContainer center={BRNO_CENTER} zoom={DEFAULT_ZOOM} className="map">
      <TileLayer url={tiles.url} attribution={tiles.attribution} />

      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>
            <h3 className="popup-title">{place.name}</h3>
            <p className="popup-meta">
              {place.category} · {'★'.repeat(place.rating)}
            </p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

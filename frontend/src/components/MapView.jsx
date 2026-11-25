import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
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

// Leaflet measures its container only once. When the sidebar slides away the
// map gets wider, so we watch its size and tell Leaflet to re-measure –
// otherwise a grey strip without tiles appears.
function ResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])

  return null
}

// Smoothly moves the map to the selected place whenever the selection changes.
function FlyToSelected({ place }) {
  const map = useMap()

  useEffect(() => {
    if (place) {
      map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 16))
    }
  }, [map, place])

  return null
}

export default function MapView({ places, selectedPlace, onSelectPlace }) {
  return (
    <MapContainer center={BRNO_CENTER} zoom={DEFAULT_ZOOM} className="map">
      <TileLayer url={tiles.url} attribution={tiles.attribution} />
      <ResizeHandler />
      <FlyToSelected place={selectedPlace} />

      {places.map((place) => {
        const isDimmed = selectedPlace && selectedPlace.id !== place.id
        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            title={place.name}
            opacity={isDimmed ? 0.5 : 1}
            eventHandlers={{ click: () => onSelectPlace(place.id) }}
          />
        )
      })}
    </MapContainer>
  )
}

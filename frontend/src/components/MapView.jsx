import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useI18n } from '../i18n/LanguageContext.js'

// --- Map configuration -----------------------------------------------------
const BRNO_CENTER = [49.195, 16.608]
const DEFAULT_ZOOM = 14
const MOBILE_BREAKPOINT = 768 // keep in sync with the media query in index.css
const PANEL_SPACE = 400 // width of the floating panel on the left + a margin

const MAPY_API_KEY = import.meta.env.VITE_MAPY_API_KEY

// Use Mapy.com tiles when a key is configured, otherwise fall back to
// OpenStreetMap so the app still works for anyone who clones the repo.
// Mapy.com can label the map in the app's language (`lang` parameter).
function getTiles(lang) {
  if (MAPY_API_KEY) {
    return {
      url: `https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}?lang=${lang}&apikey=${MAPY_API_KEY}`,
      attribution:
        '<a href="https://api.mapy.com/copyright" target="_blank" rel="noreferrer">&copy; Seznam.cz a.s. a další</a>',
    }
  }
  return {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
  }
}

// The floating panel covers part of the map: the left side on desktop,
// the bottom half on mobile. Returns how many pixels it hides on each side.
function getCoveredArea(map) {
  const { x: width, y: height } = map.getSize()
  return width < MOBILE_BREAKPOINT
    ? { left: 0, bottom: Math.round(height * 0.5) }
    : { left: PANEL_SPACE, bottom: 0 }
}

// --- Custom pins -----------------------------------------------------------

// The pin is built from an HTML string, so any text put into it must be
// escaped. Otherwise a place named `<img src=x onerror=...>` would run code
// (an XSS attack) – important once place names come from the database.
function escapeHtml(text) {
  const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return text.replace(/[&<>"']/g, (char) => replacements[char])
}

function createPinIcon(place, isSelected) {
  return L.divIcon({
    className: 'pin-anchor', // replaces Leaflet's default white square
    iconSize: [0, 0], // a zero-size anchor exactly at the coordinate; CSS positions the pin
    html: `
      <div class="pin${isSelected ? ' pin--selected' : ''}" data-rating="${place.rating}">
        <span class="pin-dot"></span>
        <span class="pin-label">${escapeHtml(place.name)}</span>
      </div>`,
  })
}

// --- Helper components (render nothing, they just talk to Leaflet) --------

// Leaflet measures its container only once. When the map is shown again or
// the window changes, we tell it to re-measure – otherwise grey strips appear.
function ResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])

  return null
}

// Zooms the map so all visible places fit next to the panel.
// Runs on start and whenever the set of places changes (e.g. a filter).
// While the map is hidden (list view) it has zero size and fitting would put
// it in a wrong spot – so it waits and fits once the map is shown again.
function FitToPlaces({ places, isVisible }) {
  const map = useMap()
  // useRef = a value that survives re-renders but changing it doesn't re-render.
  const isFirstFit = useRef(true)
  const lastFitted = useRef(null)
  // A string like "49.19,16.59;49.20,16.60". It changes only when different
  // places are shown – the `places` array itself is new on every render,
  // so depending on it would re-zoom the map all the time.
  const coordinates = places.map((place) => `${place.lat},${place.lng}`).join(';')

  useEffect(() => {
    // Hidden, nothing to show, or already fitted to these places (just
    // switching back from the list keeps the user's own zoom and position).
    if (!isVisible || coordinates === '' || coordinates === lastFitted.current) return
    lastFitted.current = coordinates
    map.invalidateSize() // make sure Leaflet knows the real size before fitting
    const points = coordinates.split(';').map((pair) => pair.split(',').map(Number))
    const covered = getCoveredArea(map)
    map.fitBounds(L.latLngBounds(points), {
      paddingTopLeft: [covered.left + 60, 60],
      paddingBottomRight: [60, covered.bottom + 60],
      maxZoom: 16,
      animate: !isFirstFit.current, // instant on page load, animated after a filter change
    })
    isFirstFit.current = false
  }, [map, coordinates, isVisible])

  return null
}

// Smoothly moves the map to the selected place, so that it ends up in the
// middle of the part of the map that the panel does not cover.
function FlyToSelected({ place }) {
  const map = useMap()

  useEffect(() => {
    if (!place) return
    // The map may have just been shown (a card clicked in the list view) and
    // Leaflet still remembers its hidden, zero size – measure it again first.
    map.invalidateSize()
    const zoom = Math.max(map.getZoom(), 16)
    const covered = getCoveredArea(map)
    // Work in pixels: move the centre left/down by half the covered area.
    const placePoint = map.project([place.lat, place.lng], zoom)
    const center = placePoint.subtract([covered.left / 2, -covered.bottom / 2])
    map.flyTo(map.unproject(center, zoom), zoom)
  }, [map, place])

  return null
}

// Shows as many pin labels as possible without overlaps. Goes through the
// pins from the most important (selected, then best rated) and hides a label
// if it would cover a label or a dot that is already on the map.
function LabelCollisionHandler({ trigger }) {
  const map = useMap()

  useEffect(() => {
    function overlaps(a, b) {
      return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
    }

    function layout() {
      const pins = [...map.getContainer().querySelectorAll('.pin')]
      const priority = (pin) =>
        (pin.classList.contains('pin--selected') ? 100 : 0) + Number(pin.dataset.rating)
      pins.sort((a, b) => priority(b) - priority(a))

      const dots = pins.map((pin) => pin.querySelector('.pin-dot').getBoundingClientRect())
      const shownLabels = []

      pins.forEach((pin, index) => {
        pin.classList.remove('pin--label-hidden')
        const label = pin.querySelector('.pin-label').getBoundingClientRect()
        const hitsLabel = shownLabels.some((other) => overlaps(label, other))
        const hitsDot = dots.some((dot, dotIndex) => dotIndex !== index && overlaps(label, dot))

        if (hitsLabel || hitsDot) {
          pin.classList.add('pin--label-hidden')
        } else {
          shownLabels.push(label)
        }
      })
    }

    // Wait one frame so the markers are already in the page before measuring.
    const frame = requestAnimationFrame(layout)
    map.on('zoomend moveend', layout)
    return () => {
      cancelAnimationFrame(frame)
      map.off('zoomend moveend', layout)
    }
  }, [map, trigger])

  return null
}

// Clicking an empty part of the map goes back from the detail to the list.
// (Clicks on pins don't reach the map, Leaflet stops them.)
function BackgroundClickHandler({ onClick }) {
  useMapEvents({ click: onClick })
  return null
}

// One pin. The icon is created again only when what it shows changes.
// A new icon makes Leaflet rebuild the pin's HTML, which would throw away
// the label hiding done by LabelCollisionHandler (e.g. on a language switch).
function PlaceMarker({ place, isSelected, onSelect }) {
  const { id, name, rating } = place
  const icon = useMemo(
    () => createPinIcon({ name, rating }, isSelected),
    [name, rating, isSelected],
  )

  return (
    <Marker
      position={[place.lat, place.lng]}
      icon={icon}
      title={name}
      riseOnHover
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{ click: () => onSelect(id) }}
    />
  )
}

export default function MapView({
  places,
  selectedPlace,
  isVisible,
  onSelectPlace,
  onBackgroundClick,
}) {
  const { lang } = useI18n()
  const tiles = getTiles(lang)
  const labelTrigger = `${places.map((place) => place.id).join(',')}|${selectedPlace?.id}|${isVisible}`

  return (
    <MapContainer center={BRNO_CENTER} zoom={DEFAULT_ZOOM} zoomControl={false} className="map">
      <TileLayer url={tiles.url} attribution={tiles.attribution} />
      {/* Bottom right, so the panel on the left doesn't cover it. */}
      <ZoomControl position="bottomright" />
      <ResizeHandler />
      <FitToPlaces places={places} isVisible={isVisible} />
      <FlyToSelected place={selectedPlace} />
      <BackgroundClickHandler onClick={onBackgroundClick} />

      {places.map((place) => (
        <PlaceMarker
          key={place.id}
          place={place}
          isSelected={selectedPlace?.id === place.id}
          onSelect={onSelectPlace}
        />
      ))}

      {/* After the markers, so it measures them once they are rendered. */}
      <LabelCollisionHandler trigger={labelTrigger} />
    </MapContainer>
  )
}

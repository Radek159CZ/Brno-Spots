// Hard-coded sample data for the first iteration.
// The shape mirrors the `places` table of the planned API, so later we can
// swap this file for a `fetch('/api/places')` call without touching the map.

export const samplePlaces = [
  {
    id: 1,
    name: 'Hrad Špilberk',
    category: 'Viewpoint',
    lat: 49.1947,
    lng: 16.5997,
    rating: 5,
  },
  {
    id: 2,
    name: 'Katedrála sv. Petra a Pavla',
    category: 'Sightseeing',
    lat: 49.191,
    lng: 16.6075,
    rating: 4,
  },
  {
    id: 3,
    name: 'Zelný trh',
    category: 'Market',
    lat: 49.1918,
    lng: 16.6086,
    rating: 4,
  },
  {
    id: 4,
    name: 'Náměstí Svobody',
    category: 'Sightseeing',
    lat: 49.1951,
    lng: 16.608,
    rating: 3,
  },
  {
    id: 5,
    name: 'Park Lužánky',
    category: 'Park',
    lat: 49.2071,
    lng: 16.6085,
    rating: 5,
  },
]

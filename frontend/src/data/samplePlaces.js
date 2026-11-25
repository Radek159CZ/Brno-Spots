// Hard-coded sample data for the first iteration.
// The shape mirrors the `places` table of the planned API, so later we can
// swap this file for a `fetch('/api/places')` call without touching the map.
// Descriptions and tips are placeholders – to be replaced with my own.

export const samplePlaces = [
  {
    id: 1,
    name: 'Hrad Špilberk',
    category: 'Viewpoint',
    lat: 49.1947,
    lng: 16.5997,
    rating: 5,
    photo: '/photos/spilberk.jpg',
    website: 'https://www.spilberk.cz',
    description:
      'Castle on a hill above the city centre with a view over the whole of Brno. The best light is around sunset.',
    tips: [
      { type: 'recommend', text: 'Walk around the ramparts for the view.' },
      { type: 'skip', text: 'Busy weekend afternoons – come on a weekday morning.' },
    ],
  },
  {
    id: 2,
    name: 'Katedrála sv. Petra a Pavla',
    category: 'Sightseeing',
    lat: 49.191,
    lng: 16.6075,
    rating: 4,
    photo: '/photos/katedrala.jpg',
    website: 'https://www.katedrala-petrov.cz',
    description:
      'Gothic cathedral on Petrov hill. Its bells famously ring noon at 11 o’clock.',
    tips: [{ type: 'recommend', text: 'Climb the tower for a view over the old town.' }],
  },
  {
    id: 3,
    name: 'Zelný trh',
    category: 'Market',
    lat: 49.1918,
    lng: 16.6086,
    rating: 4,
    photo: '/photos/zelny-trh.jpg',
    description: 'Market square with fresh produce stalls and the baroque Parnas fountain.',
    tips: [{ type: 'recommend', text: 'Seasonal fruit from the morning stalls.' }],
  },
  {
    id: 4,
    name: 'Náměstí Svobody',
    category: 'Sightseeing',
    lat: 49.1951,
    lng: 16.608,
    rating: 3,
    photo: '/photos/namesti-svobody.jpg',
    description: 'The main square of Brno and the city’s most common meeting point.',
    tips: [],
  },
  {
    id: 5,
    name: 'Park Lužánky',
    category: 'Park',
    lat: 49.2071,
    lng: 16.6085,
    rating: 5,
    photo: '/photos/luzanky.jpg',
    description: 'Large park north of the centre with old trees, a stream and plenty of benches.',
    tips: [{ type: 'recommend', text: 'Picnic by the stream on a summer evening.' }],
  },
]

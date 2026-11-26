// Hard-coded sample data for the first iteration.
// The shape mirrors the `places` table of the planned API, so later we can
// swap this file for a `fetch('/api/places')` call without touching the map.
//
// Texts I write myself (description, tips) exist in both languages: { en, cs }.
// Names stay as they are – they are proper nouns.
// `category` is an id; its visible name comes from the translation files.
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
    description: {
      en: 'Castle on a hill above the city centre with a view over the whole of Brno. The best light is around sunset.',
      cs: 'Hrad na kopci nad centrem s výhledem na celé Brno. Nejhezčí světlo je kolem západu slunce.',
    },
    tips: [
      {
        type: 'recommend',
        text: {
          en: 'Walk around the ramparts for the view.',
          cs: 'Projdi se po hradbách kvůli výhledu.',
        },
      },
      {
        type: 'skip',
        text: {
          en: 'Busy weekend afternoons – come on a weekday morning.',
          cs: 'Víkendová odpoledne, kdy je tu plno – přijď radši ve všední den ráno.',
        },
      },
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
    description: {
      en: 'Gothic cathedral on Petrov hill. Its bells famously ring noon at 11 o’clock.',
      cs: 'Gotická katedrála na Petrově. Její zvony slavně odbíjejí poledne už v 11 hodin.',
    },
    tips: [
      {
        type: 'recommend',
        text: {
          en: 'Climb the tower for a view over the old town.',
          cs: 'Vyjdi na věž, je z ní výhled na staré město.',
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Zelný trh',
    category: 'Market',
    lat: 49.1918,
    lng: 16.6086,
    rating: 4,
    photo: '/photos/zelny-trh.jpg',
    description: {
      en: 'Market square with fresh produce stalls and the baroque Parnas fountain.',
      cs: 'Tržní náměstí se stánky s čerstvou zeleninou a barokní kašnou Parnas.',
    },
    tips: [
      {
        type: 'recommend',
        text: {
          en: 'Seasonal fruit from the morning stalls.',
          cs: 'Sezónní ovoce z ranních stánků.',
        },
      },
    ],
  },
  {
    id: 4,
    name: 'Náměstí Svobody',
    category: 'Sightseeing',
    lat: 49.1951,
    lng: 16.608,
    rating: 3,
    photo: '/photos/namesti-svobody.jpg',
    description: {
      en: 'The main square of Brno and the city’s most common meeting point.',
      cs: 'Hlavní náměstí Brna a nejčastější místo srazů.',
    },
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
    description: {
      en: 'Large park north of the centre with old trees, a stream and plenty of benches.',
      cs: 'Velký park severně od centra se starými stromy, potokem a spoustou laviček.',
    },
    tips: [
      {
        type: 'recommend',
        text: {
          en: 'Picnic by the stream on a summer evening.',
          cs: 'Piknik u potoka za letního večera.',
        },
      },
    ],
  },
]

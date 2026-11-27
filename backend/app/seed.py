from sqlmodel import Session, select

from app.models import Place, Tip, TipType

# Sample places loaded into an empty database on the first start.
# (Moved here from the frontend's former samplePlaces.js.)
# Descriptions are short placeholders and most ratings are a provisional 4 –
# to be replaced with my own texts, ratings and tips.
SAMPLE_PLACES = [
    {
        "name": "Hrad Špilberk",
        "category": "Viewpoint",
        "lat": 49.1947,
        "lng": 16.5997,
        "rating": 5,
        "photo": "/photos/spilberk.jpg",
        "website": "https://www.spilberk.cz",
        "description_en": "Castle on a hill above the city centre with a view over the whole of Brno. The best light is around sunset.",
        "description_cs": "Hrad na kopci nad centrem s výhledem na celé Brno. Nejhezčí světlo je kolem západu slunce.",
        "tips": [
            (TipType.recommend, "Walk around the ramparts for the view.", "Projdi se po hradbách kvůli výhledu."),
            (
                TipType.skip,
                "Busy weekend afternoons – come on a weekday morning.",
                "Víkendová odpoledne, kdy je tu plno – přijď radši ve všední den ráno.",
            ),
        ],
    },
    {
        "name": "Katedrála sv. Petra a Pavla",
        "category": "Sightseeing",
        "lat": 49.191,
        "lng": 16.6075,
        "rating": 4,
        "photo": "/photos/katedrala.jpg",
        "website": "https://www.katedrala-petrov.cz",
        "description_en": "Gothic cathedral on Petrov hill. Its bells famously ring noon at 11 o’clock.",
        "description_cs": "Gotická katedrála na Petrově. Její zvony slavně odbíjejí poledne už v 11 hodin.",
        "tips": [
            (TipType.recommend, "Climb the tower for a view over the old town.", "Vyjdi na věž, je z ní výhled na staré město."),
        ],
    },
    {
        "name": "Náměstí Svobody",
        "category": "Sightseeing",
        "lat": 49.1951,
        "lng": 16.608,
        "rating": 3,
        "photo": "/photos/namesti-svobody.jpg",
        "description_en": "The main square of Brno and the city’s most common meeting point.",
        "description_cs": "Hlavní náměstí Brna a nejčastější místo srazů.",
        "tips": [],
    },
    {
        "name": "Park Lužánky",
        "category": "Park",
        "lat": 49.2071,
        "lng": 16.6085,
        "rating": 5,
        "photo": "/photos/luzanky.jpg",
        "description_en": "Large park north of the centre with old trees, a stream and plenty of benches.",
        "description_cs": "Velký park severně od centra se starými stromy, potokem a spoustou laviček.",
        "tips": [
            (TipType.recommend, "Picnic by the stream on a summer evening.", "Piknik u potoka za letního večera."),
        ],
    },
    {
        "name": "Kino Art",
        "category": "Cinema",
        "lat": 49.2042162,
        "lng": 16.6033663,
        "rating": 4,
        "website": "https://www.kinoart.cz",
        "description_en": "Art-house cinema on Cihlářská street, with a café.",
        "description_cs": "Artové kino na Cihlářské ulici, s kavárnou.",
        "tips": [],
    },
    {
        "name": "Kimono",
        "category": "Cafe",
        "lat": 49.2053446,
        "lng": 16.6029738,
        "rating": 4,
        "description_en": "Café on Bayerova street in Veveří.",
        "description_cs": "Kavárna na Bayerově ulici ve Veveří.",
        "tips": [],
    },
    {
        "name": "Punkt.",
        "category": "Cafe",
        "lat": 49.20628,
        "lng": 16.601983,
        "rating": 4,
        "description_en": "Café on Bayerova street in Veveří.",
        "description_cs": "Kavárna na Bayerově ulici ve Veveří.",
        "tips": [],
    },
    {
        "name": "Pickle",
        "category": "Restaurant",
        "lat": 49.1944667,
        "lng": 16.6131964,
        "rating": 4,
        "description_en": "Bistro on Orlí street in the city centre.",
        "description_cs": "Bistro na Orlí ulici v centru.",
        "tips": [],
    },
    {
        "name": "U Tomana",
        "category": "Restaurant",
        "lat": 49.1952277,
        "lng": 16.6071843,
        "rating": 4,
        "description_en": "Restaurant right on náměstí Svobody.",
        "description_cs": "Restaurace přímo na náměstí Svobody.",
        "tips": [],
    },
    {
        "name": "U Dřevěného vlka",
        "category": "Pub",
        "lat": 49.192839,
        "lng": 16.6098,
        "rating": 4,
        "website": "https://www.drevenyvlk.cz",
        "description_en": "Pub on Zelný trh with beer from local breweries.",
        "description_cs": "Hospoda na Zelném trhu s pivem z místních pivovarů.",
        "tips": [],
    },
    {
        "name": "Pivnice U Čápa",
        "category": "Pub",
        "lat": 49.19963,
        "lng": 16.598049,
        "rating": 4,
        "description_en": "Classic Brno pub on Obilní trh.",
        "description_cs": "Klasická brněnská pivnice na Obilním trhu.",
        "tips": [],
    },
    {
        "name": "Suzie's Steak Pub",
        "category": "Restaurant",
        "lat": 49.201686,
        "lng": 16.602049,
        "rating": 5,
        "website": "https://www.suzies.cz",
        "description_en": "Steak pub on Kounicova street.",
        "description_cs": "Steakový pub na Kounicově ulici.",
        "tips": [],
    },
    {
        "name": "Nepal",
        "category": "Restaurant",
        "lat": 49.224441,
        "lng": 16.590209,
        "rating": 4,
        "description_en": "Indian and Nepalese restaurant by Slovanské náměstí.",
        "description_cs": "Indická a nepálská restaurace u Slovanského náměstí.",
        "tips": [],
    },
    {
        "name": "Everest",
        "category": "Restaurant",
        "lat": 49.203363,
        "lng": 16.596566,
        "rating": 4,
        "website": "https://www.everestbrno.cz",
        "description_en": "Indian and Nepalese restaurant on Veveří street.",
        "description_cs": "Indická a nepálská restaurace na ulici Veveří.",
        "tips": [],
    },
    {
        "name": "Caruso Pizza",
        "category": "Restaurant",
        "lat": 49.205852,
        "lng": 16.602709,
        "rating": 4,
        "website": "https://www.carusopizza.cz",
        "description_en": "Pizzeria on Bayerova street in Veveří.",
        "description_cs": "Pizzerie na Bayerově ulici ve Veveří.",
        "tips": [],
    },
    {
        "name": "Park Lane",
        "category": "Cafe",
        "lat": 49.204332,
        "lng": 16.608492,
        "rating": 4,
        "description_en": "Café on Lužánecká street, a few steps from Lužánky park.",
        "description_cs": "Kavárna na Lužánecké, pár kroků od parku Lužánky.",
        "tips": [],
    },
    {
        "name": "Buchta B",
        "category": "Cafe",
        "lat": 49.2090114,
        "lng": 16.6038245,
        "rating": 4,
        "description_en": "Café on Štefánikova street.",
        "description_cs": "Kavárna na Štefánikově ulici.",
        "tips": [],
    },
    {
        "name": "Srdečno",
        "category": "Cafe",
        "lat": 49.203583,
        "lng": 16.6063,
        "rating": 4,
        "description_en": "Café on Smetanova street.",
        "description_cs": "Kavárna na Smetanově ulici.",
        "tips": [],
    },
    {
        "name": "La Speranza",
        "category": "Restaurant",
        "lat": 49.202647,
        "lng": 16.607426,
        "rating": 4,
        "description_en": "Italian bistro and pizzeria on Lidická street.",
        "description_cs": "Italské bistro a pizzerie na Lidické ulici.",
        "tips": [],
    },
    {
        "name": "FIKA",
        "category": "Cafe",
        "lat": 49.194264,
        "lng": 16.6067974,
        "rating": 4,
        "description_en": "Café on Dominikánské náměstí in the city centre.",
        "description_cs": "Kavárna na Dominikánském náměstí v centru.",
        "tips": [],
    },
    {
        "name": "Mr. Poke",
        "category": "Restaurant",
        "lat": 49.1942149,
        "lng": 16.6102079,
        "rating": 4,
        "description_en": "Poke bowls on Jánská street in the city centre.",
        "description_cs": "Poke bowly na Jánské ulici v centru.",
        "tips": [],
    },
]


def seed_if_empty(session: Session) -> None:
    # Only an empty database is filled, so my own edits are never overwritten.
    if session.exec(select(Place).limit(1)).first() is not None:
        return

    for data in SAMPLE_PLACES:
        place_fields = {key: value for key, value in data.items() if key != "tips"}
        place = Place(**place_fields)
        place.tips = [
            Tip(type=tip_type, text_en=text_en, text_cs=text_cs, position=index)
            for index, (tip_type, text_en, text_cs) in enumerate(data["tips"])
        ]
        session.add(place)

    session.commit()

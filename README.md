# Brno Spots

An interactive map of my favourite places in Brno and the surrounding area –
with photos, my rating and personal tips (*what to order, what to skip*).

> 🚧 Work in progress – stage 1 (MVP) is being built.

## Tech stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React (Vite), react-leaflet, Mapy.com tiles |
| Backend  | Python, FastAPI *(planned)*                 |
| Database | SQLite → PostgreSQL *(planned)*             |
| DevOps   | Docker Compose *(planned)*                  |

## Repository structure

```
.
├── frontend/   # React single-page app (map UI)
├── backend/    # FastAPI REST API (coming soon)
└── README.md
```

## Getting started

### Frontend

Requirements: Node.js 20+

```bash
cd frontend
npm install
cp .env.example .env   # then put your Mapy.com API key into .env
npm run dev
```

Open http://localhost:5173.

Without an API key, the map falls back to OpenStreetMap tiles, so the app
works out of the box.

## Roadmap

- [x] Map of Brno with sample pins
- [ ] REST API + database for places
- [ ] Category filter
- [ ] Place detail (description, photos, rating, tips)
- [ ] Create / edit / delete places (single owner)
- [ ] "Navigate" button → Mapy.com route
- [ ] Stage 2: menu items with prices and "last updated" date
- [ ] Stage 3: public transport info, multiple users

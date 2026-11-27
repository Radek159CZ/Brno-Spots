# Brno Spots

An interactive map of my favourite places in Brno and the surrounding area –
with photos, my rating and personal tips (*what to order, what to skip*).

> 🚧 Work in progress – stage 1 (MVP) is being built.

## Tech stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React (Vite), react-leaflet, Mapy.com tiles |
| Backend  | Python, FastAPI, SQLModel                   |
| Database | SQLite (PostgreSQL later)                   |
| DevOps   | Docker Compose *(planned)*                  |

## Repository structure

```
.
├── frontend/   # React single-page app (map UI)
├── backend/    # FastAPI REST API + database
└── README.md
```

## Getting started

Run the backend and the frontend, each in its own terminal.

### Backend

Requirements: Python 3.11+

```bash
cd backend
python -m venv .venv
.venv\Scriptsctivate        # Windows (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs on http://localhost:8000 (interactive docs at
http://localhost:8000/docs). On the first start it creates the SQLite database
`backend/brno_spots.db` and fills it with sample places. Delete the file to
start again from the sample data.

Tests: `pytest` (inside `backend/`, with the virtual environment active).

### Frontend

Requirements: Node.js 20+

```bash
cd frontend
npm install
cp .env.example .env   # then put your Mapy.com API key into .env
npm run dev
```

Open http://localhost:5173. The dev server forwards `/api/...` requests to the
backend.

Without an API key, the map falls back to OpenStreetMap tiles, so the app
works out of the box.

> **Windows / PowerShell:** if `npm` says *running scripts is disabled*, use
> `npm.cmd run dev`, or allow scripts for your user once:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Credits

Sample photos are from Wikimedia Commons under CC BY-SA licences – see
[frontend/public/photos/CREDITS.md](frontend/public/photos/CREDITS.md).

## Roadmap

- [x] Map of Brno with sample pins
- [x] List / map views, category filter, search, sorting
- [x] Place detail (description, photo, rating, tips)
- [x] "Navigate" button → Mapy.com route
- [x] Czech / English UI
- [x] REST API + database for places (read-only)
- [ ] Create / edit / delete places (single owner)
- [ ] Events / opening hours from external sources
- [ ] Stage 2: menu items with prices and "last updated" date
- [ ] Stage 3: public transport info, multiple users

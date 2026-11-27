from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.database import create_tables, engine, get_session
from app.models import Place, PlaceRead
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once when the server starts: make sure the tables exist and
    # that a brand-new database has some sample places in it.
    create_tables()
    with Session(engine) as session:
        seed_if_empty(session)
    yield


app = FastAPI(title="Brno Spots API", lifespan=lifespan)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/places", response_model=list[PlaceRead])
def list_places(session: Session = Depends(get_session)):
    # selectinload fetches the tips of all places in one extra query,
    # instead of one query per place (the "N+1 queries" problem).
    places = session.exec(select(Place).options(selectinload(Place.tips)).order_by(Place.id)).all()
    return [PlaceRead.from_db(place) for place in places]


@app.get("/api/places/{place_id}", response_model=PlaceRead)
def get_place(place_id: int, session: Session = Depends(get_session)):
    place = session.get(Place, place_id)
    if place is None:
        raise HTTPException(status_code=404, detail="Place not found")
    return PlaceRead.from_db(place)

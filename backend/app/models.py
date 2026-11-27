from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

# --- Database tables -------------------------------------------------------
# Texts I write myself exist in two languages, stored as two columns
# (`description_en`, `description_cs`). The API joins them back into
# { "en": ..., "cs": ... }, which is the shape the frontend uses.


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TipType(str, Enum):
    recommend = "recommend"
    skip = "skip"


class Place(SQLModel, table=True):
    __tablename__ = "places"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    category: str = Field(index=True)  # id like "Park"; the label is translated in the frontend
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    rating: int = Field(ge=1, le=5)
    photo: str | None = None
    website: str | None = None
    description_en: str = ""
    description_cs: str = ""
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

    # Deleting a place deletes its tips too. The list keeps the order the
    # tips were added in (`position`).
    tips: list["Tip"] = Relationship(
        back_populates="place",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": "Tip.position"},
    )


class Tip(SQLModel, table=True):
    __tablename__ = "tips"

    id: int | None = Field(default=None, primary_key=True)
    place_id: int = Field(foreign_key="places.id", index=True)
    type: TipType
    text_en: str = ""
    text_cs: str = ""
    position: int = 0

    place: Place = Relationship(back_populates="tips")


# --- API response shapes ---------------------------------------------------
# Kept separate from the tables, so the database can change without
# changing what the frontend receives (and nothing internal leaks out).


class LocalizedText(BaseModel):
    en: str
    cs: str


class TipRead(BaseModel):
    type: TipType
    text: LocalizedText


class PlaceRead(BaseModel):
    id: int
    name: str
    category: str
    lat: float
    lng: float
    rating: int
    photo: str | None
    website: str | None
    description: LocalizedText
    tips: list[TipRead]

    @classmethod
    def from_db(cls, place: Place) -> "PlaceRead":
        return cls(
            id=place.id,
            name=place.name,
            category=place.category,
            lat=place.lat,
            lng=place.lng,
            rating=place.rating,
            photo=place.photo,
            website=place.website,
            description=LocalizedText(en=place.description_en, cs=place.description_cs),
            tips=[
                TipRead(type=tip.type, text=LocalizedText(en=tip.text_en, cs=tip.text_cs))
                for tip in place.tips
            ],
        )

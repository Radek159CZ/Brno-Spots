import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.database import get_session
from app.main import app
from app.seed import SAMPLE_PLACES, seed_if_empty


@pytest.fixture
def client():
    # Each test gets its own empty in-memory database, so tests never touch
    # the real brno_spots.db file and can't influence each other.
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_if_empty(session)

    def get_test_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_test_session
    # Not using `with TestClient(...)`, so the startup code (which uses the
    # real database file) doesn't run.
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_list_places_returns_all_sample_places(client):
    response = client.get("/api/places")

    assert response.status_code == 200
    names = [place["name"] for place in response.json()]
    assert names == [place["name"] for place in SAMPLE_PLACES]


def test_place_has_the_shape_the_frontend_expects(client):
    spilberk = client.get("/api/places").json()[0]

    assert spilberk["description"] == {
        "en": SAMPLE_PLACES[0]["description_en"],
        "cs": SAMPLE_PLACES[0]["description_cs"],
    }
    assert [tip["type"] for tip in spilberk["tips"]] == ["recommend", "skip"]
    assert set(spilberk["tips"][0]["text"]) == {"en", "cs"}


def test_get_one_place(client):
    first_id = client.get("/api/places").json()[0]["id"]

    response = client.get(f"/api/places/{first_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Hrad Špilberk"


def test_unknown_place_is_404(client):
    assert client.get("/api/places/9999").status_code == 404


def test_seed_does_not_duplicate_places(client):
    count_before = len(client.get("/api/places").json())

    # Run the seed again on the same (already filled) test database.
    session = next(app.dependency_overrides[get_session]())
    seed_if_empty(session)

    assert len(client.get("/api/places").json()) == count_before

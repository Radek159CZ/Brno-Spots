import os

from sqlmodel import Session, SQLModel, create_engine

# SQLite for now: the whole database is one file next to the code.
# Later the same code can run on PostgreSQL – only this URL changes, e.g.
# DATABASE_URL=postgresql+psycopg://user:password@localhost/brno_spots
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./brno_spots.db")

# SQLite allows a connection to be used only by the thread that opened it.
# FastAPI handles requests in several threads, so that check is switched off.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


def create_tables() -> None:
    # Creates the tables that don't exist yet. It never changes an existing
    # table – once the schema starts changing, switch to migrations (Alembic).
    SQLModel.metadata.create_all(engine)


def get_session():
    # One session per request; `with` closes it when the request ends.
    # Used as a FastAPI dependency: `session: Session = Depends(get_session)`.
    with Session(engine) as session:
        yield session

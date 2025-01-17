from sqlmodel import create_engine
from sqlmodel import SQLModel, Session
from app.core.settings import Settings


settings = Settings()
engine = create_engine(
    url=settings.database.connection_string,
    echo=settings.database.debug,
    connect_args=settings.database.connection_args,
)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session

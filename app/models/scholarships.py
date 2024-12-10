from sqlmodel import SQLModel, Field
from uuid import uuid4


class Scholarships(SQLModel, table=True):  # type: ignore
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str = Field(max_length=100)
    description: str = Field(max_length=1000)

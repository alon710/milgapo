from pydantic import BaseModel
from pydantic import Field
from uuid import uuid4


class ScholarshipCreate(BaseModel):
    name: str
    description: str


class Scholarship(ScholarshipCreate):
    id: str = Field(default_factory=lambda: str(uuid4()))

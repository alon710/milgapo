from pydantic import BaseModel
from pydantic import Field
from uuid import uuid4


class ScholarshipCreate(BaseModel):
    name: str = Field(examples=["Very Cool Scholarship"])
    description: str = Field(
        examples=["This scholarship is very cool and is for very cool students."]
    )


class Scholarship(ScholarshipCreate):
    id: str = Field(default_factory=lambda: str(uuid4()), examples=[str(uuid4())])


class ScholarshipGroupCreate(BaseModel):
    name: str = Field(examples=["Orthodox Jews"])
    description: str = Field(
        examples=["This group of scholarships is for Orthodox Jewish students."]
    )


class ScholarshipGroup(ScholarshipGroupCreate):
    id: str = Field(default_factory=lambda: str(uuid4()), examples=[str(uuid4())])


class ScholarshipsGroupsScholarshipsLink(BaseModel):
    group_id: str = Field(examples=[str(uuid4())])
    scholarship_id: str = Field(examples=[str(uuid4())])

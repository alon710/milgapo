from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from pydantic import Field
from uuid import uuid4


class ScholarshipFilter(BaseModel):
    model_config: ConfigDict = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    names: list[str] = Field(default_factory=list, examples=[["Very Cool Scholarship"]])


class ScholarshipCreate(BaseModel):
    model_config: ConfigDict = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    name: str = Field(examples=["Very Cool Scholarship"])
    description: str = Field(
        examples=["This scholarship is very cool and is for very cool students."]
    )


class Scholarship(ScholarshipCreate):
    id: str = Field(default_factory=lambda: str(uuid4()), examples=[str(uuid4())])


class ScholarshipGroupCreate(BaseModel):
    model_config: ConfigDict = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    name: str = Field(examples=["Orthodox Jews"])
    description: str = Field(
        examples=["This group of scholarships is for Orthodox Jewish students."]
    )


class ScholarshipGroup(ScholarshipGroupCreate):
    id: str = Field(default_factory=lambda: str(uuid4()), examples=[str(uuid4())])


class ScholarshipsGroupsScholarshipsLink(BaseModel):
    model_config: ConfigDict = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    group_id: str = Field(examples=[str(uuid4())])
    scholarship_id: str = Field(examples=[str(uuid4())])

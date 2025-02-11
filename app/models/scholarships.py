from sqlmodel import Field, Relationship, SQLModel
from uuid import uuid4
from pydantic import ConfigDict


class ScholarshipsGroupsScholarshipsLinks(SQLModel, table=True):  # type: ignore
    __tablename__ = "scholarships_groups_scholarships_links"
    scholarship_id: str = Field(foreign_key="scholarships.id", primary_key=True)
    group_id: str = Field(foreign_key="scholarships_groups.id", primary_key=True)


class ScholarshipsGroups(SQLModel, table=True):  # type: ignore
    __tablename__ = "scholarships_groups"
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str = Field(max_length=100)
    description: str = Field(max_length=1000)

    scholarships: list["Scholarships"] = Relationship(
        back_populates="groups",
        link_model=ScholarshipsGroupsScholarshipsLinks,
    )

    model_config: ConfigDict = ConfigDict(arbitrary_types_allowed=True)


class Scholarships(SQLModel, table=True):  # type: ignore
    __tablename__ = "scholarships"
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str = Field(max_length=100)
    description: str = Field(max_length=1000)

    groups: list["ScholarshipsGroups"] = Relationship(
        back_populates="scholarships",
        link_model=ScholarshipsGroupsScholarshipsLinks,
    )

    model_config: ConfigDict = ConfigDict(arbitrary_types_allowed=True)

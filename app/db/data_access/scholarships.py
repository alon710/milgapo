from sqlmodel import Session, insert, update
from sqlalchemy.sql.expression import Insert

from app.schemas.scholarships import (
    Scholarship,
    ScholarshipCreate,
    ScholarshipGroup,
    ScholarshipGroupCreate,
    ScholarshipsGroupsScholarshipsLink,
)
from app.models.scholarships import (
    Scholarships,
    ScholarshipsGroups,
    ScholarshipsGroupsScholarshipsLinks,
)


class ScholarshipsDataAccess:
    def __init__(self, session: Session):
        self.session = session

    def get_scholarship_by_id(self, scholarship_id: str) -> Scholarship:
        with self.session as session:
            return session.get(Scholarships, scholarship_id)

    def create_scholarship(
        self,
        scholarship: ScholarshipCreate,
    ) -> Scholarship:
        with self.session as session:
            scholarship = Scholarships(**scholarship.model_dump())
            session.add(scholarship)
            session.commit()
            session.refresh(scholarship)
            return Scholarship(**scholarship.model_dump())

    def get_scholarship_group_by_id(self, group_id: str) -> ScholarshipGroup:
        with self.session as session:
            scholarship_group = session.get(ScholarshipsGroups, group_id)
            return ScholarshipGroup(**scholarship_group.model_dump())

    def create_scholarship_group(
        self,
        scholarship_group: ScholarshipGroupCreate,
    ) -> ScholarshipGroup:
        with self.session as session:
            group = ScholarshipsGroups(**scholarship_group.model_dump())
            session.add(group)
            session.commit()
            session.refresh(group)
            return ScholarshipGroup(**group.model_dump())

    def add_scholarship_to_group(
        self,
        scholarship_id: str,
        group_id: str,
    ) -> ScholarshipsGroupsScholarshipsLink:
        with self.session as session:
            if not session.get(Scholarships, scholarship_id):
                raise ValueError(f"Scholarship '{scholarship_id}' does not exist")
            if not session.get(ScholarshipsGroups, group_id):
                raise ValueError(f"Group '{group_id}' does not exist")

            link = ScholarshipsGroupsScholarshipsLinks(
                scholarship_id=scholarship_id,
                group_id=group_id,
            )
            session.merge(link)
            session.commit()
            return ScholarshipsGroupsScholarshipsLink(**link.model_dump())

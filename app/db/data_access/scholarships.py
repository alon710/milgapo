from sqlmodel import Session, insert, update
from sqlalchemy.sql.expression import Insert

from app.schemas.scholarships import (
    Scholarship,
    ScholarshipCreate,
    ScholarshipGroup,
    ScholarshipGroupCreate,
)
from app.models.scholarships import (
    Scholarships,
    ScholarshipsGroups,
    ScholarshipsGroupsScholarshipsLink,
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
            return scholarship

    def get_scholarship_group_by_id(self, group_id: str) -> ScholarshipGroup:
        with self.session as session:
            return session.get(ScholarshipsGroups, group_id)

    def create_scholarship_group(
        self,
        scholarship_group: ScholarshipGroupCreate,
    ) -> ScholarshipGroup:
        with self.session as session:
            group = ScholarshipsGroups(**scholarship_group.model_dump())
            session.add(group)
            session.commit()
            session.refresh(group)
            return group

    def add_scholarship_to_group(
        self,
        scholarship_id: str,
        group_id: str,
    ) -> ScholarshipsGroupsScholarshipsLink:
        with self.session as session:
            new_record = ScholarshipsGroupsScholarshipsLink(
                scholarship_id=scholarship_id,
                group_id=group_id,
            )
            session.merge(new_record)  # Will insert or update as needed
            session.commit()
            return new_record

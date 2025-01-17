from sqlmodel import Session
from app.db.data_access.scholarships import ScholarshipsDataAccess
from app.schemas.scholarships import (
    ScholarshipCreate,
    Scholarship,
    ScholarshipFilter,
    ScholarshipGroup,
    ScholarshipGroupCreate,
)


class ScholarshipsService:
    def __init__(self, session: Session):
        self.session = session

    def get_scholarship_by_id(
        self,
        scholarship_id: str,
    ) -> Scholarship:
        return ScholarshipsDataAccess(self.session).get_scholarship_by_id(
            scholarship_id=scholarship_id,
        )

    def create_scholarship(
        self,
        scholarship: ScholarshipCreate,
    ) -> Scholarship:
        return ScholarshipsDataAccess(self.session).create_scholarship(
            scholarship=scholarship,
        )

    def get_scholarship_group_by_id(
        self,
        group_id: str,
    ) -> ScholarshipGroup:
        return ScholarshipsDataAccess(self.session).get_scholarship_group_by_id(
            group_id=group_id,
        )

    def create_scholarship_group(
        self,
        group: ScholarshipGroupCreate,
    ) -> ScholarshipGroup:
        return ScholarshipsDataAccess(self.session).create_scholarship_group(group)

    def add_scholarship_to_group(
        self,
        scholarship_id: str,
        group_id: str,
    ) -> ScholarshipGroup:
        return ScholarshipsDataAccess(self.session).add_scholarship_to_group(
            scholarship_id=scholarship_id,
            group_id=group_id,
        )

    def get_scholarships(
        self,
        filters: ScholarshipFilter,
        offset: int,
        limit: int,
    ):
        return ScholarshipsDataAccess(self.session).get_scholarships(
            filters=filters,
            offset=offset,
            limit=limit,
        )

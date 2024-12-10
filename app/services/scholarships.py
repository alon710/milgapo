from sqlmodel import Session
from app.db.data_access.scholarships import ScholarshipsDataAccess


class ScholarshipsService:
    def __init__(self, session: Session):
        self.session = session

    def get_scholarship_by_id(
        self,
        scholarship_id: str,
    ):
        return ScholarshipsDataAccess(self.session).get_scholarship_by_id(
            scholarship_id=scholarship_id,
        )

    def create_scholarship(
        self,
        scholarship,
    ):
        return ScholarshipsDataAccess(self.session).create_scholarship(
            scholarship=scholarship,
        )

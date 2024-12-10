from sqlmodel import Session

from app.schemas.scholarships import Scholarship, ScholarshipCreate
from app.models.scholarships import Scholarships


class ScholarshipsDataAccess:
    def __init__(self, session: Session):
        self.session = session

    def get_scholarship_by_id(self, scholarship_id: str) -> Scholarship:
        return self.session.get(Scholarships, scholarship_id)

    def create_scholarship(
        self,
        scholarship: ScholarshipCreate,
    ) -> Scholarship:
        db_scholarship = Scholarships(**scholarship.model_dump())
        self.session.add(db_scholarship)
        self.session.commit()
        self.session.refresh(db_scholarship)
        return db_scholarship

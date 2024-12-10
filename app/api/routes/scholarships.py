from fastapi import APIRouter, Depends
from app.db.database import get_session
from app.schemas.scholarships import Scholarship, ScholarshipCreate
from app.services.scholarships import ScholarshipsService

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])


@router.get("/{id}")
def get_scholarship(id: str, db=Depends(get_session)) -> Scholarship:
    return ScholarshipsService(db).get_scholarship_by_id(id)


@router.post("/")
def create_scholarship(
    scholarship: ScholarshipCreate, db=Depends(get_session)
) -> Scholarship:
    return ScholarshipsService(db).create_scholarship(scholarship)

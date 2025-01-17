from fastapi import APIRouter, Depends
from app.db.database import get_session
from app.schemas.scholarships import (
    Scholarship,
    ScholarshipCreate,
    ScholarshipFilter,
    ScholarshipGroup,
    ScholarshipsGroupsScholarshipsLink,
)
from app.services.scholarships import ScholarshipsService

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])


@router.get("/{id}")
def get_scholarship(id: str, db=Depends(get_session)) -> Scholarship:
    return ScholarshipsService(db).get_scholarship_by_id(id)


@router.post("/")
def create_scholarship(
    scholarship: ScholarshipCreate,
    db=Depends(get_session),
) -> Scholarship:
    return ScholarshipsService(db).create_scholarship(scholarship)


@router.get("/groups/{id}")
def get_scholarship_group(
    id: str,
    db=Depends(get_session),
) -> ScholarshipGroup:
    return ScholarshipsService(db).get_scholarship_group_by_id(id)


@router.post("/groups/")
def create_scholarship_group(
    group: ScholarshipGroup,
    db=Depends(get_session),
) -> ScholarshipGroup:
    return ScholarshipsService(db).create_scholarship_group(group)


@router.put("/groups/{group_id}/scholarships/{scholarship_id}")
def add_scholarship_to_group(
    scholarship_id: str,
    group_id: str,
    db=Depends(get_session),
) -> ScholarshipsGroupsScholarshipsLink:
    return ScholarshipsService(db).add_scholarship_to_group(scholarship_id, group_id)


@router.post("/scholarships/get-bulk")
def get_scholarships(
    filters: ScholarshipFilter,
    offset: int = 0,
    limit: int = 10,
    db=Depends(get_session),
):
    return ScholarshipsService(db).get_scholarships(
        filters=filters,
        offset=offset,
        limit=limit,
    )

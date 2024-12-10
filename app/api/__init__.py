from fastapi import APIRouter
from app.api.routes import scholarships

router = APIRouter(prefix="/api")

router.include_router(scholarships.router)

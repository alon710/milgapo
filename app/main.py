from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import logfire
from contextlib import asynccontextmanager
from app.core.logger import init_logger
from app.api import router as api_router
from app.core.settings import Settings

logfire.configure()
init_logger()

settings = Settings()
app = FastAPI(debug=True)

logfire.instrument_fastapi(app)


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.db.database import create_db_and_tables

    create_db_and_tables()

    yield


app.router.lifespan_context = lifespan
app.include_router(api_router)


@app.get("/", include_in_schema=False)
def read_root():
    return RedirectResponse(url="/docs")

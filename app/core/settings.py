from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

from app.schemas.common import Environment


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="DATABASE_")
    connection_string: str = Field(alias="DATABASE_URL")
    debug: bool = Field(alias="DATABASE_DEBUG")
    connection_args: dict = Field(alias="DATABASE_CONNECTION_ARGS")


class CoreSettings(BaseSettings):
    environment: Environment = Field(alias="ENVIRONMENT", default=Environment.LOCAL)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    core: CoreSettings = CoreSettings()
    database: DatabaseSettings = DatabaseSettings()

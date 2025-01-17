from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


from pathlib import Path

ENV_FILE = Path(__file__).parent.parent / ".env"


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="DATABASE_")
    connection_string: str = Field(alias="DATABASE_URL", default="sqlite://")
    debug: bool = Field(alias="DATABASE_DEBUG")
    connection_args: dict = Field(
        alias="DATABASE_CONNECTION_ARGS", default={"check_same_thread": False}
    )


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE)
    database: DatabaseSettings = DatabaseSettings()

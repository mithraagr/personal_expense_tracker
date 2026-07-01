from __future__ import annotations

from functools import lru_cache

from typing import Annotated, Any

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Personal Expense Management"
    app_env: str = "development"
    api_prefix: str = "/api"
    debug: bool = False

    secret_key: str = Field(default="change_this_secret_key", min_length=16)
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    database_url: str = "sqlite:///./expenses.db"

    default_admin_first_name: str = "System"
    default_admin_last_name: str = "Admin"
    default_admin_email: str = "admin@example.com"
    default_admin_city: str = "Default"
    default_admin_password: str = "Admin@123"

    cors_allowed_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173"]
    cors_allowed_origin_regex: str | None = None


    email_notifications_enabled: bool = False
    smtp_host: str | None = None
    smtp_port: int | None = None
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_use_tls: bool = True

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.development"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: Any) -> list[str]:
        if value is None or value == "":
            return []
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()

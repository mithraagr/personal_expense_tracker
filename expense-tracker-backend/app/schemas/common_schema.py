from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str | list[dict[str, Any]]

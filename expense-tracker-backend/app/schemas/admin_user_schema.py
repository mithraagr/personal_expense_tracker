from __future__ import annotations

from pydantic import BaseModel

from app.schemas.user_schema import UserRole


class ChangeUserRoleRequest(BaseModel):
    role: UserRole

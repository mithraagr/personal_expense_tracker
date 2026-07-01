from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

UserRole = Literal["user", "admin"]


class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    city: str
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

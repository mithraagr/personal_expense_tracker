from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field, model_validator

from app.schemas.user_schema import UserOut
from app.utils.security import validate_password_policy


class RegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=80)
    last_name: str = Field(..., min_length=1, max_length=80)
    email: EmailStr
    city: str = Field(..., min_length=1, max_length=120)
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)

    @model_validator(mode="after")
    def validate_register(self) -> "RegisterRequest":
        self.first_name = self.first_name.strip()
        self.last_name = self.last_name.strip()
        self.city = self.city.strip()
        if self.password != self.confirm_password:
            raise ValueError("Password and confirm password must match.")
        validate_password_policy(self.password)
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_new_password: str = Field(..., min_length=8, max_length=128)

    @model_validator(mode="after")
    def validate_change_password(self) -> "ChangePasswordRequest":
        if self.new_password != self.confirm_new_password:
            raise ValueError("New password and confirm password must match.")
        validate_password_policy(self.new_password)
        return self

from __future__ import annotations

from datetime import timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.setting import UserSetting
from app.models.user import User
from app.schemas.auth_schema import ChangePasswordRequest, LoginRequest, RegisterRequest
from app.utils.exceptions import AppError
from app.utils.security import create_access_token, hash_password, verify_password


class AuthService:
    def register(self, db: Session, payload: RegisterRequest) -> User:
        email = payload.email.lower().strip()
        existing = db.scalar(select(User).where(func.lower(User.email) == email))
        if existing:
            raise AppError(409, "Email already registered.")

        user = User(
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
            email=email,
            city=payload.city.strip(),
            hashed_password=hash_password(payload.password),
            role="user",
            is_active=True,
        )
        db.add(user)
        db.flush()
        db.add(UserSetting(user_id=user.id, monthly_expense_limit=0, monthly_limit_enabled=False))
        db.commit()
        db.refresh(user)
        return user

    def login(self, db: Session, payload: LoginRequest) -> tuple[str, User]:
        email = payload.email.lower().strip()
        user = db.scalar(select(User).where(func.lower(User.email) == email))
        if not user or not verify_password(payload.password, user.hashed_password):
            raise AppError(401, "Invalid email or password.")
        if not user.is_active:
            raise AppError(403, "Your account is disabled. Please contact administrator.")

        settings = get_settings()
        token = create_access_token(
            subject=str(user.id),
            role=user.role,
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        )
        return token, user

    def change_password(self, db: Session, user: User, payload: ChangePasswordRequest) -> None:
        if not verify_password(payload.current_password, user.hashed_password):
            raise AppError(400, "Current password is incorrect.")
        if verify_password(payload.new_password, user.hashed_password):
            raise AppError(400, "New password should not be same as current password.")
        user.hashed_password = hash_password(payload.new_password)
        db.commit()

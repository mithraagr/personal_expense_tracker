from __future__ import annotations

from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.utils.exceptions import AppError
from app.utils.jwt import decode_access_token

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_prefix}/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise AppError(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token.")

    user = db.get(User, user_id)
    if not user:
        raise AppError(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token.")
    if not user.is_active:
        raise AppError(status.HTTP_403_FORBIDDEN, "Your account is disabled. Please contact administrator.")
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise AppError(status.HTTP_403_FORBIDDEN, "Admin access required.")
    return current_user

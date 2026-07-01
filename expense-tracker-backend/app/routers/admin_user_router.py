from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.schemas.admin_user_schema import ChangeUserRoleRequest
from app.schemas.user_schema import UserOut
from app.services.admin_user_service import AdminUserService

router = APIRouter(prefix="/admin/users", tags=["Admin - Users"])
service = AdminUserService()


@router.get("", response_model=list[UserOut])
def list_users(
    search: str | None = Query(default=None, max_length=120),
    role: str | None = Query(default=None, pattern="^(user|admin)$"),
    status: str | None = Query(default=None, pattern="^(active|disabled)$"),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.list_users(db, search=search, role=role, status=status)


@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.get_user(db, user_id)


@router.put("/{user_id}/enable", response_model=UserOut)
def enable_user(
    user_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.enable_user(db, user_id)


@router.put("/{user_id}/disable", response_model=UserOut)
def disable_user(
    user_id: int,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.disable_user(db, current_admin, user_id)


@router.put("/{user_id}/role", response_model=UserOut)
def change_user_role(
    user_id: int,
    payload: ChangeUserRoleRequest,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.change_role(db, current_admin, user_id, payload)

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.setting_schema import MonthlyLimitUpdate, UserSettingOut
from app.services.setting_service import SettingService

router = APIRouter(prefix="/settings", tags=["Settings"])
service = SettingService()


@router.get("", response_model=UserSettingOut)
def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get_or_create(db, current_user)


@router.put("/monthly-limit", response_model=UserSettingOut)
def update_monthly_limit(
    payload: MonthlyLimitUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_monthly_limit(db, current_user, payload)


@router.delete("/monthly-limit", response_model=UserSettingOut)
def disable_monthly_limit(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.disable_monthly_limit(db, current_user)

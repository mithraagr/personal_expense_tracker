from __future__ import annotations

from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.setting import UserSetting
from app.models.user import User
from app.schemas.setting_schema import MonthlyLimitUpdate


class SettingService:
    def get_or_create(self, db: Session, user: User) -> UserSetting:
        setting = db.scalar(select(UserSetting).where(UserSetting.user_id == user.id))
        if setting:
            return setting
        setting = UserSetting(user_id=user.id, monthly_expense_limit=Decimal("0.00"), monthly_limit_enabled=False)
        db.add(setting)
        db.commit()
        db.refresh(setting)
        return setting

    def update_monthly_limit(self, db: Session, user: User, payload: MonthlyLimitUpdate) -> UserSetting:
        setting = self.get_or_create(db, user)
        setting.monthly_expense_limit = payload.monthly_expense_limit
        setting.monthly_limit_enabled = payload.monthly_limit_enabled
        db.commit()
        db.refresh(setting)
        return setting

    def disable_monthly_limit(self, db: Session, user: User) -> UserSetting:
        setting = self.get_or_create(db, user)
        setting.monthly_limit_enabled = False
        db.commit()
        db.refresh(setting)
        return setting

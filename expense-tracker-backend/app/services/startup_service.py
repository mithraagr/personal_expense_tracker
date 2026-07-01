from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.category import Category
from app.models.setting import UserSetting
from app.models.user import User
from app.schemas.expense_schema import EXPENSE_CATEGORIES
from app.utils.security import hash_password


class StartupService:
    def ensure_default_admin(self, db: Session) -> None:
        settings = get_settings()
        admin_count = db.scalar(select(func.count()).select_from(User).where(User.role == "admin")) or 0
        if admin_count:
            return
        admin = User(
            first_name=settings.default_admin_first_name,
            last_name=settings.default_admin_last_name,
            email=settings.default_admin_email.lower().strip(),
            city=settings.default_admin_city,
            hashed_password=hash_password(settings.default_admin_password),
            role="admin",
            is_active=True,
        )
        db.add(admin)
        db.flush()
        db.add(UserSetting(user_id=admin.id, monthly_expense_limit=0, monthly_limit_enabled=False))
        db.commit()

    def ensure_categories(self, db: Session) -> None:
        existing = set(db.scalars(select(Category.name)).all())
        for name in EXPENSE_CATEGORIES:
            if name not in existing:
                db.add(Category(name=name, is_active=True))
        db.commit()

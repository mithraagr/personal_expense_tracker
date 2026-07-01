from __future__ import annotations

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.admin_user_schema import ChangeUserRoleRequest
from app.utils.exceptions import AppError


class AdminUserService:
    def active_admin_count(self, db: Session) -> int:
        return int(db.scalar(select(func.count()).select_from(User).where(User.role == "admin", User.is_active.is_(True))) or 0)

    def list_users(self, db: Session, *, search: str | None = None, role: str | None = None, status: str | None = None) -> list[User]:
        query = select(User)
        if search:
            pattern = f"%{search.strip().lower()}%"
            query = query.where(
                or_(
                    func.lower(User.first_name).like(pattern),
                    func.lower(User.last_name).like(pattern),
                    func.lower(User.email).like(pattern),
                    func.lower(User.city).like(pattern),
                )
            )
        if role:
            if role not in {"user", "admin"}:
                raise AppError(400, "Role value must be either user or admin.")
            query = query.where(User.role == role)
        if status:
            if status not in {"active", "disabled"}:
                raise AppError(400, "Status must be active or disabled.")
            query = query.where(User.is_active.is_(status == "active"))
        return list(db.scalars(query.order_by(User.id.desc())).all())

    def get_user(self, db: Session, user_id: int) -> User:
        user = db.get(User, user_id)
        if not user:
            raise AppError(404, "User not found.")
        return user

    def enable_user(self, db: Session, target_user_id: int) -> User:
        target = self.get_user(db, target_user_id)
        target.is_active = True
        db.commit()
        db.refresh(target)
        return target

    def disable_user(self, db: Session, current_admin: User, target_user_id: int) -> User:
        target = self.get_user(db, target_user_id)
        if target.id == current_admin.id:
            raise AppError(400, "Admin cannot disable their own account.")
        if target.role == "admin" and target.is_active and self.active_admin_count(db) <= 1:
            raise AppError(400, "Cannot disable the last active admin account.")
        target.is_active = False
        db.commit()
        db.refresh(target)
        return target

    def change_role(self, db: Session, current_admin: User, target_user_id: int, payload: ChangeUserRoleRequest) -> User:
        target = self.get_user(db, target_user_id)
        new_role = payload.role
        if target.id == current_admin.id and new_role != "admin":
            raise AppError(400, "Admin cannot remove their own admin role.")
        if target.role == "admin" and new_role != "admin" and target.is_active and self.active_admin_count(db) <= 1:
            raise AppError(400, "Cannot remove admin role from the last active admin account.")
        target.role = new_role
        db.commit()
        db.refresh(target)
        return target

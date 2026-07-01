from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Any

from sqlalchemy import Select, and_, extract, func, or_, select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense_schema import ExpenseCreate, ExpenseUpdate
from app.utils.date_utils import current_month_year
from app.utils.exceptions import AppError


class ExpenseService:
    def _base_query(self, user: User) -> Select[tuple[Expense]]:
        return select(Expense).where(Expense.user_id == user.id)

    def _has_any_filter(self, filters: dict[str, Any]) -> bool:
        return any(value not in (None, "") for value in filters.values())

    def apply_filters(self, query: Select[tuple[Expense]], filters: dict[str, Any]) -> Select[tuple[Expense]]:
        date_value: date | None = filters.get("date")
        from_date: date | None = filters.get("from_date")
        to_date: date | None = filters.get("to_date")
        month: int | None = filters.get("month")
        year: int | None = filters.get("year")
        category: str | None = filters.get("category")
        search: str | None = filters.get("search")

        if from_date and to_date and from_date > to_date:
            raise AppError(400, "From date should not be greater than to date.")

        if not self._has_any_filter(filters):
            month, year = current_month_year()

        if date_value:
            query = query.where(Expense.spend_date == date_value)
        else:
            if from_date:
                query = query.where(Expense.spend_date >= from_date)
            if to_date:
                query = query.where(Expense.spend_date <= to_date)
            if month:
                query = query.where(extract("month", Expense.spend_date) == month)
            if year:
                query = query.where(extract("year", Expense.spend_date) == year)

        if category:
            query = query.where(Expense.category == category)

        if search:
            search_term = f"%{search.strip().lower()}%"
            query = query.where(
                or_(
                    func.lower(Expense.title).like(search_term),
                    func.lower(Expense.category).like(search_term),
                )
            )

        return query

    def list(self, db: Session, user: User, filters: dict[str, Any]) -> list[Expense]:
        query = self.apply_filters(self._base_query(user), filters).order_by(Expense.spend_date.desc(), Expense.id.desc())
        return list(db.scalars(query).all())

    def get(self, db: Session, user: User, expense_id: int) -> Expense:
        expense = db.scalar(select(Expense).where(Expense.id == expense_id, Expense.user_id == user.id))
        if not expense:
            raise AppError(404, "Expense not found.")
        return expense

    def create(self, db: Session, user: User, payload: ExpenseCreate) -> Expense:
        expense = Expense(
            user_id=user.id,
            title=payload.title or payload.category,
            category=payload.category,
            spend_date=payload.spend_date,
            amount=payload.amount,
        )
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense

    def update(self, db: Session, user: User, expense_id: int, payload: ExpenseUpdate) -> Expense:
        expense = self.get(db, user, expense_id)
        expense.title = payload.title or payload.category
        expense.category = payload.category
        expense.spend_date = payload.spend_date
        expense.amount = payload.amount
        db.commit()
        db.refresh(expense)
        return expense

    def delete(self, db: Session, user: User, expense_id: int) -> None:
        expense = self.get(db, user, expense_id)
        db.delete(expense)
        db.commit()

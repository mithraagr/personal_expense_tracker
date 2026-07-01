from __future__ import annotations

from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.common_schema import MessageResponse
from app.schemas.expense_schema import ExpenseCategory, ExpenseCreate, ExpenseOut, ExpenseUpdate
from app.services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["Expenses"])
service = ExpenseService()


def expense_filters(
    date: date | None = Query(default=None, description="Filter by one exact spend date."),
    from_date: date | None = Query(default=None, description="Filter range start date."),
    to_date: date | None = Query(default=None, description="Filter range end date."),
    month: int | None = Query(default=None, ge=1, le=12, description="Filter by month number, 1-12."),
    year: int | None = Query(default=None, ge=1900, le=2200, description="Filter by year."),
    category: ExpenseCategory | None = Query(default=None, description="Filter by expense category."),
    search: str | None = Query(default=None, max_length=120, description="Search title or category."),
) -> dict[str, Any]:
    return {
        "date": date,
        "from_date": from_date,
        "to_date": to_date,
        "month": month,
        "year": year,
        "category": category,
        "search": search,
    }


@router.get("", response_model=list[ExpenseOut])
def list_expenses(
    filters: dict[str, Any] = Depends(expense_filters),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list:
    return service.list(db, current_user, filters)


@router.post("", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    payload: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.create(db, current_user, payload)


@router.get("/{expense_id}", response_model=ExpenseOut)
def get_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get(db, current_user, expense_id)


@router.put("/{expense_id}", response_model=ExpenseOut)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update(db, current_user, expense_id, payload)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    service.delete(db, current_user, expense_id)
    return None

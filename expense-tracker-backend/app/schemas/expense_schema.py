from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_serializer, model_validator

ExpenseCategory = Literal[
    "Food",
    "Grocery",
    "Travel",
    "Rent",
    "Bills",
    "Shopping",
    "Entertainment",
    "Medical",
    "Education",
    "Fuel",
    "Others",
]

EXPENSE_CATEGORIES: tuple[str, ...] = (
    "Food",
    "Grocery",
    "Travel",
    "Rent",
    "Bills",
    "Shopping",
    "Entertainment",
    "Medical",
    "Education",
    "Fuel",
    "Others",
)


class ExpenseBase(BaseModel):
    title: str | None = Field(default=None, max_length=160)
    category: ExpenseCategory
    spend_date: date
    amount: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2)

    @model_validator(mode="after")
    def normalize_expense(self) -> "ExpenseBase":
        if self.title is not None:
            self.title = self.title.strip() or None
        return self


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(ExpenseBase):
    pass


class ExpenseOut(BaseModel):
    id: int
    user_id: int
    title: str
    category: ExpenseCategory
    spend_date: date
    amount: Decimal
    created_at: datetime
    updated_at: datetime

    @field_serializer("amount")
    def serialize_amount(self, amount: Decimal) -> float:
        return float(amount)

    model_config = ConfigDict(from_attributes=True)

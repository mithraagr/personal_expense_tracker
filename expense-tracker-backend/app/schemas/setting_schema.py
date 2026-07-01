from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_serializer, model_validator


class UserSettingOut(BaseModel):
    monthly_expense_limit: Decimal
    monthly_limit_enabled: bool

    @field_serializer("monthly_expense_limit")
    def serialize_monthly_expense_limit(self, value: Decimal) -> float:
        return float(value)

    model_config = ConfigDict(from_attributes=True)


class MonthlyLimitUpdate(BaseModel):
    monthly_expense_limit: Decimal = Field(default=0, ge=0, max_digits=12, decimal_places=2)
    monthly_limit_enabled: bool = True

    @model_validator(mode="after")
    def validate_monthly_limit(self) -> "MonthlyLimitUpdate":
        if self.monthly_limit_enabled and self.monthly_expense_limit <= 0:
            raise ValueError("Monthly limit must be greater than zero.")
        return self

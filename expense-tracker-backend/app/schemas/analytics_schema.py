from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, field_serializer


class CategoryTotal(BaseModel):
    category: str
    total: Decimal

    @field_serializer("total")
    def serialize_total(self, total: Decimal) -> float:
        return float(total)


class TrendPoint(BaseModel):
    label: str
    total: Decimal

    @field_serializer("total")
    def serialize_total(self, total: Decimal) -> float:
        return float(total)


class AnalyticsSummary(BaseModel):
    overall_total: Decimal
    total_entries: int
    average_expense: Decimal
    top_category: str
    category_totals: list[CategoryTotal]
    daily_trend: list[TrendPoint]
    monthly_trend: list[TrendPoint]

    @field_serializer("overall_total", "average_expense")
    def serialize_decimal(self, value: Decimal) -> float:
        return float(value)


class SummaryResponse(BaseModel):
    overall_total: Decimal
    category_totals: list[CategoryTotal]

    @field_serializer("overall_total")
    def serialize_overall_total(self, total: Decimal) -> float:
        return float(total)

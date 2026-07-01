from __future__ import annotations

from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from typing import Any

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.user import User
from app.services.expense_service import ExpenseService
from app.utils.date_utils import month_label


class AnalyticsService:
    def __init__(self) -> None:
        self.expense_service = ExpenseService()

    def get_filtered_expenses(self, db: Session, user: User, filters: dict[str, Any]) -> list[Expense]:
        return self.expense_service.list(db, user, filters)

    def build_summary(self, expenses: list[Expense]) -> dict[str, Any]:
        overall_total = sum((expense.amount for expense in expenses), Decimal("0.00"))
        category_map: dict[str, Decimal] = defaultdict(lambda: Decimal("0.00"))
        day_map: dict[str, Decimal] = defaultdict(lambda: Decimal("0.00"))
        month_map: dict[str, Decimal] = defaultdict(lambda: Decimal("0.00"))

        for expense in expenses:
            category_map[expense.category] += expense.amount
            day_map[expense.spend_date.isoformat()] += expense.amount
            month_map[month_label(expense.spend_date.year, expense.spend_date.month)] += expense.amount

        category_totals = sorted(
            ({"category": category, "total": total} for category, total in category_map.items()),
            key=lambda row: row["total"],
            reverse=True,
        )
        total_entries = len(expenses)
        average = (overall_total / total_entries).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) if total_entries else Decimal("0.00")
        top_category = category_totals[0]["category"] if category_totals else "None"

        return {
            "overall_total": overall_total,
            "total_entries": total_entries,
            "average_expense": average,
            "top_category": top_category,
            "category_totals": category_totals,
            "daily_trend": [
                {"label": label[5:], "total": total}
                for label, total in sorted(day_map.items(), key=lambda item: item[0])
            ],
            "monthly_trend": [
                {"label": label, "total": total}
                for label, total in month_map.items()
            ],
        }

    def charts(self, db: Session, user: User, filters: dict[str, Any]) -> dict[str, Any]:
        return self.build_summary(self.get_filtered_expenses(db, user, filters))

    def summary(self, db: Session, user: User, filters: dict[str, Any]) -> dict[str, Any]:
        summary = self.charts(db, user, filters)
        return {
            "overall_total": summary["overall_total"],
            "category_totals": summary["category_totals"],
        }

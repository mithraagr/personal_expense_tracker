from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.models.user import User
from app.services.analytics_service import AnalyticsService
from app.utils.report_utils import build_excel_report, build_pdf_report


class ExportService:
    def __init__(self) -> None:
        self.analytics_service = AnalyticsService()

    def pdf(self, db: Session, user: User, filters: dict[str, Any]) -> bytes:
        expenses = self.analytics_service.get_filtered_expenses(db, user, filters)
        summary = self.analytics_service.build_summary(expenses)
        return build_pdf_report(
            user_name=f"{user.first_name} {user.last_name}",
            filters=filters,
            expenses=expenses,
            overall_total=summary["overall_total"],
            category_totals=summary["category_totals"],
        )

    def excel(self, db: Session, user: User, filters: dict[str, Any]) -> bytes:
        expenses = self.analytics_service.get_filtered_expenses(db, user, filters)
        summary = self.analytics_service.build_summary(expenses)
        return build_excel_report(
            user_name=f"{user.first_name} {user.last_name}",
            filters=filters,
            expenses=expenses,
            overall_total=summary["overall_total"],
            category_totals=summary["category_totals"],
        )

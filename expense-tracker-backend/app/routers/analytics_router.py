from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.routers.expense_router import expense_filters
from app.schemas.analytics_schema import AnalyticsSummary, SummaryResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])
service = AnalyticsService()


@router.get("/summary", response_model=SummaryResponse)
def summary(
    filters: dict[str, Any] = Depends(expense_filters),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.summary(db, current_user, filters)


@router.get("/charts", response_model=AnalyticsSummary)
def charts(
    filters: dict[str, Any] = Depends(expense_filters),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.charts(db, current_user, filters)

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.routers.expense_router import expense_filters
from app.services.export_service import ExportService
from app.utils.report_utils import report_file_stem

router = APIRouter(prefix="/exports", tags=["Exports"])
service = ExportService()


@router.get("/pdf")
def export_pdf(
    filters: dict[str, Any] = Depends(expense_filters),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    content = service.pdf(db, current_user, filters)
    filename = f"{report_file_stem()}.pdf"
    return Response(
        content=content,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/excel")
def export_excel(
    filters: dict[str, Any] = Depends(expense_filters),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    content = service.excel(db, current_user, filters)
    filename = f"{report_file_stem()}.xlsx"
    return Response(
        content=content,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

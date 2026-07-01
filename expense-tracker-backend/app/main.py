from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app import models  # noqa: F401 - ensure model metadata is registered
from app.config import get_settings
from app.database import Base, SessionLocal, engine
from app.routers import admin_user_router, analytics_router, auth_router, expense_router, export_router, setting_router
from app.services.startup_service import StartupService
from app.utils.exceptions import AppError

logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        startup = StartupService()
        startup.ensure_default_admin(db)
        startup.ensure_categories(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="FastAPI backend for the Personal Expense Management Web Application.",
    openapi_url=f"{settings.api_prefix}/openapi.json",
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_origin_regex=settings.cors_allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    errors: list[dict[str, Any]] = []
    for error in exc.errors():
        location = ".".join(str(part) for part in error.get("loc", []) if part != "body")
        errors.append({"field": location or "request", "message": error.get("msg", "Invalid value")})
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content={"detail": errors})


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(_: Request, exc: SQLAlchemyError) -> JSONResponse:
    logger.exception("Database error", exc_info=exc)
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": "Database error occurred."})


@app.exception_handler(Exception)
async def generic_error_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error", exc_info=exc)
    detail = str(exc) if settings.debug else "Internal server error."
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": detail})


@app.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}


app.include_router(auth_router.router, prefix=settings.api_prefix)
app.include_router(expense_router.router, prefix=settings.api_prefix)
app.include_router(analytics_router.router, prefix=settings.api_prefix)
app.include_router(export_router.router, prefix=settings.api_prefix)
app.include_router(setting_router.router, prefix=settings.api_prefix)
app.include_router(admin_user_router.router, prefix=settings.api_prefix)

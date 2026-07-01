from __future__ import annotations

import calendar
from datetime import date


def current_month_year() -> tuple[int, int]:
    today = date.today()
    return today.month, today.year


def month_range(year: int, month: int) -> tuple[date, date]:
    last_day = calendar.monthrange(year, month)[1]
    return date(year, month, 1), date(year, month, last_day)


def month_label(year: int, month: int) -> str:
    return f"{calendar.month_abbr[month]} {year}"

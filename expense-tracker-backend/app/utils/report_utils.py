from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from io import BytesIO
from typing import Iterable

from openpyxl import Workbook
from openpyxl.styles import Font
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.models.expense import Expense


def money(value: Decimal | int | float) -> str:
    return f"INR {float(value):,.2f}"


def report_file_stem() -> str:
    return f"expense_report_{date.today().strftime('%Y_%m_%d')}"


def build_filter_description(filters: dict[str, object]) -> str:
    visible = {key: value for key, value in filters.items() if value not in (None, "")}
    if not visible:
        return "Current month"
    return ", ".join(f"{key}: {value}" for key, value in visible.items())


def build_pdf_report(
    *,
    user_name: str,
    filters: dict[str, object],
    expenses: list[Expense],
    overall_total: Decimal,
    category_totals: list[dict[str, Decimal]],
) -> bytes:
    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=28, leftMargin=28, topMargin=28, bottomMargin=28)
    styles = getSampleStyleSheet()
    story = [
        Paragraph("Personal Expense Management", styles["Title"]),
        Paragraph("Expense Report", styles["Heading2"]),
        Paragraph(f"User: {user_name}", styles["Normal"]),
        Paragraph(f"Filters: {build_filter_description(filters)}", styles["Normal"]),
        Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles["Normal"]),
        Spacer(1, 12),
    ]

    rows: list[list[object]] = [["Spend Date", "Title", "Category", "Amount"]]
    if expenses:
        rows.extend([[item.spend_date.isoformat(), item.title, item.category, money(item.amount)] for item in expenses])
    else:
        rows.append(["No expenses found", "", "", ""])

    expense_table = Table(rows, repeatRows=1, colWidths=[80, 170, 100, 90])
    expense_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#ECEFF4")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1F2937")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (-1, 1), (-1, -1), "RIGHT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FAFB")]),
            ]
        )
    )
    story.append(expense_table)
    story.append(Spacer(1, 14))
    story.append(Paragraph(f"Overall Total: {money(overall_total)}", styles["Heading3"]))

    summary_rows: list[list[object]] = [["Category", "Total"]]
    summary_rows.extend([[row["category"], money(row["total"])] for row in category_totals] or [["No data", money(0)]])
    summary_table = Table(summary_rows, repeatRows=1, colWidths=[220, 120])
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#ECEFF4")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (-1, 1), (-1, -1), "RIGHT"),
            ]
        )
    )
    story.append(summary_table)

    document.build(story)
    return buffer.getvalue()


def build_excel_report(
    *,
    user_name: str,
    filters: dict[str, object],
    expenses: list[Expense],
    overall_total: Decimal,
    category_totals: list[dict[str, Decimal]],
) -> bytes:
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Expenses"

    rows = [
        ["Personal Expense Management"],
        ["Expense Report"],
        ["User", user_name],
        ["Filters", build_filter_description(filters)],
        ["Generated", datetime.now().strftime("%Y-%m-%d %H:%M")],
        [],
        ["Spend Date", "Title", "Category", "Amount"],
    ]
    for row in rows:
        sheet.append(row)
    for expense in expenses:
        sheet.append([expense.spend_date.isoformat(), expense.title, expense.category, float(expense.amount)])
    if not expenses:
        sheet.append(["No expenses found", "", "", 0])

    sheet.append([])
    sheet.append(["Overall Total", "", "", float(overall_total)])
    sheet.append([])
    sheet.append(["Category Summary"])
    sheet.append(["Category", "Total"])
    for row in category_totals:
        sheet.append([row["category"], float(row["total"])])

    for cell in sheet[1]:
        cell.font = Font(bold=True, size=14)
    for cell in sheet[7]:
        cell.font = Font(bold=True)
    for column in ("A", "B", "C", "D"):
        sheet.column_dimensions[column].width = 22

    output = BytesIO()
    workbook.save(output)
    return output.getvalue()

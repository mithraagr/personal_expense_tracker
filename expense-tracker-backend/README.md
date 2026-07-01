# Personal Expense Management Backend

FastAPI backend for the React + Vite personal expense tracker frontend.

## Features implemented

- JWT authentication and current-user API
- User registration, login, logout, password change
- Default admin creation during startup
- Role-based admin access control
- User enable/disable and role management
- Expense create, read, update, delete
- Current-month default expense view when no filters are supplied
- Filters by date, date range, month/year, category, and search
- Analytics summary for category totals, daily trend, monthly trend, averages, and top category
- Monthly spending limit settings
- PDF and Excel exports for filtered expenses
- SQLite + SQLAlchemy ORM structure designed for future PostgreSQL/MySQL migration
- FastAPI Swagger/OpenAPI docs

## Folder structure

```text
app/
  main.py
  config.py
  database.py
  dependencies.py
  models/
  schemas/
  routers/
  services/
  utils/
```

## Run locally

```bash
cd expense-tracker-backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger documentation:

```text
http://localhost:8000/api/docs
```

Health check:

```text
http://localhost:8000/health
```

## Frontend connection

In the frontend `.env`, use:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
VITE_TOKEN_STORAGE_KEY=expense_tracker_token
```

## Default admin

The first startup creates a default admin only when no admin user exists.

Default values are controlled by environment variables:

```env
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin@123
```

Change the default admin password after first login.

## API overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`

### Expenses

- `POST /api/expenses`
- `GET /api/expenses`
- `GET /api/expenses/{expense_id}`
- `PUT /api/expenses/{expense_id}`
- `DELETE /api/expenses/{expense_id}`

Supported query filters:

```text
date, from_date, to_date, month, year, category, search
```

### Analytics

- `GET /api/analytics/summary`
- `GET /api/analytics/charts`

### Settings

- `GET /api/settings`
- `PUT /api/settings/monthly-limit`
- `DELETE /api/settings/monthly-limit`

### Exports

- `GET /api/exports/pdf`
- `GET /api/exports/excel`

### Admin users

- `GET /api/admin/users`
- `GET /api/admin/users/{user_id}`
- `PUT /api/admin/users/{user_id}/enable`
- `PUT /api/admin/users/{user_id}/disable`
- `PUT /api/admin/users/{user_id}/role`

## Notes

The current frontend mapper sends only `category`, `spend_date`, and `amount` for expense create/update. The backend also supports an optional `title` field so the UI can preserve expense titles if the frontend service is later updated to send it.

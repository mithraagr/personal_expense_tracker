# Expense Tracker Frontend

A modular React + Vite + TypeScript frontend for the Personal Expense Management Web Application.

The application implements the requested UI screens and client-side behavior for:

- Login, registration, logout and protected routes
- Expense dashboard with quick add, edit, delete and confirmation dialogs
- Current-month default expense loading
- Filters by date, date range, month, year, category and search
- Summary cards, category chart, daily trend chart and category bar chart
- PDF and Excel export actions wired to backend export endpoints
- Settings page with password change and monthly spending limit
- Monthly limit alert
- Admin-only user management with search, role filter, status filter, enable/disable and role change
- Responsive desktop, tablet and mobile layouts

## Tech Stack

- React
- Vite
- TypeScript
- React Router
- Axios
- Recharts
- Lucide React icons
- Plain CSS with reusable design tokens

## Folder Structure

```text
src/
├── components/
│   ├── admin/
│   ├── auth/
│   ├── charts/
│   ├── common/
│   ├── expenses/
│   └── settings/
├── context/
├── pages/
├── routes/
├── services/
├── styles/
├── types/
└── utils/
```

## Environment Files

The project includes:

```text
.env
.env.development
.env.production
```

Important values:

```env
VITE_APP_NAME=Expense Tracker
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=true
VITE_TOKEN_STORAGE_KEY=expense_tracker_token
VITE_DEFAULT_ROUTE=/expenses
```

Set `VITE_USE_MOCK_API=false` when connecting to the FastAPI backend.

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Mock Login Accounts

Mock mode is enabled by default so the UI can run without the backend.

```text
Normal user:
Email: user@example.com
Password: Password@123

Admin user:
Email: admin@example.com
Password: Admin@123
```

## Backend API Mapping

The service layer is separated under `src/services/` and is ready to call the FastAPI endpoints from the requirement document:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/{expense_id}`
- `DELETE /api/expenses/{expense_id}`
- `GET /api/analytics/charts`
- `GET /api/exports/pdf`
- `GET /api/exports/excel`
- `GET /api/settings`
- `PUT /api/settings/monthly-limit`
- `DELETE /api/settings/monthly-limit`
- `GET /api/admin/users`
- `PUT /api/admin/users/{user_id}/enable`
- `PUT /api/admin/users/{user_id}/disable`
- `PUT /api/admin/users/{user_id}/role`

## Production Build

```bash
npm run build
npm run preview
```

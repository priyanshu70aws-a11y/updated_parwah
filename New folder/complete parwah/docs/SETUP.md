# Complete Project Setup & Run Guide

This guide explains how to run the full PARWAH stack (Frontend + Backend + ML Service) on a local machine.

## 1) Prerequisites

Install the following first:

- **Node.js**: v18+ (recommended v20)
- **npm**: v9+
- **Python**: v3.10+
- **pip**: latest version
- **PostgreSQL**: v14+

Optional but recommended:

- `nvm` for Node version management
- `virtualenv` (or `venv`) for Python environments

---

## 2) Repository Structure

Main folders used during runtime:

- `frontend/` → React + Vite client
- `backend/` → Node.js API + DB models/routes
- `ml-service/` → Flask APIs for similarity/deduplication processing

---

## 3) Environment Variables

### Backend (`backend/.env`)

Create `backend/.env` and set:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=replace_with_long_random_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=parwah
DB_USER=postgres
DB_PASSWORD=postgres
ML_SERVICE_URL=http://localhost:8000
```

### Frontend (`frontend/.env`)

If needed, create:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> The current frontend API service defaults to `http://localhost:5000/api`.

### ML Service (`ml-service/.env` optional)

If your ML app reads env values, define model/service options here.

---

## 4) Database Setup

1. Start PostgreSQL.
2. Create DB:

```bash
createdb parwah
```

3. From `backend/`, run migrations/seeding (if configured in your Sequelize scripts):

```bash
npm run db:migrate
npm run db:seed
```

If these scripts are missing, run the seed file directly or use your existing setup flow from the team.

---

## 5) Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### ML Service

```bash
cd ml-service
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

---

## 6) Run the Services

Open **3 terminals** and run services in this order:

### Terminal A — Backend API

```bash
cd backend
npm run dev
```

Expected URL:

- API base: `http://localhost:5000/api`

### Terminal B — ML Service

```bash
cd ml-service
source .venv/bin/activate
python api/app.py
```

Expected URL:

- ML base: `http://localhost:8000`

### Terminal C — Frontend

```bash
cd frontend
npm run dev
```

Expected URL:

- App: `http://localhost:5173`

---

## 7) Login Roles & Panels

- **User role**: access dashboard and user panel with report tracking + points breakdown.
- **Admin role**: access admin operations panel with complaint controls, NIEG grouping, heatmap, department graph, and worker assignment board.

Make sure role is correctly set in your DB user record.

---

## 8) Basic Health Checks

Run after startup:

```bash
# Backend
curl http://localhost:5000/api/stats/dashboard

# Frontend (HTTP response check)
curl -I http://localhost:5173

# ML service
curl http://localhost:8000
```

---

## 9) Troubleshooting

- **`vite: not found`**
  - Run `npm install` in `frontend/` and verify `node_modules/.bin/vite` exists.

- **DB connection failures**
  - Verify PostgreSQL credentials in `backend/.env`.
  - Confirm DB exists and server is running.

- **CORS/auth errors**
  - Ensure frontend and backend URLs are aligned.
  - Confirm JWT token is stored in localStorage after login.

- **ML endpoint not reachable**
  - Start ML service first and confirm `ML_SERVICE_URL` in backend env.

---

## 10) Production Build (Frontend)

```bash
cd frontend
npm run build
npm run preview
```

---

## 11) Suggested Startup Order Summary

1. PostgreSQL
2. ML Service
3. Backend
4. Frontend

This ensures all dependent APIs are available before UI actions begin.

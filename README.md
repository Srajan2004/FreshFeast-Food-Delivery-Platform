# FreshFeast — Food Delivery Platform

A full-stack rebuild of the FreshFeast Stitch mockups: a Spring Boot REST API and a React frontend, covering the **customer app**, **restaurant dashboard**, and **admin panel** modules, styled with the Vibrant Culinary System design language.

```
freshfeast/
  backend/    Spring Boot 3 + PostgreSQL/H2 + Spring Security (JWT) REST API
  frontend/   React 18 + Vite + Tailwind CSS
```

## Quick start

**1. Backend** (see `backend/README.md` for full details)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2   # fastest way to try it — no DB setup
```
Runs at `http://localhost:8080`, auto-seeded with demo accounts.

**2. Frontend** (see `frontend/README.md` for full details)
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

**3. Log in** with a seeded demo account (password `password123` for all):
- `customer@freshfeast.com` — browse, order, track, get support
- `owner@freshfeast.com` — manage restaurant, menu, live orders, analytics
- `admin@freshfeast.com` — manage users, respond to support tickets

## What's implemented
- JWT authentication & role-based access (CUSTOMER / RESTAURANT_OWNER / ADMIN)
- Restaurant CRUD, menu categories & items, availability toggling
- Cart (single-restaurant enforcement) → checkout → order placement
- Live order queue for restaurant owners with one-click status progression
- Order tracking for customers (status stepper, auto-refresh)
- Restaurant analytics: revenue, order volume by status, top-selling items
- Admin: user list/search/filter, suspend/ban accounts, platform stats endpoint
- Support tickets: customers submit, admins triage/respond/resolve

## Not built (out of scope for this pass)
The original mockup pack also included a **delivery-partner** module (assigned orders, logistics view) which wasn't selected for this build. The backend's `Order`/`OrderStatus` model already supports an `OUT_FOR_DELIVERY` state, so a delivery-partner role and app could be added later without a schema rework — ask if you'd like that built out next.

## Design system
Colors, type scale, radii, and spacing in `frontend/tailwind.config.js` are taken directly from the `vibrant_culinary_system/DESIGN.md` that shipped with your Stitch export. Swapping to the `aurelian_minimalist` look later just means updating that one file.

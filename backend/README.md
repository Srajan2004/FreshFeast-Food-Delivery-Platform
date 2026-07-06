# FreshFeast Backend (Spring Boot)

A full REST API for the FreshFeast food delivery platform: customer ordering, restaurant management, and admin oversight, secured with JWT.

## Stack
- Java 17, Spring Boot 3.3
- Spring Web, Spring Data JPA, Spring Security
- PostgreSQL (default) / H2 (quick local demo)
- JWT auth (jjwt)
- Lombok

## Getting started

### Option A — quick demo with H2 (no database setup required)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
The API starts at `http://localhost:8080`. An in-memory H2 database is created and seeded automatically with demo accounts. H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:freshfeast`, user `sa`, blank password).

### Option B — PostgreSQL (production-style)
1. Create a database:
   ```sql
   CREATE DATABASE freshfeast;
   ```
2. Set environment variables (or edit `application.yml` directly):
   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/freshfeast
   export DB_USERNAME=postgres
   export DB_PASSWORD=yourpassword
   export JWT_SECRET=$(openssl rand -base64 48)
   export CORS_ORIGINS=http://localhost:5173
   ```
3. Run:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   (the `postgres` profile is active by default)

Tables are auto-created/updated via `spring.jpa.hibernate.ddl-auto=update`. For real production use, replace this with a migration tool (Flyway/Liquibase).

## Demo accounts
Seeded automatically on first run when the `users` table is empty (password for all: `password123`):

| Role             | Email                     |
|------------------|---------------------------|
| Admin            | admin@freshfeast.com      |
| Restaurant Owner | owner@freshfeast.com      |
| Customer         | customer@freshfeast.com   |

## API overview

All endpoints are under `/api`. Authenticated requests need `Authorization: Bearer <token>`.

### Auth
- `POST /api/auth/register` — `{ name, email, password, phone, role }` → token
- `POST /api/auth/login` — `{ email, password }` → token

### Restaurants
- `GET /api/restaurants?search=` — public list/search
- `GET /api/restaurants/{id}` — public detail
- `GET /api/restaurants/mine` — owner's restaurants (RESTAURANT_OWNER)
- `POST /api/restaurants` — create (RESTAURANT_OWNER, ADMIN)
- `PUT /api/restaurants/{id}` — update (owner/ADMIN)
- `DELETE /api/restaurants/{id}` — delete (owner/ADMIN)

### Menu
- `GET /api/restaurants/{id}/menu-items` — public
- `GET /api/restaurants/{id}/categories` — public
- `POST /api/restaurants/{id}/categories` — owner/ADMIN
- `POST /api/restaurants/{id}/menu-items` — owner/ADMIN
- `PUT /api/menu-items/{itemId}` — owner/ADMIN
- `DELETE /api/menu-items/{itemId}` — owner/ADMIN

### Cart (CUSTOMER)
- `GET /api/cart`
- `POST /api/cart/items` — `{ menuItemId, quantity }`
- `PUT /api/cart/items/{cartItemId}` — `{ quantity }`
- `DELETE /api/cart/items/{cartItemId}`
- `DELETE /api/cart`

### Orders
- `POST /api/orders` — place order from cart (CUSTOMER) — `{ deliveryAddress }`
- `GET /api/orders/mine` — CUSTOMER
- `GET /api/orders/restaurant/{restaurantId}` — owner/ADMIN
- `GET /api/orders/{id}` — participant only
- `PATCH /api/orders/{id}/status` — owner/ADMIN — `{ status }`

### Analytics (owner/ADMIN)
- `GET /api/restaurants/{id}/analytics`

### Support tickets
- `POST /api/support/tickets` — any authenticated user
- `GET /api/support/tickets/mine`
- `GET /api/support/tickets` — ADMIN
- `PATCH /api/support/tickets/{id}` — ADMIN — `{ status, adminResponse }`

### Admin
- `GET /api/admin/users`
- `PATCH /api/admin/users/{id}/status` — `{ status }`
- `GET /api/admin/stats`

## Notes
- Order flow: add items to cart → `POST /api/orders` converts the cart into an order and clears it. A cart may only hold items from one restaurant at a time.
- Roles: `CUSTOMER`, `RESTAURANT_OWNER`, `ADMIN`, enforced via `@PreAuthorize` + JWT claims.
- Passwords are hashed with BCrypt; never returned in any response.

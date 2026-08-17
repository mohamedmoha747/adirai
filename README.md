# Adirai — Order & Delivery Management

Full-stack MERN SaaS for multi-shop ordering, payments, delivery assignment, and live tracking.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + Socket.IO client + Leaflet
- **Backend:** Node.js + Express + MongoDB/Mongoose + JWT + Socket.IO
- **Maps:** OpenStreetMap via Leaflet (no paid API key required)

## Project structure

```
server/   Express API, models, services, Socket.IO
client/   React role-based web app
```

## Quick start

1. Install [Node.js 18+](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas).
2. Copy environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Set `MONGODB_URI` and `JWT_SECRET` in `server/.env`.
4. Install and seed:

```bash
cd server && npm install && npm run seed
cd ../client && npm install
```

5. If MongoDB is not running, start it (Windows example):

```bash
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "%USERPROFILE%\data\db" --bind_ip 127.0.0.1 --port 27017
```

6. Run both apps in separate terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

- API: http://localhost:5000
- Web: http://localhost:5173

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@adirai.com | Admin@123 |
| Seller | seller@adirai.com | Seller@123 |
| Delivery | delivery@adirai.com | Delivery@123 |
| Customer | customer@adirai.com | Customer@123 |

A second shop/seller (`seller2@adirai.com`) and extra delivery partners are also seeded.

## Order status flow

`PENDING → CONFIRMED → ACCEPTED → PREPARING → READY_FOR_PICKUP → PICKED_UP → ON_THE_WAY → DELIVERED → COMPLETED`

Invalid jumps are rejected on the server. Every change is stored in `OrderStatusLog`.

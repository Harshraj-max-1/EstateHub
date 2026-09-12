# EstateHub 🏠 — Premium Real Estate Marketplace

A production-quality, full-stack **MERN** real estate marketplace inspired by MagicBricks, 99Acres, and NoBroker — built for the Indian market.

---

## 🚀 Live Architecture

```
Client (React + Vite)   → http://localhost:5173
Server (Node + Express) → http://localhost:5001
Database (MongoDB)      → mongodb://127.0.0.1:27017/estatehub
Socket.IO               → http://localhost:5001
```

---

## ⚙️ Quick Setup

### 1. Install dependencies
```bash
cd estatehub
npm install
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
# Edit PORT=5001, MONGO_URI, JWT_SECRET
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start servers
```bash
npm run server   # Terminal 1 – Backend on :5001
npm run client   # Terminal 2 – Frontend on :5173
```

---

## 🔑 Demo Credentials (1-Click Login on /login)

| Role | Email | Password |
|---|---|---|
| 👑 Admin | admin@estatehub.com | Admin@123 |
| 🏢 Agent | agent.rajesh@estatehub.com | Agent@123 |
| 👤 Buyer | buyer.rahul@estatehub.com | Buyer@123 |

---

## 🗂️ Project Structure

```
estatehub/
├── server/
│   ├── config/         # DB + Cloudinary
│   ├── controllers/    # 11 route controllers
│   ├── middleware/     # Auth, RBAC, upload, error, rate-limit
│   ├── models/         # 11 Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # Recommendations, notifications, email
│   ├── sockets/        # Socket.IO handler
│   └── seed/           # Database seeder (22 Indian properties)
└── client/
    ├── src/
    │   ├── api/        # Axios with JWT interceptor
    │   ├── context/    # Auth, Theme, Socket, Compare contexts
    │   ├── components/ # Common UI + Property + Modals + Dashboard
    │   ├── pages/      # All 20+ page components
    │   └── utils/      # Formatters + constants
    └── vite.config.js  # Proxy /api → :5001
```

---

## 🎯 Key Features

### Three Roles
- **BUYER**: Browse, save favorites, compare, enquire, schedule visits, chat, review agents
- **AGENT**: 6-step property wizard, manage enquiries/appointments, view analytics
- **ADMIN**: Property approval queue, user management, report moderation

### Highlights
- 🗺️ Interactive Leaflet + OpenStreetMap with price marker popups
- 📊 Recharts AreaChart (7-day views), PieChart (status), BarChart (categories)
- 💬 Real-time Socket.IO chat with typing indicators + online presence
- 🔍 Multi-filter search (city, type, price range, BHK, furnishing) synced to URL params
- ⚖️ Side-by-side comparison matrix for up to 4 properties
- 🤖 Rule-based recommendations (city 40pts + type 30pts + BHK 15pts + price ±30% 15pts)
- 🌙 Full dark mode with localStorage persistence
- 📱 Responsive across all viewports

### Technical Notes
- Port 5001 (macOS AirPlay blocks 5000)
- Mongoose async pre-save hooks without `next` argument (Mongoose 8+)
- Custom Leaflet HTML div markers for Vite compatibility
- Cloudinary with local /uploads fallback for offline dev

---

## 📡 Core API Reference

```
POST  /api/auth/login
POST  /api/auth/register
GET   /api/properties?city=Noida&type=Apartment&minPrice=&maxPrice=&bedrooms=3&sortBy=newest&page=1
GET   /api/properties/:id
POST  /api/properties              (AGENT)
GET   /api/properties/agent/my-properties
GET   /api/properties/:id/recommendations
GET   /api/favorites
POST  /api/favorites/:id           (toggle)
POST  /api/enquiries
GET   /api/enquiries/my
POST  /api/appointments
GET   /api/appointments/agent
PUT   /api/appointments/:id/status
GET   /api/messages/conversations
POST  /api/messages/conversations
GET   /api/messages/:conversationId
GET   /api/admin/stats
GET   /api/admin/properties/pending
PUT   /api/admin/properties/:id/review
GET   /api/admin/users
GET   /api/analytics/agent
```

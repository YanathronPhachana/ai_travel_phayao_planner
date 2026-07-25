# AI Travel Phayao Planner 🤖🗺️

แอปวางแผนการท่องเที่ยวจังหวัดพะเยา ด้วย AI ช่วยจัดการทริป สถานที่ท่องเที่ยว ที่พัก ค่าใช้จ่าย และรายการของใช้จำเป็น

สร้างจาก [starter-template](https://github.com/fakduai-logistics-and-digital-platform/starter-template)

**Tech Stack**

| | |
|---|---|
| **Backend** | [Hono](https://hono.dev/) + [Cloudflare Workers](https://workers.cloudflare.com/) + D1 (SQLite) + KV (Cache) |
| **Frontend** | [Vue 3](https://vuejs.org/) + [Vuetify](https://vuetifyjs.com/) + [Pinia](https://pinia.vuejs.org/) |
| **Deploy** | Cloudflare Workers (backend) + Cloudflare Pages (frontend) |
| **CI/CD** | GitHub Actions — typecheck → build → deploy อัตโนมัติ |

## โครงสร้างโปรเจกต์

```
ai_travel_phayao_planner/
├── .github/workflows/deploy.yml  # CI/CD pipeline
├── backend/                      # Hono API (Cloudflare Workers)
│   ├── src/domain/               # Entities, Repository interfaces
│   ├── src/services/             # Business logic
│   ├── src/handlers/             # HTTP handlers
│   ├── src/schemas/              # Zod schemas + validation
│   ├── src/routers/              # Route definitions
│   ├── src/di/                   # Dependency injection
│   └── migrations/               # D1 SQL migrations
└── frontend/                     # Vue 3 + Vuetify SPA
    ├── src/pages/                # Routes (auto-generated)
    ├── src/apis/                 # API fetch functions
    ├── src/stores/               # Pinia stores
    └── src/models/               # TypeScript interfaces
```

## Resources

| Resource | คำอธิบาย |
|---|---|
| `Users` | จัดการผู้ใช้ (ตัวอย่าง — มาจาก template) |
| `Destinations` | สถานที่ท่องเที่ยวในจังหวัดพะเยา |
| `Trips` | แผนการเดินทาง |
| `Trip Expenses` | ค่าใช้จ่ายในแต่ละทริป |
| `Accommodations` | ที่พักสำหรับแต่ละทริป |
| `Packing Items` | รายการของใช้จำเป็นที่ต้องเตรียม |

### Destinations API

| Method | Path | คำอธิบาย |
|---|---|---|
| `GET` | `/api/v1/destinations` | รายการสถานที่ท่องเที่ยวทั้งหมด (filter: `?category=...`) |
| `POST` | `/api/v1/destinations` | เพิ่มสถานที่ใหม่ |
| `GET` | `/api/v1/destinations/:id` | ดูสถานที่เดียว |
| `PATCH` | `/api/v1/destinations/:id` | แก้ไขสถานที่ |
| `DELETE` | `/api/v1/destinations/:id` | ลบสถานที่ |

### Trips API

| Method | Path | คำอธิบาย |
|---|---|---|
| `GET` | `/api/v1/trips` | รายการทริปทั้งหมด |
| `POST` | `/api/v1/trips` | สร้างทริปใหม่ |
| `GET` | `/api/v1/trips/:id` | ดูทริปเดียว |
| `PATCH` | `/api/v1/trips/:id` | แก้ไขทริป |
| `DELETE` | `/api/v1/trips/:id` | ลบทริป |

### Trip Expenses API

| Method | Path | คำอธิบาย |
|---|---|---|
| `GET` | `/api/v1/trips/:tripId/expenses` | ค่าใช้จ่ายของทริป |
| `POST` | `/api/v1/trips/:tripId/expenses` | เพิ่มค่าใช้จ่าย |
| `GET` | `/api/v1/trips/:tripId/expenses/summary` | สรุปค่าใช้จ่ายแยกตามหมวดหมู่ |
| `PATCH` | `/api/v1/trips/:tripId/expenses/:id` | แก้ไขค่าใช้จ่าย |
| `DELETE` | `/api/v1/trips/:tripId/expenses/:id` | ลบค่าใช้จ่าย |

### Accommodations API

| Method | Path | คำอธิบาย |
|---|---|---|
| `GET` | `/api/v1/trips/:tripId/accommodations` | ที่พักของทริป |
| `POST` | `/api/v1/trips/:tripId/accommodations` | เพิ่มที่พัก |
| `PATCH` | `/api/v1/trips/:tripId/accommodations/:id` | แก้ไขที่พัก |
| `DELETE` | `/api/v1/trips/:tripId/accommodations/:id` | ลบที่พัก |

### Packing Items API

| Method | Path | คำอธิบาย |
|---|---|---|
| `GET` | `/api/v1/trips/:tripId/packing` | รายการของใช้ของทริป |
| `POST` | `/api/v1/trips/:tripId/packing` | เพิ่มของใช้ |
| `PATCH` | `/api/v1/trips/:tripId/packing/:id` | แก้ไขของใช้ / toggle checked |
| `DELETE` | `/api/v1/trips/:tripId/packing/:id` | ลบของใช้ |

## Local Development

### Backend

```bash
cd backend
npm install

# login Cloudflare (ให้ user ทำ)
npx wrangler login

# สร้าง D1 database ใน local
npm run db:migrate:local

# รัน dev server → http://localhost:8787
npm run dev
# API Docs → http://localhost:8787/docs
```

### Frontend

```bash
cd frontend

pnpm install

# ตั้งค่า environment
cp .env.example .env
# แก้ VITE_BACKEND_URL=http://localhost:8787

# รัน dev server → http://localhost:5173
pnpm dev
```

## Deploy

ดู [deploy-plan.md](deploy-plan.md) สำหรับขั้นตอน deploy ขึ้น Cloudflare + GitHub Actions

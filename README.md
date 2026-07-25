# NgernNgern ThongThong — Personal Finance Tracker

เว็บแอปบันทึกรายรับ/รายจ่ายส่วนตัว สร้างจาก [starter-template](https://github.com/fakduai-logistics-and-digital-platform/starter-template)

**Tech Stack**

| | |
|---|---|
| **Backend** | [Hono](https://hono.dev/) + [Cloudflare Workers](https://workers.cloudflare.com/) + D1 (SQLite) + KV (Cache) |
| **Frontend** | [Vue 3](https://vuejs.org/) + [Vuetify](https://vuetifyjs.com/) + [Pinia](https://pinia.vuejs.org/) |
| **Deploy** | Cloudflare Workers (backend) + Cloudflare Pages (frontend) |
| **CI/CD** | GitHub Actions — typecheck → build → deploy อัตโนมัติ |

## โครงสร้างโปรเจกต์

```
ngernngern_thongthong/
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
| `Transactions` | บันทึกรายรับ/รายจ่าย — **หัวใจของแอปนี้** |

### Transactions API

| Method | Path | คำอธิบาย |
|---|---|---|
| `GET` | `/api/v1/transactions` | รายการทั้งหมด (filter: `?type=income\|expense`) |
| `GET` | `/api/v1/transactions/summary` | สรุปยอดรายรับ/รายจ่าย/คงเหลือ/แยกหมวด |
| `POST` | `/api/v1/transactions` | เพิ่มรายการใหม่ |
| `GET` | `/api/v1/transactions/:id` | ดูรายการเดียว |
| `PATCH` | `/api/v1/transactions/:id` | แก้ไขรายการ |
| `DELETE` | `/api/v1/transactions/:id` | ลบรายการ |

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

# 🏛️ Backend Architecture — WealthyMe

Dokumen ini menjelaskan pola desain, struktur folder, dan alur request yang digunakan dalam backend WealthyMe.

---

## 📐 Pola Desain: Modular Layered Architecture

Backend WealthyMe menggunakan pola **Modular Layered Architecture** — setiap fitur (module) diorganisir secara mandiri dan di dalamnya dibagi menjadi tiga lapisan yang memiliki tanggung jawab berbeda:

```
┌─────────────────────────────────────────┐
│              HTTP Request               │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           Middleware Layer              │  ← Validasi, Auth, Upload
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           Controller Layer             │  ← Terima req, kirim res
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│            Service Layer               │  ← Business logic
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│          Prisma Client (ORM)           │  ← Akses Database
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│            PostgreSQL DB               │
└─────────────────────────────────────────┘
```

---

## 📁 Struktur Folder Lengkap

```
src/
├── app.ts                      # Inisialisasi Express + middleware global
├── server.ts                   # Entry point: listen port
│
├── routes/
│   └── index.ts                # Router utama — mount semua module router
│
├── middlewares/
│   ├── access.middleware.ts    # Auth: verifyUser, isAdmin
│   ├── multer.middleware.ts    # File upload handler (avatar, receipt)
│   └── validation.middleware.ts # Validasi body & query pakai Zod
│
├── modules/                    # Setiap folder = 1 fitur bisnis
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.route.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.route.ts
│   ├── profile/
│   │   ├── profile.controller.ts
│   │   ├── profile.service.ts
│   │   └── profile.route.ts
│   ├── account/
│   │   ├── account.controller.ts
│   │   ├── account.service.ts
│   │   └── account.route.ts
│   ├── category/
│   │   ├── category.controller.ts
│   │   ├── category.service.ts
│   │   └── category.route.ts
│   └── transaction/
│       ├── transaction.controller.ts
│       ├── transaction.service.ts
│       └── transaction.route.ts
│
├── lib/
│   ├── prisma/
│   │   └── index.ts            # Singleton Prisma Client
│   ├── types/                  # Zod schema + TS types per module
│   │   ├── auth.type.ts
│   │   ├── user.type.ts
│   │   ├── profile.type.ts
│   │   ├── account.type.ts
│   │   ├── category.type.ts
│   │   ├── transaction.type.ts
│   │   └── params.type.ts      # Query params schema (pagination, filter)
│   └── utils/                  # Fungsi helper
│       ├── response.utils.ts   # Standarisasi format response JSON
│       ├── error.utils.ts      # Error handler terpusat
│       ├── jwt.utils.ts        # Sign & verify JWT
│       ├── cloudinary.utils.ts # Upload & delete file ke Cloudinary
│       ├── currency.utils.ts   # Konversi/format mata uang
│       └── validation.utils.ts # Helper validasi tambahan
│
├── generated/
│   └── prisma/                 # Prisma Client auto-generated (jangan diedit)
│
└── seed/                       # Script untuk mengisi data awal database
```

---

## 🔄 Alur Request (Request Lifecycle)

Berikut alur lengkap dari sebuah request yang masuk hingga response keluar:

```
Client
  │
  ▼
[app.ts] — Global Middleware
  ├── cors()            → Mengizinkan origin frontend
  ├── express.json()    → Parse JSON body
  ├── cookieParser()    → Parse cookie (untuk refresh token)
  └── bodyParser.json() → Fallback body parsing
  │
  ▼
[routes/index.ts] — Route Dispatch
  └── /api/auth        → authRouter
  └── /api/user        → userRouter
  └── /api/profile     → profileRouter
  └── /api/account     → accountRouter
  └── /api/category    → categoryRouter
  └── /api/transaction → transactionRouter
  │
  ▼
[module/xxx.route.ts] — Per-module Middleware Chain
  ├── accessMiddleware.verifyUser   → Cek JWT + Refresh Token
  ├── accessMiddleware.isAdmin      → Cek role admin (jika diperlukan)
  ├── multer.upload.single(...)     → Handle file upload (jika ada)
  └── validationMiddleware.validateBody/validateQuery  → Validasi Zod
  │
  ▼
[module/xxx.controller.ts] — Controller
  ├── Ekstrak data dari req.body / req.params / req.query
  ├── Panggil service layer
  └── Kirim response via responseUtils
  │
  ▼
[module/xxx.service.ts] — Service (Business Logic)
  ├── Logika bisnis murni
  ├── Akses database via Prisma Client
  └── Throw error jika ada kondisi yang tidak valid
  │
  ▼
[lib/prisma/index.ts] — Prisma Singleton
  └── Query ke PostgreSQL
```

---

## 🧩 Penjelasan Per Lapisan

### 1. Route Layer (`*.route.ts`)
Mendefinisikan endpoint HTTP dan menyusun middleware chain untuk setiap route. Route tidak mengandung logika bisnis sama sekali.

```typescript
// Contoh: auth.route.ts
router.post("/login",
  validationMiddleware.validateBody(loginSchema),  // ← validasi dulu
  authController.login                             // ← baru ke controller
);
```

### 2. Middleware Layer (`middlewares/`)

| Middleware             | Fungsi                                                                        |
| ---------------------- | ----------------------------------------------------------------------------- |
| `verifyUser`           | Memverifikasi Access Token + Refresh Token. Auto-rotate access token jika expired. |
| `isAdmin`              | Memeriksa apakah role user adalah `admin`                                     |
| `upload.single(...)`   | Menerima file tunggal dari form-data menggunakan Multer                       |
| `validateBody(schema)` | Memvalidasi `req.body` dengan Zod schema, mengembalikan 400 jika gagal        |
| `validateQuery(schema)`| Memvalidasi `req.query` dengan Zod schema                                    |

### 3. Controller Layer (`*.controller.ts`)
Bertugas sebagai jembatan antara HTTP dan service layer. Controller **tidak boleh** mengandung logika bisnis.

Tanggung jawab controller:
- Mengambil data dari `req` (body, params, query, files, userId)
- Memanggil satu atau lebih service method
- Mengembalikan response dengan format standar via `responseUtils`

```typescript
// Contoh pola standar controller
async createAccount(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const body = req.body;
    const result = await accountService.createAccount(userId, body);
    return responseUtils.success(res, 201, "account created", result);
  } catch (err) {
    return catchAllErrors(res, err);
  }
}
```

### 4. Service Layer (`*.service.ts`)
Tempat semua **business logic** berada. Service berkomunikasi langsung dengan Prisma Client.

Tanggung jawab service:
- Validasi kondisi bisnis (cek duplikasi, cek kepemilikan resource, dll)
- Operasi CRUD via Prisma
- Melempar error jika kondisi tidak terpenuhi

### 5. Lib / Shared Utilities (`lib/`)

#### `response.utils.ts`
Standarisasi format response JSON di seluruh aplikasi:
```json
// Success
{ "status": "success", "message": "...", "data": { ... } }

// Error
{ "status": "error", "message": "..." }
```

#### `error.utils.ts`
Handler error terpusat (`catchAllErrors`) — menangkap semua jenis error dan mengkonversinya menjadi response HTTP yang tepat.

#### `jwt.utils.ts`
Helper untuk sign dan verify Access Token (15 menit) dan Refresh Token (7 hari).

#### `cloudinary.utils.ts`
Abstraksi untuk upload file (avatar & receipt) ke Cloudinary dan menghapusnya menggunakan `public_id`.

---

## 🔐 Sistem Autentikasi

WealthyMe menggunakan strategi **Dual Token Authentication**:

```
┌─────────────┐          ┌─────────────────┐
│  Access     │ 15 min   │ Auto-rotate     │
│  Token      │ ───────► │ (via header     │
│  (Bearer)   │          │  x-new-access-  │
└─────────────┘          │  token)         │
                         └─────────────────┘
┌─────────────┐
│  Refresh    │ 7 days  → Disimpan di HttpOnly Cookie
│  Token      │         → Disimpan di DB (bisa di-revoke)
│  (Cookie)   │         → Terikat ke device (User-Agent)
└─────────────┘
```

- **Access Token** dikirim via `Authorization: Bearer <token>` header
- **Refresh Token** disimpan di `HttpOnly Cookie` dan di-persist ke database
- Jika Access Token expired, middleware otomatis meng-generate yang baru dan mengirimnya di response header `x-new-access-token`
- Refresh Token bisa di-revoke (`isRevoked: true`) untuk force logout dari device tertentu

---

## 🗑️ Soft Delete pada Transaction

Model `transaction` mengimplementasikan **Soft Delete** menggunakan field `deletedAt`:

- `deletedAt = null` → transaksi aktif
- `deletedAt = <unix timestamp>` → transaksi sudah dihapus (masuk trash)
- Ada endpoint khusus `PATCH /restore` untuk memulihkan transaksi
- Ada endpoint `DELETE /permanent` untuk hapus permanen (purge)

---

## 📦 Konfigurasi TypeScript

Alias path `@/` di-resolve ke `src/` menggunakan `tsconfig.json`, sehingga import selalu bersih:

```typescript
// Tanpa alias → buruk
import { prisma } from "../../lib/prisma/index.js";

// Dengan alias @/ → bersih
import { prisma } from "@/lib/prisma/index.js";
```

---

## 🌱 Database Seed

Folder `src/seed/` berisi script untuk mengisi data awal (contoh: kategori default income/expense). Jalankan dengan:

```bash
npx tsx src/seed/index.ts
```

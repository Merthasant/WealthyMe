# 💰 WealthyMe — Backend

REST API server untuk aplikasi manajemen keuangan pribadi **WealthyMe**. Dibangun dengan **Node.js + TypeScript + Express + Prisma + PostgreSQL**.

---

## 📋 Tech Stack

| Layer          | Teknologi                          |
| -------------- | ---------------------------------- |
| Runtime        | Node.js (ESM)                      |
| Language       | TypeScript 5                       |
| Framework      | Express 5                          |
| ORM            | Prisma 7 (`@prisma/client`)        |
| Database       | PostgreSQL                         |
| Auth           | JWT (Access Token + Refresh Token) |
| File Upload    | Multer + Cloudinary                |
| Hashing        | Argon2                             |
| Validation     | Zod                                |
| Dev Server     | Nodemon + tsx                      |

---

## ⚙️ Prasyarat

Pastikan kamu sudah menginstall:

- **Node.js** ≥ 18.x
- **PostgreSQL** (lokal atau cloud)
- **npm** ≥ 9.x

---

## 🚀 Instalasi

### 1. Clone & Masuk Folder Backend

```bash
cd backend
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di root folder `backend/` (atau salin dari contoh di bawah):

```env
# ────────────────────────────────────────────
# DATABASE
# ────────────────────────────────────────────
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=public"

# ────────────────────────────────────────────
# SERVER
# ────────────────────────────────────────────
PORT=8000
CORS_ORIGIN="http://localhost:5173"

# ────────────────────────────────────────────
# JWT SECRETS
# Gunakan string random yang panjang & aman!
# ────────────────────────────────────────────
ACCESSTOKEN_SECRET="your-access-token-secret"
REFRESHTOKEN_SECRET="your-refresh-token-secret"

# ────────────────────────────────────────────
# CLOUDINARY (untuk upload avatar & receipt)
# Daftar di https://cloudinary.com
# ────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_AVATAR_FOLDER="wealthyMe_app/avatar_profile_user"
CLOUDINARY_RECEIPT_FOLDER="wealthyMe_app/receipt_user"
```

> **⚠️ Penting:** Jangan pernah push file `.env` ke repository. Pastikan `.gitignore` sudah mengecualikannya.

---

## 🗄️ Migrasi Database

### Jalankan Migrasi (Development)

```bash
npx prisma migrate dev
```

Perintah ini akan:
1. Membuat file migrasi baru (jika ada perubahan schema)
2. Menerapkan semua migrasi ke database
3. Meng-generate Prisma Client otomatis

### Generate Prisma Client (tanpa migrasi)

```bash
npx prisma generate
```

### Lihat Database di Browser (Prisma Studio)

```bash
npx prisma studio
```

### Reset Database (hati-hati — menghapus semua data!)

```bash
npx prisma migrate reset
```

---

## ▶️ Menjalankan Server

### Development Mode (dengan hot-reload)

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8000`

### Build Production

```bash
npm run build
```

Output build ada di folder `build/`.

---

## 📁 Struktur Folder

```
backend/
├── prisma/
│   ├── schema.prisma       # Definisi model database
│   └── migrations/         # File migrasi database
├── src/
│   ├── app.ts              # Setup Express (middleware global)
│   ├── server.ts           # Entry point server
│   ├── generated/          # Prisma Client auto-generated
│   ├── lib/
│   │   ├── prisma/         # Inisialisasi singleton Prisma Client
│   │   ├── types/          # Zod schema & TypeScript types
│   │   └── utils/          # Helper functions (response, error, jwt, dll)
│   ├── middlewares/        # Middleware Express (auth, validasi, upload)
│   ├── modules/            # Fitur-fitur (auth, user, account, ...)
│   ├── routes/             # Router utama
│   └── seed/               # Data seed untuk database
├── .env                    # Environment variables (jangan di-commit!)
├── nodemon.json            # Konfigurasi Nodemon
├── package.json
└── tsconfig.json
```

---

## 🔧 Scripts

| Script        | Perintah         | Keterangan                     |
| ------------- | ---------------- | ------------------------------ |
| `dev`         | `npm run dev`    | Jalankan server dengan nodemon |
| `build`       | `npm run build`  | Compile TypeScript ke JS       |

---

## 📌 Catatan

- Backend menggunakan **ES Modules** (`"type": "module"` di `package.json`)
- Import path menggunakan alias `@/` yang di-resolve ke `src/`
- Semua timestamp disimpan dalam format **Unix Epoch (integer)** bukan `DateTime`
- Prisma Client di-generate ke `src/generated/prisma` (custom output)

# 📊 Schema — WealthyMe Backend

Dokumen ini menjelaskan **Entity Relationship Diagram (ERD)** database dan seluruh **API Endpoint** yang tersedia.

---

## 🗺️ Entity Relationship Diagram (ERD)

### Diagram Relasi

```
┌──────────────────────────────────────────────────────────────────────┐
│                              user                                    │
│  id (PK)  · name · email (UNIQUE) · password · createdAt · updatedAt│
└─────┬──────────────────┬──────────────────┬──────────────────┬───────┘
      │ 1                │ 1                │ 1..n             │ 1..n
      │                  │                  │                  │
      ▼ 1                ▼ 1                ▼ n                ▼ n
┌──────────┐      ┌──────────┐      ┌─────────────┐   ┌──────────────┐
│   role   │      │ profile  │      │  account    │   │  category    │
│──────────│      │──────────│      │─────────────│   │──────────────│
│ id (PK)  │      │ id (PK)  │      │ id (PK)     │   │ id (PK)      │
│ name     │      │displayName│     │ name        │   │ name         │
│ userId   │      │birthDate │      │ type        │   │ type         │
│(FK→user) │      │profession│      │ balance     │   │ userId       │
│createdAt │      │avatarUrl │      │currency_code│   │(FK→user)     │
│updatedAt │      │avatarPublicId   │ userId      │   │ createdAt    │
└──────────┘      │timezone  │      │(FK→user)    │   │ updatedAt    │
                  │ userId   │      │ createdAt   │   └──────┬───────┘
                  │(FK→user) │      │ updatedAt   │          │
                  │createdAt │      └──────┬──────┘          │ 1
                  │updatedAt │             │ 1..n            │
                  └──────────┘             │                  │
                                           ▼ n                ▼ n
┌───────────────────────────────────────────────────────────────────┐
│                          transaction                              │
│  id (PK) · amount · type · note · transactionAt · deletedAt      │
│  receiptUrl · receiptPublicId · currency_code                     │
│  accountId (FK→account) · categoryId (FK→category)               │
│  createdAt · updatedAt                                            │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       refreshToken                          │
│  id (PK) · token (UNIQUE) · isRevoked · expiredAt · device  │
│  userId (FK→user) · createdAt · updatedAt                   │
└─────────────────────────────────────────────────────────────┘
```

---

### Detail Model

#### `user`
Entitas utama aplikasi. Setiap user memiliki satu role, satu profile, dan banyak account & kategori.

| Field       | Tipe     | Keterangan                     |
| ----------- | -------- | ------------------------------ |
| `id`        | String   | UUID, Primary Key              |
| `name`      | String   | Nama lengkap user              |
| `email`     | String   | Unik, digunakan untuk login    |
| `password`  | String   | Di-hash dengan Argon2          |
| `createdAt` | Int      | Unix timestamp                 |
| `updatedAt` | Int      | Unix timestamp                 |

---

#### `role`
Relasi **1-to-1** dengan `user`. Dipisah dari user agar scalable (mudah menambah permission di masa depan).

| Field       | Tipe   | Keterangan                              |
| ----------- | ------ | --------------------------------------- |
| `id`        | String | UUID, Primary Key                       |
| `name`      | Enum   | `admin` \| `user` (default: `user`)     |
| `userId`    | String | FK → `user.id` (UNIQUE, relasi 1-to-1) |
| `createdAt` | Int    | Unix timestamp                          |
| `updatedAt` | Int    | Unix timestamp                          |

---

#### `refreshToken`
Menyimpan refresh token per device untuk mendukung **multi-device session** dan **token revocation**.

| Field       | Tipe    | Keterangan                                   |
| ----------- | ------- | -------------------------------------------- |
| `id`        | String  | UUID, Primary Key                            |
| `token`     | String  | Token string, UNIQUE                         |
| `isRevoked` | Boolean | `true` = token dicabut / tidak valid         |
| `expiredAt` | Int     | Unix timestamp kapan token expired           |
| `device`    | String  | User-Agent string (identifikasi device)      |
| `userId`    | String  | FK → `user.id`                               |

---

#### `profile`
Informasi tambahan user. Relasi **1-to-1** dengan `user`.

| Field           | Tipe    | Keterangan                           |
| --------------- | ------- | ------------------------------------ |
| `id`            | String  | UUID, Primary Key                    |
| `displayName`   | String? | Nama tampilan (UNIQUE, opsional)     |
| `birthDate`     | Int?    | Unix timestamp, opsional             |
| `profession`    | String? | Pekerjaan, opsional                  |
| `avatarUrl`     | String? | URL gambar dari Cloudinary           |
| `avatarPublicId`| String? | Public ID Cloudinary (untuk hapus)   |
| `timezone`      | String  | Timezone user (misal: `Asia/Jakarta`)|
| `userId`        | String  | FK → `user.id` (UNIQUE)              |

---

#### `account`
Representasi dompet/rekening milik user. Setiap account memiliki banyak transaksi.

| Field           | Tipe        | Keterangan                                        |
| --------------- | ----------- | ------------------------------------------------- |
| `id`            | String      | UUID, Primary Key                                 |
| `name`          | String      | Nama akun (misal: "BCA", "GoPay")                 |
| `type`          | Enum        | `cash` \| `e_wallet` \| `bank` \| `investment`   |
| `balance`       | Decimal     | Saldo saat ini (presisi 15,2)                     |
| `currency_code` | Enum        | `IDR` \| `USD` \| `SGD` \| `EUR`                 |
| `userId`        | String      | FK → `user.id`                                    |

---

#### `category`
Kategori transaksi (income/expense). Bisa milik user tertentu atau global (userId nullable = kategori default sistem).

| Field       | Tipe   | Keterangan                                        |
| ----------- | ------ | ------------------------------------------------- |
| `id`        | String | UUID, Primary Key                                 |
| `name`      | String | Nama kategori (misal: "Gaji", "Makan")            |
| `type`      | Enum   | `income` \| `expense`                             |
| `userId`    | String?| FK → `user.id` (null = kategori global/default)  |

---

#### `transaction`
Inti dari aplikasi — mencatat setiap pemasukan/pengeluaran. Mengimplementasikan **soft delete**.

| Field              | Tipe    | Keterangan                                        |
| ------------------ | ------- | ------------------------------------------------- |
| `id`               | String  | UUID, Primary Key                                 |
| `amount`           | Decimal | Jumlah transaksi (presisi 15,2)                   |
| `type`             | Enum    | `income` \| `expense`                             |
| `note`             | String? | Catatan opsional                                  |
| `transactionAt`    | Int     | Unix timestamp waktu transaksi terjadi            |
| `deletedAt`        | Int?    | Null = aktif, isi = soft deleted (ada di trash)   |
| `receiptUrl`       | String? | URL bukti transaksi dari Cloudinary               |
| `receiptPublicId`  | String? | Public ID Cloudinary untuk hapus receipt          |
| `currency_code`    | Enum    | `IDR` \| `USD` \| `SGD` \| `EUR`                 |
| `accountId`        | String  | FK → `account.id`                                 |
| `categoryId`       | String  | FK → `category.id`                                |

---

### Enum Types

| Enum              | Values                                          |
| ----------------- | ----------------------------------------------- |
| `roles`           | `admin`, `user`                                 |
| `walletType`      | `cash`, `e_wallet`, `bank`, `investment`        |
| `currencyType`    | `IDR`, `USD`, `SGD`, `EUR`                      |
| `transactionType` | `income`, `expense`                             |

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:8000/api`

> 🔒 = Memerlukan autentikasi (Header: `Authorization: Bearer <access_token>` + Cookie: `refreshToken`)
> 👑 = Memerlukan role `admin`

---

### 🔑 Auth — `/api/auth`

| Method | Endpoint    | Auth | Deskripsi                                          |
| ------ | ----------- | ---- | -------------------------------------------------- |
| `POST` | `/login`    | ❌   | Login dengan email & password. Mengembalikan access token & set refresh token cookie. |
| `POST` | `/register` | ❌   | Registrasi user baru.                              |
| `POST` | `/logout`   | 🔒   | Logout — revoke refresh token, hapus cookie.       |
| `GET`  | `/me`       | 🔒   | Mendapatkan data user yang sedang login.           |

**Request Body — `POST /login`**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Request Body — `POST /register`**
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "yourpassword"
}
```

---

### 👤 User — `/api/user`

> Semua endpoint memerlukan 🔒 + 👑

| Method   | Endpoint  | Deskripsi                              |
| -------- | --------- | -------------------------------------- |
| `GET`    | `/`       | Ambil semua user (dengan pagination)   |
| `GET`    | `/:id`    | Ambil satu user berdasarkan ID         |
| `POST`   | `/`       | Buat user baru (admin)                 |
| `PATCH`  | `/:id`    | Update data user                       |
| `DELETE` | `/:id`    | Hapus user                             |

**Query Params — `GET /`**
```
?page=1&limit=10&search=budi&sort=createdAt&order=desc
```

---

### 🪪 Profile — `/api/profile`

| Method  | Endpoint  | Auth | Deskripsi                                |
| ------- | --------- | ---- | ---------------------------------------- |
| `GET`   | `/`       | 🔒   | Ambil profile user yang sedang login     |
| `POST`  | `/`       | 🔒   | Buat profile (upload avatar via multipart/form-data) |
| `PATCH` | `/`       | 🔒   | Update profile (bisa ganti avatar)       |
| `PATCH` | `/avatar` | 🔒   | Hapus avatar saja (reset ke default)     |

**Form Data — `POST /` & `PATCH /`**
```
avatar      (file, opsional)
displayName (string, opsional)
birthDate   (number - unix timestamp, opsional)
profession  (string, opsional)
timezone    (string, required pada create)
```

---

### 🏦 Account — `/api/account`

| Method   | Endpoint | Auth | Deskripsi                                |
| -------- | -------- | ---- | ---------------------------------------- |
| `POST`   | `/`      | 🔒   | Buat akun/dompet baru                    |
| `GET`    | `/`      | 🔒   | Ambil semua akun milik user              |
| `GET`    | `/:id`   | 🔒   | Ambil satu akun berdasarkan ID           |
| `PATCH`  | `/:id`   | 🔒   | Update akun                              |
| `DELETE` | `/:id`   | 🔒   | Hapus akun                               |

**Request Body — `POST /`**
```json
{
  "name": "BCA Utama",
  "type": "bank",
  "balance": 5000000,
  "currency_code": "IDR"
}
```

**Query Params — `GET /`**
```
?type=bank&sort=balance&order=asc
```

---

### 🏷️ Category — `/api/category`

| Method   | Endpoint | Auth | Deskripsi                                         |
| -------- | -------- | ---- | ------------------------------------------------- |
| `GET`    | `/`      | 🔒   | Ambil semua kategori (milik user + kategori global) |
| `GET`    | `/:id`   | 🔒   | Ambil satu kategori                               |
| `POST`   | `/`      | 🔒   | Buat kategori custom                              |
| `PATCH`  | `/:id`   | 🔒   | Update kategori                                   |
| `DELETE` | `/:id`   | 🔒   | Hapus kategori                                    |

**Request Body — `POST /`**
```json
{
  "name": "Investasi Saham",
  "type": "expense"
}
```

**Query Params — `GET /`**
```
?type=income&search=makan&page=1&limit=10
```

---

### 💸 Transaction — `/api/transaction`

| Method   | Endpoint          | Auth | Deskripsi                                          |
| -------- | ----------------- | ---- | -------------------------------------------------- |
| `GET`    | `/`               | 🔒   | Ambil satu transaksi berdasarkan query `?id=`      |
| `GET`    | `/datatable`      | 🔒   | Ambil transaksi dengan filter, pagination, sort    |
| `GET`    | `/chart`          | 🔒   | Ambil data agregasi untuk chart (grafik)           |
| `POST`   | `/`               | 🔒   | Buat transaksi baru (bisa upload receipt)          |
| `PATCH`  | `/`               | 🔒   | Update transaksi (query `?id=`)                    |
| `DELETE` | `/`               | 🔒   | Soft delete transaksi (query `?id=`)               |
| `PATCH`  | `/restore`        | 🔒   | Pulihkan transaksi dari trash (query `?id=`)       |
| `DELETE` | `/receipt`        | 🔒   | Hapus receipt saja dari transaksi                  |
| `DELETE` | `/permanent`      | 🔒   | Hapus permanen semua transaksi di trash            |

**Query Params — `GET /datatable`**
```
?page=1&limit=10&type=expense&accountId=xxx&categoryId=xxx
&startDate=<unix>&endDate=<unix>&sort=transactionAt&order=desc
```

**Query Params — `GET /chart`**
```
?accountId=xxx&startDate=<unix>&endDate=<unix>&groupBy=day|month
```

**Form Data — `POST /` & `PATCH /`** (multipart/form-data)
```
receipt       (file, opsional)
amount        (number, required)
type          (income | expense, required)
categoryId    (string UUID, required)
transactionAt (number - unix timestamp, required)
note          (string, opsional)
currency_code (IDR | USD | SGD | EUR, required)
```

---

## 📡 Format Response Standar

Semua endpoint menggunakan format response yang konsisten:

### ✅ Success
```json
{
  "status": "success",
  "message": "transaction created",
  "data": { ... }
}
```

### ❌ Error
```json
{
  "status": "error",
  "message": "unauthenticated!"
}
```

### 🔄 Token Auto-Rotate
Jika access token expired dan berhasil di-rotate, response akan menyertakan header:
```
x-new-access-token: Bearer <new_access_token>
```
Frontend harus membaca header ini dan menyimpan token baru.

---

## 🔑 HTTP Status Codes

| Code  | Keterangan                                      |
| ----- | ----------------------------------------------- |
| `200` | OK — Request berhasil                           |
| `201` | Created — Resource berhasil dibuat              |
| `400` | Bad Request — Input tidak valid / format salah  |
| `401` | Unauthorized — Tidak terautentikasi             |
| `403` | Forbidden — Tidak punya akses (bukan admin)     |
| `404` | Not Found — Resource tidak ditemukan            |
| `409` | Conflict — Duplikasi data                       |
| `500` | Internal Server Error — Error tak terduga       |

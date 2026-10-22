# Todo App Backend

RESTful API untuk aplikasi Todo, dibuat dengan **Express.js + TypeScript**, database **MySQL**, dan autentikasi **JWT**.

## Teknologi

- Express.js 5 + TypeScript (dijalankan dengan `tsx`)
- MySQL (`mysql2`)
- `bcrypt` untuk hash password, `jsonwebtoken` untuk token login
- `cors` dan `dotenv`

## Struktur Folder

```
backend/
├── database/todo_app.sql     # skema database untuk di-import
├── postman/                  # koleksi Postman siap pakai
├── src/
│   ├── config/db.ts          # connection pool MySQL
│   ├── models/               # query SQL (userModel, todoModel)
│   ├── middlewares/          # validator.ts, authMiddleware.ts
│   ├── controllers/          # authController, todoController
│   ├── routes/
│   │   ├── index.ts          # penghubung: /auth dan /todos
│   │   ├── authRoutes.ts     # register, login
│   │   └── todoRoutes.ts     # CRUD todo (wajib login)
│   ├── types/                # kontrak request & response
│   │   ├── auth.ts           # RegisterRequest, LoginRequest, AuthResponse
│   │   ├── todo.ts           # CreateTodoRequest, UpdateTodoRequest, TodoResponse, TodoQuery
│   │   ├── common.ts         # SuccessResponse, PaginatedResponse, ErrorResponse
│   │   ├── express.d.ts      # req.user dan req.requestId
│   │   └── index.ts          # export semua kontrak
│   ├── utils/response.ts     # sendSuccess, sendPaginated, sendError
│   ├── app.ts                # X-Request-Id, logger, CORS, JSON, rute
│   └── server.ts             # baca .env lalu jalankan server
├── .env.example
└── package.json
```

## Setup

### 1. Siapkan database

Jalankan MySQL (Laragon: **Start All**, XAMPP: **Start MySQL**), lalu import skema dengan salah satu cara berikut:

- **phpMyAdmin / HeidiSQL**: buka tab SQL, salin isi `database/todo_app.sql`, lalu jalankan.
- **Terminal**:

  ```bash
  mysql -u root < database/todo_app.sql
  ```

Skema ini membuat database `todo_app_backend` dengan dua tabel:

| Tabel   | Kolom                                  |
| ------- | -------------------------------------- |
| `auth`  | `id`, `nama`, `email`, `password`      |
| `todos` | `id`, `user_id`, `task`, `is_completed` |

### 2. Install dependency

```bash
npm install
```

### 3. Atur environment variables

Salin `.env.example` menjadi `.env`, lalu sesuaikan isinya:

```bash
cp .env.example .env
```

| Variabel         | Keterangan                                         |
| ---------------- | -------------------------------------------------- |
| `PORT`           | Port server (default `5000`)                       |
| `DB_HOST`        | Host MySQL                                         |
| `DB_PORT`        | Port MySQL (default `3306`)                        |
| `DB_USER`        | User MySQL                                         |
| `DB_PASSWORD`    | Password MySQL (kosong untuk Laragon/XAMPP)        |
| `DB_NAME`        | Nama database (`todo_app_backend`)                 |
| `JWT_SECRET`     | Kunci rahasia JWT, isi dengan string acak panjang  |
| `JWT_EXPIRES_IN` | Masa berlaku token (misalnya `1d`)                 |
| `CORS_ORIGIN`    | Origin frontend yang diizinkan, pisahkan dengan koma |

> Di Windows, port 5000 kadang sudah dipakai oleh sistem. Jika server gagal berjalan atau semua request dibalas `403`, ganti `PORT` ke port lain (misalnya `5001`).

### 4. Jalankan server

```bash
npm run dev
```

Jika berhasil, terminal menampilkan `Server berjalan di http://localhost:<PORT>`.

## Endpoint

| Method | Endpoint             | Middleware       | Body                            | Respons sukses |
| ------ | -------------------- | ---------------- | ------------------------------- | -------------- |
| POST   | `/api/auth/register` | Validator        | `username`/`nama`, `email`, `password` | `201`   |
| POST   | `/api/auth/login`    | Validator        | `email`, `password`             | `200` + token  |
| GET    | `/api/todos?page=1&perPage=5` | Auth + Validator | –                      | `200`          |
| GET    | `/api/todos/:id`     | Auth             | –                               | `200`          |
| POST   | `/api/todos`         | Auth + Validator | `task`                          | `201`          |
| PUT    | `/api/todos/:id`     | Auth + Validator | `task` dan/atau `completed`     | `200`          |
| DELETE | `/api/todos/:id`     | Auth             | –                               | `200`          |

Semua rute `/api/todos` hanya bisa mengakses todo milik user yang sedang login. Todo milik user lain dianggap tidak ada (`404`).

Contoh body `PUT /api/todos/13` (`is_completed` juga masih diterima):

```json
{
  "task": "Mengerjakan Tugas #5 Backend (selesai)",
  "completed": true
}
```

`page` (default `1`) dan `perPage` (default `10`, maksimal `100`) bersifat opsional.

### Format response

Semua response memakai format yang sama melalui `src/utils/response.ts`. Kolom database `is_completed` dan `user_id` dikirim sebagai `completed` dan `userId`.

```json
{
  "success": true,
  "message": "Daftar todo berhasil diambil",
  "data": [{ "id": 7, "userId": 1, "task": "Mengerjakan Tugas #6 Backend", "completed": false }],
  "meta": {
    "timestamp": "2026-10-22T16:57:00.702Z",
    "requestId": "79188e2f-e640-4c29-9ab8-041bdce59af6",
    "pagination": { "page": 1, "perPage": 5, "total": 7, "totalPages": 2, "hasNextPage": true, "hasPrevPage": false }
  }
}
```

Response error berbentuk `{ "success": false, "message": "...", "errors": [...], "meta": { "timestamp": "...", "requestId": "..." } }`.

### X-Request-Id

Setiap response membawa header `X-Request-Id` berisi UUID unik. Nilai yang sama muncul di `meta.requestId` dan di log console server, sehingga satu request bisa dilacak dari Postman sampai terminal:

```
[2026-10-22T16:57:00.703Z] [79188e2f-e640-4c29-9ab8-041bdce59af6] GET /api/todos?page=1&perPage=5 -> 200 (6.9 ms)
```

Rute `/api/todos` membutuhkan header:

```
Authorization: Bearer <token>
```

### Kode error

| Status | Kapan                                                        |
| ------ | ------------------------------------------------------------ |
| `400`  | Body tidak lengkap, format salah, ID bukan angka, atau bukan JSON yang valid |
| `401`  | Token tidak ada, tidak valid, kedaluwarsa, atau login gagal  |
| `404`  | Rute tidak ditemukan, atau todo tidak ada / milik user lain  |
| `409`  | Email sudah terdaftar                                        |
| `500`  | Kesalahan di server                                          |

## Pengujian dengan Postman

1. Import `postman/todo-app-api.postman_collection.json` ke Postman.
2. Sesuaikan variabel `base_url` dengan `PORT` di `.env`.
3. Folder **Tugas 4**: jalankan berurutan **Register**, **Login**, **Post Todo**, **Get Todos**.
4. Folder **Tugas 5**: jalankan berurutan **Login**, **Get Task**, **Put Task 13**, **Delete Task 14**, **Get Task 13**, **Get Task 14**, **404 Handler**, **Auth Handler**. Ubah angka `13` dan `14` di URL sesuai id todo milikmu.
5. Folder **Tugas 6**: jalankan berurutan **Register**, **Login**, **Post Todo**, **Get Todos (page=1&perPage=5)**, **404 Handler**. Cek `meta.timestamp` di tab Body, `X-Request-Id` di tab Headers, lalu cocokkan dengan log di terminal `npm run dev`.

Request **Login** punya script Post-response yang otomatis menyimpan token ke variabel `{{jwt_token}}`, sehingga request todo langsung memakai Bearer Token tersebut.

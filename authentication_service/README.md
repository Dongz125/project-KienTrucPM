# Authentication Service (Express.js + PostgreSQL + Redis)

## Tính năng

-   Đăng ký (email + password)
-   Đăng nhập (trả về accessToken + refreshToken)
-   Refresh access token bằng refresh token
-   Logout (thu hồi refresh token)
-   Middleware `requireAuth` để bảo vệ route

## Yêu cầu

-   Node 18+
-   PostgreSQL
-   Redis

## Cài đặt

1. Clone repo
2. Tạo file `.env` từ `.env.example` và chỉnh thông số DB/Redis/JWT
3. Cài dependencies:
   npm install
4. Khởi động PostgreSQL & Redis (khởi động PostgreSQL, tạo database. Sau đó chạy docker compose up --build cho lần đầu để khởi động redis, từ các lần sau chỉ cần docker compose up -d)
5. Chạy:
   npm start (cần đảm bảo trong db hiện tại không có bảng user hoặc bảng user phải do chính service này tạo)

Server mặc định lắng nghe PORT (mặc định 4000).

## Khởi tạo database

Khi server start, file `sql/init.sql` sẽ được chạy tự động (tạo bảng `users` nếu chưa có).

## API

Base URL: http://localhost:4000/api/auth

### POST /register

Request body:
{
"email": "a@b.com",
"password": "Password123!",
"fullName": "Tên"
}

Response: user info (không trả password).

### POST /login

Request body:
{
"email": "a@b.com",
"password": "Password123!"
}

Response:
{
"user": { "id": 1, "email": "...", "full_name": "..." },
"accessToken": "...",
"refreshToken": "..."
}

-   accessToken dùng để auth header: Authorization: Bearer <accessToken>
-   refreshToken dùng để lấy accessToken mới hoặc logout.

### POST /refresh

Request body:
{
"refreshToken": "<token>"
}

Response:
{
"accessToken": "..."
}

### POST /logout

Request body:
{
"refreshToken": "<token>"
}

Sau logout, refreshToken bị xóa khỏi Redis và không thể dùng để refresh nữa.

## Bảo mật & kiến nghị

-   Đặt ACCESS_TOKEN_SECRET và REFRESH_TOKEN_SECRET dài & an toàn.
-   Xoá refresh token khi logout.
-   Có thể lưu nhiều refresh token cho 1 user (device-based) — hiện tại logic lưu refresh:<token> -> userId.
-   Thêm rate-limiting, helmet, cors trong production.
-   Xem xét dùng HTTPS, secure cookies nếu cần.

## Test

Sau server chạy:
node test.js

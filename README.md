# 🎓 EduSpace - Online Learning & Mentorship Management System

> **Dự án Kỹ năng Phát triển Phần mềm (SWP391) - Nhóm 2 (Group 2) | Trường Đại học FPT (FPT University)**

![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Build-Vite%208-646CFF?logo=vite)
![Tailwind CSS v4](https://img.shields.io/badge/Style-Tailwind%20v4-38B2AC?logo=tailwindcss)
![Java 21](https://img.shields.io/badge/Backend-Java%2021-ED8B00?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Framework-Spring%20Boot%204.0-6DB33F?logo=springboot)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)

---

## 📌 1. Tổng Quan Dự Án (Project Overview)

**EduSpace** là hệ thống quản lý học tập trực tuyến (LMS - Learning Management System) tích hợp kết nối Cố vấn (Mentorship) được thiết kế hiện đại, nhằm cung cấp giải pháp toàn diện cho việc học tập, giảng dạy và tương tác trực tiếp giữa **Học viên (Learner)**, **Người sáng tạo nội dung (Creator/Instructor)**, **Cố vấn (Mentor)** và **Quản trị viên (Admin)**.

Hệ thống hỗ trợ quản lý khóa học theo lộ trình (Roadmap), lớp học trực tuyến, làm và nộp bài tập, hỗ trợ giải cứu học tập trực tiếp (Incident/Rescue Support), cấp chứng chỉ hoàn thành (Certificate), cùng kênh thông báo thời gian thực qua WebSockets.

---

## 🚀 2. Công Nghệ Sử Dụng (Tech Stack)

### 🎨 Frontend
- **Core Framework**: React 19 (Vite)
- **Routing**: React Router 7 (`react-router`)
- **Styling**: Tailwind CSS v4.0 với `@tailwindcss/vite`, Shadcn UI (Radix UI primitives)
- **Icons & UI Components**: Lucide React, Sonner (Toast Notifications)
- **HTTP Client**: Axios (Tích hợp JWT Interceptor & NProgress)
- **Real-time**: SockJS Client & `@stomp/stompjs` (WebSocket)

### ⚙️ Backend
- **Core Language**: Java 21
- **Framework**: Spring Boot 4.0.6
- **Security & Auth**: Spring Security, JWT (JSON Web Token), OAuth2 Client (Google Social Login)
- **Data Access**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.x (H2 Database cho môi trường Test)
- **Media Cloud**: Cloudinary SDK (Tải lên hình ảnh, video bài giảng)
- **Email Service**: Spring Boot Mail Starter (Xác thực Email & Thông báo)
- **Real-time Messaging**: Spring WebSocket & STOMP Protocol
- **API Documentation**: SpringDoc OpenAPI 3.0 (Swagger UI)

---

## 🔥 3. Các Tính Năng Chính (Core Features)

| Vai trò (Role) | Tính năng nổi bật |
| :--- | :--- |
| **🌐 Guest (Khách)** | • Xem danh sách khóa học, xem chi tiết bài giảng dùng thử.<br>• Tìm kiếm & lọc khóa học theo danh mục/lộ trình.<br>• Đăng ký tài khoản mới, xác thực OTP Email hoặc đăng nhập qua Google OAuth2. |
| **👨‍🎓 Learner (Học viên)** | • Đăng ký ghi danh khóa học (Enrollment).<br>• Học theo bài giảng, xem video, làm bài tập & nộp bài (Submissions).<br>• Theo dõi tiến độ lộ trình học cá nhân (Roadmap).<br>• Gửi yêu cầu trợ giúp/giải cứu bài tập tới Mentor (Incident Rescue Support).<br>• Tham gia nhóm học tập (Study Groups).<br>• Nhận chứng chỉ trực tuyến khi hoàn thành khóa học (Certificates). |
| **👨‍🏫 Creator (Giảng viên)** | • Tạo và quản lý khóa học, bài giảng, bài tập.<br>• Quản lý tài nguyên media (Upload video/hình ảnh qua Cloudinary).<br>• Xem báo cáo phân tích doanh thu và số lượng học viên.<br>• Đăng ký xét duyệt nâng cấp tài khoản lên Creator. |
| **🛡️ Mentor (Cố vấn)** | • Tiếp nhận & xử lý yêu cầu hỗ trợ học tập thời gian thực từ học viên.<br>• Hướng dẫn, chấm bài và tương tác với các nhóm học tập. |
| **👑 Admin (Quản trị viên)** | • Quản lý toàn bộ người dùng và phân quyền hệ thống.<br>• Phê duyệt đơn đăng ký Creator & Mentor.<br>• Duyệt/Khóa các khóa học trên hệ thống.<br>• Xem thống kê tổng quan toàn hệ thống. |

---

## 🏗️ 4. Kiến Trúc & Cấu Trúc Thư Mục (System Architecture)

Dự án áp dụng mô hình **Client-Server (Decoupled)** tách biệt hoàn toàn Frontend và Backend thông qua RESTful APIs.

```text
SWP391-Group2-EduSpace/
├── backend/                       # Source code Spring Boot REST API
│   ├── src/main/java/org/eduspace/backend/
│   │   ├── config/                # Cấu hình CORS, Cloudinary, Security, WebSocket
│   │   ├── controller/            # Tầng tiếp nhận HTTP Request (REST Endpoints)
│   │   ├── dto/                   # Data Transfer Objects (Request/Response)
│   │   ├── entity/                # JPA Entities (Database Tables)
│   │   ├── exception/             # Xử lý ngoại lệ toàn cục (Global Exception Handling)
│   │   ├── repository/           # Tầng tương tác Database (Spring Data JPA)
│   │   ├── security/              # Cấu hình Spring Security & JWT Filters
│   │   └── service/               # Tầng xử lý Logic nghiệp vụ (Business Logic)
│   ├── application.properties     # Cấu hình Spring Boot
│   └── pom.xml                    # File quản lý thư viện Maven
│
└── frontend/                      # Source code React 19 + Vite
    ├── src/
    │   ├── components/            # UI Components dùng chung (Shadcn UI, Header, Nav)
    │   ├── contexts/              # React Contexts (AuthContext)
    │   ├── lib/                   # Axios Instance & Utilities
    │   ├── modules/               # Cấu trúc Modular theo tính năng:
    │   │   ├── admin/             # Module Quản trị viên
    │   │   ├── auth/              # Module Đăng nhập / Đăng ký
    │   │   ├── course-lifecycle/  # Module Quản lý khóa học
    │   │   ├── course-enrollment/ # Module Đăng ký học
    │   │   ├── learning/          # Module Giao diện bài học
    │   │   ├── mentor/            # Module Cố vấn
    │   │   └── roadmap/           # Module Lộ trình học tập
    │   ├── routes/                # Bảo vệ Route (ProtectedRoute)
    │   └── services/              # Tầng gọi API Backend
    ├── package.json               # Quản lý dependencies NPM
    └── vite.config.js             # Cấu hình Vite
```

---

## 🛠️ 5. Hướng Dẫn Cài Đặt & Chạy Môi Trường Cục Bộ (Setup Guide)

### 📋 Yêu cầu tiên quyết (Prerequisites)
- **Node.js**: `v18.x` trở lên (Khuyên dùng `v20.x` hoặc mới hơn)
- **JDK**: Java Development Kit `21`
- **Database**: MySQL `8.0+`
- **Build Tool**: Maven `3.8+` (Hoặc dùng wrapper `mvnw` đi kèm)

---

### 1️⃣ Cấu hình & Chạy Backend (Spring Boot)

1. **Di chuyển vào thư mục backend**:
   ```bash
   cd backend
   ```

2. **Tạo CSDL MySQL**:
   Mở MySQL Workbench hoặc MySQL CLI và tạo database:
   ```sql
   CREATE DATABASE eduspace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Cấu hình biến môi trường (`.env.properties`)**:
   Tạo file `.env.properties` tại thư mục `backend/` (cùng cấp với `.env.properties.example`) và điền các thông tin:
   ```properties
   PORT=8080
   DB_URL=jdbc:mysql://localhost:3306/eduspace_db?useSSL=false&serverTimezone=UTC
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SMTP=smtp.gmail.com
   EMAIL_PASSWORD=your_email_app_password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Khởi chạy ứng dụng Spring Boot**:
   - Trên **Windows**:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - Trên **Linux/macOS**:
     ```bash
     ./mvnw spring-boot:run
     ```
   Server Backend sẽ khởi chạy tại URL: `http://localhost:8080`

---

### 2️⃣ Cấu hình & Chạy Frontend (React + Vite)

1. **Di chuyển vào thư mục frontend**:
   ```bash
   cd frontend
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```

3. **Tạo file `.env`**:
   Tạo file `.env` tại thư mục `frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Khởi chạy Development Server**:
   ```bash
   npm run dev
   ```
   Ứng dụng Web sẽ mở tại URL: `http://localhost:5173`

---

## 📡 6. Tài Liệu API & Định Dạng Phản Hồi (API Documentation)

### 📖 Swagger UI
Sau khi khởi chạy Backend, truy cập tài liệu Swagger tương tác tại:
👉 `http://localhost:8080/swagger-ui.html`

### 📄 API Response Format Thống Nhất
Toàn bộ phản hồi HTTP REST API đều sử dụng cấu trúc chuẩn `APIResponse<T>`:

```json
{
  "isSuccess": true,
  "code": 200,
  "message": "Thao tác thành công",
  "data": {
    "id": 1,
    "name": "Khóa học Java Core"
  }
}
```

---

## 👥 7. Đội Ngũ Phát Triển (Development Team)

Dự án được thực hiện bởi **Nhóm 2 - Lớp SWP391 - Học kỳ SU26 - FPT University**:

- **Tên dự án**: EduSpace Management System
- **Môn học**: SWP391 - Software Development Project

---

## 📝 8. Giấy Phép (License)

Dự án được phát triển phục vụ mục đích học tập và nghiên cứu trong khuôn khổ môn học **SWP391** tại Trường Đại học FPT.

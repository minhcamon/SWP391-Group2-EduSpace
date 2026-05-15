# Cấu Trúc Thư Mục Dự Án (Backend)

Dự án này sử dụng kiến trúc phân tầng (Layered Architecture) chuẩn của Spring Boot. Dưới đây là giải thích chi tiết về cấu trúc thư mục và vai trò của từng thư mục, giúp các thành viên trong nhóm dễ dàng nắm bắt và đóng góp vào dự án.

## Sơ Đồ Cấu Trúc Thư Mục

```text
backend/
├── pom.xml                        # Nơi khai báo các thư viện (dependencies) và cấu hình build của Maven
├── src/
│   ├── main/
│   │   ├── java/org/eduspace/backend/
│   │   │   ├── BackendApplication.java # File gốc chứa hàm main để chạy ứng dụng Spring Boot
│   │   │   │
│   │   │   ├── config/            # Chứa các file cấu hình ứng dụng (VD: cấu hình CORS, cấu hình chung)
│   │   │   ├── controller/        # Tầng API: Nơi tiếp nhận các HTTP request từ phía client (React/Vue/...) và trả về HTTP response
│   │   │   ├── dto/               # Data Transfer Objects: Các đối tượng dùng để đóng gói và truyền tải dữ liệu giữa Client - Server
│   │   │   │   ├── request/       # Các class DTO định nghĩa cấu trúc dữ liệu gửi TỪ client LÊN server (VD: LoginRequest)
│   │   │   │   └── response/      # Các class DTO định nghĩa cấu trúc dữ liệu server TRẢ VỀ cho client (VD: UserResponse)
│   │   │   ├── entity/            # Chứa các Model class ánh xạ trực tiếp với các bảng trong cơ sở dữ liệu MySQL (Dùng JPA/Hibernate)
│   │   │   ├── exception/         # Chứa các class xử lý lỗi (Exception) tùy chỉnh và Global Exception Handler để chuẩn hóa format lỗi trả về cho frontend
│   │   │   ├── repository/        # Tầng Database: Các interface kế thừa JpaRepository để thao tác trực tiếp với Database (CRUD)
│   │   │   ├── security/          # Tầng Bảo Mật: Chứa các cấu hình Spring Security, các Filter xử lý JWT (JSON Web Token), xác thực và phân quyền
│   │   │   └── service/           # Tầng Business Logic: Nơi chứa toàn bộ logic nghiệp vụ cốt lõi của ứng dụng (xử lý dữ liệu trước khi lưu hoặc sau khi lấy từ DB)
│   │   │
│   │   └── resources/
│   │       ├── application.properties # File cấu hình môi trường của Spring Boot (kết nối Database, JWT secret, server port...)
│   │       ├── static/            # Chứa các tài nguyên tĩnh như file CSS, JS, Images (Thường ít dùng khi đã tách riêng Frontend)
│   │       └── templates/         # Chứa các file HTML templates nếu dùng Thymeleaf (Ít dùng cho REST API)
│   │
│   └── test/                      # Thư mục chứa các file kiểm thử tự động (Unit Test, Integration Test)
│       └── java/org/eduspace/backend/
│           └── BackendApplicationTests.java
```

## Luồng Hoạt Động Cơ Bản Của Một Request

Khi Client (Frontend) gửi một yêu cầu (ví dụ: đăng ký tài khoản) lên Server, luồng dữ liệu sẽ đi qua các tầng sau:

1. **Client** gửi HTTP POST request kèm JSON data.
2. **Controller**: Nhận request, map JSON thành đối tượng `DTO (request)`. Có thể validate tính hợp lệ của data tại đây.
3. **Service**: Controller gọi các hàm trong Service và truyền DTO vào. Service thực hiện các logic nghiệp vụ (kiểm tra email đã tồn tại chưa, mã hóa mật khẩu, ...), sau đó chuyển đổi `DTO` thành `Entity`.
4. **Repository**: Service gọi Repository để tiến hành lưu `Entity` xuống Database.
5. **Database**: MySQL lưu trữ dữ liệu thành công.
6. **Repository -> Service**: Repository trả về kết quả cho Service. Service chuyển đổi kết quả (`Entity`) thành `DTO (response)`.
7. **Controller -> Client**: Controller nhận `DTO (response)` từ Service và chuyển về định dạng JSON kèm HTTP Status (ví dụ: 201 Created) để trả về cho Client.

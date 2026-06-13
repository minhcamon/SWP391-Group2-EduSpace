# Giai đoạn 1: Sử dụng Maven để build dự án thành file JAR
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy toàn bộ code backend vào trong container
COPY . .

# Chạy lệnh build của Maven (bỏ qua chạy thử test để tránh lỗi kết nối DB lúc build)
RUN mvn clean package -DskipTests

# Giai đoạn 2: Sử dụng JRE tinh gọn để chạy ứng dụng (giúp giảm dung lượng file xuống thấp nhất)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy file .jar đã build từ giai đoạn 1 sang giai đoạn 2
COPY --from=build /app/target/*.jar app.jar

# Render sẽ cấp phát cổng ngẫu nhiên qua biến môi trường $PORT. 
# Đoạn lệnh này ép Spring Boot lắng nghe chính xác cổng đó.
ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT:-8080} app.jar"]
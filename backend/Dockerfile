FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT:-8080} app.jar"]
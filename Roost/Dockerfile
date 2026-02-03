# Multi-stage Dockerfile for building and running the Spring Boot backend

FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# Backend Java está em bikepirata/backend-java/
WORKDIR /app/bikepirata/backend-java
RUN mvn -DskipTests clean package -B

FROM eclipse-temurin:17-jre
WORKDIR /app
# Copia o artefato gerado (usa wildcard para nome do jar)
COPY --from=build /app/bikepirata/backend-java/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]

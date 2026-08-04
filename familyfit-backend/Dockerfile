# ─────────────────────────────────────────────────────────────
# Stage 1 – Build
#   Uses the official Maven + Temurin 17 image so no local
#   Maven installation is required inside the container.
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy dependency manifest first so Docker layer-caches the
# dependency download step as long as pom.xml hasn't changed.
COPY pom.xml .

# Download all dependencies (cached layer)
RUN mvn dependency:go-offline -q

# Copy source and build the fat jar
COPY src ./src
RUN mvn clean package -DskipTests -q

# ─────────────────────────────────────────────────────────────
# Stage 2 – Runtime
#   Lightweight JRE-only image keeps the final image small.
#   eclipse-temurin:17-jre-jammy is the official, slim choice
#   for Java 17 on Ubuntu Jammy (actively maintained).
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy only the built jar from the build stage
COPY --from=build /app/target/familyfit-backend-1.0.0.jar app.jar

# Render (and most container platforms) inject PORT at runtime.
# application.properties already maps it: server.port=${PORT:8080}
EXPOSE 8080

# -Djava.security.egd speeds up Spring Boot startup in containers
# by avoiding entropy starvation on /dev/random.
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

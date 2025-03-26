#Stage 1 - get base image, copy files and package application in a jar
FROM eclipse-temurin:23-jdk-alpine AS package
WORKDIR /src
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .
COPY src src

RUN chmod a+x mvnw
RUN ./mvnw package -Dmaven.test.skip=true
#Stage 2 - expose the env variables and run the jar

FROM eclipse-temurin:23-jre-alpine
WORKDIR /app
COPY --from=package src/target/*.jar app.jar
ENV PORT=8080
EXPOSE ${PORT}
ENTRYPOINT ["java","-jar","app.jar"]

FROM maven:3.9.8-eclipse-temurin-21 AS build

# set the working directory
WORKDIR /app

# copy the pom.xml and install dependencies
COPY pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline

# copy the source code and build the application
COPY src ./src
RUN mvn -B -DskipTests clean package

# use an official JDK image for the run stage
FROM eclipse-temurin:21-jre-alpine

# set the working directory
WORKDIR /app

# copy the built JAR file & normalize it's name
COPY --from=build /app/target/PlanComparison-0.0.1-SNAPSHOT.jar /app/app.jar

# expose port 8080
EXPOSE 8080

# specify the command to run the application
ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
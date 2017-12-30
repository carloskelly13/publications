### Publications

#### A web app for screen layout and print design.

The Publications monorepo contains the source for the JavaScript app and the Spring Boot service.

#### JavaScript App

The front-end app uses [React](https://reactjs.org), [React Router](https://reacttraining.com/react-router/), and [styled-components](https://www.styled-components.com). Requirements for running the app are [Node](https://nodejs.org/) 8 and [Yarn](https://yarnpkg.com/) 1.3 or higher. To get started in the `client` dir:

```
$ yarn install
$ yarn start
```

The app in the default configuration will run on port `4040` and require the service running at `localhost:8080`. In the Wepback configuration you can point the service to the production instance of `https://www.publicationsapp.com/api`.

#### Spring Boot Service

The Publications service is a Java-based [Spring Boot](https://projects.spring.io/spring-boot/) app that connects to a [PostgreSQL](https://www.postgresql.org) database. Requirements for running the service locally are [JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and a PostgreSQL database named `publications` with the username and password `publications`. To run the service in the `server` dir:

```
$ ./gradlew bootRun
```

The service will run on port `8080`.

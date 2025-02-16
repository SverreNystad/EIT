# Developer Setup Guide


### Prerequisites
- Ensure that git is installed on your machine. [Download Git](https://git-scm.com/downloads)
- Docker is used for the backend and database setup. [Download Docker](https://www.docker.com/products/docker-desktop)
- Ensure that python is installed on your machine. [Download Python](https://www.python.org/downloads/)
- Ensure that Node.js is installed on your machine. [Download Node.js](https://nodejs.org/en/download/)

### Environment Variables
The application uses environment variables to store sensitive information. The environment variables are stored in a `.env` file in the root directory of the project. Copy the `.env.example` file and rename it to `.env`. Fill in the required information in the `.env` file.

```bash
cp .env.example .env
```

## Usage
To run the application run the following command
```bash
docker compose up --build
```


## Backend Setup
As the backend is running in a docker container with hot reloading, you can run the following command to start the backend server.

```bash
docker compose up --build backend
```

This will start the fastapi server on `http://localhost:8000`. You can access the openapi documentation at `http://localhost:8000/docs` or `http://localhost:8000/redoc`.

### Testing
There are both api tests and unit tests in the backend. To run all the tests run the following command
```bash
docker compose run backend python -m pytest
```

To only run the unit tests run the following command
```bash
docker compose run backend pytest -m "not apitest"
```

To only run the api tests run the following command
```bash
docker compose run backend pytest -m "apitest"
```


## Client Setup
The client is an Expo project created with `create-expo-app`. To get started with the client follow the steps below.
The client is running in a docker container but does not have hot reloading, 

```bash
docker compose up --build client
```

### Get started
During development, you can run the client locally on your machine. To do this follow the steps below.
1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```
The output will provide options to open the app in a development build, Android emulator, iOS simulator, or Expo Go, a limited sandbox for trying out app development with Expo.




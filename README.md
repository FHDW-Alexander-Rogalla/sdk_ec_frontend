# sdk_ec_frontend
Software Development Kit, E-Commerce project, Angular-Frontend

## Prerequisites
- Docker & Docker Compose
- Backend API must be running (see `sdk_ec_backend_api`)

## Startup

### HTTP Mode (Development)
```open a new terminal
docker compose -f compose.http.yaml up --build
```

### HTTPS Mode (Production-like)
```open a new terminal
docker compose -f compose.https.yaml up --build
```

## Configuration
Configure backend URL in `src/environments/environment.ts`:
- HTTP Backend: `http://localhost:5139/api`
- HTTPS Backend: `https://localhost:7129/api`
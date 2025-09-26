# # Avenue Code Challenge - Person API

A simple, functional Node.js Express API for person management with PostgreSQL database.

## Features

- **Simple & Functional**: Clean, direct code without over-engineered architecture
- **Input Validation**: Joi validation for all endpoints
- **Error Handling**: Proper logging without exposing sensitive information
- **Database**: PostgreSQL with Docker support
- **Unit Tests**: Comprehensive test coverage with Jest and Supertest

## Tech Stack

- Node.js (ES6+)
- Express.js
- PostgreSQL
- Joi (validation)
- Winston (logging)
- Jest & Supertest (testing)
- Docker & Docker Compose

## API Endpoints

### 1. GET /person/:id
Get a person by ID.

**Example:**
```bash
curl http://localhost:3000/person/1
```

### 2. POST /person/list
Filter persons by firstName and/or lastName (case-insensitive, partial matching).

**Example:**
```bash
curl -X POST http://localhost:3000/person/list \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Mickey"}'
```

### 3. POST /person
Create a new person.

**Example:**
```bash
curl -X POST http://localhost:3000/person \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "lastName": "Doe"}'
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Database
```bash
docker-compose up -d
```

### 3. Start API Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 4. Run Tests
```bash
npm test
```

The API will be running at `http://localhost:3000`

## Architecture

This project follows clean architecture principles with clear separation of concerns:

### Layers:
- **Controllers**: Handle HTTP requests/responses only
- **Use Cases**: Contain all business logic and rules
- **Database**: Data persistence layer
- **Validation**: Input validation with Joi schemas

### Project Structure

```
src/
├── app.js                 # Main Express application
├── config/
│   └── database.js        # Database connection
├── controllers/
│   └── personController.js # HTTP request/response handlers
├── usecases/
│   └── personUseCases.js   # Business logic layer
├── middleware/
│   ├── errorHandler.js    # Global error handling
│   └── validation.js      # Request validation
├── routes/
│   └── personRoutes.js    # Route definitions
├── utils/
│   └── logger.js          # Winston logger setup
└── validation/
    └── schemas.js         # Joi schemas
```

### Business Rules Implemented:
- **Duplicate Name Prevention**: Cannot create persons with identical first and last names
- **Case-insensitive Search**: Filtering works regardless of case
- **Partial Matching**: Search supports partial name matching

## Environment Variables

Update `.env` file as needed:

- `PORT`: Server port (default: 3000)
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5433 - changed to avoid conflicts)
- `DB_NAME`: Database name (default: avenuecode_db)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)

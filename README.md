# EventPulse API

EventPulse is a backend REST API for an event management platform. It provides authentication, authorization, event management, event registration, real-time announcements, API documentation, validation, error handling, and automated testing.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- MongoDB Atlas
- Socket.io
- JWT
- bcryptjs
- Express Validator
- Swagger / OpenAPI
- Jest
- Supertest
- Vercel

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization for admins and attendees
- Event CRUD operations
- Event filtering by category, city, and date range
- Pagination and sorting
- Event title and description search
- Event registration
- Registration cancellation
- Capacity management
- Duplicate registration prevention
- Real-time event announcements using Socket.io
- Announcement history
- Request validation
- Centralized error handling
- Automated tests
- Swagger API documentation
- MongoDB Atlas database
- Vercel deployment
- Health monitoring endpoint

## Project Structure

```text
30903180103508-EventPulse/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── tests/
├── postman/
├── app.js
├── seed.js
├── package.json
├── vercel.json
├── jest.config.js
├── .env.example
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd 30903180103508-EventPulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Use `.env.example` as a reference.

Required environment variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the `.env` file to GitHub.

### 4. Seed the database

```bash
npm run seed
```

The seed script creates:

- Admin user
- Technology category
- Music category
- Sports category
- Education category
- Sample events

Default admin credentials created by the seed script:

```text
Email: admin@eventpulse.com
Password: Admin123!
```

### 5. Start the development server

```bash
npm run dev
```

The API will run locally on:

```text
http://localhost:5000
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/auth/register` | Register a new attendee              |
| POST   | `/api/auth/login`    | Login and receive a JWT              |
| GET    | `/api/auth/me`       | Get the currently authenticated user |

### Events

| Method | Endpoint          | Description                  |
| ------ | ----------------- | ---------------------------- |
| GET    | `/api/events`     | Get all events               |
| GET    | `/api/events/:id` | Get an event by ID           |
| POST   | `/api/events`     | Create an event (Admin only) |
| PATCH  | `/api/events/:id` | Update an event (Admin only) |
| DELETE | `/api/events/:id` | Delete an event (Admin only) |

### Event Query Features

The events endpoint supports:

```text
GET /api/events?category=ID
GET /api/events?city=Cairo
GET /api/events?startDate=2026-01-01&endDate=2026-12-31
GET /api/events?search=technology
GET /api/events?page=1&limit=10
GET /api/events?sortBy=date&order=asc
GET /api/events?sortBy=registrations&order=desc
```

These parameters can also be combined.

### Registrations

| Method | Endpoint                 | Description                          |
| ------ | ------------------------ | ------------------------------------ |
| POST   | `/api/registrations`     | Register for an event                |
| GET    | `/api/registrations/my`  | Get the current user's registrations |
| DELETE | `/api/registrations/:id` | Cancel a registration                |

### Announcements

| Method | Endpoint                      | Description                               |
| ------ | ----------------------------- | ----------------------------------------- |
| POST   | `/api/announcements`          | Create an event announcement (Admin only) |
| GET    | `/api/announcements/:eventId` | Get announcement history for an event     |

### Health Check

| Method | Endpoint  | Description                   |
| ------ | --------- | ----------------------------- |
| GET    | `/health` | Check API and database status |

Example response:

```json
{
  "status": "ok",
  "environment": "development",
  "uptime": 258.8475109,
  "database": "connected"
}
```

## Swagger API Documentation

Interactive API documentation is available through Swagger UI.

Local URL:

```text
http://localhost:5000/api-docs
```

Swagger currently documents the Authentication and Events endpoints.

## Postman

A Postman collection is included in the `postman/` directory.

The collection contains requests for:

- Auth
- Events
- Registrations
- Announcements

The Postman environment uses:

```text
baseUrl
token
```

For local testing:

```text
baseUrl=http://localhost:5000
```

## Testing

Run the automated test suite with:

```bash
npm test
```

The project includes:

- Unit tests for `AppError`
- Unit tests for `asyncHandler`
- Integration tests for the Events API using Supertest

## Real-Time Features

EventPulse uses Socket.io for real-time event announcements.

Each event can have its own Socket.io room. Announcements are broadcast to the corresponding event room and are also persisted in MongoDB through the `Message` model.

## Database

The application uses MongoDB through Mongoose.

For deployment, MongoDB Atlas is used as the cloud database.

The MongoDB connection string is stored in the `MONGO_URI` environment variable.

## Deployment

The API is deployed using Vercel.

### Environment Variables

The following variables must be configured on the Vercel project:

```text
MONGO_URI
JWT_SECRET
NODE_ENV=production
```

### Health Check

After deployment, the API health endpoint can be checked at:

```text
YOUR_VERCEL_URL/health
```

Expected response:

```json
{
  "status": "ok",
  "environment": "production",
  "uptime": 123.45,
  "database": "connected"
}
```

## Live Deployment

Live API:

```text
TO BE ADDED AFTER VERCEL DEPLOYMENT
```

Swagger Documentation:

```text
TO BE ADDED AFTER VERCEL DEPLOYMENT
```

## Security

Sensitive credentials are stored in environment variables.

The `.env` file is excluded from Git using `.gitignore` and must never be committed to the repository.

## Git Workflow

The project follows Conventional Commits, for example:

```text
feat: add event registration
fix: handle duplicate registrations
docs: update README
test: add event API tests
```

A release tag is created for the final version:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## Project Status

EventPulse API includes:

- Authentication and authorization
- Event management
- Advanced event queries
- Event registration
- Capacity management
- Real-time announcements
- Validation and error handling
- Automated testing
- Swagger documentation
- Postman collection
- MongoDB Atlas support
- Vercel deployment support

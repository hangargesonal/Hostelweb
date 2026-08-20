# Hostel Management System

React + Spring Boot + PostgreSQL starter project.

## Modules
- Home dashboard
- Student registration, edit and delete
- Daily attendance
- Leaving/out-pass requests
- Other information page
- Responsive menu/sidebar

## 1. PostgreSQL setup

Create a database:

```sql
CREATE DATABASE hostel_db;
```

Then open:

`backend/src/main/resources/application.properties`

and set:

```properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

The tables are created automatically by JPA because `spring.jpa.hibernate.ddl-auto=update`.

## 2. Run backend

Requirements:
- Java 17+
- Maven
- PostgreSQL

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

`http://localhost:8080`

## 3. Run frontend

Requirements:
- Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Open:

`http://localhost:5173`

## API endpoints

### Students
- GET `/api/students`
- GET `/api/students/{id}`
- POST `/api/students`
- PUT `/api/students/{id}`
- DELETE `/api/students/{id}`

### Attendance
- GET `/api/attendance?date=YYYY-MM-DD`
- POST `/api/attendance`

### Leaving
- GET `/api/leaving`
- POST `/api/leaving`
- PUT `/api/leaving/{id}/status?status=APPROVED`

### Dashboard
- GET `/api/dashboard`

## Important
This is a college-project starter. For a production system, add authentication/authorization, stronger validation, pagination, audit logs, database migrations and role-based access.

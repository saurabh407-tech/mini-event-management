# Mini Event Management System

A RESTful API built with Node.js, Express, and MySQL for managing events and bookings.

## Prerequisites
- Node.js v16+
- MySQL 8+

## How to Run

### Step 1 — Setup Database
Open MySQL terminal or MySQL Workbench and run:
```
source schema.sql
```

### Step 2 — Configure Environment
Open the `.env` file and update your MySQL password:
```
DB_PASSWORD=yourpassword
```

### Step 3 — Install Dependencies
```
npm install
```

### Step 4 — Start Server
```
npm start
```

Server runs at: http://localhost:3000  
Swagger Docs at: http://localhost:3000/api-docs

## API Endpoints

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | /events                   | List all upcoming events           |
| POST   | /events                   | Create a new event                 |
| POST   | /bookings                 | Book a ticket (returns unique code)|
| GET    | /users/:id/bookings       | Get all bookings by a user         |
| POST   | /events/:id/attendance    | Mark attendance using booking code |

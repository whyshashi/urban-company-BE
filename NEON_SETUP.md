# Neon Database Integration Setup

## Overview
This application has been updated to use Neon database (PostgreSQL in the cloud) instead of local PostgreSQL.

## Setup Instructions

### 1. Get Your Neon Database URL
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or use an existing one
3. Copy your database connection string from the dashboard
4. It should look like: `postgresql://username:password@hostname:port/database?sslmode=require`

### 2. Environment Variables
Create a `.env` file in your project root with:

```env
# Neon Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Database Schema
You'll need to create the database tables in your Neon database. You can run the migration files or create the tables manually:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Service providers table
CREATE TABLE service_providers (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id),
  provider_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  service_id INTEGER REFERENCES services(id),
  slot_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Run the Application
```bash
npm run dev
```

## What Changed

### Database Connection
- Replaced Knex with Neon's serverless driver
- Updated all database queries from Knex syntax to raw SQL
- Added proper error handling for database operations

### Files Modified
- `src/db/neon.ts` - New Neon database configuration
- `src/index.ts` - Updated to use Neon
- `src/routes/servicesRoute.ts` - Converted to use Neon SQL
- `src/routes/bookingRoutes.ts` - Converted to use Neon SQL
- `src/routes/userRoutes.ts` - Converted to use Neon SQL

### Benefits of Neon
- Serverless PostgreSQL database
- Automatic scaling
- Built-in connection pooling
- Global distribution
- No server management required

## API Endpoints
All existing API endpoints remain the same:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get single user
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Services
- `GET /service/services` - Get all services
- `POST /service/services` - Create service
- `GET /service/services/:id` - Get service with providers
- `POST /service/services/:id/providers` - Add provider to service

### Bookings
- `POST /book` - Create booking
- `GET /book/:userId` - Get user bookings
- `PUT /book/:id` - Update booking status
- `DELETE /book/:id` - Delete booking
- `POST /book/:id/review` - Add review to booking

# Admin Dashboard

Admin panel backend API with comprehensive role-based access control (RBAC) and user management system.

## Description

A backend API designed for admin panel applications, featuring role-based access control, and user management. This system provides secure authentication, authorization, and comprehensive administrative functionality for managing users, roles, and permissions.

## Features

- **Role-Based Access Control (RBAC)**: Permission system with roles accessibility
- **User Management**: Complete CRUD operations for user accounts
- **Authentication & Authorization**: Secure JWT-based authentication with role verification

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/admin-dashboard.git

# Navigate to project directory
cd admin-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Run database migrations (if applicable)
npm run migrate

# Start the development server
npm start
```

## API Usage

The API runs on `http://localhost:8000` by default. Below are the available endpoints with example requests:

### Authentication Endpoints

#### 1. User Registration
Register a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
    "name": "Jonathan Kelly",
    "email": "johnkelly@gmail.com",
    "password": "@Johkely@1234"
}
```

#### 2. User Login
Authenticate a user and receive access tokens.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "johnkelly@gmail.com",
    "password": "@Johkely@1234"
}
```

**Response:**
The login endpoint returns both access and refresh tokens. Save these for subsequent requests.

#### 3. Refresh Access Token
Refresh an expired access token using the refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. User Logout
Logout a user and invalidate their refresh token.

**Endpoint:** `POST /api/auth/logout`

**Request Body:**
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Endpoints

#### Get Current User Profile
Access protected user information.

**Endpoint:** `GET /api/admin/me`

**Headers Required:**
- `Authorization: Bearer YOUR_ACCESS_TOKEN`

### Authentication Flow

1. **Register** a new user account using `/api/auth/signup`
2. **Login** with credentials to receive access and refresh tokens via `/api/auth/login`
3. **Use the access token** in the Authorization header for protected endpoints
4. **Refresh tokens** when they expire using `/api/auth/refresh`
5. **Logout** to invalidate tokens using `/api/auth/logout`

### Token Usage

For all protected endpoints, include the access token in the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```


## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - JSON Web Tokens for authentication

## Author

**Abiodun Afolabi** - Backend Developer
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

### Authentication Endpoints

## Postman Testing Guide

Use this section to test the newly added routes with Postman. Keep the usage patterns above as a guide for building requests.

Note: The server defaults to port `8000` unless `PORT` is set. If you used the previous defaults, verify your running port.

### Recommended Postman Environment Variables

- `baseUrl`: `http://localhost:8000`
- `accessToken`: set after login
- `refreshToken`: set after login
- `userId`: set to a target user when needed
- `logId`: set to a target log when needed

In Postman, add `Authorization: Bearer {{accessToken}}` to requests that require auth.

### Roles Overview

- `user`: can access own profile/data only
- `manager`: can view stats; can view/export logs but must apply at least one filter (user/actionType/from/to)
- `admin`: full access – manage users, view stats, delete logs

Login is rate-limited (max 10 attempts per 15 minutes per IP).

### Auth Flow in Postman

1. Signup: `POST {{baseUrl}}/api/auth/signup`
   - Body (JSON):
     ```json
     { "name": "Jane Admin", "email": "jane@example.com", "password": "Str0ngP@ss!" }
     ```
2. Login: `POST {{baseUrl}}/api/auth/login`
   - Body (JSON):
     ```json
     { "email": "jane@example.com", "password": "Str0ngP@ss!" }
     ```
   - From the response, copy `accessToken` → `{{accessToken}}`, `refreshToken` → `{{refreshToken}}` in your environment.
3. Me: `GET {{baseUrl}}/api/users/me` (Header: `Authorization: Bearer {{accessToken}}`)
4. Refresh: `POST {{baseUrl}}/api/auth/refresh`
   - Body (JSON): `{ "refreshToken": "{{refreshToken}}" }`
5. Logout: `POST {{baseUrl}}/api/auth/logout`
   - Body (JSON): `{ "refreshToken": "{{refreshToken}}" }`

### Bootstrap Admin (one-time)

To test admin-only routes, set one user to role `admin` directly in MongoDB, then login again to obtain a token containing `role: admin`.

### Users (Admin)

- List: `GET {{baseUrl}}/api/users`
- Update Role: `PATCH {{baseUrl}}/api/users/{{userId}}/role`
  - Body (JSON): `{ "role": "manager" }` (allowed: `user|manager|admin`)
- Delete: `DELETE {{baseUrl}}/api/users/{{userId}}`

### Stats (Admin, Manager)

- Users by role: `GET {{baseUrl}}/api/stats/users`
- Login stats (success vs failed): `GET {{baseUrl}}/api/stats/logins`
- Active users in last 24h: `GET {{baseUrl}}/api/stats/active-users`

### Activity Logs

Recorded actions: `login_success`, `login_failed`, `create_user`, `update_role`, `delete_user`.

- View (Admin, Manager): `GET {{baseUrl}}/api/logs`
  - Managers must provide at least one filter:
    - Query params: `user` (ObjectId), `actionType`, `from` (ISO date), `to` (ISO date)
    - In Postman, set them in the Params tab, e.g. `actionType=login_success&from=2025-09-10&to=2025-09-11`.
- Export (Admin, Manager): `GET {{baseUrl}}/api/logs/export`
  - Query params: `format=csv|json` plus optional filters above
  - In Postman, choose `Send and Download` to save CSV.
- Delete one (Admin): `DELETE {{baseUrl}}/api/logs/{{logId}}`
- Bulk delete (Admin): `DELETE {{baseUrl}}/api/logs`
  - Optional query filters: `from`, `to`, `user`, `actionType`

### Notes

- Always include `Authorization: Bearer {{accessToken}}` for protected endpoints.
- Login route has rate limiting; multiple failed attempts will be temporarily blocked.
- Behind a proxy, the app trusts proxy IPs for accurate client IP logging.

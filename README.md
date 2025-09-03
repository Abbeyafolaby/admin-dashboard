# Admin Dashboard

Admin panel backend API with comprehensive role-based access control (RBAC) and user management system.

## Description

A backend API designed for admin panel applications, featuring role-based access control, and user management. This system provides secure authentication, authorization, and comprehensive administrative functionality for managing users, roles, and permissions.

## Features

- **Role-Based Access Control (RBAC)**: Permission system with roles accessiblity
- **User Management**: Complete CRUD operations for user accounts
- **Authentication & Authorization**: Secure JWT-based authentication with role verification

## Installation & Usage

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

### Usage
Access the admin API at `http://localhost:3000/api/admin`


## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database


## Author

**Abiodun Afolabi** - Backend Developer
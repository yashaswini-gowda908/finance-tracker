# Finance Tracker

A full-stack personal finance management application built with React, Node.js, Express.js, and MongoDB. It helps users manage their financial transactions and visualize their financial activity.

## Features

- User registration and login
- Authentication using JSON Web Tokens (JWT)
- Password hashing using bcryptjs
- Add and manage income and expense transactions
- Transaction management through REST API endpoints
- Financial data visualization using Chart.js
- React-based user interface

## Technology Stack

**Frontend**
- React 18
- React Router DOM
- Axios
- Chart.js
- React Chart.js 2

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

## Project Structure

```text
finance-tracker/
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
└── server/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yashaswini-gowda908/finance-tracker.git
cd finance-tracker
```

### 2. Configure the backend

```bash
cd server
npm install
```

Configure the required environment variables before starting the server. Do not commit secrets or credentials.

Start the backend:

```bash
npm start
```

### 3. Configure the frontend

Open another terminal:

```bash
cd finance-tracker/client
npm install
npm start
```

The React development server will start, and the application will be available at:

`http://localhost:3000`

# Backend API

The backend includes routes for:

- User authentication
- Transaction management

API route definitions are available in the `server/routes/` directory.

 # Future Improvements

- Add automated testing for frontend and backend
- Improve financial analytics and reporting
- Add deployment and CI/CD workflows
- Enhance application security and validation

  # Author

 Yashaswini Gowda L

Information Science and Engineering Student

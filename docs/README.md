# Quick-Cart

Welcome to the Quick-Cart project! This repository contains the code for a multivendor e-commerce platform with separate applications for customers, vendors, and administrators. The system is designed to facilitate a seamless shopping experience across multiple platforms and manage interactions between customers, vendors, and the admin team efficiently.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Quick-Cart is an e-commerce platform that allows customers to browse products, manage their cart, and make purchases. Vendors can manage their products and view orders, while administrators have access to a dashboard for overall system management.

### Applications

1. **Customer App**: A mobile application developed with React Native for customers to interact with the platform.
2. **Vendor Panel**: A web application developed with React for vendors to manage their products and orders.
3. **Admin Panel**: A web application developed with React for administrators to oversee the system.
4. **Backend API**: A server built with Node.js and Express that handles requests from the frontend applications and communicates with the MongoDB database.

## Technologies Used

- **Frontend**:
  - React Native (Customer App)
  - React (Vendor Panel, Admin Panel)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - Prisma
- **Real-time Communication**:
  - Socket.IO

## Installation

To get started with Quick-Cart, follow the installation instructions for each component:

### Frontend (Customer App)

1. Clone the repository:
   ```bash
   git clone https://github.com/cruso003/Quick-Cart
   cd customer-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Vendor Panel

1. Clone the repository:
   ```bash
   git clone https://github.com/cruso003/Quick-Cart
   cd vendor-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Admin Panel

1. Clone the repository:
   ```bash
   git clone https://github.com/cruso003/Quick-Cart
   cd admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend API

1. Clone the repository:
   ```bash
   git clone https://github.com/cruso003/Quick-Cart
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables. Create a `.env` file based on `.env.example`.

4. Start the server:
   ```bash
   npm start
   ```

## Usage

### Frontend

- **Customer App**: Use the mobile app to browse products, add items to your cart, and complete purchases.
- **Vendor Panel**: Manage your products, view and process orders, and communicate with customers.
- **Admin Panel**: Oversee the platform, manage users, and perform administrative tasks.

### Backend API

- **Endpoints**: Refer to the API documentation for details on available endpoints and usage.

## API Documentation

For detailed API documentation, including endpoints, request parameters, and response formats, refer to the [OpenAPI Documentation](./docs/api/openapi.yaml).

## Contributing

We welcome contributions to the Quick-Cart project! Please follow these guidelines:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Create a pull request.

For detailed contribution guidelines, please refer to the [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./docs/LICENSE) file for details.

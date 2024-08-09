# Architecture Overview

## 1. Introduction

The architecture of the multivendor e-commerce app, "Quick-Cart," is designed to support a seamless shopping experience across multiple platforms (customer, vendor, and admin). This document outlines the architecture of the system, including the backend, frontend, and interactions between components.

## 2. System Components

### 2.1. Frontend

- **Customer App**: Developed with React Native, providing a mobile experience for users to browse products, manage their cart, and complete purchases.
- **Vendor Panel**: Developed with React, allowing vendors to manage their products, view orders, and interact with customers.
- **Admin Panel**: Developed with React, used for managing the overall system, monitoring activity, and handling administrative tasks.

### 2.2. Backend

- **API Server**: Built with Node.js and Express, providing RESTful APIs for interaction between the frontend and database.
- **Database**: MongoDB is used as the database for storing product data, user information, orders, messages, and pickup station details.
- **ORM**: Prisma is used for database interactions, providing a type-safe way to interact with MongoDB.

### 2.3. Real-time Communication

- **Socket.IO**: Used for real-time communication, enabling live chat features between customers and vendors.

## 3. Architecture Diagram

[FlowChart](./flowchart.png)
[CloudArchitecture](./cloudArchitecture.png)
[databaseSchema](./databaseSchema.png)

## 4. Detailed Component Architecture

### 4.1. Frontend Architecture

#### Customer App

- **Screens**: Includes screens for product listing, product details, cart, checkout, and user profile.
- **State Management**: Uses React Native's state management with Redux or Context API.
- **Navigation**: Uses React Navigation for handling navigation and deep linking.

#### Vendor Panel

- **Features**: Product management, order management, and messaging with customers.
- **State Management**: Uses React's state management with Redux or Context API.

#### Admin Panel

- **Features**: User management, order management, system monitoring, and analytics.
- **State Management**: Uses React's state management with Redux or Context API.

### 4.2. Backend Architecture

#### API Server

- **Routes**: 
  - `/products`: Endpoints for product management (CRUD operations).
  - `/orders`: Endpoints for order management.
  - `/messages`: Endpoints for messaging between customers and vendors.
  - `/pickup-stations`: Endpoints for managing pickup stations.
- **Controllers**: Handles business logic for different routes.
- **Middleware**: Includes authentication, authorization, and logging middleware.
- **Error Handling**: Centralized error handling for managing API errors.

#### Database

- **Schema**: 
  - **User**: Stores user information (profile details, authentication credentials).
  - **Product**: Stores product details (name, description, price, vendor information).
  - **Order**: Stores order details (items, customer information, order status).
  - **Message**: Stores message threads between users.
  - **PickupStation**: Stores details about pickup stations.

### 4.3. Real-time Communication

- **Socket.IO Integration**: 
  - **Events**: Handles events such as `newMessage` to notify users of incoming messages.
  - **Namespaces/Rooms**: Uses namespaces or rooms to handle communication between specific users.

## 5. Data Flow

### 5.1. User Registration and Authentication

1. **Frontend**: User registers or logs in via the app.
2. **Backend**: Receives registration or login request, verifies credentials, and issues a JWT.
3. **Frontend**: Stores JWT and uses it for authenticated requests.

### 5.2. Product Management

1. **Vendor**: Adds or updates product details via the vendor panel.
2. **Backend**: Processes the request, updates the database, and returns the response.
3. **Customer App**: Retrieves product data for display.

### 5.3. Order Processing

1. **Customer**: Places an order via the customer app.
2. **Backend**: Processes the order, updates the database, and sends a notification to the vendor.
3. **Vendor**: Receives order notification and processes it.

### 5.4. Messaging

1. **Customer/Vendor**: Sends a message via the app.
2. **Backend**: Creates or updates the message thread, broadcasts the message to both sender and receiver.
3. **Frontend**: Updates the chat interface in real-time.

### 5.5. Pickup Stations

1. **Admin/Vendor**: Creates or updates pickup station details via the admin panel.
2. **Backend**: Updates the database with the new or updated pickup station information.
3. **Customer**: Retrieves pickup station data when selecting a pickup location.

## 6. Security Considerations

- **Authentication**: JWT is used for securing API endpoints.
- **Authorization**: Role-based access control is implemented to manage user permissions.
- **Data Validation**: All input data is validated on the server side to prevent injection attacks.

## 7. Future Enhancements

- **AI Features**: Implement AI-based product recommendations and customer support.

## 8. Conclusion

The architecture of the "Quick-Cart" app is designed to be scalable, modular, and efficient, ensuring a smooth and responsive experience for customers, vendors, and administrators.

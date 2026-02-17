# AmazPro

**AmazPro** is a full-featured e-commerce backend API built with Node.js, Express, and MongoDB, designed as a clone of popular e-commerce platforms. It includes user authentication, product management, reviews, orders, and cart functionality. The frontend is in progress.

---

## Features

- User registration and login with JWT authentication
- Role-based access control: **Admin, Vendor, Customer**
- CRUD operations for products, including vendor approval workflow
- Review system for products
- Cart management for users
- Order management with status updates and cancellation
- API documentation via Swagger

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JWT  
- **API Documentation:** Swagger (OpenAPI 3.0)  
- **Other Dependencies:** bcrypt, cors, dotenv  

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd amazpro

npm install

PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRE=30d

npm run dev  # if using nodemon
# or
node server.js

http://localhost:3000

```

# API Routes Documentation

## Users

| Method | Endpoint                     | Description                  | Auth |
|--------|------------------------------|------------------------------|------|
| POST   | /api/users/register          | Register a new user          | No   |
| POST   | /api/users/login             | Login                        | No   |
| GET    | /api/users/profile           | Get user profile             | Yes  |
| PUT    | /api/users/profile           | Update profile               | Yes  |
| PUT    | /api/users/vendor-profile    | Complete vendor profile      | Yes  |

---

## Products

| Method | Endpoint                         | Description                 | Auth          |
|--------|----------------------------------|-----------------------------|--------------|
| GET    | /api/products                    | Get all products            | No           |
| GET    | /api/products/vendor             | Get vendor's products       | Vendor       |
| GET    | /api/products/:id                | Get single product          | No           |
| POST   | /api/products                    | Create product              | Vendor       |
| PUT    | /api/products/:id                | Update product              | Vendor       |
| DELETE | /api/products/:id                | Delete product              | Admin/Vendor |
| PUT    | /api/products/approve/:id        | Approve product             | Admin        |

---

## Reviews

| Method | Endpoint                     | Description              | Auth |
|--------|------------------------------|--------------------------|------|
| POST   | /api/reviews                 | Create review            | Yes  |
| GET    | /api/reviews/:productId      | Get product reviews      | No   |
| PUT    | /api/reviews/:id             | Update review            | Yes  |
| DELETE | /api/reviews/:id             | Delete review            | Yes  |

---

## Orders

| Method | Endpoint                        | Description                | Auth  |
|--------|---------------------------------|----------------------------|-------|
| POST   | /api/orders                     | Create order               | Yes   |
| GET    | /api/orders/my-orders           | Get user orders            | Yes   |
| GET    | /api/orders/:id                 | Get single order           | Yes   |
| GET    | /api/orders/allorders           | Get all orders             | Admin |
| PUT    | /api/orders/status/:id          | Update order status        | Admin |
| PUT    | /api/orders/cancel/:id          | Cancel order               | Yes   |
| PUT    | /api/orders/vendor/:id          | Update order status        | Vendor|

---

## Cart

| Method | Endpoint                 | Description              | Auth |
|--------|--------------------------|--------------------------|------|
| GET    | /api/cart                | Get user's cart          | Yes  |
| POST   | /api/cart                | Add item to cart         | Yes  |
| PUT    | /api/cart                | Update cart item         | Yes  |
| DELETE | /api/cart/:productId     | Remove item from cart    | Yes  |
| DELETE | /api/cart                | Clear cart               | Yes  |

# 🛒 AmazPro – MERN E-Commerce Platform

A full-stack e-commerce platform built using the MERN stack (**MongoDB, Express.js, React.js, Node.js**).

AmazPro allows customers to manage carts and liked items, place orders, while vendors and admins can manage products and orders through role-based dashboards.

---

# 🚀 Overview

AmazPro provides:

- Secure JWT-based authentication
- Role-based access control
- Product management for vendors
- Cart & liked products functionality
- Order management system
- Vendor and admin dashboards
- Protected frontend routes
- Swagger API documentation

The project follows a scalable layered architecture with controllers, services, middleware, routes, and models.

---

# 🧱 Project Structure

## Backend Structure

```bash
backend
│
├── src
│   ├── config              # MongoDB configuration
│   ├── controllers         # Request handling logic
│   ├── middleware          # Authentication & authorization
│   ├── models              # MongoDB schemas
│   ├── routes              # API routes
│   ├── services            # Business logic layer
│
├── app.js
└── package.json
```

---

## Frontend Structure

```bash
frontend
│
├── public
│
├── src
│   ├── api                 # Axios configuration
│   ├── components          # Reusable components
│   ├── context             # Authentication context
│   ├── layouts             # Layout wrappers
│   ├── pages               # Application pages
│   ├── styles              # CSS files
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

# 🔐 Authentication & Authorization

## 🔒 Authentication Features

- JWT-based authentication
- Secure password hashing using BCrypt
- Login & Registration system
- Protected backend APIs
- Role-based authorization
- Persistent user sessions

---

## 👥 User Roles

### Customer

- Add products to cart
- Like products
- Place orders
- Manage profile

### Vendor

- Add products
- Update products
- Manage product stock
- View vendor orders
- Update order status

### Admin

- Approve products
- View all users
- Manage all orders
- Delete users/products

---

# ✨ Features

## 👤 User Management

- User registration
- User login
- Profile management
- Vendor profile completion
- Admin-controlled user management
- Role-based authorization

---

## 🛍️ Product Management

- Create products
- Update products
- Delete products
- Approve products by admin
- Vendor-specific product handling
- Product stock management
- Product details page
- Products become visible to users only after admin approval

---

## 👥 User Roles

### Customer

- Add approved products to cart
- Like approved products
- Place orders
- Manage profile

### Vendor

- Add products
- Update products
- Manage stock
- View vendor orders
- Update order status

### Admin

- Approve vendor products
- View all users
- Manage all orders
- Delete users/products

---

## 🛒 Cart Management

- Add products to cart
- Update cart quantity
- Remove items from cart
- Clear cart
- Auto cart creation

---

## ❤️ Liked Products

- Add liked products
- Remove liked products
- View liked items
- Clear liked products

---

## 📦 Order Management

- Create orders
- Cancel orders
- Update order status
- Vendor order management
- Admin order management
- Customer order history
- Automatic stock updates

---

## 🖥️ Frontend Pages

- Home Page
- Login Page
- Register Page
- Product Details Page
- Cart Page
- Checkout Page
- Orders Page
- Liked Products Page
- Customer Dashboard
- Vendor Dashboard
- Admin Dashboard
- Profile Page
- Add Product Page

---

# ⚙️ Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Context API
- CSS

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- BCrypt
- Swagger
- dotenv

---

# 📡 API Endpoints

## 🔑 Authentication

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/users/register` | Register user |
| POST | `/api/users/login` | Login user |

---

## 👤 Users

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/vendor-profile` | Complete vendor profile |
| GET | `/api/users/all` | Get all users (Admin) |
| DELETE | `/api/users/:id` | Delete user |

---

## 🛍️ Products

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| PUT | `/api/products/approve/:id` | Approve product |
| GET | `/api/products/vendor` | Vendor products |

---

## 🛒 Cart

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart` | Update cart item |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

---

## ❤️ Liked Products

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/liked` | Get liked items |
| POST | `/api/liked/add` | Add liked item |
| DELETE | `/api/liked/remove/:productId` | Remove liked item |
| DELETE | `/api/liked/clear` | Clear liked items |

---

## 📦 Orders

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my-orders` | Customer orders |
| GET | `/api/orders/allorders` | All orders (Admin) |
| GET | `/api/orders/vendor-orders` | Vendor orders |
| GET | `/api/orders/:id` | Get order details |
| PUT | `/api/orders/status/:id` | Update order status |
| PUT | `/api/orders/cancel/:id` | Cancel order |
| PUT | `/api/orders/vendor/:id` | Vendor order update |

---

# 🔐 Middleware

## Authentication Middleware

The project uses protected middleware for:

- JWT token validation
- User authentication
- Route protection

---

## Authorization Middleware

Role-based access control for:

- Admin routes
- Vendor routes
- Customer routes

---

# 📘 Swagger Documentation

Swagger API documentation is enabled.

## Access Swagger UI

```bash
http://localhost:3000/api-docs
```

---

# 📈 Key Functionalities

## Role-Based Dashboards

Different dashboards are available for:

- Customers
- Vendors
- Admins

---

## Vendor Product Management

Vendors can:

- Add products
- Manage stock
- View orders
- Update order status

---

## Order & Stock Synchronization

When orders are placed:

- Product stock decreases
- Sold count increases

When orders are cancelled:

- Stock is restored
- Sold count is reduced

---

## Protected Frontend Routing

Routes are protected based on user roles using:

- ProtectedRoute component
- JWT authentication
- Role validation

---

# ▶️ How to Run

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file inside backend:

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 5️⃣ Run Backend

```bash
npm run dev
```

---

## 6️⃣ Run Frontend

```bash
npm run dev
```

---

# 🛠️ Future Enhancements

- Payment gateway integration
- Product search & filters
- Real-time order tracking
- Email notifications
- Wishlist sharing
- Seller analytics dashboard
- Dark mode UI
- Docker deployment
- CI/CD integration

---

# 📝 Notes

- Built using MERN stack architecture
- Layered backend architecture
- RESTful APIs
- JWT-secured authentication
- Role-based authorization
- Responsive frontend design
- Swagger-documented APIs
- Designed for scalability and maintainability

---

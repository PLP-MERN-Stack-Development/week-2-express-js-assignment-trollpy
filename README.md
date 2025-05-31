# 🛍️ Product Management API with Express.js

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)
![RESTful](https://img.shields.io/badge/RESTful-API-orange)

A complete RESTful API for product management built with Express.js, featuring CRUD operations, middleware, authentication, and error handling.

## 🌟 Features

- **Full CRUD Operations** - Create, Read, Update, and Delete products
- **Middleware Support** - Request logging, authentication, and validation
- **Comprehensive Error Handling** - Custom error types and global error handler
- **In-Memory Database** - Sample data with UUID generation
- **RESTful Design** - Proper HTTP methods and status codes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/product-api.git
cd product-api

    Install dependencies

bash

npm install

    Start the server

bash

npm start

The API will be available at http://localhost:3000
📚 API Documentation
Base URL

http://localhost:3000/api
Endpoints
Method	Endpoint	Description	Authentication
GET	/products	Get all products	No
GET	/products/:id	Get a single product	No
POST	/products	Create a new product	Yes
PUT	/products/:id	Update an existing product	Yes
DELETE	/products/:id	Delete a product	Yes
Authentication

Protected routes require an Authorization header:

Authorization: Bearer your-token-here

Note: For demonstration purposes, any token starting with "Bearer " will be accepted
📝 Example Requests
Get all products
bash

curl http://localhost:3000/api/products

Create a product
bash

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Noise cancelling wireless headphones",
    "price": 199.99,
    "category": "electronics",
    "inStock": true
  }'

Update a product
bash

curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "price": 1099.99,
    "inStock": false
  }'

🛠️ Project Structure

    Middleware

        requestLogger: Logs all incoming requests

        authenticate: Validates authorization tokens

        errorHandler: Global error handling middleware

    Validation

        Required fields check

        Price validation

        Data type checking

    Error Handling

        400 Bad Request (Validation errors)

        401 Unauthorized

        404 Not Found

        500 Internal Server Error

🧪 Testing

The API can be tested using:

    Postman

    Insomnia

    cURL commands

    Automated testing frameworks (Jest, Mocha, etc.)
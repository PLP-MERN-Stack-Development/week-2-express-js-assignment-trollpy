// server.js - Starter Express server for Week 2 assignment
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Custom middleware for request logging
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Custom middleware for basic authentication (token-based)
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  
  // For demo purposes, accept any token that starts with 'Bearer '
  // In production, you'd validate against a real authentication system
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Please provide a valid authorization token' 
    });
  }
  
  next();
};

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Handle different types of errors
  if (err.type === 'validation') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }
  
  // Default to 500 server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on our end'
  });
};

// Apply middleware
app.use(requestLogger);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      error: 'Product not found',
      message: `Product with id ${productId} does not exist`
    });
  }
  
  res.json(product);
});

// POST /api/products - Create a new product (requires authentication)
app.post('/api/products', authenticate, (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    
    // Validation
    if (!name || !description || price === undefined || !category) {
      const error = new Error('Missing required fields: name, description, price, and category are required');
      error.type = 'validation';
      throw error;
    }
    
    if (typeof price !== 'number' || price < 0) {
      const error = new Error('Price must be a positive number');
      error.type = 'validation';
      throw error;
    }
    
    // Create new product
    const newProduct = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim().toLowerCase(),
      inStock: inStock !== undefined ? Boolean(inStock) : true
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update a product (requires authentication)
app.put('/api/products/:id', authenticate, (req, res) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
        message: `Product with id ${productId} does not exist`
      });
    }
    
    const { name, description, price, category, inStock } = req.body;
    
    // Validation for price if provided
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      const error = new Error('Price must be a positive number');
      error.type = 'validation';
      throw error;
    }
    
    // Update product with provided fields
    const updatedProduct = {
      ...products[productIndex],
      ...(name && { name: name.trim() }),
      ...(description && { description: description.trim() }),
      ...(price !== undefined && { price: Number(price) }),
      ...(category && { category: category.trim().toLowerCase() }),
      ...(inStock !== undefined && { inStock: Boolean(inStock) })
    };
    
    products[productIndex] = updatedProduct;
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete a product (requires authentication)
app.delete('/api/products/:id', authenticate, (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Product not found',
      message: `Product with id ${productId} does not exist`
    });
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// Apply error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
// tests/cart.test.js
const request = require('supertest');
const express = require('express');
const cartRoutes = require('../src/routes/cartRoutes');
const cartRepository = require('../src/models/orm/cartRepository');
const productModel = require('../src/models/productModel');
const validateRequest = require('../src/middleware/validationMiddleware');

// Mock dependencies
jest.mock('../src/models/orm/cartRepository');
jest.mock('../src/models/productModel');

// Create express app for testing
const app = express();
app.use(express.json());

// Middleware to mock authenticated user
app.use((req, res, next) => {
  req.userId = 1; // Mock user ID for testing
  next();
});

app.use('/api/cart', cartRoutes);

describe('Shopping Cart API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cart', () => {
    it('should get cart items and summary', async () => {
      const mockCartItems = [
        { id: 1, user_id: 1, product_id: 1, quantity: 2, name: 'Test Product', price: 10.99 }
      ];
      
      const mockSummary = {
        total_items: 1,
        total_quantity: 2,
        total_price: 21.98
      };
      
      cartRepository.getCartItems.mockResolvedValue(mockCartItems);
      cartRepository.getCartSummary.mockResolvedValue(mockSummary);
      
      const response = await request(app).get('/api/cart');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items', mockCartItems);
      expect(response.body).toHaveProperty('summary', mockSummary);
      expect(cartRepository.getCartItems).toHaveBeenCalledWith(1);
      expect(cartRepository.getCartSummary).toHaveBeenCalledWith(1);
    });
  });
  
  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 10.99,
        is_available: true,
        stock_count: 10
      };
      
      const mockCartItem = {
        id: 1,
        user_id: 1,
        product_id: 1,
        quantity: 2
      };
      
      productModel.getProductById.mockResolvedValue(mockProduct);
      cartRepository.addCartItem.mockResolvedValue(mockCartItem);
      
      const response = await request(app)
        .post('/api/cart')
        .send({ product_id: 1, quantity: 2 });
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCartItem);
      expect(productModel.getProductById).toHaveBeenCalledWith(1);
      expect(cartRepository.addCartItem).toHaveBeenCalledWith(1, 1, 2);
    });
    
    it('should validate quantity', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({ product_id: 1, quantity: 0 });
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(cartRepository.addCartItem).not.toHaveBeenCalled();
    });
    
    it('should check product availability', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 10.99,
        is_available: false,
        stock_count: 10
      };
      
      productModel.getProductById.mockResolvedValue(mockProduct);
      
      const response = await request(app)
        .post('/api/cart')
        .send({ product_id: 1, quantity: 2 });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product is not available');
      expect(cartRepository.addCartItem).not.toHaveBeenCalled();
    });
    
    it('should check product stock', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 10.99,
        is_available: true,
        stock_count: 1
      };
      
      productModel.getProductById.mockResolvedValue(mockProduct);
      
      const response = await request(app)
        .post('/api/cart')
        .send({ product_id: 1, quantity: 2 });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Insufficient stock');
      expect(response.body.available).toBe(1);
      expect(cartRepository.addCartItem).not.toHaveBeenCalled();
    });
  });
  
  describe('PATCH /api/cart/:productId', () => {
    it('should update cart item quantity', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 10.99,
        is_available: true,
        stock_count: 10
      };
      
      const mockCartItem = {
        id: 1,
        user_id: 1,
        product_id: 1,
        quantity: 5
      };
      
      productModel.getProductById.mockResolvedValue(mockProduct);
      cartRepository.updateCartItem.mockResolvedValue(mockCartItem);
      
      const response = await request(app)
        .patch('/api/cart/1')
        .send({ quantity: 5 });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCartItem);
      expect(productModel.getProductById).toHaveBeenCalledWith(1);
      expect(cartRepository.updateCartItem).toHaveBeenCalledWith(1, 1, 5);
    });
  });
  
  describe('DELETE /api/cart/:productId', () => {
    it('should remove item from cart', async () => {
      cartRepository.removeCartItem.mockResolvedValue(true);
      
      const response = await request(app).delete('/api/cart/1');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('removed from cart');
      expect(cartRepository.removeCartItem).toHaveBeenCalledWith(1, 1);
    });
    
    it('should return 404 if item not found', async () => {
      cartRepository.removeCartItem.mockResolvedValue(false);
      
      const response = await request(app).delete('/api/cart/999');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });
  });
  
  describe('DELETE /api/cart', () => {
    it('should clear cart', async () => {
      cartRepository.clearCart.mockResolvedValue(true);
      
      const response = await request(app).delete('/api/cart');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('cleared');
      expect(cartRepository.clearCart).toHaveBeenCalledWith(1);
    });
  });
});
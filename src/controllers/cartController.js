const cartRepository = require('../models/orm/cartRepository');
const productModel = require('../models/productModel');

const getCart = async (req, res, next) => {
  try {
    const userId = req.userId || req.params.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const cartItems = await cartRepository.getCartItems(userId);
    const cartSummary = await cartRepository.getCartSummary(userId);
    
    res.json({
      items: cartItems,
      summary: cartSummary
    });
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.userId || req.body.user_id; // Assume authentication middleware sets userId
    const { product_id, quantity } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const product = await productModel.getProductById(product_id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (!product.is_available) {
      return res.status(400).json({ message: "Product is not available" });
    }
    
    if (product.stock_count < quantity) {
      return res.status(400).json({ 
        message: "Insufficient stock", 
        available: product.stock_count 
      });
    }
    
    const cartItem = await cartRepository.addCartItem(userId, product_id, quantity);
    
    res.status(201).json(cartItem);
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.userId || req.body.user_id;
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const product = await productModel.getProductById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.stock_count < quantity) {
      return res.status(400).json({ 
        message: "Insufficient stock", 
        available: product.stock_count 
      });
    }
    
    const updatedCartItem = await cartRepository.updateCartItem(userId, productId, quantity);
    
    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.json(updatedCartItem);
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userId || req.body.user_id;
    const productId = parseInt(req.params.productId, 10);
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const deleted = await cartRepository.removeCartItem(userId, productId);
    
    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.status(200).json({
      message: "Item removed from cart successfully",
      product_id: productId
    });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.userId || req.body.user_id;
    
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const deleted = await cartRepository.clearCart(userId);
    
    res.status(200).json({
      message: "Cart cleared successfully",
      success: deleted
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};

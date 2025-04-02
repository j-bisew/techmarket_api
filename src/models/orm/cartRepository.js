const { sequelize } = require('../../config/sequelize');
const CartItem = require('./cartItem');
const { QueryTypes } = require('sequelize');

const getCartItems = async (userId) => {
  const cartItems = await sequelize.query(`
    SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, ci.added_at,
           p.name, p.price, p.image_url, p.stock_count, (p.price * ci.quantity) as total_price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
    ORDER BY ci.added_at DESC
  `, {
    bind: [userId],
    type: QueryTypes.SELECT
  });

  return cartItems;
};

const getCartItem = async (userId, productId) => {
  return await CartItem.findOne({
    where: {
      user_id: userId,
      product_id: productId
    }
  });
};

const addCartItem = async (userId, productId, quantity) => {
  try {
    const existingItem = await getCartItem(userId, productId);
    
    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
      await existingItem.save();
      return existingItem;
    } else {
      // Create new cart item
      return await CartItem.create({
        user_id: userId,
        product_id: productId,
        quantity,
        added_at: new Date()
      });
    }
  } catch (error) {
    throw error;
  }
};

const updateCartItem = async (userId, productId, quantity) => {
  try {
    const cartItem = await getCartItem(userId, productId);
    
    if (!cartItem) {
      return null;
    }
    
    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem;
  } catch (error) {
    throw error;
  }
};

const removeCartItem = async (userId, productId) => {
  try {
    const cartItem = await getCartItem(userId, productId);
    
    if (!cartItem) {
      return false;
    }
    
    await cartItem.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    const result = await CartItem.destroy({
      where: {
        user_id: userId
      }
    });
    
    return result > 0;
  } catch (error) {
    throw error;
  }
};

const getCartSummary = async (userId) => {
  const summary = await sequelize.query(`
    SELECT 
      COUNT(ci.id) as total_items,
      SUM(ci.quantity) as total_quantity,
      SUM(p.price * ci.quantity) as total_price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
  `, {
    bind: [userId],
    type: QueryTypes.SELECT
  });

  return summary[0];
};

module.exports = {
  getCartItems,
  getCartItem,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartSummary
};
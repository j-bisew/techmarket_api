const { sequelize, testConnection } = require('./sequelize');
const CartItem = require('../models/orm/cartItem');

const initOrm = async () => {
  try {
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {
      console.error('Failed to connect to the database. ORM models will not be synced.');
      return false;
    }
    
    await CartItem.syncModel();
    
    console.log('ORM initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing ORM:', error);
    return false;
  }
};

module.exports = initOrm;
const db = require("../config/db");

const getAllReviews = async () => {
    const { rows } = await db.query(`
        SELECT r.*, p.name as product_name, u.username as user_name
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
    `);
    return rows;
};

const getReviewById = async (id) => {
    const { rows } = await db.query(`
        SELECT r.*, p.name as product_name, u.username as user_name
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        JOIN users u ON r.user_id = u.id
        WHERE r.id = $1
    `, [id]);
    return rows[0];
};

const getReviewsByProductId = async (productId) => {
    const { rows } = await db.query(`
        SELECT r.*, u.username as user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC
    `, [productId]);
    return rows;
};

const getReviewsByUserId = async (userId) => {
    const { rows } = await db.query(`
        SELECT r.*, p.name as product_name
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    `, [userId]);
    return rows;
};

const addReview = async (review) => {
    const { product_id, user_id, rating, comment } = review;
    
    const { rows: existingReviews } = await db.query(
        "SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2",
        [product_id, user_id]
    );
    
    if (existingReviews.length > 0) {
        throw new Error("User has already reviewed this product");
    }
    
    const { rows } = await db.query(
        `INSERT INTO reviews (product_id, user_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [product_id, user_id, rating, comment]
    );
      
    return rows[0];
};

const updateReview = async (id, updates) => {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE reviews SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    
    const { rows } = await db.query(query, [...values, id]);
   
    return rows[0];
};

const deleteReview = async (id) => {
    const { rows } = await db.query("SELECT product_id FROM reviews WHERE id = $1", [id]);
    
    if (rows.length === 0) {
        return false;
    }
        
    const { rowCount } = await db.query("DELETE FROM reviews WHERE id = $1", [id]);
    return rowCount > 0;
};


module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByProductId,
    getReviewsByUserId,
    addReview,
    updateReview,
    deleteReview,
};
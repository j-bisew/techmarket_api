const db = require("../config/db");
const bcrypt = require("bcryptjs");

const getAllUsers = async () => {
    const { rows } = await db.query(
        "SELECT id, username, email, first_name, last_name, created_at FROM users ORDER BY username"
    );
    return rows;
};

const getUserById = async (id) => {
    const { rows } = await db.query(
        "SELECT id, username, email, first_name, last_name, created_at FROM users WHERE id = $1",
        [id]
    );
    return rows[0];
};

const getUserByUsername = async (username) => {
    const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
};

const getUserWithReviews = async (id) => {
    const { rows: userRows } = await db.query(
        "SELECT id, username, email, first_name, last_name, created_at FROM users WHERE id = $1",
        [id]
    );
    
    if (userRows.length === 0) {
        return null;
    }

    const user = userRows[0];
    
    const { rows: reviewsRows } = await db.query(
        `SELECT r.*, p.name as product_name 
         FROM reviews r 
         JOIN products p ON r.product_id = p.id 
         WHERE r.user_id = $1 
         ORDER BY r.created_at DESC`,
        [id]
    );
    
    user.reviews = reviewsRows;
    
    return user;
};

const addUser = async (userData) => {
    const { username, email, password, first_name, last_name } = userData;
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const { rows } = await db.query(
        `INSERT INTO users (username, email, password_hash, first_name, last_name) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, username, email, first_name, last_name, created_at`,
        [username, email, password_hash, first_name, last_name]
    );
    
    return rows[0];
};

const updateUser = async (id, updates) => {
    if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password_hash = await bcrypt.hash(updates.password, salt);
        delete updates.password;
    }
    
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING id, username, email, first_name, last_name, created_at`;
    
    const { rows } = await db.query(query, [...values, id]);
    return rows[0];
};

const deleteUser = async (id) => {
    const { rowCount } = await db.query("DELETE FROM users WHERE id = $1", [id]);
    return rowCount > 0;
};

const validatePassword = async (user, password) => {
    if (!user || !user.password_hash) {
        return false;
    }
    
    return await bcrypt.compare(password, user.password_hash);
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getUserWithReviews,
    addUser,
    updateUser,
    deleteUser,
    validatePassword
};
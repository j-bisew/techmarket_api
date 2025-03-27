const db = require("../config/db");

const getAllCategories = async () => {
    const { rows } = await db.query("SELECT * FROM categories ORDER BY name");
    return rows;
};

const getCategoryById = async (id) => {
    const { rows } = await db.query("SELECT * FROM categories WHERE id = $1", [id]);
    return rows[0];
};

const getCategoryWithProducts = async (id) => {
    const { rows: categoryRows } = await db.query("SELECT * FROM categories WHERE id = $1", [id]);
    
    if (categoryRows.length === 0) {
        return null;
    }

    const category = categoryRows[0];
    
    const { rows: productsRows } = await db.query(
        "SELECT * FROM products WHERE category_id = $1 ORDER BY name",
        [id]
    );
    
    category.products = productsRows;
    
    return category;
};

const addCategory = async (category) => {
    const { name, description } = category;
    
    const { rows } = await db.query(
        "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    );
    
    return rows[0];
};

const updateCategory = async (id, updates) => {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE categories SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    
    const { rows } = await db.query(query, [...values, id]);
    return rows[0];
};

const deleteCategory = async (id) => {
    const { rowCount } = await db.query("DELETE FROM categories WHERE id = $1", [id]);
    return rowCount > 0;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryWithProducts,
    addCategory,
    updateCategory,
    deleteCategory
};
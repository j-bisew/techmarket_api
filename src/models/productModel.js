const db = require("../config/db");

const getAllProducts = async ({ sort, available, category_id } = {}) => {
    let query = `
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
    `;
    
    let conditions = [];
    let values = [];
    let paramCount = 1;

    if (available !== undefined) {
        conditions.push(`p.is_available = $${paramCount}`);
        values.push(available);
        paramCount++;
    }

    if (category_id !== undefined) {
        conditions.push(`p.category_id = $${paramCount}`);
        values.push(category_id);
        paramCount++;
    }

    if (conditions.length) {
        query += " WHERE " + conditions.join(" AND ");
    }

    if (sort === "price") {
        query += " ORDER BY p.price";
    } else if (sort === "name") {
        query += " ORDER BY p.name";
    } else {
        query += " ORDER BY p.id";
    }

    const { rows } = await db.query(query, values);
    return rows;
};

const getProductById = async (id) => {
    const { rows } = await db.query(`
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
    `, [id]);
    
    return rows[0];
};

const getProductWithReviews = async (id) => {
    // Pobieramy produkt z informacją o kategorii
    const { rows: productRows } = await db.query(`
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
    `, [id]);
    
    if (productRows.length === 0) {
        return null;
    }

    const product = productRows[0];
    
    // Pobieramy recenzje dla produktu
    const { rows: reviewRows } = await db.query(`
        SELECT r.*, u.username as reviewer_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC
    `, [id]);
    
    product.reviews = reviewRows;
    
    // Obliczamy średnią ocenę
    if (reviewRows.length > 0) {
        product.avg_rating = reviewRows.reduce((sum, review) => sum + review.rating, 0) / reviewRows.length;
    } else {
        product.avg_rating = 0;
    }
    
    return product;
};

const addProduct = async (product) => {
    const { name, category_id, description, price, stock_count, brand, image_url, is_available } = product;
    
    const { rows } = await db.query(
        `INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url, is_available) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [name, category_id, description, price, stock_count, brand, image_url, is_available !== undefined ? is_available : true]
    );
    
    return rows[0];
};

const updateProduct = async (id, updates) => {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE products SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    
    const { rows } = await db.query(query, [...values, id]);
    return rows[0];
};

const deleteProduct = async (id) => {
    // Usuwamy najpierw recenzje produktu (może być obsłużone przez ON DELETE CASCADE)
    await db.query("DELETE FROM reviews WHERE product_id = $1", [id]);
    
    // Usuwamy produkt
    const { rowCount } = await db.query("DELETE FROM products WHERE id = $1", [id]);
    return rowCount > 0;
};

const resetProductsSequence = async () => {
    const { rows } = await db.query("SELECT COALESCE(MAX(id), 0) as max_id FROM products");
    const maxId = rows[0].max_id;
    
    await db.query(`ALTER SEQUENCE products_id_seq RESTART WITH ${maxId + 1}`);
    return maxId + 1;
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductWithReviews,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsSequence
};
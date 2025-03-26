const db = require("../config/db");

const getAllProducts = async ({ sort, available } = {}) => {
    let query = "SELECT * FROM products";
    let conditions = [];
    let values = [];
    let paramCount = 1;

    if (available !== undefined) {
        conditions.push(`is_available = $${paramCount}`);
        values.push(available);
        paramCount++;
    }

    if (conditions.length) {
        query += " WHERE " + conditions.join(" AND ");
    }

    if (sort === "price") {
        query += " ORDER BY price";
    } else {
        query += " ORDER BY id";
    }

    const { rows } = await db.query(query, values);
    return rows;
};

const getProductById = async (id) => {
    const { rows } = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    return rows[0];
};

const addProduct = async (product) => {
    const { name, category, description, price, stock_count, brand, image_url, is_available } = product;
    
    const { rows } = await db.query(
        "INSERT INTO products (name, category, description, price, stock_count, brand, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [name, category, description, price, stock_count, brand, image_url, is_available !== undefined ? is_available : true]
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
    await db.query("BEGIN");
    
    try {
        const { rowCount } = await db.query("DELETE FROM products WHERE id = $1", [id]);
        
        if (rowCount === 0) {
            await db.query("ROLLBACK");
            return false;
        }
        
        await db.query(`
            WITH rows_to_update AS (
                SELECT id FROM products WHERE id > $1 ORDER BY id
            )
            UPDATE products p
            SET id = p.id - 1
            FROM rows_to_update r
            WHERE p.id = r.id
        `, [id]);
        
        await db.query(`SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 0))`);
        
        await db.query("COMMIT");
        return true;
    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    }
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
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsSequence
};
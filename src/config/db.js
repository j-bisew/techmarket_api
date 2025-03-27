const { Pool } = require("pg");
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const initDbFromSql = async () => {
    try {
        const initScript = fs.readFileSync(path.join(__dirname, 'init.sql')).toString();
        await pool.query(initScript);
        console.log('Database initialized successfully from SQL file.');
    } catch (err) {
        console.error('Error initializing database from SQL file:', err);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end(),
    initDbFromSql
};
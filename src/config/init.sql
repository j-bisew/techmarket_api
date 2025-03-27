CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    stock_count INT NOT NULL,
    brand TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT NOW()
);

DELETE FROM products;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
        ALTER SEQUENCE products_id_seq RESTART WITH 1;
        
        INSERT INTO products (name, category, description, price, stock_count, brand, image_url, is_available)
        VALUES 
        ('Laptop Pro', 'Electronics', 'High-performance laptop for professionals', 1299.99, 50, 'TechBrand', 'laptop.jpg', true),
        ('Smart Watch', 'Electronics', 'Fitness and health tracking smart watch', 199.99, 100, 'FitTech', 'watch.jpg', true),
        ('Ergonomic Chair', 'Furniture', 'Office chair with lumbar support', 249.99, 30, 'ComfortPlus', 'chair.jpg', true);
    END IF;
END $$;
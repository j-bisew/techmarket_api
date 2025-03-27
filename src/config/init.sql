CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    stock_count INT NOT NULL,
    brand TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (product_id, user_id)
);

-- Czyszczenie danych
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;
DELETE FROM reviews;

-- Resetowanie sekwencji
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;

-- Wstawianie przykładowych danych
INSERT INTO categories (name, description)
VALUES 
    ('Electronics', 'Electronic devices and gadgets'),
    ('Furniture', 'Home and office furniture'),
    ('Clothing', 'Apparel and fashion items');

INSERT INTO users (username, email, password_hash, first_name, last_name)
VALUES 
    ('jankowalski', 'jan.kowalski@email.com', '$2a$10$rPiEAgQNIT1TCoKi3Eqq8eVaRYIRlR29tPF/TZSDP9U0HoKYiNHZy', 'Jan', 'Kowalski'),
    ('annanowak', 'anna.nowak@email.com', '$2a$10$rPiEAgQNIT1TCoKi3Eqq8eVaRYIRlR29tPF/TZSDP9U0HoKYiNHZy', 'Anna', 'Nowak'),
    ('pawelwisniewski', 'pawel.wisniewski@email.com', '$2a$10$rPiEAgQNIT1TCoKi3Eqq8eVaRYIRlR29tPF/TZSDP9U0HoKYiNHZy', 'Paweł', 'Wiśniewski');

INSERT INTO products (name, category_id, description, price, stock_count, brand, image_url, is_available)
VALUES 
    ('Laptop Pro', 1, 'High-performance laptop for professionals', 1299.99, 50, 'TechBrand', 'laptop.jpg', true),
    ('Smart Watch', 1, 'Fitness and health tracking smart watch', 199.99, 100, 'FitTech', 'watch.jpg', true),
    ('Ergonomic Chair', 2, 'Office chair with lumbar support', 249.99, 30, 'ComfortPlus', 'chair.jpg', true);

INSERT INTO reviews (product_id, user_id, rating, comment)
VALUES 
    (1, 1, 5, 'Excellent laptop, very fast and reliable.'),
    (1, 2, 4, 'Good performance, but battery life could be better.'),
    (2, 3, 5, 'Great smartwatch, love the fitness tracking features.'),
    (3, 1, 4, 'Comfortable chair, good for long work sessions.');
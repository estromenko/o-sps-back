CREATE TABLE IF NOT EXISTS fleamarket_posts (
    id VARCHAR(255) UNIQUE NOT NULL,
    owner_id VARCHAR(255) NULL REFERENCES users(id),
    text TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    image VARCHAR(255)
);
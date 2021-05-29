CREATE TABLE IF NOT EXISTS fleamarket_post_comments (
    id VARCHAR(255) UNIQUE NOT NULL,
    post_id VARCHAR(255) NOT NULL REFERENCES fleamarket_posts(id),
    owner_id VARCHAR(255) NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    is_anominous BOOLEAN DEFAULT FALSE
);
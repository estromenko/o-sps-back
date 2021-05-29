CREATE TABLE IF NOT EXISTS fleamarket_post_comments (
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    post_id int NOT NULL REFERENCES fleamarket_posts(id),
    owner_id int NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    is_anominous BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS bath_queue (
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    start_time TIMESTAMP NOT NULL
);
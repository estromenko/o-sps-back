CREATE TABLE IF NOT EXISTS bath_queue (
    user_id int NOT NULL REFERENCES users(id),
    start_time TIMESTAMP NOT NULL
);
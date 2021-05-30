
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dorm_id VARCHAR(255) REFERENCES dorms(id),
    room_number int,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    image VARCHAR(255) DEFAULT 'default.jpeg'
);
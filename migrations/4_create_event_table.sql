CREATE TABLE IF NOT EXISTS events (
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    owner_id int NOT NULL REFERENCES users(id),
    speciality VARCHAR(255) NOT NULL
);
-- Your SQL goes here
CREATE TABLE password_entries (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    platform VARCHAR(100) NOT NULL,
    "user" VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (uid) REFERENCES "user"(id) ON DELETE CASCADE
);

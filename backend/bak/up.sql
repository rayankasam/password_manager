-- Your SQL goes here
CREATE TABLE password_entries (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(100) NOT NULL,
    "user" VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    extra_info TEXT
);

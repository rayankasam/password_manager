-- Your SQL goes here
CREATE TABLE extra_info (
    id SERIAL PRIMARY KEY,
    password_entry_id INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    info VARCHAR(255) NOT NULL,
    FOREIGN KEY (password_entry_id) REFERENCES password_entries(id) ON DELETE CASCADE
);

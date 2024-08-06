-- Your SQL goes here
ALTER TABLE users
ALTER COLUMN password_hash SET NOT NULL,
ALTER COLUMN password_salt SET NOT NULL;

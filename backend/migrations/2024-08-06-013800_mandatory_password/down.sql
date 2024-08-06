-- This file should undo anything in `up.sql`
ALTER TABLE users
ALTER COLUMN password_hash DROP NOT NULL,
ALTER COLUMN password_salt DROP NOT NULL;

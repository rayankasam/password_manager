-- This file should undo anything in `up.sql`
ALTER TABLE users
ADD COLUMN password_salt VARCHAR(22) NOT NULL;

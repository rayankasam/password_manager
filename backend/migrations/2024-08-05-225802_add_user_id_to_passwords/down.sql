-- This file should undo anything in `up.sql`
-- Remove the foreign key constraint first
ALTER TABLE password_entries DROP CONSTRAINT fk_user;

-- Remove the new column
ALTER TABLE password_entries DROP COLUMN user_id;

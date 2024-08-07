-- Add the new column allowing NULLs
ALTER TABLE password_entries ADD COLUMN user_id INTEGER;

-- Alter the column to NOT NULL
ALTER TABLE password_entries ALTER COLUMN user_id SET NOT NULL;

-- Set up the foreign key constraint
ALTER TABLE password_entries ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

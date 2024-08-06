-- Add the new column allowing NULLs
ALTER TABLE password_entries ADD COLUMN user_id INTEGER;

-- Ensure the default user exists
INSERT INTO users (username, password_hash) 
VALUES ('default_user', 'default_hash')
ON CONFLICT (username) DO NOTHING;

-- Update existing rows with the default user ID
UPDATE password_entries SET user_id = (SELECT id FROM users WHERE username = 'default_user');

-- Alter the column to NOT NULL
ALTER TABLE password_entries ALTER COLUMN user_id SET NOT NULL;

-- Set up the foreign key constraint
ALTER TABLE password_entries ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

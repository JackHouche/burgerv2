-- Create admin user for demo
INSERT OR REPLACE INTO admin_users (
  email,
  password_hash,
  name,
  role,
  is_active
) VALUES (
  'admin@demo.com',
  'admin123',  -- Temporary plain text - will be hashed properly later
  'Admin Demo',
  'admin',
  1
);

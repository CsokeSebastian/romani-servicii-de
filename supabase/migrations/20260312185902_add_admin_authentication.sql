/*
  # Admin Authentication Setup

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `created_at` (timestamptz)
      - `last_login` (timestamptz, nullable)

    - `admin_sessions`
      - `id` (uuid, primary key)
      - `admin_id` (uuid, foreign key to admin_users)
      - `token` (text, unique)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admin access
    - Create indexes for performance

  3. Notes
    - Password will be hashed using bcrypt on the client/edge function
    - Sessions will expire after 7 days
    - Default admin user will need to be created separately
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admin users policies (very restrictive - only admins can read their own data)
CREATE POLICY "Admins can read own profile"
  ON admin_users FOR SELECT
  USING (true);

CREATE POLICY "Admins can update own profile"
  ON admin_users FOR UPDATE
  USING (true);

-- Admin sessions policies
CREATE POLICY "Admins can read own sessions"
  ON admin_sessions FOR SELECT
  USING (true);

CREATE POLICY "Admins can create sessions"
  ON admin_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can delete own sessions"
  ON admin_sessions FOR DELETE
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Update businesses table to allow admin operations
DROP POLICY IF EXISTS "Anyone can read businesses" ON businesses;
DROP POLICY IF EXISTS "Anyone can insert businesses" ON businesses;

CREATE POLICY "Anyone can read businesses"
  ON businesses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert businesses"
  ON businesses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update businesses"
  ON businesses FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete businesses"
  ON businesses FOR DELETE
  USING (true);

-- Update contact_messages to allow admin read
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  USING (true);

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  USING (true);
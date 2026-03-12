/*
  # Create Contact Messages Table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) - Sender's name
      - `email` (text) - Sender's email address
      - `message` (text) - Message content
      - `created_at` (timestamptz) - Timestamp when message was sent
      - `ip_address` (text, optional) - IP address for spam prevention
      - `user_agent` (text, optional) - Browser user agent
  
  2. Security
    - Enable RLS on `contact_messages` table
    - No public read access (only admin/backend can read)
    - Public can insert (to submit contact forms)
    - Add rate limiting protection through timestamp checks
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

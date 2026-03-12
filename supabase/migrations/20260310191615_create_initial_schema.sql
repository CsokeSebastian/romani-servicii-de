/*
  # Create Servicii Pentru Români Directory Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name in Romanian
      - `slug` (text, unique) - URL-friendly identifier
      - `icon` (text) - Lucide icon name
      - `created_at` (timestamptz)
    
    - `businesses`
      - `id` (uuid, primary key)
      - `name` (text) - Business name
      - `category_id` (uuid, foreign key to categories)
      - `city` (text) - City in Germany
      - `description` (text) - Business description
      - `phone` (text) - Contact phone
      - `email` (text) - Contact email
      - `website` (text) - Business website
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `latitude` (decimal) - For map location
      - `longitude` (decimal) - For map location
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `business_images`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key to businesses)
      - `image_url` (text) - Image URL
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to approved businesses
    - Add policies for business submission
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  city text NOT NULL,
  description text NOT NULL,
  phone text NOT NULL,
  email text,
  website text,
  status text DEFAULT 'pending' NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_images table
CREATE TABLE IF NOT EXISTS business_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Businesses policies
CREATE POLICY "Anyone can view approved businesses"
  ON businesses FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Anyone can submit a business"
  ON businesses FOR INSERT
  TO public
  WITH CHECK (status = 'pending');

-- Business images policies
CREATE POLICY "Anyone can view images of approved businesses"
  ON business_images FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = business_images.business_id
      AND businesses.status = 'approved'
    )
  );

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Avocați', 'avocati', 'Scale'),
  ('Constructori', 'constructori', 'HardHat'),
  ('Contabili', 'contabili', 'Calculator'),
  ('Dentiști', 'dentisti', 'Tooth'),
  ('Frizerii', 'frizerii', 'Scissors'),
  ('Mecanici Auto', 'mecanici-auto', 'Wrench'),
  ('Medici', 'medici', 'Stethoscope'),
  ('Traducători', 'traducatori', 'Languages'),
  ('Diverse', 'diverse', 'Briefcase')
ON CONFLICT (slug) DO NOTHING;
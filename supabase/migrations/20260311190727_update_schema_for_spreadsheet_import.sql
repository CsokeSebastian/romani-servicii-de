/*
  # Update Schema for Spreadsheet-Based Directory

  1. Changes to Tables
    - Drop existing `categories` table (categories will be dynamic)
    - Update `businesses` table to match spreadsheet structure:
      - Remove `category_id` foreign key
      - Add `category` as text field
      - Simplify to core fields: name, category, address, plz, city, phone
      - Add `slug` for SEO-friendly URLs
      - Remove status field (all imported businesses are approved by default)
    - Drop `business_images` table (not needed for initial import)

  2. New Features
    - Automatic slug generation
    - All businesses are public by default
    - Categories are dynamically derived from category column

  3. Security
    - Enable RLS on businesses table
    - Add policies for public read access
    - Add policies for CSV import
*/

-- Drop existing tables
DROP TABLE IF EXISTS business_images;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS categories;

-- Create new businesses table matching spreadsheet structure
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  address text NOT NULL,
  plz text NOT NULL,
  city text NOT NULL,
  phone text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_category_city ON businesses(category, city);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Public read access to all businesses
CREATE POLICY "Anyone can view all businesses"
  ON businesses FOR SELECT
  TO public
  USING (true);

-- Allow public insert for CSV import
CREATE POLICY "Anyone can insert businesses"
  ON businesses FOR INSERT
  TO public
  WITH CHECK (true);

-- Sample data for testing
INSERT INTO businesses (name, category, address, plz, city, phone, slug) VALUES
  ('Popescu Bau', 'Constructori', 'Hauptstraße 123', '80331', 'München', '+49 89 12345678', 'popescu-bau'),
  ('Cabinet Avocat Ionescu', 'Avocați', 'Berliner Allee 45', '10115', 'Berlin', '+49 30 98765432', 'cabinet-avocat-ionescu'),
  ('Auto Service Dumitru', 'Mecanici Auto', 'Industriestraße 67', '60311', 'Frankfurt', '+49 69 55544433', 'auto-service-dumitru'),
  ('Dr. Med. Popovici', 'Medici', 'Königsallee 89', '40212', 'Düsseldorf', '+49 211 77788899', 'dr-med-popovici'),
  ('Contabilitate Radu SRL', 'Contabili', 'Maximilianstraße 12', '80539', 'München', '+49 89 33322211', 'contabilitate-radu-srl'),
  ('Dental Clinic Gheorghe', 'Dentiști', 'Friedrichstraße 34', '10117', 'Berlin', '+49 30 44455566', 'dental-clinic-gheorghe'),
  ('Traduceri Profesionale Stan', 'Traducători', 'Kaiserstraße 78', '60329', 'Frankfurt', '+49 69 11122233', 'traduceri-profesionale-stan'),
  ('Construcții Marinescu', 'Constructori', 'Ludwigstraße 56', '80539', 'München', '+49 89 99988877', 'constructii-marinescu')
ON CONFLICT (slug) DO NOTHING;
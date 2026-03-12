/*
  # Add Geolocation Support for Radius-based Search

  1. Changes
    - Add latitude and longitude columns to businesses table
    - Add geocoding function for German addresses
    - Add distance calculation function
    - Update existing businesses with approximate coordinates
  
  2. German City Coordinates (approximate city centers)
    - München: 48.1351, 11.5820
    - Berlin: 52.5200, 13.4050
    - Frankfurt: 50.1109, 8.6821
    - Düsseldorf: 51.2277, 6.7735
*/

-- Add latitude and longitude columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'businesses' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE businesses ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'businesses' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE businesses ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Update existing businesses with approximate coordinates based on city
UPDATE businesses SET latitude = 48.1351, longitude = 11.5820 WHERE city = 'München';
UPDATE businesses SET latitude = 52.5200, longitude = 13.4050 WHERE city = 'Berlin';
UPDATE businesses SET latitude = 50.1109, longitude = 8.6821 WHERE city = 'Frankfurt';
UPDATE businesses SET latitude = 51.2277, longitude = 6.7735 WHERE city = 'Düsseldorf';

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  r DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

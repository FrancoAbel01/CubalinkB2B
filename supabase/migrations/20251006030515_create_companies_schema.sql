/*
  # Create Companies Directory Schema

  1. New Tables
    - `companies`
      - `id` (uuid, primary key) - Unique identifier for each company
      - `name` (text) - Company name
      - `description` (text) - Company description
      - `logo_url` (text, nullable) - URL to company logo
      - `website` (text, nullable) - Company website URL
      - `email` (text, nullable) - Contact email
      - `phone` (text, nullable) - Contact phone number
      - `address` (text, nullable) - Physical address
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp
    
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `company_id` (uuid, foreign key) - Reference to companies table
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric, nullable) - Product price
      - `image_url` (text, nullable) - URL to product image
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `services`
      - `id` (uuid, primary key) - Unique identifier for each service
      - `company_id` (uuid, foreign key) - Reference to companies table
      - `name` (text) - Service name
      - `description` (text) - Service description
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add public read policies (anyone can view company data)
    - Data is publicly accessible for display purposes
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  logo_url text,
  website text,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2),
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view)
CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_services_company_id ON services(company_id);
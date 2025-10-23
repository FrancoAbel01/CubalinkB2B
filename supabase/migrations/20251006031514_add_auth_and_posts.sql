/*
  # Add Authentication and Posts System

  1. Changes to Tables
    - `companies`
      - Add `user_id` (uuid, foreign key) - Links company to authenticated user
      - Add unique constraint on user_id (one company per user)
    
  2. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `company_id` (uuid, foreign key) - Reference to companies table
      - `title` (text) - Post title
      - `content` (text) - Post content
      - `image_url` (text, nullable) - Optional post image
      - `created_at` (timestamptz) - Post creation timestamp
      - `updated_at` (timestamptz) - Post update timestamp

  3. Security Updates
    - Enable RLS on posts table
    - Add policies for authenticated users to manage their company
    - Add policies for authenticated users to create/edit/delete their own posts
    - Add public read policy for posts
    - Update company policies for authenticated management

  4. Important Notes
    - Companies can now be managed only by their authenticated owner
    - Posts can only be created by authenticated company owners
    - All data remains publicly readable for display
*/

-- Add user_id to companies table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE companies ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
  END IF;
END $$;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Posts policies: Anyone can read
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

-- Posts policies: Company owners can insert their own posts
CREATE POLICY "Company owners can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Posts policies: Company owners can update their own posts
CREATE POLICY "Company owners can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Posts policies: Company owners can delete their own posts
CREATE POLICY "Company owners can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Companies policies: Authenticated users can insert their company
DROP POLICY IF EXISTS "Anyone can view companies" ON companies;
CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create company"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Companies policies: Users can update their own company
CREATE POLICY "Users can update own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Companies policies: Users can delete their own company
CREATE POLICY "Users can delete own company"
  ON companies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Products policies: Company owners can manage products
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Company owners can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = products.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Services policies: Company owners can manage services
DROP POLICY IF EXISTS "Anyone can view services" ON services;
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Company owners can create services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = services.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = services.company_id
      AND companies.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = services.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = services.company_id
      AND companies.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_company_id ON posts(company_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
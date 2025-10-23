/*
  # Add User Roles, Subscriptions, and Extra Services

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - Reference to auth.users
      - `role` (text) - User role: 'client', 'company', 'admin'
      - `full_name` (text, nullable) - User's full name
      - `phone` (text, nullable) - Contact phone
      - `created_at` (timestamptz) - Profile creation timestamp
      - `updated_at` (timestamptz) - Profile update timestamp
    
    - `extra_services`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Service name
      - `description` (text) - Service description
      - `price` (numeric) - Service price
      - `image_url` (text, nullable) - Service image
      - `is_active` (boolean) - Whether service is active
      - `created_at` (timestamptz) - Service creation timestamp

  2. Changes to Existing Tables
    - `companies`
      - Add `subscription_status` (text) - Status: 'pending', 'active', 'inactive'
      - Add `subscription_activated_at` (timestamptz, nullable) - When subscription was activated
      - Add `subscription_expires_at` (timestamptz, nullable) - When subscription expires

  3. Security
    - Enable RLS on all new tables
    - Add policies for user profiles (users can read/update their own)
    - Add policies for extra services (anyone can read, only admin can manage)
    - Add policies to prevent inactive companies from posting/editing

  4. Important Notes
    - Default admin email: admin@directorio.com
    - Companies start with 'pending' status
    - After 30 days of activation, status changes to 'inactive'
    - Inactive companies cannot post or edit until reactivated
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'company', 'admin')),
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create extra_services table
CREATE TABLE IF NOT EXISTS extra_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add subscription fields to companies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE companies ADD COLUMN subscription_status text DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active', 'inactive'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'subscription_activated_at'
  ) THEN
    ALTER TABLE companies ADD COLUMN subscription_activated_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'subscription_expires_at'
  ) THEN
    ALTER TABLE companies ADD COLUMN subscription_expires_at timestamptz;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_services ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Extra services policies
CREATE POLICY "Anyone can view active services"
  ON extra_services FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can manage services"
  ON extra_services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Update posts policies to check subscription status
DROP POLICY IF EXISTS "Company owners can create posts" ON posts;
CREATE POLICY "Active company owners can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
      AND companies.subscription_status = 'active'
    )
  );

DROP POLICY IF EXISTS "Company owners can update own posts" ON posts;
CREATE POLICY "Active company owners can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
      AND companies.subscription_status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
      AND companies.subscription_status = 'active'
    )
  );

DROP POLICY IF EXISTS "Company owners can delete own posts" ON posts;
CREATE POLICY "Active company owners can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = posts.company_id
      AND companies.user_id = auth.uid()
      AND companies.subscription_status = 'active'
    )
  );

-- Update companies policies to check subscription status
DROP POLICY IF EXISTS "Users can update own company" ON companies;
CREATE POLICY "Active users can update own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND (
      subscription_status = 'active' OR
      EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role = 'admin'
      )
    )
  );

-- Admin can update any company (for subscription management)
CREATE POLICY "Admins can update any company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_companies_subscription_status ON companies(subscription_status);
CREATE INDEX IF NOT EXISTS idx_companies_subscription_expires_at ON companies(subscription_expires_at);

-- Insert default admin user profile (will be created when admin signs up with admin@directorio.com)
-- Note: Admin must first create account through normal registration
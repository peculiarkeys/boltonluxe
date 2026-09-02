-- =============================================
-- Luxe Royalty: Multi-Property Administration Schema
-- =============================================

-- 1. Create properties table or alter existing
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE,
  slug text UNIQUE,
  address text,
  status text DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

DO $$
BEGIN
  BEGIN
    ALTER TABLE public.properties ADD COLUMN code text UNIQUE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  BEGIN
    ALTER TABLE public.properties ADD COLUMN slug text UNIQUE;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  BEGIN
    ALTER TABLE public.properties ADD COLUMN address text;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
  BEGIN
    ALTER TABLE public.properties ADD COLUMN status text DEFAULT 'active' NOT NULL;
  EXCEPTION
    WHEN duplicate_column THEN NULL;
  END;
END $$;

-- Seed properties
INSERT INTO public.properties (name, code, slug, location)
VALUES 
  ('Johnwood Hotel', 'JOHNWOOD', 'johnwood', 'Abuja'),
  ('Bolton White Hotel', 'BWH', 'bolton-white-hotel', 'Abuja'),
  ('Bolton White Residence', 'BWR', 'bolton-white-residence', 'Abuja')
ON CONFLICT (code) DO NOTHING;

-- 2. Create admin_profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE RESTRICT NOT NULL,
  username text NOT NULL UNIQUE,
  display_name text,
  role text NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_auth_user UNIQUE (auth_user_id)
);
-- Note: auth_user_id normally references auth.users(id), but we omit the explicit FK to auth schema 
-- in case it causes cross-schema issues depending on the Supabase setup, though usually it's fine.
-- Let's add the FK if possible, or leave it as UUID. Supabase standard allows FK to auth.users.
-- ALTER TABLE public.admin_profiles ADD CONSTRAINT admin_profiles_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read their own profile"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- 3. Extend Operational Tables
DO $$
DECLARE
  v_johnwood_id uuid;
BEGIN
  SELECT id INTO v_johnwood_id FROM public.properties WHERE code = 'JOHNWOOD';

  -- Add to bookings if exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id);
    UPDATE public.bookings SET property_id = v_johnwood_id WHERE property_id IS NULL;
  END IF;

  -- Add to loyalty_bookings (stays)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'loyalty_bookings') THEN
    ALTER TABLE public.loyalty_bookings ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id);
    UPDATE public.loyalty_bookings SET property_id = v_johnwood_id WHERE property_id IS NULL;
  END IF;
  
  -- Add to loyalty_point_transactions (if not already there)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'loyalty_point_transactions') THEN
    ALTER TABLE public.loyalty_point_transactions ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id);
  END IF;

  -- Add to loyalty_reward_redemptions (if not already there)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'loyalty_reward_redemptions') THEN
    ALTER TABLE public.loyalty_reward_redemptions ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id);
  END IF;
END $$;

-- 4. RLS Policies for Operational Data
-- bookings
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
    DROP POLICY IF EXISTS "Admins can view property bookings" ON public.bookings;
    CREATE POLICY "Admins can view property bookings"
      ON public.bookings FOR SELECT
      TO authenticated
      USING (
        property_id IN (
          SELECT property_id FROM public.admin_profiles WHERE auth_user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- loyalty_bookings (stays)
-- Add a policy for admins to view stays in their property
DROP POLICY IF EXISTS "Admins can view property stays" ON public.loyalty_bookings;
CREATE POLICY "Admins can view property stays"
  ON public.loyalty_bookings FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT property_id FROM public.admin_profiles WHERE auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can insert property stays" ON public.loyalty_bookings;
CREATE POLICY "Admins can insert property stays"
  ON public.loyalty_bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    property_id IN (
      SELECT property_id FROM public.admin_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- loyalty_reward_redemptions
DROP POLICY IF EXISTS "Admins can view property redemptions" ON public.loyalty_reward_redemptions;
CREATE POLICY "Admins can view property redemptions"
  ON public.loyalty_reward_redemptions FOR SELECT
  TO authenticated
  USING (
    property_id IS NULL OR property_id IN (
      SELECT property_id FROM public.admin_profiles WHERE auth_user_id = auth.uid()
    )
  );

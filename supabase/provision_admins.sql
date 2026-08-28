-- =============================================
-- Luxe Royalty: Admin Provisioning Script
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- =============================================

-- This script inserts the 12 admin users directly into auth.users and links them in admin_profiles.
-- It requires postgres superuser/supabase_admin privileges (running via Supabase Studio SQL editor is fine).
-- 
-- The passwords here are standard crypted passwords. 
-- Since Supabase uses bcrypt for passwords, we use a known hash for all of them temporarily,
-- or we can use pgcrypto to generate them. 
-- The pgcrypto extension is usually enabled in Supabase.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_johnwood_id uuid;
  v_bwh_id uuid;
  v_bwr_id uuid;
  
  -- User variables
  v_uid uuid;
  v_email text;
  v_password text;
  v_role text;
BEGIN
  -- Get property IDs
  SELECT id INTO v_johnwood_id FROM public.properties WHERE code = 'JOHNWOOD';
  SELECT id INTO v_bwh_id FROM public.properties WHERE code = 'BWH';
  SELECT id INTO v_bwr_id FROM public.properties WHERE code = 'BWR';

  IF v_johnwood_id IS NULL OR v_bwh_id IS NULL OR v_bwr_id IS NULL THEN
    RAISE EXCEPTION 'Properties must be seeded first.';
  END IF;

  -- Array of users to create: [email, password, property_id, role]
  -- We'll just do a few directly for simplicity and robustness in plpgsql

  -- ---------------------------------------------------------
  -- Johnwood Admin 1: General Manager
  -- ---------------------------------------------------------
  v_email := 'johnwood.generalmanager@boltonhq.com';
  v_password := 'P$8vKx!2mQc#9L';
  v_role := 'GENERAL_MANAGER';
  
  -- Check if user exists
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_johnwood_id, 'johnwood.generalmanager', 'Johnwood GM', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- Johnwood Admin 2: GSA
  -- ---------------------------------------------------------
  v_email := 'johnwood.gsa@boltonhq.com';
  v_password := 'zR@5gN*7bTj^4W';
  v_role := 'GSA';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_johnwood_id, 'johnwood.gsa', 'Johnwood GSA', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- Johnwood Admin 3: Front Office Manager
  -- ---------------------------------------------------------
  v_email := 'johnwood.frontofficemanager@boltonhq.com';
  v_password := 'F#3yLp&9dKz!6M';
  v_role := 'FRONT_OFFICE_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_johnwood_id, 'johnwood.frontofficemanager', 'Johnwood FOM', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- Johnwood Admin 4: Operations Manager
  -- ---------------------------------------------------------
  v_email := 'johnwood.operationsmanager@boltonhq.com';
  v_password := 'wV%2cX*4nRm$8H';
  v_role := 'OPERATIONS_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_johnwood_id, 'johnwood.operationsmanager', 'Johnwood Ops Mgr', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- BWH Admin 1: General Manager
  -- ---------------------------------------------------------
  v_email := 'bwh.generalmanager@boltonhq.com';
  v_password := 'B!9mJc@7pZk#4V';
  v_role := 'GENERAL_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwh_id, 'bwh.generalmanager', 'BWH GM', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- BWH Admin 2: GSA
  -- ---------------------------------------------------------
  v_email := 'bwh.gsa@boltonhq.com';
  v_password := 'tF$6hN*2bWq^8D';
  v_role := 'GSA';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwh_id, 'bwh.gsa', 'BWH GSA', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- BWH Admin 3: Front Office Manager
  -- ---------------------------------------------------------
  v_email := 'bwh.frontofficemanager@boltonhq.com';
  v_password := 'L%3vXg&5mRz!1P';
  v_role := 'FRONT_OFFICE_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwh_id, 'bwh.frontofficemanager', 'BWH FOM', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- BWH Admin 4: Operations Manager
  -- ---------------------------------------------------------
  v_email := 'bwh.operationsmanager@boltonhq.com';
  v_password := 'yK*8dC#4pTj@7N';
  v_role := 'OPERATIONS_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwh_id, 'bwh.operationsmanager', 'BWH Ops Mgr', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- Residence Admin 1: General Manager
  -- ---------------------------------------------------------
  v_email := 'residence.generalmanager@boltonhq.com';
  v_password := 'R@2nWp!5mKz$9F';
  v_role := 'GENERAL_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwr_id, 'residence.generalmanager', 'Residence GM', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- Residence Admin 2: GSA
  -- ---------------------------------------------------------
  v_email := 'residence.gsa@boltonhq.com';
  v_password := 'vH#7bJ*3cTq%6L';
  v_role := 'GSA';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwr_id, 'residence.gsa', 'Residence GSA', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- Residence Admin 3: Front Office Manager
  -- ---------------------------------------------------------
  v_email := 'residence.frontofficemanager@boltonhq.com';
  v_password := 'M$4zGk^8pXn!2W';
  v_role := 'FRONT_OFFICE_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwr_id, 'residence.frontofficemanager', 'Residence FOM', v_role)
  ON CONFLICT (username) DO NOTHING;

  -- ---------------------------------------------------------
  -- Residence Admin 4: Operations Manager
  -- ---------------------------------------------------------
  v_email := 'residence.operationsmanager@boltonhq.com';
  v_password := 'dC%9vF*1nRj@5T';
  v_role := 'OPERATIONS_MANAGER';
  
  SELECT id INTO v_uid FROM auth.users WHERE email = v_email;
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', v_email, crypt(v_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, format('{"sub":"%s","email":"%s"}', v_uid::text, v_email)::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_bwr_id, 'residence.operationsmanager', 'Residence Ops Mgr', v_role)
  ON CONFLICT (username) DO NOTHING;

END $$;

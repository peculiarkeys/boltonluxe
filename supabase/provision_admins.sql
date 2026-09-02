
-- =============================================
-- FIX: Update the trigger to ignore admin users and prevent ID collisions
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_consumer_user()
RETURNS trigger AS $$
DECLARE
  new_guest_id text;
BEGIN
  -- Do not create a guest profile for admin users
  IF new.raw_user_meta_data->>'role' = 'admin' THEN
    RETURN NEW;
  END IF;

  -- Generate a unique guest ID using clock_timestamp to prevent bulk insert collisions
  new_guest_id := 'GST' || to_char(clock_timestamp(), 'YYMMDDHH24MISS') || lpad(floor(random() * 1000)::text, 3, '0');
  
  INSERT INTO public.guests (guest_id, name, email, status, auth_id)
  VALUES (new_guest_id, COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown'), new.email, 'active', new.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Luxe Royalty: Admin Provisioning Script
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- =============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;


DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'JOHNWOOD';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property JOHNWOOD not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'johnwood.generalmanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'johnwood.generalmanager@boltonhq.com', crypt('P$8vKx!2mQc#9L', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'johnwood.generalmanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'johnwood.generalmanager', 'Johnwood GM', 'GENERAL_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'JOHNWOOD';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property JOHNWOOD not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'johnwood.gsa@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'johnwood.gsa@boltonhq.com', crypt('zR@5gN*7bTj^4W', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'johnwood.gsa@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'johnwood.gsa', 'Johnwood GSA', 'GSA')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'JOHNWOOD';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property JOHNWOOD not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'johnwood.frontofficemanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'johnwood.frontofficemanager@boltonhq.com', crypt('F#3yLp&9dKz!6M', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'johnwood.frontofficemanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'johnwood.frontofficemanager', 'Johnwood FOM', 'FRONT_OFFICE_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'JOHNWOOD';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property JOHNWOOD not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'johnwood.operationsmanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'johnwood.operationsmanager@boltonhq.com', crypt('wV%2cX*4nRm$8H', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'johnwood.operationsmanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'johnwood.operationsmanager', 'Johnwood Ops Mgr', 'OPERATIONS_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWH';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWH not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'bwh.generalmanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'bwh.generalmanager@boltonhq.com', crypt('B!9mJc@7pZk#4V', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'bwh.generalmanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'bwh.generalmanager', 'BWH GM', 'GENERAL_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWH';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWH not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'bwh.gsa@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'bwh.gsa@boltonhq.com', crypt('tF$6hN*2bWq^8D', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'bwh.gsa@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'bwh.gsa', 'BWH GSA', 'GSA')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWH';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWH not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'bwh.frontofficemanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'bwh.frontofficemanager@boltonhq.com', crypt('L%3vXg&5mRz!1P', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'bwh.frontofficemanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'bwh.frontofficemanager', 'BWH FOM', 'FRONT_OFFICE_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWH';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWH not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'bwh.operationsmanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'bwh.operationsmanager@boltonhq.com', crypt('yK*8dC#4pTj@7N', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'bwh.operationsmanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'bwh.operationsmanager', 'BWH Ops Mgr', 'OPERATIONS_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWR';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWR not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'residence.generalmanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'residence.generalmanager@boltonhq.com', crypt('R@2nWp!5mKz$9F', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'residence.generalmanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'residence.generalmanager', 'Residence GM', 'GENERAL_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWR';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWR not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'residence.gsa@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'residence.gsa@boltonhq.com', crypt('vH#7bJ*3cTq%6L', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'residence.gsa@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'residence.gsa', 'Residence GSA', 'GSA')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWR';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWR not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'residence.frontofficemanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'residence.frontofficemanager@boltonhq.com', crypt('M$4zGk^8pXn!2W', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'residence.frontofficemanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'residence.frontofficemanager', 'Residence FOM', 'FRONT_OFFICE_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = 'BWR';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property BWR not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = 'residence.operationsmanager@boltonhq.com';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', 'residence.operationsmanager@boltonhq.com', crypt('dC%9vF*1nRj@5T', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin", "full_name":"Admin User"}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{"sub":"%s","email":"%s"}', v_uid::text, 'residence.operationsmanager@boltonhq.com')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, 'residence.operationsmanager', 'Residence Ops Mgr', 'OPERATIONS_MANAGER')
  ON CONFLICT (username) DO NOTHING;
END $$;

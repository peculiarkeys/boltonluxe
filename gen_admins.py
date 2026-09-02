admins = [
    ('JOHNWOOD', 'johnwood.generalmanager@boltonhq.com', 'P$8vKx!2mQc#9L', 'GENERAL_MANAGER', 'johnwood.generalmanager', 'Johnwood GM'),
    ('JOHNWOOD', 'johnwood.gsa@boltonhq.com', 'zR@5gN*7bTj^4W', 'GSA', 'johnwood.gsa', 'Johnwood GSA'),
    ('JOHNWOOD', 'johnwood.frontofficemanager@boltonhq.com', 'F#3yLp&9dKz!6M', 'FRONT_OFFICE_MANAGER', 'johnwood.frontofficemanager', 'Johnwood FOM'),
    ('JOHNWOOD', 'johnwood.operationsmanager@boltonhq.com', 'wV%2cX*4nRm$8H', 'OPERATIONS_MANAGER', 'johnwood.operationsmanager', 'Johnwood Ops Mgr'),

    ('BWH', 'bwh.generalmanager@boltonhq.com', 'B!9mJc@7pZk#4V', 'GENERAL_MANAGER', 'bwh.generalmanager', 'BWH GM'),
    ('BWH', 'bwh.gsa@boltonhq.com', 'tF$6hN*2bWq^8D', 'GSA', 'bwh.gsa', 'BWH GSA'),
    ('BWH', 'bwh.frontofficemanager@boltonhq.com', 'L%3vXg&5mRz!1P', 'FRONT_OFFICE_MANAGER', 'bwh.frontofficemanager', 'BWH FOM'),
    ('BWH', 'bwh.operationsmanager@boltonhq.com', 'yK*8dC#4pTj@7N', 'OPERATIONS_MANAGER', 'bwh.operationsmanager', 'BWH Ops Mgr'),

    ('BWR', 'residence.generalmanager@boltonhq.com', 'R@2nWp!5mKz$9F', 'GENERAL_MANAGER', 'residence.generalmanager', 'Residence GM'),
    ('BWR', 'residence.gsa@boltonhq.com', 'vH#7bJ*3cTq%6L', 'GSA', 'residence.gsa', 'Residence GSA'),
    ('BWR', 'residence.frontofficemanager@boltonhq.com', 'M$4zGk^8pXn!2W', 'FRONT_OFFICE_MANAGER', 'residence.frontofficemanager', 'Residence FOM'),
    ('BWR', 'residence.operationsmanager@boltonhq.com', 'dC%9vF*1nRj@5T', 'OPERATIONS_MANAGER', 'residence.operationsmanager', 'Residence Ops Mgr'),
]

sql = """-- =============================================
-- Luxe Royalty: Admin Provisioning Script
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- =============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

"""

for p_code, email, password, role, username, display_name in admins:
    sql += f"""
DO $$
DECLARE
  v_prop_id uuid;
  v_uid uuid;
BEGIN
  SELECT id INTO v_prop_id FROM public.properties WHERE code = '{p_code}';
  IF v_prop_id IS NULL THEN
    RAISE EXCEPTION 'Property {p_code} not found!';
  END IF;

  SELECT id INTO v_uid FROM auth.users WHERE email = '{email}';
  IF v_uid IS NULL THEN
    PERFORM pg_sleep(1.1);
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud, confirmation_token)
    VALUES (v_uid, '00000000-0000-0000-0000-000000000000', '{email}', crypt('{password}', gen_salt('bf')), now(), '{{"provider":"email","providers":["email"]}}', '{{"role":"admin", "full_name":"Admin User"}}', now(), now(), 'authenticated', 'authenticated', '');
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, format('{{"sub":"%s","email":"%s"}}', v_uid::text, '{email}')::jsonb, 'email', now(), now(), now());
  END IF;

  INSERT INTO public.admin_profiles (auth_user_id, property_id, username, display_name, role)
  VALUES (v_uid, v_prop_id, '{username}', '{display_name}', '{role}')
  ON CONFLICT (username) DO NOTHING;
END $$;
"""

with open('/Users/mac/Desktop/bolton-hq-hospitality-suite-main/supabase/provision_admins.sql', 'w') as f:
    f.write(sql)

with open('/Users/mac/Desktop/bolton-hq-hospitality-suite-main/supabase/provision_admins.sql', 'r') as f:
    content = f.read()

trigger_fix = """
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

"""

with open('/Users/mac/Desktop/bolton-hq-hospitality-suite-main/supabase/provision_admins.sql', 'w') as f:
    f.write(trigger_fix + content)

-- 1. Link Guests and Loyalty Members to Auth Users
ALTER TABLE guests ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) UNIQUE;
ALTER TABLE loyalty_members ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) UNIQUE;

-- 2. Create a function to handle new consumer app user signups
CREATE OR REPLACE FUNCTION public.handle_new_consumer_user()
RETURNS TRIGGER AS $$
DECLARE
  new_guest_id TEXT;
  new_member_id TEXT;
BEGIN
  -- Generate unique IDs
  new_guest_id := 'GST' || to_char(CURRENT_TIMESTAMP, 'YYMMDDHH24MISS');
  new_member_id := 'MEM' || to_char(CURRENT_TIMESTAMP, 'YYMMDDHH24MISS');

  -- Insert into guests table
  INSERT INTO public.guests (guest_id, name, email, status, auth_id)
  VALUES (new_guest_id, new.raw_user_meta_data->>'full_name', new.email, 'active', new.id);

  -- Insert into loyalty_members table
  INSERT INTO public.loyalty_members (member_id, name, email, status, tier, points, stays, join_date, auth_id)
  VALUES (new_member_id, new.raw_user_meta_data->>'full_name', new.email, 'active', 'bronze', 0, 0, CURRENT_DATE, new.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_consumer_user();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Guests Policy: Consumers can view and update their own guest profile
DROP POLICY IF EXISTS "Consumers can view own guest profile" ON guests;
CREATE POLICY "Consumers can view own guest profile" ON guests
  FOR SELECT USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Consumers can update own guest profile" ON guests;
CREATE POLICY "Consumers can update own guest profile" ON guests
  FOR UPDATE USING (auth.uid() = auth_id);

-- Loyalty Members Policy: Consumers can view their own loyalty profile
DROP POLICY IF EXISTS "Consumers can view own loyalty details" ON loyalty_members;
CREATE POLICY "Consumers can view own loyalty details" ON loyalty_members
  FOR SELECT USING (auth.uid() = auth_id);

-- Loyalty Stays Policy: Consumers can view their stays
DROP POLICY IF EXISTS "Consumers can view their stays" ON loyalty_stays;
CREATE POLICY "Consumers can view their stays" ON loyalty_stays
  FOR SELECT USING (
    member_id IN (SELECT id FROM loyalty_members WHERE auth_id = auth.uid())
  );

-- Bookings Policy: Consumers can view their bookings via email match
DROP POLICY IF EXISTS "Consumers can view their bookings" ON bookings;
CREATE POLICY "Consumers can view their bookings" ON bookings
  FOR SELECT USING (guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 6. RPC function for HQ Dashboard to fetch all members (bypasses RLS)
-- This allows the HQ dashboard (using anon key) to read all members without RLS blocking them.
CREATE OR REPLACE FUNCTION public.get_all_loyalty_members()
RETURNS SETOF public.loyalty_members AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.loyalty_members ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

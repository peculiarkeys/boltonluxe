-- =============================================
-- LUXE ROYALTY: Demo Seed Data
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Create Demo Members
INSERT INTO public.loyalty_members (member_id, name, email, phone, tier, points, stays, status, join_date)
VALUES
  ('BWG LX123 4567', 'John Bolton', 'john.bolton@example.com', '+234 801 234 5678', 'Gold', 2500, 12, 'Active', '2025-01-15'),
  ('BWG LX999 0000', 'Sarah Williams', 'sarah.w@example.com', '+234 802 999 0000', 'Silver', 450, 3, 'Active', '2026-02-10'),
  ('BWG LX000 1111', 'Michael Ade', 'm.ade@example.com', '+234 803 000 1111', 'Platinum', 8500, 42, 'Active', '2024-05-20')
ON CONFLICT (member_id) DO UPDATE 
SET points = EXCLUDED.points, stays = EXCLUDED.stays, tier = EXCLUDED.tier;

-- 2. Create Demo Stay History for John Bolton
DO $$
DECLARE
    john_id uuid;
BEGIN
    SELECT id INTO john_id FROM public.loyalty_members WHERE member_id = 'BWG LX123 4567';
    
    IF john_id IS NOT NULL THEN
        INSERT INTO public.loyalty_bookings (member_id, check_in_date, check_out_date, room_type, amount_spent, points_earned, discount_applied, staff_name, notes)
        VALUES
          (john_id, '2026-03-01', '2026-03-04', 'Executive Suite', 150000, 150, 20, 'Front Desk A', 'Frequent guest, likes high floor'),
          (john_id, '2026-04-10', '2026-04-12', 'Standard Room', 45000, 45, 20, 'Front Desk B', 'Business trip')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- =============================================
-- Luxe Royalty: loyalty_bookings table
-- Run this in your Supabase SQL Editor
-- =============================================

-- Stay logging table: records each guest visit with points earned
CREATE TABLE IF NOT EXISTS public.loyalty_bookings (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id         uuid NOT NULL REFERENCES public.loyalty_members(id) ON DELETE CASCADE,
  check_in_date     date NOT NULL,
  check_out_date    date,
  room_type         text NOT NULL,
  amount_spent      numeric(12, 2) NOT NULL DEFAULT 0,
  points_earned     integer NOT NULL DEFAULT 0,
  discount_applied  numeric(5, 2) NOT NULL DEFAULT 0,
  staff_name        text,
  notes             text,
  created_at        timestamptz DEFAULT now() NOT NULL
);

-- Index for fast member history lookup (the primary use case)
CREATE INDEX IF NOT EXISTS loyalty_bookings_member_id_idx
  ON public.loyalty_bookings(member_id);

CREATE INDEX IF NOT EXISTS loyalty_bookings_check_in_idx
  ON public.loyalty_bookings(check_in_date DESC);

-- Enable Row Level Security
ALTER TABLE public.loyalty_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users can read all bookings
CREATE POLICY "Authenticated users can read loyalty bookings"
  ON public.loyalty_bookings FOR SELECT
  TO authenticated
  USING (true);

-- Policy: authenticated users can insert bookings (staff logging stays)
CREATE POLICY "Authenticated users can insert loyalty bookings"
  ON public.loyalty_bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: authenticated users can update bookings (corrections)
CREATE POLICY "Authenticated users can update loyalty bookings"
  ON public.loyalty_bookings FOR UPDATE
  TO authenticated
  USING (true);

-- =============================================
-- Tier Rules Reference Table (config, not code)
-- =============================================

CREATE TABLE IF NOT EXISTS public.loyalty_tier_rules (
  tier                    text PRIMARY KEY,
  discount_percent        integer NOT NULL,
  points_per_1000_ngn     numeric(4, 1) NOT NULL,
  free_night_threshold    integer NOT NULL,
  perks                   text[] DEFAULT '{}'
);

-- Seed the tier rules
INSERT INTO public.loyalty_tier_rules (tier, discount_percent, points_per_1000_ngn, free_night_threshold, perks)
VALUES
  ('Silver',   10, 1.0, 200, ARRAY['Member Rate', '10% Discount']),
  ('Gold',     20, 1.5, 150, ARRAY['Priority Reservations', 'Early Check-In', 'Late Check-Out', '20% Discount']),
  ('Platinum', 30, 2.0, 100, ARRAY['Room Upgrades', 'VIP Concierge', 'Complimentary Breakfast', '30% Discount'])
ON CONFLICT (tier) DO NOTHING;

-- Enable RLS
ALTER TABLE public.loyalty_tier_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tier rules"
  ON public.loyalty_tier_rules FOR SELECT
  TO authenticated
  USING (true);

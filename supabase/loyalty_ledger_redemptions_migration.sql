-- =============================================
-- Luxe Royalty: Points Ledger & Rewards Redemption System
-- Database Migration (Phase 1)
-- =============================================

-- =============================================
-- 1. Extend existing loyalty_point_transactions (The Ledger)
-- =============================================
ALTER TABLE public.loyalty_point_transactions
  ADD COLUMN IF NOT EXISTS balance_after    integer,
  ADD COLUMN IF NOT EXISTS reference_type   text, -- 'STAY', 'REDEMPTION', 'ADMIN_ADJUSTMENT'
  ADD COLUMN IF NOT EXISTS reference_id     text, -- ID of the source record
  ADD COLUMN IF NOT EXISTS status           text DEFAULT 'COMPLETED', -- 'COMPLETED', 'REVERSED', 'VOID'
  ADD COLUMN IF NOT EXISTS created_by       text, -- Admin ID or 'SYSTEM'
  ADD COLUMN IF NOT EXISTS metadata         jsonb;

-- Idempotency and fast lookup index
CREATE INDEX IF NOT EXISTS loyalty_pt_txn_ref_idx 
  ON public.loyalty_point_transactions(member_id, reference_type, reference_id);

-- =============================================
-- 2. Extend existing loyalty_reward_redemptions (The Redemption Record)
-- =============================================
ALTER TABLE public.loyalty_reward_redemptions
  ADD COLUMN IF NOT EXISTS points_spent     integer,
  ADD COLUMN IF NOT EXISTS redemption_code  text UNIQUE,
  ADD COLUMN IF NOT EXISTS used_at          timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at       timestamptz,
  ADD COLUMN IF NOT EXISTS property_id      text,
  ADD COLUMN IF NOT EXISTS used_by          text,
  ADD COLUMN IF NOT EXISTS metadata         jsonb;

-- Indexes for code search and status filtering
CREATE INDEX IF NOT EXISTS loyalty_redemptions_code_idx 
  ON public.loyalty_reward_redemptions(redemption_code);
CREATE INDEX IF NOT EXISTS loyalty_redemptions_status_idx 
  ON public.loyalty_reward_redemptions(status);

-- =============================================
-- 3. Extend existing loyalty_rewards (The Catalogue)
-- =============================================
ALTER TABLE public.loyalty_rewards
  ADD COLUMN IF NOT EXISTS reference_naira_value  numeric(12,2),
  ADD COLUMN IF NOT EXISTS min_tier               text,
  ADD COLUMN IF NOT EXISTS quantity               integer,
  ADD COLUMN IF NOT EXISTS valid_from             timestamptz,
  ADD COLUMN IF NOT EXISTS valid_until            timestamptz,
  ADD COLUMN IF NOT EXISTS terms_conditions       text;

-- =============================================
-- 4. Create Atomic RPC: redeem_reward
-- =============================================
CREATE OR REPLACE FUNCTION public.redeem_reward(
  p_member_id uuid,
  p_reward_id uuid,
  p_property_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_member record;
  v_reward record;
  v_new_balance integer;
  v_redemption_code text;
  v_redemption_id uuid;
  v_result jsonb;
BEGIN
  -- 1. Lock member row
  SELECT * INTO v_member 
  FROM public.loyalty_members 
  WHERE id = p_member_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found';
  END IF;

  IF v_member.status != 'Active' THEN
    RAISE EXCEPTION 'Member account is not active';
  END IF;

  -- 2. Get reward
  SELECT * INTO v_reward
  FROM public.loyalty_rewards
  WHERE id = p_reward_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reward not found';
  END IF;

  IF v_reward.status != 'Active' THEN
    RAISE EXCEPTION 'Reward is not currently active';
  END IF;

  -- Check dates if they exist
  IF v_reward.valid_from IS NOT NULL AND v_reward.valid_from > now() THEN
    RAISE EXCEPTION 'Reward is not yet valid';
  END IF;

  IF v_reward.valid_until IS NOT NULL AND v_reward.valid_until < now() THEN
    RAISE EXCEPTION 'Reward has expired';
  END IF;

  -- 3. Verify balance
  IF v_member.points < v_reward.points_cost THEN
    RAISE EXCEPTION 'Insufficient points. Have: %, Need: %', v_member.points, v_reward.points_cost;
  END IF;

  -- 4. Calculate new balance
  v_new_balance := v_member.points - v_reward.points_cost;

  -- 5. Generate redemption code (LUXE-XXXXX)
  v_redemption_code := 'LUXE-' || upper(substr(md5(random()::text), 1, 5));
  
  -- Ensure code uniqueness (simple retry loop for extremely rare collision)
  WHILE EXISTS (SELECT 1 FROM public.loyalty_reward_redemptions WHERE redemption_code = v_redemption_code) LOOP
    v_redemption_code := 'LUXE-' || upper(substr(md5(random()::text), 1, 5));
  END LOOP;

  -- 6. Insert redemption record
  INSERT INTO public.loyalty_reward_redemptions (
    member_id, 
    reward_id, 
    redemption_id,
    points_spent,
    redemption_code,
    status,
    property_id,
    date,
    created_at
  ) VALUES (
    p_member_id,
    p_reward_id,
    'RED-' || extract(epoch from now())::bigint::text,
    v_reward.points_cost,
    v_redemption_code,
    'AVAILABLE',
    p_property_id,
    now()::date,
    now()
  ) RETURNING id INTO v_redemption_id;

  -- 7. Insert ledger entry
  INSERT INTO public.loyalty_point_transactions (
    member_id,
    amount,
    type,
    description,
    date,
    created_at,
    balance_after,
    reference_type,
    reference_id,
    status,
    created_by
  ) VALUES (
    p_member_id,
    -(v_reward.points_cost),
    'redeemed',
    'Redeemed: ' || v_reward.name,
    now()::date,
    now(),
    v_new_balance,
    'REDEMPTION',
    v_redemption_id::text,
    'COMPLETED',
    'SYSTEM'
  );

  -- 8. Update member balance
  UPDATE public.loyalty_members
  SET points = v_new_balance
  WHERE id = p_member_id;

  -- 9. Return success info
  v_result := jsonb_build_object(
    'redemption_id', v_redemption_id,
    'redemption_code', v_redemption_code,
    'points_spent', v_reward.points_cost,
    'balance_after', v_new_balance,
    'reward_name', v_reward.name
  );

  RETURN v_result;
END;
$$;

-- =============================================
-- 5. Create Atomic RPC: adjust_member_points
-- =============================================
CREATE OR REPLACE FUNCTION public.adjust_member_points(
  p_member_id uuid,
  p_points integer,
  p_description text,
  p_admin_id text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_member record;
  v_new_balance integer;
  v_type text;
BEGIN
  -- 1. Lock member row
  SELECT * INTO v_member 
  FROM public.loyalty_members 
  WHERE id = p_member_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found';
  END IF;

  -- 2. Calculate new balance
  v_new_balance := v_member.points + p_points;
  
  IF p_points > 0 THEN
    v_type := 'earned';
  ELSE
    v_type := 'redeemed';
  END IF;

  -- 3. Insert ledger entry
  INSERT INTO public.loyalty_point_transactions (
    member_id,
    amount,
    type,
    description,
    date,
    created_at,
    balance_after,
    reference_type,
    reference_id,
    status,
    created_by
  ) VALUES (
    p_member_id,
    p_points,
    v_type,
    COALESCE(p_description, 'Admin Adjustment'),
    now()::date,
    now(),
    v_new_balance,
    'ADMIN_ADJUSTMENT',
    'ADJ-' || extract(epoch from now())::bigint::text,
    'COMPLETED',
    p_admin_id
  );

  -- 4. Update member balance
  UPDATE public.loyalty_members
  SET points = v_new_balance
  WHERE id = p_member_id;

  RETURN v_new_balance;
END;
$$;

-- =============================================
-- 6. Create RPC: reconcile_member_points
-- =============================================
CREATE OR REPLACE FUNCTION public.reconcile_member_points(
  p_member_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance integer;
  v_calculated_balance integer;
  v_result jsonb;
BEGIN
  -- Get current balance
  SELECT points INTO v_current_balance
  FROM public.loyalty_members
  WHERE id = p_member_id;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'Member not found';
  END IF;

  -- Calculate ledger sum
  SELECT COALESCE(SUM(amount), 0) INTO v_calculated_balance
  FROM public.loyalty_point_transactions
  WHERE member_id = p_member_id
    AND (status IS NULL OR status != 'VOID');

  -- Return comparison
  v_result := jsonb_build_object(
    'member_id', p_member_id,
    'current_balance', v_current_balance,
    'ledger_balance', v_calculated_balance,
    'is_synchronized', (v_current_balance = v_calculated_balance),
    'discrepancy', (v_current_balance - v_calculated_balance)
  );

  RETURN v_result;
END;
$$;

-- =============================================
-- Luxe Royalty: loyalty_notifications table
-- Run this in your Supabase SQL Editor
-- =============================================

-- Communication log — every notification ever sent to a member
CREATE TABLE IF NOT EXISTS public.loyalty_notifications (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id      uuid NOT NULL REFERENCES public.loyalty_members(id) ON DELETE CASCADE,
  type           text NOT NULL,          -- welcome | points_earned | tier_upgrade | reward_redeemed | reminder | custom
  channel        text NOT NULL DEFAULT 'email',  -- email | sms | in_app
  subject        text NOT NULL,
  body           text NOT NULL,
  status         text NOT NULL DEFAULT 'sent',   -- sent | pending | failed
  sent_at        timestamptz,
  triggered_by   text,                   -- staff name who triggered the action
  meta           jsonb,                  -- arbitrary data snapshot (e.g. points, tier)
  created_at     timestamptz DEFAULT now() NOT NULL
);

-- Indexes for fast lookup by member and recency
CREATE INDEX IF NOT EXISTS loyalty_notifications_member_id_idx
  ON public.loyalty_notifications(member_id);

CREATE INDEX IF NOT EXISTS loyalty_notifications_created_at_idx
  ON public.loyalty_notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.loyalty_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read notifications"
  ON public.loyalty_notifications FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert notifications"
  ON public.loyalty_notifications FOR INSERT
  TO authenticated WITH CHECK (true);

-- =============================================
-- Views: useful query shortcuts
-- =============================================

-- Member notification summary: how many notifications each member has received
CREATE OR REPLACE VIEW public.loyalty_member_notification_summary AS
SELECT
  m.id,
  m.name,
  m.member_id AS card_number,
  m.tier,
  COUNT(n.id)                          AS total_notifications,
  COUNT(n.id) FILTER (WHERE n.type = 'welcome')         AS welcome_count,
  COUNT(n.id) FILTER (WHERE n.type = 'points_earned')   AS points_notifications,
  COUNT(n.id) FILTER (WHERE n.type = 'tier_upgrade')    AS tier_upgrades,
  MAX(n.sent_at)                       AS last_contacted_at
FROM public.loyalty_members m
LEFT JOIN public.loyalty_notifications n ON n.member_id = m.id
GROUP BY m.id, m.name, m.member_id, m.tier;

-- =============================================
-- Trigger: auto-log tier upgrade events
-- Fires whenever a member's tier column changes
-- =============================================

-- Helper function that runs the notification insert
CREATE OR REPLACE FUNCTION public.fn_loyalty_tier_upgrade_notify()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tier IS DISTINCT FROM OLD.tier THEN
    INSERT INTO public.loyalty_notifications (
      member_id, type, channel, subject, body,
      status, sent_at, triggered_by, meta
    ) VALUES (
      NEW.id,
      'tier_upgrade',
      'email',
      'Congratulations — You''ve been upgraded to ' || NEW.tier || '!',
      'Your tier has been upgraded from ' || OLD.tier || ' to ' || NEW.tier || '.',
      'sent',
      now(),
      'System (automatic)',
      jsonb_build_object('old_tier', OLD.tier, 'new_tier', NEW.tier)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to loyalty_members
DROP TRIGGER IF EXISTS trg_tier_upgrade_notify ON public.loyalty_members;
CREATE TRIGGER trg_tier_upgrade_notify
  AFTER UPDATE OF tier ON public.loyalty_members
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_loyalty_tier_upgrade_notify();

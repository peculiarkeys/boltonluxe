-- =============================================
-- Security Hardening: RLS Policies Fix
-- =============================================

-- Drop the overly permissive "authenticated" policies
DROP POLICY IF EXISTS "Authenticated users can read loyalty bookings" ON public.loyalty_bookings;
DROP POLICY IF EXISTS "Authenticated users can insert loyalty bookings" ON public.loyalty_bookings;
DROP POLICY IF EXISTS "Authenticated users can update loyalty bookings" ON public.loyalty_bookings;

DROP POLICY IF EXISTS "Authenticated users can read notifications" ON public.loyalty_notifications;
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.loyalty_notifications;

-- Create secure policies for loyalty_bookings
-- 1. Users can read their own bookings
CREATE POLICY "Users can view own bookings" 
  ON public.loyalty_bookings FOR SELECT 
  TO authenticated 
  USING (
    member_id IN (
      SELECT id FROM public.loyalty_members 
      WHERE user_id = auth.uid()
    )
  );

-- 2. Staff/Admin can read all bookings
-- Assuming admin/staff are identified by a custom claim or existence in a staff table. 
-- For now, if we are keeping things simple and we don't have a staff table, 
-- we will use a function check if user is staff (this depends on implementation details, 
-- but a secure approach is needed). If no staff table exists in Supabase yet, we'll
-- use the auth.uid() check to limit users to only their own data.
-- (Will refine this based on admin auth strategy).

-- Create secure policies for loyalty_notifications
-- 1. Users can read their own notifications
CREATE POLICY "Users can view own notifications" 
  ON public.loyalty_notifications FOR SELECT 
  TO authenticated 
  USING (
    member_id IN (
      SELECT id FROM public.loyalty_members 
      WHERE user_id = auth.uid()
    )
  );

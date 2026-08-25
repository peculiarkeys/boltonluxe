import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoyaltyMember } from './useLoyaltyMembers';

export interface LoyaltyBookingEntry {
  id: string;
  member_id: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  amount_spent: number;
  points_earned: number;
  discount_applied: number;
  staff_name: string;
  notes: string;
  created_at: string;
}

// Tier configuration
export const TIER_CONFIG = {
  Silver:   { discount: 10, multiplier: 1.0, freeNightAt: 200, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300' },
  Gold:     { discount: 20, multiplier: 1.5, freeNightAt: 150, color: 'text-amber-500', bg: 'bg-amber-50',  border: 'border-amber-300' },
  Platinum: { discount: 30, multiplier: 2.0, freeNightAt: 100, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-300' },
  Standard: { discount: 0,  multiplier: 0.5,   freeNightAt: 200, color: 'text-gray-400',  bg: 'bg-gray-100', border: 'border-gray-200' },
};

export const generateCardNumber = () => {
  const r3 = Math.floor(100 + Math.random() * 900); // 3-digit
  const r4 = Math.floor(1000 + Math.random() * 9000); // 4-digit
  return `BWG LX${r3} ${r4}`;
};

export const ROOM_PRICES: Record<string, number> = {
  'Superior Room': 350000,
  'Deluxe Room': 410000,
  'Executive Room': 475000,
  'Premium Suite': 575000,
  'VIP Suite': 750000,
  'Apartment': 800000,
};

export const calculatePoints = (amountSpent: number, tier: LoyaltyMember['tier']): number => {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.Standard;
  if (!config.multiplier) return 0;
  return Math.floor((amountSpent / 1000) * config.multiplier);
};

export const useLoyaltyCheckin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingStay, setIsLoggingStay] = useState(false);
  const { toast } = useToast();

  // ── Card number lookup ──────────────────────────────────────────────────────
  const lookupByCardNumber = async (cardNumber: string): Promise<LoyaltyMember | null> => {
    if (!cardNumber.trim()) return null;
    setIsLoading(true);
    const cleanNo = cardNumber.trim().toUpperCase();
    
    try {
      const { data, error } = await supabase.rpc('get_all_loyalty_members');

      if (!error && data) {
        const found = data.find((m: any) => m.member_id === cleanNo);
        if (found) return found as LoyaltyMember;
      }

      return null;
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lookup failed', description: err.message });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Stay history ─────────────────────────────────────────────────────────────
  // Returns empty silently if the loyalty_bookings table has not been created yet.
  const fetchStayHistory = async (memberId: string): Promise<LoyaltyBookingEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('loyalty_bookings')
        .select('*')
        .eq('member_id', memberId)
        .order('check_in_date', { ascending: false })
        .limit(20);

      if (error) return [];
      return (data || []) as LoyaltyBookingEntry[];
    } catch {
      return [];
    }
  };

  // ── Log Stay ─────────────────────────────────────────────────────────────────
  // Uses RPCs exclusively for the critical member update (points + stays).
  // Auxiliary writes (bookings table, point ledger) are best-effort.
  const logStay = async (
    member: LoyaltyMember,
    stay: {
      check_in_date: string;
      check_out_date: string;
      room_type: string;
      amount_spent: number;
      staff_name: string;
      notes: string;
    }
  ): Promise<boolean> => {
    setIsLoggingStay(true);
    try {
      const config = TIER_CONFIG[member.tier] || TIER_CONFIG.Standard;
      const pointsEarned = calculatePoints(stay.amount_spent, member.tier);
      const newPoints = member.points + pointsEarned;
      const newStays = member.stays + 1;

      // Auto-tier upgrade logic
      let newTier = member.tier;
      if (newStays >= 25 && newPoints >= 1500 && member.tier !== 'Platinum') {
        newTier = 'Platinum';
      } else if (newStays >= 10 && newPoints >= 500 && member.tier === 'Silver') {
        newTier = 'Gold';
      }

      // Use RPCs exclusively to update member (bypasses RLS)
      await supabase.rpc('update_member_stays', { p_member_id: member.id, p_points: 0, p_amount: 1 });
      await supabase.rpc('update_member_points', { p_member_id: member.id, p_points: pointsEarned });

      // Handle tier upgrade separately if needed
      if (newTier !== member.tier) {
        await supabase
          .from('loyalty_members')
          .update({ tier: newTier })
          .eq('id', member.id);
      }

      // Best-effort: insert booking detail record
      try {
        const { error: bookingError } = await supabase.from('loyalty_bookings').insert([{
          member_id: member.id,
          ...stay,
          points_earned: pointsEarned,
          discount_applied: config.discount,
        }]);
        if (bookingError) console.error("Booking insert error:", bookingError);
      } catch (e) { console.error(e); }

      // Best-effort: log to points ledger
      try {
        const { error: txnError } = await supabase.from('loyalty_point_transactions').insert([{
          member_id: member.id,
          amount: pointsEarned,
          type: 'earned',
          description: `Stay: ${stay.room_type} (${stay.check_in_date} – ${stay.check_out_date})`,
          date: new Date().toISOString(),
        }]);
        if (txnError) console.error("Txn insert error:", txnError);
      } catch (e) { console.error(e); }

      const upgraded = newTier !== member.tier;
      toast({
        title: `Stay logged — +${pointsEarned} points awarded`,
        description: upgraded
          ? `${member.name} has been upgraded to ${newTier}!`
          : `${member.name} now has ${newPoints.toLocaleString()} points.`,
      });

      return true;
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Failed to log stay', description: err.message });
      return false;
    } finally {
      setIsLoggingStay(false);
    }
  };

  // ── Quick Enrol (used from CheckIn page "Enrol New Member" modal) ────────────
  const enrolMember = async (details: {
    name: string;
    email: string;
    phone: string;
  }): Promise<LoyaltyMember | null> => {
    setIsLoading(true);
    try {
      const cardNumber = generateCardNumber();

      const { data, error } = await supabase
        .from('loyalty_members')
        .insert([{
          member_id: cardNumber,
          name: details.name,
          email: details.email || null,
          phone: details.phone,
          tier: 'Silver',
          points: 0,
          stays: 0,
          status: 'Active',
          join_date: new Date().toISOString().split('T')[0],
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: `Welcome to Luxe Royalty, ${details.name}!`,
        description: `Card number: ${cardNumber}`,
      });

      return data as LoyaltyMember;
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Enrolment failed', description: err.message });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isLoggingStay,
    lookupByCardNumber,
    fetchStayHistory,
    logStay,
    enrolMember,
  };
};

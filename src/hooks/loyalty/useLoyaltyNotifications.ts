import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type NotificationType = 'welcome' | 'points_earned' | 'tier_upgrade' | 'reward_redeemed' | 'reminder' | 'custom';
export type NotificationChannel = 'email' | 'sms' | 'in_app';
export type NotificationStatus = 'sent' | 'pending' | 'failed';

export interface LoyaltyNotification {
  id: string;
  member_id: string;
  member_name?: string;
  member_email?: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject: string;
  body: string;
  status: NotificationStatus;
  sent_at: string | null;
  created_at: string;
  triggered_by: string; // staff name
  meta?: Record<string, string | number>; // e.g. { points: 450, tier: 'Gold' }
}

// ─────────────────────────────────────────────
// Template Engine
// ─────────────────────────────────────────────

export const NOTIFICATION_TEMPLATES: Record<NotificationType, {
  subject: (data: Record<string, string | number>) => string;
  body: (data: Record<string, string | number>) => string;
}> = {
  welcome: {
    subject: (d) => `Welcome to Luxe Royalty, ${d.name}!`,
    body: (d) => `Dear ${d.name},\n\nWelcome to the Luxe Royalty loyalty programme — Bolton White Group's exclusive guest rewards club.\n\nYour membership details:\n• Card Number: ${d.card_number}\n• Tier: ${d.tier}\n• Starting Points: 0\n\nAs a ${d.tier} member, you enjoy ${d.discount}% off all rooms, dining, and spa services. You earn points on every qualifying spend and can redeem them for complimentary stays and exclusive rewards.\n\nPlease keep your card number safe. Present it at any Bolton White Group property to access your benefits.\n\nWe look forward to making every stay exceptional.\n\nWarm regards,\nThe Luxe Royalty Team\nBolton White Group`,
  },
  points_earned: {
    subject: (d) => `You earned ${d.points} Luxe Royalty points!`,
    body: (d) => `Dear ${d.name},\n\nThank you for staying with us at Bolton White Group.\n\nYour recent stay has been credited:\n• Points Earned: +${d.points} points\n• New Balance: ${d.balance} points\n• Progress to Free Night: ${d.progress}% complete\n\n${Number(d.balance) >= Number(d.threshold) ? 'Great news — you have enough points for a complimentary night! Contact us to redeem.' : `You need ${Number(d.threshold) - Number(d.balance)} more points for a free night.`}\n\nThank you for being a valued Luxe Royalty member.\n\nWarm regards,\nThe Luxe Royalty Team`,
  },
  tier_upgrade: {
    subject: (d) => `Congratulations — You've been upgraded to ${d.new_tier}!`,
    body: (d) => `Dear ${d.name},\n\nCongratulations! Based on your loyalty and continued patronage, you have been upgraded from ${d.old_tier} to ${d.new_tier} membership.\n\nYour new ${d.new_tier} benefits include:\n• ${d.discount}% discount on all services\n• ${d.multiplier}x points on every spend\n• ${d.perks}\n\nYour loyalty means everything to us. We look forward to welcoming you back for an even more elevated experience.\n\nWarm regards,\nThe Luxe Royalty Team\nBolton White Group`,
  },
  reward_redeemed: {
    subject: (d) => `Reward Confirmed: ${d.reward_name}`,
    body: (d) => `Dear ${d.name},\n\nYour reward redemption has been confirmed.\n\nRedemption Details:\n• Reward: ${d.reward_name}\n• Points Used: ${d.points_used}\n• Remaining Balance: ${d.remaining_balance} points\n\nPlease present your Luxe Royalty card (${d.card_number}) when claiming this reward at the property.\n\nThank you for being a Luxe Royalty member.\n\nWarm regards,\nThe Luxe Royalty Team`,
  },
  reminder: {
    subject: (d) => `You're close to a free night, ${d.name}!`,
    body: (d) => `Dear ${d.name},\n\nJust a reminder — you are only ${d.points_needed} points away from a complimentary night at any Bolton White Group property.\n\nYour current balance: ${d.balance} points\nTarget: ${d.threshold} points\n\nBook your next stay today and unlock your free night.\n\nWarm regards,\nThe Luxe Royalty Team`,
  },
  custom: {
    subject: (d) => String(d.subject || 'A message from Luxe Royalty'),
    body: (d) => String(d.body || ''),
  },
};

export const buildNotification = (
  type: NotificationType,
  data: Record<string, string | number>
): { subject: string; body: string } => {
  const template = NOTIFICATION_TEMPLATES[type];
  return {
    subject: template.subject(data),
    body: template.body(data),
  };
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useLoyaltyNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /** Fetch all notifications — latest first */
  const fetchNotifications = async (): Promise<LoyaltyNotification[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('loyalty_notifications')
        .select('*, loyalty_members(name, email)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return (data || []).map((n: any) => ({
        ...n,
        member_name: n.loyalty_members?.name,
        member_email: n.loyalty_members?.email,
      })) as LoyaltyNotification[];
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Failed to load notifications', description: err.message });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /** Fetch notifications for a single member */
  const fetchMemberNotifications = async (memberId: string): Promise<LoyaltyNotification[]> => {
    try {
      const { data, error } = await supabase
        .from('loyalty_notifications')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as LoyaltyNotification[];
    } catch {
      return [];
    }
  };

  /** Create a notification record (and simulate send) */
  const sendNotification = async (params: {
    member_id: string;
    type: NotificationType;
    channel: NotificationChannel;
    triggered_by: string;
    data: Record<string, string | number>;
  }): Promise<boolean> => {
    try {
      const { subject, body } = buildNotification(params.type, params.data);

      const { error } = await supabase
        .from('loyalty_notifications')
        .insert([{
          member_id: params.member_id,
          type: params.type,
          channel: params.channel,
          subject,
          body,
          status: 'sent',
          sent_at: new Date().toISOString(),
          triggered_by: params.triggered_by,
          meta: params.data,
        }]);

      if (error) {
        // Table may not exist yet — fail silently, don't block the caller
        return false;
      }

      toast({
        title: 'Notification sent',
        description: `${params.channel.toUpperCase()}: "${subject}"`,
      });

      return true;
    } catch {
      // Never throw — notifications are supplementary, not critical
      return false;
    }
  };

  /** Send the welcome notification immediately after enrolment */
  const sendWelcomeNotification = (params: {
    member_id: string;
    name: string;
    card_number: string;
    tier: string;
    discount: number;
    triggered_by: string;
  }) => {
    return sendNotification({
      member_id: params.member_id,
      type: 'welcome',
      channel: 'email',
      triggered_by: params.triggered_by,
      data: {
        name: params.name,
        card_number: params.card_number,
        tier: params.tier,
        discount: params.discount,
      },
    });
  };

  /** Send points-earned notification after a stay is logged */
  const sendPointsEarnedNotification = (params: {
    member_id: string;
    name: string;
    points: number;
    balance: number;
    threshold: number;
    triggered_by: string;
  }) => {
    const progress = Math.min(100, Math.round((params.balance / params.threshold) * 100));
    return sendNotification({
      member_id: params.member_id,
      type: 'points_earned',
      channel: 'email',
      triggered_by: params.triggered_by,
      data: {
        name: params.name,
        points: params.points,
        balance: params.balance,
        threshold: params.threshold,
        progress,
      },
    });
  };

  /** Send tier upgrade notification */
  const sendTierUpgradeNotification = (params: {
    member_id: string;
    name: string;
    old_tier: string;
    new_tier: string;
    discount: number;
    multiplier: number;
    perks: string;
    triggered_by: string;
  }) => {
    return sendNotification({
      member_id: params.member_id,
      type: 'tier_upgrade',
      channel: 'email',
      triggered_by: params.triggered_by,
      data: {
        name: params.name,
        old_tier: params.old_tier,
        new_tier: params.new_tier,
        discount: params.discount,
        multiplier: params.multiplier,
        perks: params.perks,
      },
    });
  };

  return {
    isLoading,
    fetchNotifications,
    fetchMemberNotifications,
    sendNotification,
    sendWelcomeNotification,
    sendPointsEarnedNotification,
    sendTierUpgradeNotification,
    buildNotification,
  };
};

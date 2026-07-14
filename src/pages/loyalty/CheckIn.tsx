import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Search, UserPlus, Clock, Award, Star, Gift,
  CheckCircle2, XCircle, Loader2, CalendarDays, Hotel,
  TrendingUp, Sparkles, ChevronRight, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useLoyaltyCheckin, TIER_CONFIG, LoyaltyBookingEntry, ROOM_PRICES } from '@/hooks/loyalty/useLoyaltyCheckin';
import { LoyaltyMember } from '@/hooks/loyalty/useLoyaltyMembers';

/* ─────────────────────────────────────────────
   Tier Badge Component
───────────────────────────────────────────── */
const TierBadge = ({ tier }: { tier: LoyaltyMember['tier'] }) => {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.Standard;
  const icons: Record<string, React.ReactNode> = {
    Platinum: <Sparkles className="w-3 h-3 mr-1" />,
    Gold:     <Star className="w-3 h-3 mr-1 fill-amber-500" />,
    Silver:   <Award className="w-3 h-3 mr-1" />,
    Standard: null,
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {icons[tier]}
      {tier}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Points Progress Bar
───────────────────────────────────────────── */
const PointsProgress = ({ member }: { member: LoyaltyMember }) => {
  const cfg = TIER_CONFIG[member.tier];
  const pct = Math.min(100, (member.points / cfg.freeNightAt) * 100);
  const remaining = Math.max(0, cfg.freeNightAt - member.points);
  return (
    <div className="space-y-2 mt-6">
      <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
        <span>{member.points.toLocaleString()} Points</span>
        <span>{cfg.freeNightAt.toLocaleString()} pts for Reward</span>
      </div>
      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200/50 p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {remaining > 0
        ? <p className="text-xs text-muted-foreground italic">Only {remaining.toLocaleString()} more points to unlock your next free night!</p>
        : <p className="text-xs text-green-600 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Ready for redemption
          </p>
      }
    </div>
  );
};

/* ─────────────────────────────────────────────
   Log Stay Modal
───────────────────────────────────────────── */
const LogStayModal = ({
  member,
  open,
  onClose,
  onSuccess,
}: {
  member: LoyaltyMember;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { logStay, isLoggingStay } = useLoyaltyCheckin();
  const cfg = TIER_CONFIG[member.tier];

  const [form, setForm] = useState({
    check_in_date: new Date().toISOString().split('T')[0],
    check_out_date: '',
    room_type: '',
    staff_name: '',
    notes: '',
  });

  const calculateNights = () => {
    if (!form.check_in_date || !form.check_out_date) return 0;
    const start = new Date(form.check_in_date);
    const end = new Date(form.check_out_date);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const roomPrice = form.room_type ? (ROOM_PRICES[form.room_type] || 0) : 0;
  
  const discountedDailyPrice = roomPrice * (1 - cfg.discount / 100);
  const totalAmount = discountedDailyPrice * nights;
  
  const pointsPreview = totalAmount > 0
    ? Math.floor((totalAmount / 1000) * cfg.multiplier)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAmount <= 0) return;

    const ok = await logStay(member, {
      ...form,
      amount_spent: totalAmount,
    });
    if (ok) { onSuccess(); onClose(); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-medium">
            <Hotel className="w-5 h-5 text-primary" />
            Log Stay — {member.name}
          </DialogTitle>
          <DialogDescription>
            Points are calculated automatically based on the room type and duration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Check-In</Label>
              <Input type="date" value={form.check_in_date}
                onChange={e => setForm(f => ({ ...f, check_in_date: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label>Check-Out</Label>
              <Input type="date" value={form.check_out_date}
                onChange={e => setForm(f => ({ ...f, check_out_date: e.target.value }))} required />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Room Type</Label>
            <Select onValueChange={v => setForm(f => ({ ...f, room_type: v }))} required>
              <SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger>
              <SelectContent>
                {Object.keys(ROOM_PRICES).map(r => (
                  <SelectItem key={r} value={r}>
                    {r} — ₦{ROOM_PRICES[r].toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {totalAmount > 0 && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Daily Rate:</span>
                <span className="font-medium text-gray-900">₦{roomPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{member.tier} Discount ({cfg.discount}%):</span>
                <span className="font-medium text-green-600">-₦{(roomPrice - discountedDailyPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-gray-900">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="font-medium text-gray-900">Total Billable:</span>
                <span className="text-xl font-medium text-primary">₦{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-primary/5">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  +{pointsPreview.toLocaleString()} Points to be earned
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label>Logged By</Label>
            <Input placeholder="Your name"
              value={form.staff_name}
              onChange={e => setForm(f => ({ ...f, staff_name: e.target.value }))} required />
          </div>

          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea placeholder="Special requests, etc."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="font-medium">Cancel</Button>
            <Button type="submit" disabled={isLoggingStay || totalAmount <= 0} className="gap-2 font-medium">
              {isLoggingStay ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Log Stay & Award Points
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/* ─────────────────────────────────────────────
   Stay History Row
───────────────────────────────────────────── */
const StayRow = ({ stay }: { stay: LoyaltyBookingEntry }) => (
  <div className="flex items-start justify-between py-3 border-b last:border-0">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Hotel className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium">{stay.room_type}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          {stay.check_in_date} → {stay.check_out_date}
        </p>
        {stay.notes && <p className="text-xs text-muted-foreground mt-0.5 italic">"{stay.notes}"</p>}
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-4">
      <p className="text-sm font-semibold text-green-600">+{stay.points_earned} pts</p>
      <p className="text-xs text-muted-foreground">₦{stay.amount_spent?.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{stay.discount_applied}% disc.</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const CheckIn = () => {
  const navigate = useNavigate();
  const { lookupByCardNumber, fetchStayHistory, isLoading } = useLoyaltyCheckin();

  const [cardInput, setCardInput] = useState('');
  const [searchDone, setSearchDone] = useState(false);
  const [foundMember, setFoundMember] = useState<LoyaltyMember | null>(null);
  const [stayHistory, setStayHistory] = useState<LoyaltyBookingEntry[]>([]);
  const [logStayOpen, setLogStayOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardInput.trim()) return;
    setSearchDone(false);
    const member = await lookupByCardNumber(cardInput);
    setFoundMember(member);
    setSearchDone(true);
    if (member) {
      const history = await fetchStayHistory(member.id);
      setStayHistory(history);
    } else {
      setStayHistory([]);
    }
  };

  const handleReset = () => {
    setCardInput('');
    setFoundMember(null);
    setSearchDone(false);
    setStayHistory([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleStayLogged = async () => {
    if (foundMember) {
      const member = await lookupByCardNumber(foundMember.member_id);
      setFoundMember(member);
      if (member) {
        const history = await fetchStayHistory(member.id);
        setStayHistory(history);
      }
    }
  };

  const cfg = foundMember ? TIER_CONFIG[foundMember.tier] : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight flex items-center gap-2 text-gray-900">
            <CreditCard className="w-8 h-8 text-primary" />
            Luxe Royalty Check-In
          </h1>
          <p className="text-muted-foreground mt-1">
            Enter a member's card number to retrieve their profile and points balance.
          </p>
        </div>
        <Button variant="outline" className="gap-2 flex-shrink-0 font-medium" onClick={() => navigate('/loyalty/enroll')}>
          <UserPlus className="w-4 h-4" />
          Enrol New Member
        </Button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              id="card-number-search"
              className="pl-10 h-14 text-xl font-mono tracking-[0.2em] border-gray-200 focus:ring-primary/20"
              placeholder="BWG LX123 4567"
              value={cardInput}
              onChange={e => setCardInput(e.target.value.toUpperCase())}
              autoComplete="off"
              autoFocus
            />
          </div>
          <Button type="submit" size="lg" className="h-14 gap-2 px-8 font-medium" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {isLoading ? 'Searching...' : 'Look Up'}
          </Button>
          {searchDone && (
            <Button type="button" variant="outline" size="lg" className="h-14 font-medium" onClick={handleReset}>
              Clear
            </Button>
          )}
        </div>
      </form>

      {/* Tier Quick Reference */}
      {!searchDone && (
        <div className="grid grid-cols-3 gap-4">
          {(['Silver', 'Gold', 'Platinum'] as const).map(tier => {
            const t = TIER_CONFIG[tier];
            return (
              <Card key={tier} className={`border ${t.border} ${t.bg} shadow-sm hover:shadow-md transition-shadow`}>
                <CardContent className="pt-5 pb-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <TierBadge tier={tier} />
                    <span className="text-2xl font-medium text-gray-900">{t.discount}% OFF</span>
                    <p className="text-xs text-muted-foreground">{t.multiplier}x points per ₦1k spent</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Not Found State */}
      {searchDone && !foundMember && (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="py-16 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto border border-gray-100">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-900">Member Not Found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                No profile is associated with <span className="font-mono text-gray-700 font-medium">{cardInput}</span>. Would you like to register this guest?
              </p>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Button variant="ghost" className="font-medium" onClick={handleReset}>Try Another</Button>
              <Button className="gap-2 px-8 font-medium" onClick={() => navigate('/loyalty/enroll')}>
                <UserPlus className="w-4 h-4" />
                Enrol New Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member Found State */}
      {searchDone && foundMember && cfg && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Card className={`border-none shadow-xl overflow-hidden bg-white`}>
            <div className={`h-2 ${cfg.bg} border-b ${cfg.border}`} />
            <CardContent className="pt-8 pb-8 px-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                    <span className={`text-3xl font-medium ${cfg.color}`}>
                      {foundMember.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-medium text-gray-900 tracking-tight">{foundMember.name}</h2>
                      <TierBadge tier={foundMember.tier} />
                    </div>
                    <p className="text-lg text-gray-500 font-mono tracking-widest">{foundMember.member_id}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Member since {foundMember.join_date}</span>
                      <span className="flex items-center gap-1.5"><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active Status</Badge></span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 min-w-[280px]">
                  <div><p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Lifetime Stays</p><p className="text-3xl font-medium text-gray-900">{foundMember.stays}</p></div>
                  <div><p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Points Balance</p><p className={`text-3xl font-medium ${cfg.color}`}>{foundMember.points.toLocaleString()}</p></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rewards Progress</h3>
                  <PointsProgress member={foundMember} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Privileges</h3>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                    <div className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-600" /> <span className="font-medium">{cfg.discount}% Discount</span> applied on check-out</div>
                    <div className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-600" /> <span className="font-medium">{cfg.multiplier}x Points</span> per ₦1,000 spent</div>
                    <div className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-600" /> <span className="font-medium text-primary">Priority check-in</span> enabled</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 flex gap-4">
                <Button className="flex-1 gap-2 h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all" onClick={() => setLogStayOpen(true)}>
                  <Hotel className="w-5 h-5" /> Log New Stay
                </Button>
                <Button variant="outline" className="h-14 px-8 font-medium" onClick={handleReset}>New Lookup</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="pb-4 bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" /> Recent Stay History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {stayHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No stays recorded yet.</p>
                </div>
              ) : (
                <div>
                  {stayHistory.map(stay => <StayRow key={stay.id} stay={stay} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {foundMember && (
        <LogStayModal
          member={foundMember}
          open={logStayOpen}
          onClose={() => setLogStayOpen(false)}
          onSuccess={handleStayLogged}
        />
      )}
    </div>
  );
};

export default CheckIn;


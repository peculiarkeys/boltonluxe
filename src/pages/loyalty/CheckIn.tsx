import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, UserPlus, Clock, Hotel,
  CalendarDays, Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useLoyaltyCheckin, TIER_CONFIG, LoyaltyBookingEntry, ROOM_PRICES } from '@/hooks/loyalty/useLoyaltyCheckin';
import { LoyaltyMember } from '@/hooks/loyalty/useLoyaltyMembers';

const TierBadge = ({ tier }: { tier: LoyaltyMember['tier'] }) => {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.Standard;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${cfg.color} ${cfg.bg} ${cfg.border} font-sans`}>
      {tier}
    </span>
  );
};

const PointsProgress = ({ member }: { member: LoyaltyMember }) => {
  const cfg = TIER_CONFIG[member.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.Standard;
  const pct = Math.min(100, (member.points / cfg.freeNightAt) * 100);
  const remaining = Math.max(0, cfg.freeNightAt - member.points);
  
  return (
    <div className="space-y-3 font-sans w-full">
      <div className="flex justify-between text-sm text-zinc-500 font-medium">
        <span>{member.points.toLocaleString()} pts earned</span>
        <span>{cfg.freeNightAt.toLocaleString()} pts goal</span>
      </div>
      <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-zinc-600 transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {remaining > 0 ? (
        <p className="text-sm text-zinc-400 font-medium">{remaining.toLocaleString()} pts to next reward</p>
      ) : (
        <p className="text-sm text-green-600 font-medium flex items-center gap-1">
          <Sparkles className="w-4 h-4" /> Reward ready
        </p>
      )}
    </div>
  );
};

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
  const cfg = TIER_CONFIG[member.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.Standard;

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
    if (totalAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Stay Details',
        description: 'Please ensure Check-Out is after Check-In and a Room Type is selected.',
      });
      return;
    }

    const ok = await logStay(member, {
      ...form,
      amount_spent: totalAmount,
    });
    if (ok) { onSuccess(); onClose(); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md font-sans rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-medium text-zinc-700 text-lg">Log Stay</DialogTitle>
          <DialogDescription className="text-zinc-500 font-normal">
            Record a new stay for {member.name}. Points are calculated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-600 font-medium text-xs uppercase tracking-wider">Check-In</Label>
              <Input type="date" value={form.check_in_date}
                className="bg-zinc-50 border-zinc-200 text-zinc-700 h-11 rounded-xl"
                onChange={e => setForm(f => ({ ...f, check_in_date: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-600 font-medium text-xs uppercase tracking-wider">Check-Out</Label>
              <Input type="date" value={form.check_out_date}
                className="bg-zinc-50 border-zinc-200 text-zinc-700 h-11 rounded-xl"
                onChange={e => setForm(f => ({ ...f, check_out_date: e.target.value }))} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-600 font-medium text-xs uppercase tracking-wider">Room Type</Label>
            <Select onValueChange={v => setForm(f => ({ ...f, room_type: v }))} required>
              <SelectTrigger className="bg-zinc-50 border-zinc-200 text-zinc-700 h-11 rounded-xl">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(ROOM_PRICES).map(r => (
                  <SelectItem key={r} value={r} className="text-zinc-700">
                    {r} — ₦{ROOM_PRICES[r].toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {totalAmount > 0 && (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium">Daily Rate</span>
                <span className="text-zinc-700 font-medium">₦{roomPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium">{member.tier} Discount ({cfg.discount}%)</span>
                <span className="text-green-600 font-medium">-₦{(roomPrice - discountedDailyPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium">Duration</span>
                <span className="text-zinc-700 font-medium">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
              </div>
              <Separator className="my-2 bg-zinc-200/50" />
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 font-medium">Total Billable</span>
                <span className="text-base font-medium text-zinc-700">₦{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3 h-3 text-zinc-400" />
                <span className="text-xs text-zinc-500 font-medium">
                  +{pointsPreview.toLocaleString()} points to be earned
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-zinc-600 font-medium text-xs uppercase tracking-wider">Logged By</Label>
            <Input placeholder="Staff Name"
              className="bg-zinc-50 border-zinc-200 text-zinc-700 h-11 rounded-xl"
              value={form.staff_name}
              onChange={e => setForm(f => ({ ...f, staff_name: e.target.value }))} required />
          </div>

          <DialogFooter className="pt-2 border-t border-zinc-100">
            <Button type="button" variant="ghost" onClick={onClose} className="font-medium text-zinc-500 hover:text-zinc-700 h-11 px-4">Cancel</Button>
            <Button type="submit" disabled={isLoggingStay} className="font-medium bg-zinc-700 text-white hover:bg-zinc-600 h-11 px-6 rounded-xl">
              {isLoggingStay ? "Saving..." : "Log Stay & Award"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const StayRow = ({ stay }: { stay: LoyaltyBookingEntry }) => (
  <div className="flex items-center justify-between py-4 font-sans border-b border-zinc-100 last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
        <Hotel className="w-4 h-4 text-zinc-400" />
      </div>
      <div>
        <p className="text-base font-medium text-zinc-700">{stay.room_type}</p>
        <p className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 mt-1">
          <CalendarDays className="w-3.5 h-3.5" />
          {new Date(stay.check_in_date).toLocaleDateString()} - {new Date(stay.check_out_date).toLocaleDateString()}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-base font-medium text-zinc-700 flex items-center justify-end gap-1">
        +{stay.points_earned} <span className="text-sm text-zinc-400">pts</span>
      </p>
      <p className="text-xs font-medium text-zinc-400 mt-1">₦{stay.amount_spent?.toLocaleString()}</p>
    </div>
  </div>
);

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

  const cfg = foundMember ? (TIER_CONFIG[foundMember.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.Standard) : null;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 lg:p-12 font-sans bg-[#fafafa]/50">
      <div className="w-full max-w-4xl -mt-16">
        
        {/* Main Unified Card */}
        <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden flex flex-col w-full">
          
          {/* Top Header */}
          <div className="px-10 py-8 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-zinc-700 tracking-tight">Luxe Royalty Check-In</h1>
              <p className="text-base font-medium text-zinc-500 mt-1">Retrieve member profile and points balance</p>
            </div>
            <Button variant="outline" className="font-medium text-zinc-600 border-zinc-200 rounded-xl h-12 px-6 hover:bg-zinc-50" onClick={() => navigate('/boltonadmin/loyalty/enroll')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Enrol Member
            </Button>
          </div>

          {/* Search Area */}
          <div className="p-10 bg-zinc-50/50">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
                <input
                  ref={inputRef}
                  className="w-full h-16 pl-14 pr-6 bg-white border border-zinc-200 rounded-2xl text-xl md:text-2xl font-mono text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 transition-all tracking-[0.15em] shadow-sm"
                  placeholder="BWG LX123 4567"
                  value={cardInput}
                  onChange={e => setCardInput(e.target.value.toUpperCase())}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {searchDone && (
                <Button type="button" variant="ghost" className="h-16 px-6 font-medium text-zinc-500 hover:text-zinc-700 rounded-2xl text-base" onClick={handleReset}>
                  Clear
                </Button>
              )}
              <Button type="submit" className="h-16 px-10 font-medium bg-zinc-700 text-white hover:bg-zinc-600 rounded-2xl shadow-sm text-lg transition-transform active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Look Up Profile'}
              </Button>
            </form>
          </div>

          {/* Conditional Content Area */}
          <div className="flex-1">
            {/* Initial State (Tier Quick Reference) */}
            {!searchDone && (
              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['Silver', 'Gold', 'Platinum'] as const).map(tier => {
                    const t = TIER_CONFIG[tier];
                    return (
                      <div key={tier} className="flex flex-col space-y-2 p-8 rounded-2xl bg-zinc-50/80 border border-zinc-100 hover:bg-zinc-100 transition-colors duration-300">
                        <span className="font-medium text-zinc-600 text-base">{tier}</span>
                        <span className="text-2xl font-medium text-zinc-700">{t.discount}% OFF</span>
                        <span className="text-sm font-medium text-zinc-500">{t.multiplier}x points per ₦1k</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Not Found State */}
            {searchDone && !foundMember && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6">
                  <AlertCircle className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-xl font-medium text-zinc-700 mb-2">Member Not Found</h3>
                <p className="text-base font-medium text-zinc-500 mb-8 max-w-sm">
                  No profile matched the card <span className="font-mono bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">{cardInput}</span>
                </p>
                <Button variant="outline" className="font-medium text-zinc-600 border-zinc-200 rounded-xl h-12 px-8" onClick={() => navigate('/boltonadmin/loyalty/enroll')}>
                  Enrol New Guest Profile
                </Button>
              </div>
            )}

            {/* Member Found State */}
            {searchDone && foundMember && cfg && (
              <div className="p-10 border-t border-zinc-100 animate-in fade-in duration-300">
                <div className="flex flex-col lg:flex-row gap-12">
                  
                  {/* Profile & Points - Left Side */}
                  <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-medium text-zinc-700 tracking-tight">{foundMember.name}</h2>
                        <TierBadge tier={foundMember.tier} />
                      </div>
                      <p className="text-base font-mono tracking-[0.2em] text-zinc-400">
                        {foundMember.member_id}
                      </p>
                    </div>
                    
                    <PointsProgress member={foundMember} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-zinc-100">
                      {/* Privileges Box */}
                      <div className="p-6 rounded-2xl bg-zinc-50/80 border border-zinc-100">
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">Active Privileges</p>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-base font-medium text-zinc-600">
                            <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                            {cfg.discount}% Room Discount
                          </li>
                          <li className="flex items-center gap-3 text-base font-medium text-zinc-600">
                            <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                            {cfg.multiplier}x Point Multiplier
                          </li>
                        </ul>
                      </div>

                      {/* Actions Box */}
                      <div className="flex flex-col justify-end">
                         <Button className="w-full font-medium bg-zinc-700 text-white hover:bg-zinc-600 h-14 rounded-2xl shadow-sm text-lg transition-transform active:scale-[0.98]" onClick={() => setLogStayOpen(true)}>
                          <Hotel className="w-5 h-5 mr-3" />
                          Log New Stay
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Stays - Right Side */}
                  <div className="lg:w-[360px] pl-0 lg:pl-12 lg:border-l border-zinc-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base font-medium text-zinc-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-400" />
                        Recent Stays
                      </h3>
                      <span className="text-xs font-medium text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-100">
                        {stayHistory.length}
                      </span>
                    </div>
                    
                    {stayHistory.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                          <Hotel className="w-4 h-4 text-zinc-300" />
                        </div>
                        <p className="text-sm font-medium text-zinc-400">No stays recorded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                        {stayHistory.map(stay => <StayRow key={stay.id} stay={stay} />)}
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            )}
          </div>
        </div>

        {foundMember && (
          <LogStayModal
            member={foundMember}
            open={logStayOpen}
            onClose={() => setLogStayOpen(false)}
            onSuccess={handleStayLogged}
          />
        )}
      </div>
    </div>
  );
};

export default CheckIn;

import React, { useState, useEffect } from 'react';
import {
  Bell, Mail, Send, RefreshCw, Filter, Search,
  CheckCircle, XCircle, Clock, ChevronRight, User,
  AlertTriangle, MessageSquare, Eye, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  useLoyaltyNotifications,
  LoyaltyNotification,
  NotificationType,
  NotificationChannel,
} from '@/hooks/loyalty/useLoyaltyNotifications';
import { useAuth } from '@/contexts/AuthContext';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const TYPE_LABELS: Record<NotificationType, string> = {
  welcome:        'Welcome',
  points_earned:  'Points Earned',
  tier_upgrade:   'Tier Upgrade',
  reward_redeemed:'Reward Redemption',
  reminder:       'Reminder',
  custom:         'Custom',
};

const TYPE_COLORS: Record<NotificationType, string> = {
  welcome:        'bg-blue-100 text-blue-800',
  points_earned:  'bg-green-100 text-green-800',
  tier_upgrade:   'bg-purple-100 text-purple-800',
  reward_redeemed:'bg-amber-100 text-amber-800',
  reminder:       'bg-orange-100 text-orange-800',
  custom:         'bg-gray-100 text-gray-800',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  sent:    <CheckCircle className="w-3.5 h-3.5 text-green-600" />,
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  failed:  <XCircle className="w-3.5 h-3.5 text-red-600" />,
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  email:  <Mail className="w-3.5 h-3.5" />,
  sms:    <MessageSquare className="w-3.5 h-3.5" />,
  in_app: <Bell className="w-3.5 h-3.5" />,
};

const formatDate = (d: string | null) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// ─────────────────────────────────────────────
// Notification Detail Modal
// ─────────────────────────────────────────────

const NotificationDetail = ({
  notification,
  open,
  onClose,
}: {
  notification: LoyaltyNotification | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!notification) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Notification Details
          </DialogTitle>
          <DialogDescription>
            Sent to {notification.member_name || 'Unknown Member'} via {notification.channel.toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Badge className={TYPE_COLORS[notification.type]}>
              {TYPE_LABELS[notification.type]}
            </Badge>
            <Badge variant="outline" className="gap-1">
              {CHANNEL_ICONS[notification.channel]}
              {notification.channel}
            </Badge>
            <Badge variant="outline" className="gap-1">
              {STATUS_ICONS[notification.status]}
              {notification.status}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</p>
            <p className="text-sm font-medium">{notification.subject}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message Body</p>
            <div className="rounded-lg bg-muted/40 p-3 text-sm whitespace-pre-wrap font-mono leading-relaxed text-xs">
              {notification.body}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Sent</p>
              <p className="font-medium">{formatDate(notification.sent_at)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Triggered By</p>
              <p className="font-medium">{notification.triggered_by}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────
// Stats Bar
// ─────────────────────────────────────────────

const StatsBar = ({ notifications }: { notifications: LoyaltyNotification[] }) => {
  const total = notifications.length;
  const sent = notifications.filter(n => n.status === 'sent').length;
  const pending = notifications.filter(n => n.status === 'pending').length;
  const failed = notifications.filter(n => n.status === 'failed').length;

  const byType = notifications.reduce<Record<string, number>>((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Sent',    value: total,   icon: Bell,       color: 'text-primary' },
        { label: 'Delivered',     value: sent,    icon: CheckCircle, color: 'text-green-600' },
        { label: 'Pending',       value: pending, icon: Clock,      color: 'text-amber-500' },
        { label: 'Failed',        value: failed,  icon: XCircle,    color: 'text-red-600' },
      ].map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Notifications Page
// ─────────────────────────────────────────────

const Notifications = () => {
  const { fetchNotifications, isLoading } = useLoyaltyNotifications();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<LoyaltyNotification[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<LoyaltyNotification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  useEffect(() => { loadNotifications(); }, []);

  const filtered = notifications.filter(n => {
    const matchSearch =
      !search ||
      n.member_name?.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.member_email?.toLowerCase().includes(search.toLowerCase());
    const matchType    = typeFilter === 'all'    || n.type === typeFilter;
    const matchChannel = channelFilter === 'all' || n.channel === channelFilter;
    const matchStatus  = statusFilter === 'all'  || n.status === statusFilter;
    return matchSearch && matchType && matchChannel && matchStatus;
  });

  const handleView = (n: LoyaltyNotification) => {
    setSelected(n);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            Communications Centre
          </h1>
          <p className="text-muted-foreground mt-1">
            Full log of every notification sent to Luxe Royalty members — welcome emails, points alerts, tier upgrades, and custom messages.
          </p>
        </div>
        <Button variant="outline" className="gap-2 flex-shrink-0" onClick={loadNotifications} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <StatsBar notifications={notifications} />

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by member name or subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Channels" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="in_app">In-App</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Notification Log
            <Badge variant="secondary" className="ml-2">{filtered.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading notifications…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">No notifications found.</p>
              <p className="text-xs text-muted-foreground mt-1">Notifications appear here when members are enrolled or stays are logged.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(n => (
                  <TableRow key={n.id} className="cursor-pointer hover:bg-muted/40" onClick={() => handleView(n)}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{n.member_name || '—'}</p>
                        {n.member_email && (
                          <p className="text-xs text-muted-foreground">{n.member_email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[n.type]}`}>
                        {TYPE_LABELS[n.type]}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="text-sm truncate">{n.subject}</p>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
                        {CHANNEL_ICONS[n.channel]}
                        {n.channel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-xs capitalize">
                        {STATUS_ICONS[n.status]}
                        {n.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(n.sent_at)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail modal */}
      <NotificationDetail
        notification={selected}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};

export default Notifications;

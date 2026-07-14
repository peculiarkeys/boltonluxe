import React, { useState, useRef } from 'react';
import {
  UserPlus, CreditCard, CheckCircle, ArrowRight, ArrowLeft,
  User, Phone, Mail, Star, Printer, Download, Share2,
  RefreshCw, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TIER_CONFIG, generateCardNumber } from '@/hooks/loyalty/useLoyaltyCheckin';
import { useLoyaltyNotifications } from '@/hooks/loyalty/useLoyaltyNotifications';
import { CardFlipViewer } from '@/components/loyalty/MemberCard';
import { LoyaltyMember } from '@/hooks/loyalty/useLoyaltyMembers';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ─────────────────────────────────────────────
// Step indicator
// ─────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Identity',    icon: User },
  { id: 2, label: 'Contact',     icon: Phone },
  { id: 3, label: 'Preferences', icon: Star },
  { id: 4, label: 'Preview Card',icon: CreditCard },
  { id: 5, label: 'Enroll',      icon: CheckCircle },
];

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center justify-between w-full mb-8">
    {STEPS.map((step, idx) => {
      const Icon = step.icon;
      const done = current > step.id;
      const active = current === step.id;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1">
            <div className={[
              'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
              done   ? 'bg-primary border-primary text-primary-foreground'   : '',
              active ? 'border-primary bg-primary/10 text-primary'           : '',
              !done && !active ? 'border-muted-foreground/30 text-muted-foreground' : '',
            ].join(' ')}>
              {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
            </div>
            <span className={`text-xs font-medium ${active ? 'text-primary' : done ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 transition-colors duration-300 ${done ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────
// Form state type
// ─────────────────────────────────────────────

interface EnrollFormState {
  name: string;
  birthdate: string;
  id_type: string;
  id_number: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  preferences: string;
  communication_pref: string;
  source: string;
  enrolled_by: string;
}

const INITIAL_FORM: EnrollFormState = {
  name: '',
  birthdate: '',
  id_type: '',
  id_number: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'Nigeria',
  preferences: '',
  communication_pref: 'email',
  source: 'front_desk',
  enrolled_by: '',
};

// ─────────────────────────────────────────────
// Main Enroll Page
// ─────────────────────────────────────────────

const W = 540;
const H = 340;

const Enroll = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendWelcomeNotification } = useLoyaltyNotifications();
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<EnrollFormState>({
    ...INITIAL_FORM,
    enrolled_by: user?.name || '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempMemberData, setTempMemberData] = useState<any>(null);
  const [finalMember, setFinalMember] = useState<LoyaltyMember | null>(null);

  const set = (field: keyof EnrollFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [field]: e.target.value }));

  const setSelect = (field: keyof EnrollFormState) => (val: string) =>
    setForm(f => ({ ...f, [field]: val }));

  // ── Logic ───────────────────────────────────

  const handleGenerateCard = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      const cardNumber = generateCardNumber();
      setTempMemberData({
        member_id: cardNumber,
        name: form.name,
        join_date: new Date().toISOString().split('T')[0],
        tier: 'Silver',
      });
      setIsGenerating(false);
      setStep(4);
    }, 1500);
  };

  const handleFinalEnroll = async () => {
    setIsSubmitting(true);
    try {
      const memberPayload = {
        member_id: tempMemberData.member_id,
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        address: [form.address, form.city, form.country].filter(Boolean).join(', ') || null,
        birthdate: form.birthdate || null,
        preferences: [
          form.preferences,
          form.id_type ? `ID: ${form.id_type} ${form.id_number}` : '',
          `Source: ${form.source}`,
          `Comm. pref: ${form.communication_pref}`,
        ].filter(Boolean).join('\n') || null,
        tier: 'Silver' as const,
        points: 0,
        stays: 0,
        status: 'Active' as const,
        join_date: tempMemberData.join_date,
      };

      const { data, error } = await supabase
        .from('loyalty_members')
        .insert([memberPayload])
        .select()
        .single();

      if (error) throw error;

      const member = data as LoyaltyMember;
      setFinalMember(member);

      // Best-effort notification
      try {
        await sendWelcomeNotification({
          member_id: member.id,
          name: member.name,
          card_number: member.member_id,
          tier: member.tier,
          discount: TIER_CONFIG.Silver.discount,
          triggered_by: form.enrolled_by,
        });
      } catch { /* Fail silently */ }

      setStep(5);
      toast({ title: 'Success', description: 'Member officially enrolled.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Enrollment failed', description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!tempMemberData) return;
    const text = `Welcome to Luxe Royalty! Your card number is ${tempMemberData.member_id}. Present this for your exclusive benefits at Bolton White Group.`;
    const url = `https://wa.me/${form.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPDF = async () => {
    if (!tempMemberData) return;
    
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    toast({ title: "Preparing PDF", description: "Generating high-fidelity card faces..." });

    try {
      // Create a hidden capture container
      const captureContainer = document.createElement('div');
      captureContainer.style.position = 'fixed';
      captureContainer.style.left = '-9999px';
      captureContainer.style.top = '0';
      document.body.appendChild(captureContainer);

      // Render cards into the container
      // We'll use a temporary div to render the React component
      const captureEl = document.createElement('div');
      captureContainer.appendChild(captureEl);

      // We use a bit of a hack here to render the components into the hidden div
      // but since we want it to "work well", we'll just target the refs we already have
      // but ensure they are visible for the capture or clones.
      // Clones are better.
      
      const captureFront = frontCardRef.current?.cloneNode(true) as HTMLElement;
      const captureBack = backCardRef.current?.cloneNode(true) as HTMLElement;
      
      if (!captureFront || !captureBack) throw new Error("Card elements not found");

      // Force visibility and reset transforms on clones
      [captureFront, captureBack].forEach(el => {
        el.style.transform = 'none';
        el.style.position = 'relative';
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.style.backfaceVisibility = 'visible';
        el.style.webkitBackfaceVisibility = 'visible';
        el.style.boxShadow = 'none';
        captureContainer.appendChild(el);
      });

      console.log("Starting HTML2Canvas capture...");

      // Wait for images and font to settle
      await new Promise(r => setTimeout(r, 800));

      // Capture front
      const frontCanvas = await html2canvas(captureFront, {
        scale: 3,
        useCORS: true,
        logging: true,
        backgroundColor: null,
      });

      // Capture back
      const backCanvas = await html2canvas(captureBack, {
        scale: 3,
        useCORS: true,
        logging: true,
        backgroundColor: null,
      });

      console.log("Canvas captured, generating PDF...");

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [W, H]
      });

      // Add Front
      pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, W, H);

      // Add Back
      pdf.addPage([W, H], 'landscape');
      pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, W, H);

      pdf.save(`Luxe-Royalty-${tempMemberData.member_id}.pdf`);
      
      // Cleanup
      document.body.removeChild(captureContainer);
      
      toast({ title: "Success", description: "Membership card PDF is ready." });
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast({ variant: "destructive", title: "Download failed", description: "Could not generate PDF card." });
    }
  };

  const handlePrint = () => {
    if (!tempMemberData || !frontCardRef.current || !backCardRef.current) return;
    const frontHTML = frontCardRef.current.outerHTML;
    const backHTML = backCardRef.current.outerHTML;
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>Luxe Royalty Card — ${tempMemberData.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet">
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:#f3f4f6;display:flex;flex-direction:column;align-items:center;padding:40px;font-family:'Marcellus',serif;gap:40px;}
        .card-container{box-shadow:0 10px 30px rgba(0,0,0,0.1);border-radius:20px;overflow:hidden;}
        .label{font-size:12px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;text-align:center;}
        @media print{
          body{background:white;padding:0;}
          .no-print{display:none;}
          .page-break{page-break-after:always;}
        }
      </style></head><body>
      <div class="no-print" style="margin-bottom:20px;">
        <button onclick="window.print()" style="padding:12px 30px;background:#000;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:bold;">Print Membership Card</button>
      </div>
      
      <div>
        <div class="label">Front of Card</div>
        <div class="card-container">${frontHTML}</div>
      </div>
      
      <div class="page-break"></div>
      
      <div>
        <div class="label">Back of Card</div>
        <div class="card-container">${backHTML}</div>
      </div>

      </body></html>
    `);
    win.document.close();
  };

  // ── Render ──────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-medium tracking-tight flex items-center gap-3 text-gray-900">
          <UserPlus className="w-8 h-8 text-primary" />
          Enrol New Member
        </h1>
        <p className="text-muted-foreground mt-1">Register a guest and generate their premium loyalty card.</p>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md">
        <CardContent className="pt-8 pb-8 px-10">
          <StepIndicator current={step} />

          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1">
                <h2 className="text-xl font-medium text-gray-800">Identity Details</h2>
                <p className="text-sm text-muted-foreground">Basic guest identification for the profile.</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Legal Name</Label>
                  <Input placeholder="Adaeze Okonkwo" value={form.name} onChange={set('name')} />
                </div>
                <div className="space-y-2">
                  <Label>Birthdate</Label>
                  <Input type="date" value={form.birthdate} onChange={set('birthdate')} />
                </div>
                <div className="space-y-2">
                  <Label>ID Type</Label>
                  <Select onValueChange={setSelect('id_type')} value={form.id_type}>
                    <SelectTrigger><SelectValue placeholder="Select ID" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="National ID">National ID</SelectItem>
                      <SelectItem value="NIN">NIN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ID Number</Label>
                  <Input placeholder="A00000000" value={form.id_number} onChange={set('id_number')} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} disabled={!form.name} className="px-8 gap-2 font-medium">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Contact */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1">
                <h2 className="text-xl font-medium text-gray-800">Contact Information</h2>
                <p className="text-sm text-muted-foreground">How we reach the guest for points and rewards.</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+234..." value={form.phone} onChange={set('phone')} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input placeholder="adaeze@example.com" value={form.email} onChange={set('email')} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="123 Luxury Way" value={form.address} onChange={set('address')} />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2 font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!form.phone} className="px-8 gap-2 font-medium">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1">
                <h2 className="text-xl font-medium text-gray-800">Preferences & Log</h2>
                <p className="text-sm text-muted-foreground">Final details before card generation.</p>
              </div>
              <Separator />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Guest Preferences</Label>
                  <Textarea placeholder="Pillow type, floor preference, etc." value={form.preferences} onChange={set('preferences')} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Enrolled By</Label>
                    <Input value={form.enrolled_by} onChange={set('enrolled_by')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Communication Channel</Label>
                    <Select onValueChange={setSelect('communication_pref')} value={form.communication_pref}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2 font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleGenerateCard} disabled={isGenerating || !form.enrolled_by} className="px-8 gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg transition-all">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Generate Card
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Preview Card */}
          {step === 4 && tempMemberData && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-medium text-gray-800">Luxe Royalty Identity Generated</h2>
                <p className="text-muted-foreground text-sm">Review the member card. Click to flip and see details.</p>
              </div>

              <div className="py-4">
                <CardFlipViewer
                  card={{
                    cardNumber: tempMemberData.member_id,
                    holderName: tempMemberData.name,
                    joinDate: tempMemberData.join_date,
                    tier: tempMemberData.tier,
                  }}
                  frontRef={frontCardRef}
                  backRef={backCardRef}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3 w-full">
                <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                <Button variant="outline" onClick={handleWhatsAppShare} className="gap-2 border-green-600 text-green-700 hover:bg-green-50">
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </Button>
                <Button onClick={handleFinalEnroll} disabled={isSubmitting} className="gap-2 px-10 bg-primary text-white font-medium shadow-lg hover:shadow-xl transition-all">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Official Enrollment
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && finalMember && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 text-center flex flex-col items-center py-10">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-medium text-gray-900">Member Enrolled</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {finalMember.name} is now officially a Luxe Royalty member.
                  The welcome pack and digital card have been issued.
                </p>
              </div>

              <Separator className="max-w-md mx-auto" />

              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" /> Print Receipt
                </Button>
                <Button onClick={() => window.location.reload()} className="gap-2 px-8">
                  Enrol Next Guest
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Enroll;

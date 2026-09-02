import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, FileText, Heart, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConsumerAuth } from '../contexts/ConsumerAuthContext';
import { toast } from 'sonner';

const ConsumerAccount = () => {
  const { user } = useConsumerAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    passport: '',
    nationality: '',
    preferences: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.email) return;

        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching guest profile:', error);
        }

        if (data) {
          setProfile({
            name: data.name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            passport: data.passport_number || '',
            nationality: data.nationality || '',
            preferences: data.preferences || '',
          });
        } else {
          setProfile((prev) => ({ ...prev, email: user.email || '' }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.email) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          name: profile.name || null,
          phone: profile.phone || null,
          address: profile.address || null,
          passport_number: profile.passport || null,
          nationality: profile.nationality || null,
          preferences: profile.preferences || null,
        })
        .eq('email', user.email);

      if (error) {
        console.error('Profile save error:', error);
        toast.error('Failed to update profile.');
      } else {
        toast.success('Profile updated successfully.');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      toast.error('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <p className="font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto pb-12 font-sans">
      <header className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-800 leading-tight">
          Your Profile
        </h1>
        <p className="text-zinc-600 text-lg font-medium leading-relaxed max-w-2xl">
          Manage your personal details to help us customize your stay perfectly.
        </p>
      </header>

      <div className="space-y-8">
        <section className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-zinc-200/60 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-xl font-semibold text-zinc-800 mb-8 flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <User size={20} strokeWidth={2} className="text-zinc-600" />
            </div>
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2 group">
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 ml-1">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-zinc-50/50 border border-zinc-200/50 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700 font-medium group-hover:bg-white"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2 group">
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={2} />
                <input 
                  type="email" 
                  value={profile.email}
                  className="w-full bg-zinc-50/50 border border-zinc-200/50 rounded-2xl pl-11 pr-5 py-3.5 text-zinc-500 font-medium cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2 group">
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={2} />
                <input 
                  type="tel" 
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-zinc-50/50 border border-zinc-200/50 rounded-2xl pl-11 pr-5 py-3.5 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700 font-medium group-hover:bg-white"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="space-y-2 group">
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 ml-1">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={2} />
                <input 
                  type="text" 
                  value={profile.address}
                  onChange={e => setProfile({...profile, address: e.target.value})}
                  className="w-full bg-zinc-50/50 border border-zinc-200/50 rounded-2xl pl-11 pr-5 py-3.5 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700 font-medium group-hover:bg-white"
                  placeholder="Street, City, Country"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-zinc-200/60 shadow-sm flex flex-col transition-all hover:shadow-md">
            <h2 className="text-xl font-semibold text-zinc-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-zinc-100 rounded-xl">
                <FileText size={20} strokeWidth={2} className="text-zinc-600" />
              </div>
              Documents
            </h2>
            <div className="space-y-6 flex-1">
              <div className="space-y-2 group">
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 ml-1">Passport Number</label>
                <input 
                  type="text" 
                  value={profile.passport}
                  onChange={e => setProfile({...profile, passport: e.target.value})}
                  className="w-full bg-zinc-50/50 border border-zinc-200/50 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700 font-medium group-hover:bg-white"
                  placeholder="Required for international stays"
                />
              </div>
              <div className="space-y-2 group">
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-500 ml-1">Nationality</label>
                <input 
                  type="text" 
                  value={profile.nationality}
                  onChange={e => setProfile({...profile, nationality: e.target.value})}
                  className="w-full bg-zinc-50/50 border border-zinc-200/50 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700 font-medium group-hover:bg-white"
                  placeholder="e.g. British, American"
                />
              </div>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-zinc-200/60 shadow-sm flex flex-col transition-all hover:shadow-md">
            <h2 className="text-xl font-semibold text-zinc-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-zinc-100 rounded-xl">
                <Heart size={20} strokeWidth={2} className="text-zinc-600" />
              </div>
              Stay Preferences
            </h2>
            <p className="text-sm text-zinc-500 mb-6 font-medium">
              Let us know how to prepare your room for maximum comfort.
            </p>
            <textarea 
              value={profile.preferences}
              onChange={e => setProfile({...profile, preferences: e.target.value})}
              className="w-full flex-1 min-h-[120px] bg-zinc-50/50 border border-zinc-200/50 rounded-2xl p-5 focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700 font-medium resize-none hover:bg-white"
              placeholder="e.g. High floor, extra pillows, allergic to down..."
            ></textarea>
          </section>
        </div>

        <div className="flex justify-end pt-6">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="group relative px-8 py-4 bg-zinc-800 text-white font-semibold rounded-2xl hover:bg-zinc-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={20} className="transition-transform group-hover:scale-110" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumerAccount;

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, FileText, Heart } from 'lucide-react';
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
        if (!user?.email) {
          return;
        }

        const { data: allMembers, error } = await supabase.rpc('get_all_loyalty_members');
        let data = null;
        if (allMembers && allMembers.length > 0) {
          data = allMembers.find((m: any) => m.email === user.email);
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
        setProfile((prev) => ({ ...prev, email: user?.email || '' }));
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
      // Find the member by email first
      const { data: allMembers } = await supabase.rpc('get_all_loyalty_members');
      const member = allMembers?.find((m: any) => m.email === user.email);
      
      if (!member) {
        console.error('Member not found for email:', user.email);
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('loyalty_members')
        .update({
          phone: profile.phone || null,
          address: profile.address || null,
          preferences: profile.preferences || null,
        })
        .eq('id', member.id);

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

  if (loading) return <div className="p-8 text-center text-gray-400 font-normal">Loading...</div>;

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
      <header>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-700 leading-tight">
          Your profile
        </h1>
        <p className="text-gray-500 mt-4 text-lg font-normal leading-relaxed">
          Manage your personal details to help us customize your stay perfectly.
        </p>
      </header>

      <div className="space-y-8">
        <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-medium text-gray-700 mb-8 flex items-center gap-3">
            <User size={24} strokeWidth={1.5} className="text-gray-400" /> Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest font-medium text-gray-400">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                className="w-full bg-gray-50/50 border-0 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all text-gray-700 font-normal"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest font-medium text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-gray-400" size={18} strokeWidth={1.5} />
                <input 
                  type="email" 
                  value={profile.email}
                  className="w-full bg-gray-50/50 border-0 rounded-2xl pl-12 pr-5 py-4 focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all text-gray-700 font-normal"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest font-medium text-gray-400">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-gray-400" size={18} strokeWidth={1.5} />
                <input 
                  type="tel" 
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-gray-50/50 border-0 rounded-2xl pl-12 pr-5 py-4 focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all text-gray-700 font-normal"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest font-medium text-gray-400">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} strokeWidth={1.5} />
                <input 
                  type="text" 
                  value={profile.address}
                  onChange={e => setProfile({...profile, address: e.target.value})}
                  className="w-full bg-gray-50/50 border-0 rounded-2xl pl-12 pr-5 py-4 focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all text-gray-700 font-normal"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col">
            <h2 className="text-2xl font-medium text-gray-700 mb-8 flex items-center gap-3">
              <FileText size={24} strokeWidth={1.5} className="text-gray-400" /> Documents
            </h2>
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-medium text-gray-400">Passport Number</label>
                <input 
                  type="text" 
                  value={profile.passport}
                  onChange={e => setProfile({...profile, passport: e.target.value})}
                  className="w-full bg-gray-50/50 border-0 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all text-gray-700 font-normal"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-medium text-gray-400">Nationality</label>
                <input 
                  type="text" 
                  value={profile.nationality}
                  onChange={e => setProfile({...profile, nationality: e.target.value})}
                  className="w-full bg-gray-50/50 border-0 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all text-gray-700 font-normal"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col">
            <h2 className="text-2xl font-medium text-gray-700 mb-4 flex items-center gap-3">
              <Heart size={24} strokeWidth={1.5} className="text-gray-400" /> Stay Preferences
            </h2>
            <p className="text-sm text-gray-500 mb-6 font-normal">
              Let us know how to prepare your room for maximum comfort.
            </p>
            <textarea 
              value={profile.preferences}
              onChange={e => setProfile({...profile, preferences: e.target.value})}
              className="w-full flex-1 min-h-[120px] bg-gray-50/50 border-0 rounded-2xl p-5 focus:ring-1 focus:ring-gray-200 focus:bg-white transition-all text-gray-700 font-normal resize-none"
              placeholder="e.g. Extra pillows, high floor..."
            ></textarea>
          </section>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-4 bg-gray-800 text-white font-medium rounded-full hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumerAccount;

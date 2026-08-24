import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const ConsumerSignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (data: SignUpFormValues) => {
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      if (authData?.user?.email) {
        const memberId = 'BWG LX' + Math.floor(100 + Math.random() * 900) + ' ' + Math.floor(1000 + Math.random() * 9000);
        
        await supabase.from('loyalty_members').insert([
          {
            name: data.fullName,
            email: authData.user.email,
            member_id: memberId,
            tier: 'Bronze',
            points: 500,
            stays: 0,
            status: 'Active',
            join_date: new Date().toISOString().split('T')[0]
          }
        ]);

        await supabase.from('guests').insert([
          {
            first_name: data.fullName.split(' ')[0] || '',
            last_name: data.fullName.split(' ').slice(1).join(' ') || '',
            email: authData.user.email,
            phone: '',
          }
        ]);
      }
      navigate('/dashboard');
    }
  };

  return (
    <div className="consumer-app h-screen w-full flex flex-row-reverse font-normal bg-white">
        
        {/* Right Side (Now Left): Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-4xl font-medium text-gray-800 mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-normal mb-8 text-sm">Join the Bolton Luxe loyalty program today.</p>
            
            <form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
              
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  {...register('fullName')}
                  placeholder="Jane Doe"
                  className={`w-full bg-white border ${errors.fullName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-gray-400 focus:border-gray-400'} rounded-xl px-4 py-3.5 focus:ring-1 outline-none transition-all text-gray-800 placeholder:text-gray-400`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  {...register('email')}
                  placeholder="Janedoe@mail.com"
                  className={`w-full bg-white border ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-gray-400 focus:border-gray-400'} rounded-xl px-4 py-3.5 focus:ring-1 outline-none transition-all text-gray-800 placeholder:text-gray-400`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              
              <div className="space-y-1.5 relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    {...register('password')}
                    placeholder="••••••••"
                    className={`w-full bg-white border ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-gray-400 focus:border-gray-400'} rounded-xl pl-4 pr-12 py-3.5 focus:ring-1 outline-none transition-all text-gray-800 placeholder:text-gray-400`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="pt-2 space-y-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <button 
                  type="button" 
                  className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-gray-500 text-sm">
              Already have an account? <Link to="/login" className="text-gray-700 font-medium ml-1 relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gray-700 after:left-0 after:-bottom-1">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Left Side (Now Right): Image & Glassmorphic Card */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* Glassmorphic Testimonial Card */}
          <div className="absolute bottom-12 left-12 right-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] p-8 text-white shadow-2xl">
            <p className="text-2xl font-medium leading-relaxed mb-8 drop-shadow-sm">
              "Every journey we organize is built on trust, safety, and unforgettable views."
            </p>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium">Liam Chen</h4>
                <p className="text-white/80 text-sm mt-1">Guest Relations<br/>Bolton Luxe Collection</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ConsumerSignUp;

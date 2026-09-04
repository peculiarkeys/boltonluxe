import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const bgImages = [
  '/hotels/bolton_white_hotel/BC3I7813.webp',
  '/hotels/bolton_white_hotel/BC3I7828.webp',
  '/hotels/bolton_white_hotel/IMG-20260617-WA0013.webp',
  '/hotels/bolton_white_residence/hero-bg.jpg',
  '/hotels/johnwood_hotel/7K4A0310-Edit_compressed.webp',
  '/hotels/johnwood_hotel/7K4A0327-Edit_compressed.webp',
  '/hotels/johnwood_hotel/7K4A8108-Edit_compressed.webp'
];

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const ConsumerSignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (data: SignUpFormValues) => {
    setLoading(true);
    setError(null);

    const redirectUrl = 'https://loyalty.boltonwhitegroup.com/login';

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) {
        const errMsg = authError.message || JSON.stringify(authError);
        setError(errMsg === '{}' ? 'An unexpected error occurred during sign up.' : errMsg);
        setLoading(false);
      } else {
        if (authData?.user?.email) {
          const memberId = 'BWG LX' + Math.floor(100 + Math.random() * 900) + ' ' + Math.floor(1000 + Math.random() * 9000);
          
          try {
            await supabase.from('loyalty_members').insert([
              {
                name: data.fullName,
                email: authData.user.email,
                member_id: memberId,
                tier: 'Standard',
                points: 500,
                stays: 0,
                status: 'Active',
                join_date: new Date().toISOString().split('T')[0]
              }
            ]);
          } catch (dbError) {
            console.error('Failed to create loyalty member record:', dbError);
          }
          
          // Fire and forget emails
          fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authData.user.email, fullName: data.fullName, memberId, tier: 'Standard', points: 500 }),
          }).catch(e => console.error(e));

          fetch('/api/send-admin-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authData.user.email, fullName: data.fullName, memberId, tier: 'Standard' }),
          }).catch(e => console.error(e));

          setRegisteredEmail(authData.user.email);
          setIsUnconfirmedEmail(true);
          setIsSuccess(true);
          setLoading(false);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (e: any) {
      const errMsg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e));
      setError(errMsg === '{}' ? "An unexpected error occurred during sign up." : errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="consumer-app h-screen w-full flex flex-row-reverse font-normal bg-white">
        
        {/* Right Side (Now Left): Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <img src="/logo.png" alt="Bolton Luxe" className="h-8 mb-8 object-contain" />
            
            {isSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-medium text-gray-800 mb-4">Check your email</h2>
                <p className="text-gray-500 mb-8 text-sm">
                  We've sent a confirmation link to <span className="font-medium text-gray-800">{registeredEmail}</span>. 
                  Please click the link to confirm your account and continue to login.
                </p>
                <Link 
                  to="/login"
                  className="inline-block w-full py-3.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
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
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      {...register('phoneNumber')}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full bg-white border ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-gray-400 focus:border-gray-400'} rounded-xl px-4 py-3.5 focus:ring-1 outline-none transition-all text-gray-800 placeholder:text-gray-400`}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
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

                  </div>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                  Already have an account? <Link to="/login" className="text-gray-700 font-medium ml-1 relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gray-700 after:left-0 after:-bottom-1">Sign in</Link>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Left Side (Now Right): Image & Glassmorphic Card */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gray-100 overflow-hidden">
          {bgImages.map((src, index) => (
            <img 
              key={src}
              src={src} 
              alt="Bolton Luxe Properties" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          {/* Enhanced Premium Testimonial Section */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent z-10 pointer-events-none"></div>
          
          <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
            <div className="flex gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#fbbf24" strokeWidth={0} />
              ))}
            </div>
            
            <p className="text-3xl sm:text-4xl font-normal leading-snug mb-10 text-white/95 max-w-2xl">
              "Every journey we organize is built on trust, safety, and unforgettable views."
            </p>
            
            <div className="flex items-center justify-between border-t border-white/20 pt-8">
              <div className="flex flex-col justify-center">
                <h4 className="text-lg font-semibold tracking-wide !text-white">Liam Chen</h4>
                <p className="text-white/60 text-xs tracking-[0.2em] uppercase mt-1">Guest Relations</p>
              </div>
              
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm group">
                  <ChevronLeft size={20} strokeWidth={1.5} className="text-white/70 group-hover:text-white transition-colors" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95">
                  <ChevronRight size={20} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ConsumerSignUp;

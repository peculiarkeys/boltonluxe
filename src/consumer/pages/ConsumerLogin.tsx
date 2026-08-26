import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const bgImages = [
  '/hotels/bolton_white_hotel/BC3I7813.webp',
  '/hotels/bolton_white_hotel/BC3I7828.webp',
  '/hotels/bolton_white_hotel/IMG-20260617-WA0013.webp',
  '/hotels/bolton_white_residence/hero-bg.jpg',
  '/hotels/johnwood_hotel/7K4A0310-Edit_compressed.webp',
  '/hotels/johnwood_hotel/7K4A0327-Edit_compressed.webp',
  '/hotels/johnwood_hotel/7K4A8108-Edit_compressed.webp'
];

const ConsumerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="consumer-app h-screen w-full flex font-normal bg-white">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <img src="/logo.png" alt="Bolton Luxe" className="h-8 mb-8 object-contain" />
            <h1 className="text-4xl font-medium text-gray-800 mb-2 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 font-normal mb-8 text-sm">Welcome back! Please enter your details.</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
              
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-1.5 relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-gray-800 placeholder:text-gray-400"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-gray-800 focus:ring-gray-800" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-gray-700 hover:underline">Forgot password</a>
              </div>

              <div className="pt-2 space-y-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

              </div>
            </form>

            <p className="mt-8 text-center text-gray-500 text-sm">
              Don't have an account? <Link to="/signup" className="text-gray-700 font-medium ml-1 relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gray-700 after:left-0 after:-bottom-1">Sign up for free</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image & Glassmorphic Card */}
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
              "To provide our guests the best experiences, we are constantly perfecting every detail of your stay."
            </p>
            
            <div className="flex items-center justify-between border-t border-white/20 pt-8">
              <div className="flex flex-col justify-center">
                <h4 className="text-lg font-semibold tracking-wide !text-white">Eleanor Vance</h4>
                <p className="text-white/60 text-xs tracking-[0.2em] uppercase mt-1">Concierge Director</p>
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

export default ConsumerLogin;

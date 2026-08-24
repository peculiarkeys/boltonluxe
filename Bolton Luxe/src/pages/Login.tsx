import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="h-screen w-full flex font-normal bg-white">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-4xl font-medium text-gray-900 mb-2 tracking-tight">Welcome back</h1>
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
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-gray-900 placeholder:text-gray-400"
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
                    className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all text-gray-900 placeholder:text-gray-400"
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
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-gray-900 hover:underline">Forgot password</a>
              </div>

              <div className="pt-2 space-y-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-[#111827] text-white rounded-xl font-medium hover:bg-black transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
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
                  Sign in with Google
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-gray-500 text-sm">
              Don't have an account? <Link to="/signup" className="text-gray-900 font-medium ml-1 relative inline-block after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-gray-900 after:left-0 after:-bottom-1">Sign up for free</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image & Glassmorphic Card */}
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
              "To provide our guests the best experiences, we are constantly perfecting every detail of your stay."
            </p>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium">Eleanor Vance</h4>
                <p className="text-white/80 text-sm mt-1">Concierge Director<br/>Bolton Luxe Collection</p>
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

export default Login;

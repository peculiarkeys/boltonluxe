
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { role: 'Director', email: 'director@boltonhq.com', password: 'password' },
    { role: 'Group GM', email: 'gm@boltonhq.com', password: 'password' },
    { role: 'Manager', email: 'manager@boltonhq.com', password: 'password' },
    { role: 'Staff', email: 'staff@boltonhq.com', password: 'password' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] dark:bg-[#0A0A0B] font-sans selection:bg-primary/20">
      {/* Left Column: Brand imagery (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" 
          style={{ backgroundImage: "url('/hotel_card_bg.png')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bolton-blue/80 to-bolton-blue-dark/95" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-20 h-full w-full">
          <img 
            src="/app_logo.png" 
            alt="Bolton HQ" 
            className="h-10 w-auto object-contain brightness-0 invert self-start animate-fade-in opacity-90" 
          />
          
          <div className="text-white max-w-lg animate-fade-in [animation-delay:200ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
            <h1 className="text-4xl md:text-5xl font-heading font-light tracking-tight mb-8 leading-tight">
              Elevate Your <br />
              <span className="font-medium text-white/95">Hospitality Management.</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Experience seamless operations, unmatched guest experiences, and powerful insights with the Bolton HQ platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-[400px] animate-fade-in space-y-12">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img 
              src="/app_logo.png" 
              alt="Bolton HQ" 
              className="h-10 w-auto object-contain drop-shadow-sm opacity-90 dark:invert" 
            />
          </div>

          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-3xl font-heading font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back
            </h2>
            <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400 ml-1">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-2xl bg-white dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-zinc-400 text-[15px]"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
                    Password
                  </Label>
                  <a href="#" className="text-[13px] font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 rounded-2xl bg-white dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-[15px]"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 mt-6 rounded-2xl font-medium text-[15px] shadow-[0_4px_14px_0_rgba(21,105,218,0.2)] hover:shadow-[0_6px_20px_rgba(21,105,218,0.23)] hover:bg-bolton-blue-light transition-all active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative pt-6">
              <div className="absolute inset-0 flex items-center mt-6">
                <span className="w-full border-t border-zinc-200/60 dark:border-zinc-800/40" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-[#F9FAFB] dark:bg-[#0A0A0B] px-4 text-zinc-400 font-medium tracking-widest">
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {demoUsers.map((user, index) => (
                <Button
                  key={index}
                  variant="outline"
                  type="button"
                  className="h-12 rounded-2xl text-[13px] font-medium border-zinc-200/60 dark:border-zinc-800/60 hover:bg-white dark:hover:bg-zinc-900 shadow-sm transition-all"
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                  }}
                >
                  {user.role}
                </Button>
              ))}
            </div>
          </div>
          
          <p className="text-center text-[13px] text-zinc-400 font-medium pt-8">
            &copy; {new Date().getFullYear()} Bolton HQ. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

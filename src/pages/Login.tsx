import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import TermsModal from '@/components/TermsModal';
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  if (user) {
    return <Navigate to="/boltonadmin" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/boltonadmin');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 font-sans">
      {/* Left Column: Brand imagery */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-zinc-900 overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <img 
            src="/hotels/bolton_white_hotel/BC3I7813.webp" 
            alt="Bolton White Group" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-zinc-900/40" />
        </div>
        
        <div className="relative z-10">
          <img 
            src="/app_logo.png" 
            alt="Bolton HQ" 
            className="h-10 w-auto object-contain brightness-0 invert opacity-90" 
          />
        </div>

        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-4xl font-medium tracking-tight mb-6 leading-tight text-white">
            Bolton HQ <br />
            <span className="text-zinc-400 font-normal">Workspace</span>
          </h1>
          <p className="text-base text-zinc-400 font-normal leading-relaxed">
            Secure access to property management, loyalty operations, and business development tools for authorized personnel.
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-32 relative">
        <div className="w-full max-w-md mx-auto space-y-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-12">
            <img 
              src="/app_logo.png" 
              alt="Bolton HQ" 
              className="h-10 w-auto object-contain" 
            />
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Admin Portal
            </h2>
            <p className="text-base text-zinc-500 font-normal">
              Sign in with your staff credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@boltonhq.com"
                  {...register('email')}
                  className={`h-14 pl-12 rounded-xl bg-white border-zinc-200 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:border-transparent text-base ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                  Password
                </Label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`h-14 pl-12 rounded-xl bg-white border-zinc-200 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:border-transparent text-base ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>}
            </div>
            <div className="space-y-2 mt-4 pb-2">
              <label className="flex items-center text-sm font-medium text-zinc-700 cursor-pointer">
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mr-2 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                I agree to the <button type="button" onClick={() => setShowTerms(true)} className="ml-1 text-zinc-900 hover:underline font-semibold">Terms of Service</button>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 mt-8 rounded-xl font-medium text-base bg-zinc-900 text-white shadow-md hover:bg-zinc-800 transition-all flex items-center justify-center gap-2" 
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Workspace'}
              {!isLoading && <ArrowRight className="w-5 h-5 opacity-70" />}
            </Button>
          </form>
          
          <div className="pt-12 text-center lg:text-left border-t border-zinc-200/60 mt-12">
            <p className="text-sm text-zinc-400 font-medium">
              &copy; {new Date().getFullYear()} Bolton White Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

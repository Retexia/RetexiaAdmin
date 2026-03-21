import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Mail, ArrowRight, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logoUrl from '../assets/logo.jpg';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      const userId = authData.user.id;
      let finalName = displayName;
      
      if (displayName) {
        await supabase.auth.updateUser({
          data: { full_name: displayName }
        });
      } else {
        finalName = authData.user.user_metadata?.full_name || email.split('@')[0];
      }

      // Upsert profile into public.profiles table
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: finalName,
        role: 'Administrator' // default fallback role
      }, { onConflict: 'id' });
      
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-zinc-950 font-sans items-center justify-center relative overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md p-6 sm:p-8 relative z-10">
        
        <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-xl shadow-indigo-900/30 mx-auto mb-6 border border-zinc-800 bg-zinc-900">
            <img src={logoUrl} alt="Retexia" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Sign in to the Retexia Business Admin.</p>
        </div>

        <form 
          onSubmit={handleLogin} 
          className="space-y-6 bg-[#131316]/80 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl border border-zinc-800/80 shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both"
        >
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-medium text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Display Name (Optional)</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <Input 
                type="text" 
                placeholder="How should we call you?" 
                className="pl-11 w-full bg-zinc-900/50 border-zinc-800 h-12 text-base transition-colors focus:bg-zinc-900"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <Input 
                type="email" 
                placeholder="admin@retexia.com" 
                className="pl-11 w-full bg-zinc-900/50 border-zinc-800 h-12 text-base transition-colors focus:bg-zinc-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1 mr-1">
              <label className="text-sm font-semibold text-zinc-300">Password</label>
              <a href="#" className="text-[13px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-11 w-full bg-zinc-900/50 border-zinc-800 h-12 text-base transition-colors focus:bg-zinc-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full gap-2 py-6 text-[15px] mt-4 shadow-lg shadow-indigo-900/40 relative overflow-hidden group" 
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? 'Authenticating...' : 'Sign In Securely'}
              {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </span>
          </Button>
        </form>

        <p className="text-center text-[13px] font-medium text-zinc-600 mt-8 animate-in fade-in duration-1000 delay-300 fill-mode-both">
          &copy; {new Date().getFullYear()} Retexia Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}

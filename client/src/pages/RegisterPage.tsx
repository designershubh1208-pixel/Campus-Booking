import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserPlus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Simple Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center bg-[#f9fafb] p-6 lg:p-10 relative order-2 lg:order-1">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] opacity-60 pointer-events-none -translate-y-1/2 -translate-x-1/3" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[440px] relative z-10"
        >
          <div className="mb-8">
            <div className="w-14 h-14 bg-white border border-slate-200/60 shadow-sm rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <UserPlus className="w-7 h-7" />
            </div>
            <h2 className="font-display text-[32px] lg:text-[40px] font-black text-[#0a1b33] tracking-tight leading-none mb-3">
              Create Account
            </h2>
            <p className="text-slate-500 text-[16px]">
              Join thousands of students managing their campus resources effortlessly.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-8 font-bold border border-red-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" /> <span className="line-clamp-2">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0a1b33] ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-12 pr-4 text-[15px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0a1b33] ml-1">University Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-12 pr-4 text-[15px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0a1b33] ml-1">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-12 pr-4 text-[15px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold shadow-sm hover:border-slate-300"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full bg-indigo-600 text-white py-4 rounded-[20px] font-black text-[15px] shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border border-slate-200 text-[#0a1b33] py-4 rounded-[20px] font-bold text-[15px] shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            <GoogleIcon />
            Sign in with Google
          </button>

          <p className="text-center text-slate-500 text-[15px] mt-10 font-bold">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700">Sign in securely</Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Visual/Theme match with landing page */}
      <div className="hidden lg:flex relative w-1/2 bg-[#0a1b33] overflow-hidden items-center justify-center order-1 lg:order-2">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b33] via-[#0a1b33]/40 to-transparent opacity-80" />
        
        <div className="relative z-10 p-10 lg:p-12 xl:p-16 max-w-lg">
          <div className="mb-6">
            <span className="text-indigo-400 font-sans text-[11px] lg:text-[13px] tracking-[0.3em] uppercase font-bold">
              Join Your Peers
            </span>
          </div>
          <h1 className="font-display text-[40px] lg:text-[48px] xl:text-[56px] font-black tracking-tight text-white leading-[1.05]">
            <span className="text-indigo-400 font-black">L</span>earn.<br /> 
            <span className="text-indigo-400 font-black">G</span>row.<br />
            <span className="text-indigo-400 font-black">A</span>chieve.
          </h1>
          <p className="text-indigo-100/70 font-sans text-[16px] font-medium mt-6 leading-relaxed">
            Create your account to seamlessly reserve campus resources and manage your academic schedule.
          </p>
        </div>
      </div>
    </div>
  );
};

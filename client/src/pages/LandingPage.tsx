import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, Clock, ShieldCheck, ArrowRight, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const logos = [
  { name: 'Procure', src: 'https://svgl.app/library/vercel.svg', gradient: 'bg-gradient-to-r from-blue-500 to-cyan-400' }, 
  { name: 'Shopify', src: 'https://svgl.app/library/shopify.svg', gradient: 'bg-gradient-to-r from-green-400 to-emerald-600' },
  { name: 'Blender', src: 'https://svgl.app/library/blender.svg', gradient: 'bg-gradient-to-r from-orange-400 to-blue-500' },
  { name: 'Figma', src: 'https://svgl.app/library/figma.svg', gradient: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { name: 'Spotify', src: 'https://svgl.app/library/spotify.svg', gradient: 'bg-gradient-to-r from-green-400 to-emerald-500' },
  { name: 'Lottielab', src: 'https://svgl.app/library/lottielab.svg', gradient: 'bg-gradient-to-r from-yellow-400 to-green-500' },
  { name: 'Google Cloud', src: 'https://svgl.app/library/google-cloud.svg', gradient: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  { name: 'Bing', src: 'https://svgl.app/library/bing.svg', gradient: 'bg-gradient-to-r from-cyan-400 to-teal-500' },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="w-full min-h-screen bg-[#f9fafb] pt-10 pb-10 overflow-hidden">
      {/* Hero Section */}
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
        
        {/* Background Video Layer */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
          />
        </div>

        {/* Hero Text Content */}
        <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {user && (
              <div className="mb-4">
                <span className="text-blue-600 font-bold text-lg flex items-center gap-2">
                  Welcome back, {user.name?.split(' ')[0] || user.email.split('@')[0]}
                </span>
              </div>
            )}
            <div className="mb-6">
              <span className="text-slate-500 font-sans text-[11px] md:text-[13px] tracking-[0.3em] uppercase font-bold">
                Campus Resource Booking System
              </span>
            </div>
            <h1 className="font-display text-[56px] md:text-[80px] font-black tracking-tighter text-[#0a1b33] leading-[1.05]">
              <span className="text-blue-600">S</span>paces. <span className="text-blue-600">S</span>ystems.<br />
              <span className="text-blue-600">S</span>chedules.
            </h1>
            <p className="font-sans text-[14px] md:text-[15px] font-bold text-[#64748b] mt-4 max-w-lg leading-relaxed">
              Designing simple solutions, powering student ecosystems and laying the foundation of a hassle-free waitlist system for resources, facilities and communities alike.
            </p>
            <Link to={user ? "/resources" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 bg-[#0a152d] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                Book Now
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Bottom Navbar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex items-center gap-1 bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40"
          >
            <div className="w-9 h-9 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center ml-0.5">
              <span className="text-[#0a1b33] font-black">✦</span>
            </div>
            
            <div className="flex items-center px-4 gap-6">
              <Link to="/resources" className="text-[12px] font-bold text-slate-500 hover:text-[#0a1b33] transition-colors">
                Resources
              </Link>
              <Link to="/dashboard" className="text-[12px] font-bold text-slate-500 hover:text-[#0a1b33] transition-colors">
                My Bookings
              </Link>
              <Link to="/dashboard" className="text-[12px] font-bold text-slate-500 hover:text-[#0a1b33] transition-colors">
                Dashboard
              </Link>
            </div>

            <Link to="/register" className="ml-2">
              <div className="bg-white px-5 py-2 rounded-full text-[12px] font-bold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all flex items-center gap-1 group">
                Get Started
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0a1b33] transition-colors" />
              </div>
            </Link>
          </motion.nav>
        </div>
      </div>

      {/* Seamless Marquee Scroller Component */}
      <div className="mt-16 relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="flex w-fit animate-marquee gap-6 items-center py-4">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden cursor-pointer"
            >
              <div className={`absolute inset-0 scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${logo.gradient}`} />
              <img
                src={logo.src}
                alt={logo.name}
                className="h-10 w-auto relative z-10 transition-all duration-300 group-hover:brightness-0 group-hover:invert opacity-80 group-hover:opacity-100 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-[36px] md:text-[48px] font-black tracking-tighter text-[#0a1b33]">
            Smarter Campus Management
          </h2>
          <p className="font-sans text-[#64748b] mt-4 max-w-2xl mx-auto">
            Everything you need to find, book, and manage your university resources without the administrative overhead.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Large Feature Card */}
          <div className="md:col-span-8 bg-white border border-slate-200/50 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex-1 relative z-10">
              <div className="w-14 h-14 rounded-[20px] bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-[28px] font-black text-[#0a1b33] mb-4">Instant Reservations</h3>
              <p className="text-slate-500 leading-relaxed text-[16px]">Browse available time slots across all campus facilities and lock in your booking instantly. Our real-time sync engine prevents double-booking and ensures you always have the space you need.</p>
            </div>
            
            <div className="w-full md:w-[280px] h-[220px] bg-slate-50 rounded-[24px] border border-slate-100 shadow-inner relative z-10 overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
               <div className="flex flex-col gap-3 w-3/4">
                 <div className="h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4"><div className="w-3 h-3 rounded-full bg-green-400 mr-3 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div><div className="h-2 w-1/2 bg-slate-200 rounded-full"></div></div>
                 <div className="h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4 opacity-60"><div className="w-3 h-3 rounded-full bg-red-400 mr-3 shadow-[0_0_8px_rgba(248,113,113,0.5)]"></div><div className="h-2 w-1/3 bg-slate-200 rounded-full"></div></div>
                 <div className="h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-4"><div className="w-3 h-3 rounded-full bg-green-400 mr-3 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div><div className="h-2 w-2/3 bg-slate-200 rounded-full"></div></div>
               </div>
            </div>
          </div>

          {/* Dark Small Feature Card */}
          <div className="md:col-span-4 bg-[#0a1b33] rounded-[32px] p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 shadow-xl shadow-slate-900/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-14 h-14 rounded-[20px] bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10">
              <Clock className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-display text-[24px] font-black text-white mb-4">Smart Waitlists</h3>
            <p className="text-slate-400 leading-relaxed">Is the room full? Join the waitlist and get automatically promoted if someone cancels their reservation.</p>
          </div>

          {/* Admin Feature Card */}
          <div className="md:col-span-5 bg-white border border-slate-200/50 rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group">
             <div className="w-14 h-14 rounded-[20px] bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-display text-[24px] font-black text-[#0a1b33] mb-4">Admin Controls</h3>
            <p className="text-slate-500 leading-relaxed">Approve or reject bookings, manage capacities, and track usage analytics across all campus facilities.</p>
          </div>

          {/* Cross Platform Feature Card */}
           <div className="md:col-span-7 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden">
             <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center mb-6 shadow-sm text-slate-700 group-hover:rotate-12 transition-transform duration-500">
              <Laptop className="w-7 h-7" />
            </div>
            <h3 className="font-display text-[24px] font-black text-[#0a1b33] mb-4">Cross-Platform Sync</h3>
            <p className="text-slate-600 leading-relaxed max-w-md">Access your bookings on any device. Your schedule stays perfectly synced whether you're on mobile, tablet, or desktop.</p>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="bg-white border-y border-slate-200/50 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-[36px] md:text-[48px] font-black tracking-tighter text-[#0a1b33] leading-[1.1]">Explore Spaces</h2>
              <p className="text-slate-500 mt-2">Find the perfect environment for your needs.</p>
            </div>
            <Link to="/resources" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm mt-4 md:mt-0">
              View all resources <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Study Rooms", 
                img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
                count: "24 Available", 
              },
              { 
                title: "Computer Labs", 
                img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
                count: "12 Available", 
              },
              { 
                title: "Event Halls", 
                img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
                count: "5 Available", 
              },
            ].map((space, i) => (
              <div key={i} className="group relative h-[380px] rounded-[32px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-500">
                {/* Background Image with Hover Scale */}
                <img 
                  src={space.img} 
                  alt={space.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b33]/90 via-[#0a1b33]/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                  <h3 className="font-display text-[28px] font-black text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">{space.title}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    <p className="text-blue-100 text-sm font-bold">{space.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1000px] mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-[40px] md:text-[56px] font-black tracking-tighter text-[#0a1b33] mb-6 leading-[1.1]">
          Ready to streamline your workflow?
        </h2>
        <p className="text-slate-500 mb-10 max-w-xl mx-auto">
          Join thousands of students securely booking campus resources without the headache of manual scheduling.
        </p>
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#0a1b33] text-white px-10 py-4 rounded-full font-bold text-[15px] shadow-lg hover:bg-slate-800 transition-colors"
          >
            Create Your Account
          </motion.button>
        </Link>
      </section>

    </div>
  );
};

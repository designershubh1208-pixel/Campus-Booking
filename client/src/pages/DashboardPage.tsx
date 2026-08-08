import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, MapPin, XCircle, CheckCircle, Clock3, 
  Loader2, ArrowRight, LayoutDashboard, BookmarkX, Plus,
  Inbox, Settings, AlertCircle, LogOut
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

interface Booking {
  id: string;
  status: string;
  slot: {
    date: string;
    startTime: string;
    endTime: string;
    resource: {
      name: string;
      location: string;
    }
  }
}

interface Waitlist {
  id: string;
  status: string;
  position: number;
  slot: {
    date: string;
    startTime: string;
    endTime: string;
    resource: {
      name: string;
      location: string;
    }
  }
}

export const DashboardPage: React.FC = () => {
  const { user, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  type Category = 'all' | 'pending' | 'cancelled' | 'rejected' | 'waitlist' | 'settings';
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const [bookingsRes, waitlistsRes] = await Promise.all([
        apiClient.get('/bookings/me'),
        apiClient.get('/waitlists/me')
      ]);
      setBookings(bookingsRes.data);
      setWaitlists(waitlistsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleCancelBooking = async (id: string) => {
    try {
      await apiClient.patch(`/bookings/${id}/cancel`);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to cancel booking", error);
    }
  };

  const handleLeaveWaitlist = async (id: string) => {
    try {
      await apiClient.delete(`/waitlists/${id}`);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to leave waitlist", error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(b => {
    if (activeCategory === 'all') return b.status === 'CONFIRMED' || b.status === 'PENDING';
    if (activeCategory === 'pending') return b.status === 'PENDING';
    if (activeCategory === 'cancelled') return b.status === 'CANCELLED';
    if (activeCategory === 'rejected') return b.status === 'REJECTED';
    return false;
  });

  const categories: { id: Category; label: string; icon: any; count?: number }[] = [
    { id: 'all', label: 'All Bookings', icon: Inbox, count: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length },
    { id: 'pending', label: 'Pending', icon: Clock3, count: bookings.filter(b => b.status === 'PENDING').length },
    { id: 'waitlist', label: 'Waitlist', icon: Clock, count: waitlists.length },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, count: bookings.filter(b => b.status === 'CANCELLED').length },
    { id: 'rejected', label: 'Rejected', icon: AlertCircle, count: bookings.filter(b => b.status === 'REJECTED').length },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#f4f7f9] overflow-hidden">
      
      {/* Premium Sidebar (Dark Theme) */}
      <aside className="w-[280px] bg-[#0a152d] text-white flex-col hidden md:flex shrink-0 border-r border-[#1a2642] relative z-20 shadow-xl shadow-blue-900/10">
        
        {/* Sidebar Header / Logo */}
        <div className="h-24 px-8 flex items-center border-b border-white/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-[22px] leading-none tracking-tight">Portal</h2>
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Student</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-1 hide-scrollbar">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu</p>
          
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive ? 'text-white bg-blue-600/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span className={`text-[14px] font-bold ${isActive ? 'text-white' : ''}`}>{cat.label}</span>
                </div>
                {cat.count !== undefined && cat.count > 0 && (
                  <div className={`relative z-10 px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center justify-center ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-[#1a2642] text-slate-300 group-hover:bg-[#233253]'
                  }`}>
                    {cat.count}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer (Profile & Logout) */}
        <div className="p-4 border-t border-white/5 bg-black/10">
          <button 
            onClick={() => navigate('/resources')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mb-4"
          >
            <Plus className="w-4 h-4" /> Book a Space
          </button>

          <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-inner">
                {user?.name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-tight">{user?.name?.split(' ')[0] || 'Student'}</p>
                <p className="text-[10px] font-medium text-slate-400">{user?.email.split('@')[0]}</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Menu (Visible only on small screens) */}
      <div className="md:hidden bg-[#0a152d] shrink-0 border-b border-[#1a2642] z-30">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <LayoutDashboard className="w-4 h-4" />
             </div>
             <span className="text-white font-black text-lg">Portal</span>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="flex overflow-x-auto p-3 gap-2 hide-scrollbar">
           {categories.map(cat => (
             <button
               key={cat.id}
               onClick={() => setActiveCategory(cat.id)}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                 activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300'
               }`}
             >
               <cat.icon className="w-4 h-4" />
               {cat.label}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 w-full scroll-smooth">
        {/* Subtle decorative background glow in content area */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-display text-[32px] md:text-[42px] font-black text-[#0a1b33] leading-tight tracking-tight">
              {activeCategory === 'all' && `Welcome back, ${user?.name?.split(' ')[0] || 'Student'}!`}
              {activeCategory === 'pending' && 'Pending Approvals'}
              {activeCategory === 'waitlist' && 'Your Waitlists'}
              {activeCategory === 'cancelled' && 'Cancelled Bookings'}
              {activeCategory === 'rejected' && 'Rejected Requests'}
              {activeCategory === 'settings' && 'Account Settings'}
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-[15px] md:text-[16px] max-w-xl leading-relaxed">
              {activeCategory === 'all' && "Here is an overview of all your upcoming and pending campus reservations."}
              {activeCategory === 'pending' && "These requests are currently awaiting administrator approval."}
              {activeCategory === 'waitlist' && "Track your position in line for fully booked resources."}
              {activeCategory === 'cancelled' && "Review the history of your cancelled reservations."}
              {activeCategory === 'rejected' && "Review requests that were declined by administrators."}
              {activeCategory === 'settings' && "Manage your profile details and preferences."}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[400px]"
            >
              {activeCategory === 'settings' ? (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl font-black text-4xl">
                        {user?.name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-display text-3xl font-black text-[#0a1b33]">{user?.name || 'Student User'}</h2>
                        <p className="text-slate-500 font-medium mt-1">{user?.email}</p>
                        <span className="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                          {user?.role} ACCOUNT
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Account Status</label>
                        <div className="flex items-center gap-2 text-[#0a1b33] font-bold">
                          <CheckCircle className="w-5 h-5 text-emerald-500" /> Active
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Member Since</label>
                        <div className="text-[#0a1b33] font-bold">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : activeCategory === 'waitlist' ? (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {waitlists.length === 0 ? (
                    <div className="col-span-full bg-white border border-slate-200/60 rounded-[32px] p-16 flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-400">
                        <Clock3 className="w-10 h-10" />
                      </div>
                      <h3 className="font-display text-2xl font-black text-[#0a1b33] mb-2">No active waitlists</h3>
                      <p className="text-slate-500 max-w-sm mb-8 font-medium">You are not currently in line for any full resources.</p>
                      <button onClick={() => navigate('/resources')} className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-2">
                        Browse Resources <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    waitlists.map((entry) => (
                      <motion.div key={entry.id} variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-3">
                               <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200/50">
                                 <Clock3 className="w-3.5 h-3.5" /> Position #{entry.position}
                               </span>
                               {entry.status === 'PROMOTED' && <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg"><CheckCircle className="w-3.5 h-3.5" /> Promoted</span>}
                            </div>
                            
                            <div className="text-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(entry.slot.date).toLocaleString('default', { month: 'short' })}</div>
                              <div className="font-display font-black text-2xl text-[#0a1b33] leading-none mt-0.5">{new Date(entry.slot.date).getDate()}</div>
                            </div>
                          </div>
                          
                          <h3 className="font-display text-[20px] font-black text-[#0a1b33] mb-4 pr-4 leading-tight">{entry.slot.resource.name}</h3>
                          
                          <div className="space-y-3 mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-center text-[14px] font-bold text-slate-600 gap-3">
                              <Clock className="w-4 h-4 text-orange-400" /> 
                              {new Date(entry.slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(entry.slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div className="flex items-center text-[14px] font-bold text-slate-600 gap-3">
                              <MapPin className="w-4 h-4 text-slate-400" /> 
                              {entry.slot.resource.location}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex items-center justify-end">
                          {entry.status === 'WAITING' && (
                            <button 
                              onClick={() => handleLeaveWaitlist(entry.id)}
                              className="text-slate-500 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
                            >
                              <XCircle className="w-4 h-4" /> Leave Waitlist
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredBookings.length === 0 ? (
                    <div className="col-span-full bg-white border border-slate-200/60 rounded-[32px] p-16 flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-300">
                        <Inbox className="w-10 h-10" />
                      </div>
                      <h3 className="font-display text-2xl font-black text-[#0a1b33] mb-2">No bookings found</h3>
                      <p className="text-slate-500 max-w-sm mb-8 font-medium">There are no bookings matching this category.</p>
                      {activeCategory === 'all' && (
                        <button onClick={() => navigate('/resources')} className="text-blue-600 font-bold hover:text-blue-700 flex items-center gap-2">
                          Explore Resources <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                      <motion.div key={booking.id} variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-3">
                              {booking.status === 'CONFIRMED' && <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/50"><CheckCircle className="w-3.5 h-3.5" /> Confirmed</span>}
                              {booking.status === 'PENDING' && <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/50"><Clock3 className="w-3.5 h-3.5" /> Pending</span>}
                              {booking.status === 'CANCELLED' && <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/50"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>}
                              {booking.status === 'REJECTED' && <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200/50"><AlertCircle className="w-3.5 h-3.5" /> Rejected</span>}
                            </div>
                            <div className="text-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors">
                              <div className="text-[10px] font-bold text-slate-500 group-hover:text-blue-500 uppercase tracking-widest transition-colors">{new Date(booking.slot.date).toLocaleString('default', { month: 'short' })}</div>
                              <div className="font-display font-black text-2xl text-[#0a1b33] leading-none mt-0.5">{new Date(booking.slot.date).getDate()}</div>
                            </div>
                          </div>
                          
                          <h3 className="font-display text-[20px] font-black text-[#0a1b33] mb-4 pr-4 leading-tight">{booking.slot.resource.name}</h3>
                          
                          <div className="space-y-3 mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-blue-50/30 transition-colors">
                            <div className="flex items-center text-[14px] font-bold text-slate-600 gap-3">
                              <Clock className="w-4 h-4 text-blue-500" /> 
                              {new Date(booking.slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(booking.slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div className="flex items-center text-[14px] font-bold text-slate-600 gap-3">
                              <MapPin className="w-4 h-4 text-slate-400" /> 
                              {booking.slot.resource.location}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex items-center justify-end">
                          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-slate-500 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
                            >
                              <BookmarkX className="w-4 h-4" /> Cancel Booking
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, ShieldCheck, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

interface Resource {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
}

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  availableCapacity: number;
  waitlistCount: number;
}

const getCategoryImage = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes('study') || c.includes('room')) {
    return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
  }
  if (c.includes('lab') || c.includes('computer')) {
    return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200";
  }
  if (c.includes('hall') || c.includes('event')) {
    return "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200";
  }
  return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
};

export const ResourceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resResponse = await apiClient.get(`/resources/${id}`);
        setResource(resResponse.data);

        const slotsResponse = await apiClient.get(`/slots/resource/${id}`);
        setSlots(slotsResponse.data);
        if (slotsResponse.data.length > 0) {
          // Default to the first available date
          const uniqueDates = Array.from(new Set(slotsResponse.data.map((s: Slot) => new Date(s.date).toDateString())));
          setSelectedDate(uniqueDates[0] as string);
        }
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleBook = async (slotId: string) => {
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to book a slot.' });
      return;
    }
    
    setActionLoading(slotId);
    setMessage(null);
    try {
      await apiClient.post('/bookings', { slotId });
      setMessage({ type: 'success', text: 'Slot booked successfully! Check your dashboard.' });
      // Refresh slots
      const slotsResponse = await apiClient.get(`/slots/resource/${id}`);
      setSlots(slotsResponse.data);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to book slot' });
      // Refresh slots in case the error was due to capacity changing (so the UI updates to show Waitlist)
      try {
        const slotsResponse = await apiClient.get(`/slots/resource/${id}`);
        setSlots(slotsResponse.data);
      } catch (e) {}
    } finally {
      setActionLoading(null);
    }
  };

  const handleWaitlist = async (slotId: string) => {
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to join the waitlist.' });
      return;
    }
    
    setActionLoading(slotId);
    setMessage(null);
    try {
      await apiClient.post('/waitlists', { slotId });
      setMessage({ type: 'success', text: 'Added to waitlist! We will notify you if a spot opens.' });
      // Refresh slots
      const slotsResponse = await apiClient.get(`/slots/resource/${id}`);
      setSlots(slotsResponse.data);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to join waitlist' });
      // Refresh slots to ensure UI is in sync
      try {
        const slotsResponse = await apiClient.get(`/slots/resource/${id}`);
        setSlots(slotsResponse.data);
      } catch (e) {}
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <h2 className="text-2xl font-bold">Resource not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24">
      {/* Hero Header with Image */}
      <div className="relative h-[400px] w-full">
        <img 
          src={getCategoryImage(resource.category)} 
          alt={resource.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b33] via-[#0a1b33]/60 to-transparent opacity-90" />
        
        <div className="absolute inset-0 max-w-[1200px] mx-auto px-6 flex flex-col justify-end pb-12">
          <Link to="/resources" className="text-blue-300 hover:text-white flex items-center gap-2 text-sm font-bold w-fit mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
          <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 w-fit">
            {resource.category}
          </div>
          <h1 className="font-display text-[40px] md:text-[56px] font-black text-white leading-tight">
            {resource.name}
          </h1>
          <div className="flex items-center text-blue-200 mt-4 font-bold text-sm">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            {resource.location}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-12 grid lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-1">
          <h3 className="font-display text-[24px] font-black text-[#0a1b33] mb-4">About this space</h3>
          <p className="text-slate-500 leading-relaxed text-[15px]">
            {resource.description || "No specific description has been provided for this resource."}
          </p>

          <div className="mt-8 p-6 bg-white border border-slate-200 rounded-[24px] shadow-sm">
            <h4 className="font-bold text-[#0a1b33] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" /> Facility Rules
            </h4>
            <ul className="text-sm text-slate-500 space-y-3">
              {resource.category === 'Rooms' && (
                <>
                  <li>• Check-in required within 15 mins of start time</li>
                  <li>• No food or uncovered drinks</li>
                  <li>• Leave the room clean and tidy</li>
                </>
              )}
              {resource.category === 'Labs' && (
                <>
                  <li>• No food or drinks allowed at workstations</li>
                  <li>• Report hardware issues immediately</li>
                  <li>• Save your work on personal drives</li>
                </>
              )}
              {resource.category === 'Studios' && (
                <>
                  <li>• Handle specialized equipment with extreme care</li>
                  <li>• No unauthorized guests during session</li>
                  <li>• Keep noise levels appropriate for recording</li>
                </>
              )}
              {resource.category === 'Equipment' && (
                <>
                  <li>• Return equipment exactly on time</li>
                  <li>• Report any damages upon pickup</li>
                  <li>• Must present student ID when collecting</li>
                </>
              )}
              {resource.category === 'Kits' && (
                <>
                  <li>• Keep all micro-components in the assigned box</li>
                  <li>• Do not solder directly on breadboards</li>
                  <li>• Return neatly packed and organized</li>
                </>
              )}
              {resource.category === 'Sports' && (
                <>
                  <li>• Wear appropriate non-marking shoes</li>
                  <li>• Bring your own equipment (unless booked)</li>
                  <li>• Respect your booking time window</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: Slots */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-[24px] font-black text-[#0a1b33] mb-6">Available Time Slots</h3>
          
          {message && (
            <div className={`p-4 rounded-2xl mb-6 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {slots.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 border-dashed rounded-[32px] text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold">No slots currently available for this resource.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              {/* Date Selector */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                {Array.from(new Set(slots.map(s => new Date(s.date).toDateString()))).map(dateStr => {
                  const d = new Date(dateStr);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedSlotId(null);
                      }}
                      className={`flex flex-col items-center justify-center shrink-0 w-20 h-20 rounded-2xl border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                      <span className="text-[22px] font-display font-black leading-none mt-1">{d.getDate()}</span>
                      <span className="text-[11px] font-bold mt-1">{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {slots.filter(s => new Date(s.date).toDateString() === selectedDate).map(slot => {
                  const startTime = new Date(slot.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                  const endTime = new Date(slot.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                  const isFull = slot.availableCapacity <= 0;
                  const isSelected = selectedSlotId === slot.id;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[1.02]'
                          : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[15px] font-black ${isSelected ? 'text-blue-700' : 'text-[#0a1b33]'}`}>
                          {startTime}
                        </span>
                        {isFull ? (
                          <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 bg-orange-100 px-2 py-1 rounded-md">Waitlist</span>
                        ) : (
                          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">Available</span>
                        )}
                      </div>
                      
                      <div className="text-sm font-bold text-slate-500 flex justify-between items-center mt-3">
                        <span className="flex items-center gap-1.5">
                           <Users className="w-4 h-4" /> {slot.availableCapacity}/{slot.capacity} spots
                        </span>
                        {isFull && slot.waitlistCount > 0 && (
                          <span className="text-orange-500 text-xs">{slot.waitlistCount} waiting</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Area */}
              {selectedSlotId && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-6 border-t border-slate-100"
                >
                  {(() => {
                    const slot = slots.find(s => s.id === selectedSlotId);
                    if (!slot) return null;
                    const isFull = slot.availableCapacity <= 0;
                    
                    return (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div>
                          <div className="text-sm font-bold text-slate-500 mb-1">Selected Slot</div>
                          <div className="font-black text-[#0a1b33]">
                            {new Date(slot.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        
                        {!isFull ? (
                          <button 
                            onClick={() => handleBook(slot.id)}
                            disabled={actionLoading === slot.id}
                            className="w-full sm:w-auto bg-[#0a1b33] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center min-w-[160px]"
                          >
                            {actionLoading === slot.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleWaitlist(slot.id)}
                            disabled={actionLoading === slot.id}
                            className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold text-[15px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center min-w-[160px]"
                          >
                            {actionLoading === slot.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Waitlist'}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';

interface Resource {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
}

// Fallback images based on category
const getCategoryImage = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes('study') || c.includes('room')) {
    return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800";
  }
  if (c.includes('lab') || c.includes('computer')) {
    return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800";
  }
  if (c.includes('hall') || c.includes('event')) {
    return "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800";
  }
  return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800";
};

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await apiClient.get('/resources');
        setResources(response.data);
      } catch (error) {
        console.error("Failed to fetch resources", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-12 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="font-display text-[40px] md:text-[56px] font-black tracking-tighter text-[#0a1b33] leading-tight">
              Campus <span className="text-blue-600 font-black">Resources</span>
            </h1>
            <p className="text-slate-500 mt-2 max-w-xl text-[16px] leading-relaxed">
              Find and book the perfect space for your next study session, meeting, or event.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input 
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] text-[#0a1b33] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold shadow-sm"
            />
          </div>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={resource.id} 
                className="group bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col"
              >
                {/* Image Section */}
                <div className="h-[220px] relative overflow-hidden">
                  <img 
                    src={getCategoryImage(resource.category)} 
                    alt={resource.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#0a1b33] shadow-sm">
                    {resource.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-display text-[22px] font-black text-[#0a1b33] mb-2 line-clamp-1">
                    {resource.name}
                  </h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4 font-bold">
                    <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                    {resource.location}
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {resource.description || "No description available for this resource."}
                  </p>
                  
                  <Link to={`/resources/${resource.id}`}>
                    <button className="w-full bg-slate-50 hover:bg-[#0a1b33] hover:text-white text-[#0a1b33] border border-slate-200 hover:border-[#0a1b33] py-3.5 rounded-2xl font-bold text-[14px] transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      View Availability
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredResources.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[32px] border border-slate-200/50">
            <h3 className="font-display text-[24px] font-bold text-[#0a1b33]">No resources found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search query.</p>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, Calendar, DollarSign, X, ArrowRight, Search } from 'lucide-react';
import API from '../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop';

const Destinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState(null);

  useEffect(() => {
    fetchDestinations();
  }, [category]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const url = category === 'All' ? '/destinations' : `/destinations?category=${category}`;
      const res = await API.get(url);
      if (res.data.success) {
        setDestinations(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header (Inspired by Image 2 Trippoo Header) */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block mb-1">
          Travel Guide & Weekend Getaways
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Curated Destinations & Corridors
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          Explore hill stations, historic forts, and beaches suitable for group carpools and road trips.
        </p>
      </div>

      {/* Category Pills (Trippoo / Image 2 Style) */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {[
          { label: 'All', color: 'bg-slate-900 text-white border-slate-900' },
          { label: 'Hill Station', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
          { label: 'Beach', color: 'bg-sky-100 text-sky-900 border-sky-300' },
          { label: 'Historical', color: 'bg-amber-100 text-amber-900 border-amber-300' },
          { label: 'Adventure', color: 'bg-rose-100 text-rose-900 border-rose-300' }
        ].map((cat) => (
          <button
            key={cat.label}
            onClick={() => setCategory(cat.label)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              category === cat.label
                ? `${cat.color} shadow-xs`
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading destination guide...</p>
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-16 card-clean rounded-2xl border border-slate-200 max-w-md mx-auto p-6 shadow-xs">
          <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No destinations found for this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest._id}
              onClick={() => setSelectedDest(dest)}
              className="card-clean card-clean-hover rounded-t-[44px] rounded-b-2xl overflow-hidden border border-slate-200 cursor-pointer group flex flex-col justify-between transition-all duration-300 shadow-xs"
            >
              <div>
                {/* Arched Photo Banner (Image 1 Style) */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={dest.image || FALLBACK_IMAGE}
                    alt={dest.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs">
                    {dest.category}
                  </span>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-black text-white text-lg leading-tight group-hover:text-emerald-300 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 pt-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {dest.description}
                  </p>
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  {dest.bestTime}
                </span>

                <span className="text-emerald-800 font-black bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs">
                  Est. ₹{dest.estimatedBudget}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Modal (Image 4 Structured Breakdown Style) */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
            <div className="h-56 relative">
              <img
                src={selectedDest.image || FALLBACK_IMAGE}
                alt={selectedDest.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/50" />
              <button
                onClick={() => setSelectedDest(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-white/95 px-2.5 py-0.5 rounded-full inline-block mb-1 shadow-xs">
                  {selectedDest.category}
                </span>
                <h3 className="text-2xl font-black text-white">{selectedDest.name}</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {selectedDest.description}
              </p>

              {/* Structured Key-Value Breakdown Box (Image 4 Style) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 flex justify-between items-center">
                  <span>Destination Guide</span>
                  <span className="text-slate-500 font-medium">Travel Overview</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Best Season to Visit</span>
                  <span className="font-semibold text-slate-800">{selectedDest.bestTime}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Estimated Budget Per Person</span>
                  <span className="font-black text-emerald-700">₹{selectedDest.estimatedBudget}</span>
                </div>
              </div>

              {/* Attractions */}
              <div className="mb-5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Attractions & Spots
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDest.popularAttractions?.map((att, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-indigo-600" />
                      {att}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedDest(null);
                    navigate(`/find-rides?drop=${encodeURIComponent(selectedDest.name.split(' ')[0])}`);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <Search className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Find Rides Here</span>
                </button>
                <button
                  onClick={() => setSelectedDest(null)}
                  className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Destinations;

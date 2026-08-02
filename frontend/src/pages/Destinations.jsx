import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Calendar, DollarSign, Sparkles } from 'lucide-react';
import API from '../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop';

const Destinations = () => {
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
      
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-extrabold text-rose-500 uppercase tracking-widest block mb-1">
          Travel Guide & Inspiration
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Discover Popular Destinations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore curated weekend getaways, estimated budgets, and popular attractions for your next carpool trip.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {['All', 'Hill Station', 'Beach', 'Historical', 'Adventure'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-12">Loading destinations catalog...</p>
      ) : destinations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 card-shadow">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No destinations found for this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest._id}
              onClick={() => setSelectedDest(dest)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 card-shadow card-hover cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={dest.image || FALLBACK_IMAGE}
                    alt={dest.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {dest.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-black text-slate-900 text-lg mb-1">{dest.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{dest.description}</p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  {dest.bestTime}
                </span>

                <span className="text-indigo-700 font-extrabold bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Est. ₹{dest.estimatedBudget}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-slate-200 card-shadow">
            <div className="h-56 relative">
              <img
                src={selectedDest.image || FALLBACK_IMAGE}
                alt={selectedDest.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedDest(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-slate-900">{selectedDest.name}</h3>
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">
                  Est. ₹{selectedDest.estimatedBudget}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">{selectedDest.description}</p>

              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Popular Attractions</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDest.popularAttractions?.map((att, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                      📍 {att}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedDest(null)}
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Destinations;

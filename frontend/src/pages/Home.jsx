import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Calendar, ArrowRight, Zap, Navigation, ShieldCheck } from 'lucide-react';

const QUICK_CORRIDORS = [
  { pickup: 'Thergaon', drop: 'Hinjawadi Phase 1', tag: 'Tech Corridor', fare: '₹40', time: '15 mins', border: 'border-sky-200 hover:border-sky-400 bg-sky-50/50 hover:bg-sky-50', badgeColor: 'text-sky-700' },
  { pickup: 'Chinchwad Station', drop: 'PCCOER Ravet', tag: 'Campus Direct', fare: '₹25', time: '12 mins', border: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50', badgeColor: 'text-emerald-700' },
  { pickup: 'Wakad Bridge', drop: 'Magarpatta Cybercity', tag: 'Corporate Pool', fare: '₹70', time: '35 mins', border: 'border-amber-200 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50', badgeColor: 'text-amber-700' }
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('find'); // 'find', 'split', 'offer'
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');
  const [selectedTag, setSelectedTag] = useState('All Rides');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickup) params.append('pickup', pickup);
    if (drop) params.append('drop', drop);
    if (date) params.append('date', date);
    if (activeTab === 'split') params.append('vehicleType', 'Auto Share');

    const targetPath = activeTab === 'offer' ? '/offer-ride' : '/find-rides';
    const targetSearch = activeTab === 'offer' ? '' : (params.toString() ? `?${params.toString()}` : '');

    if (!user) {
      navigate('/login', { state: { from: { pathname: targetPath, search: targetSearch } } });
      return;
    }

    if (activeTab === 'offer') {
      navigate('/offer-ride');
    } else {
      navigate(`/find-rides${targetSearch}`);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    let target = '/find-rides';
    if (tag === 'Auto Splits') {
      target = '/find-rides?vehicleType=Auto%20Share';
    } else if (tag === 'Tech Parks') {
      target = '/find-rides?drop=Hinjawadi';
    } else if (tag === 'Campus Routes') {
      target = '/find-rides?drop=Ravet';
    } else if (tag === 'Daily Shifts') {
      target = '/find-rides?community=PCCOER';
    }

    if (!user) {
      const [pathname, search] = target.split('?');
      navigate('/login', { state: { from: { pathname, search: search ? `?${search}` : '' } } });
      return;
    }

    navigate(target);
  };

  const handleQuickCorridorSelect = (corridor) => {
    setPickup(corridor.pickup);
    setDrop(corridor.drop);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 overflow-hidden bg-white">
      
      {/* 
        Scenic Travel & Open Highway Backdrop (Inspired by Image 2 Trippoo & Image 3) 
        Soft daylight scrim provides authentic travel ambiance while keeping light theme crisp and readable
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&auto=format&fit=crop&q=80"
          alt="Scenic Travel Highway"
          className="w-full h-full object-cover object-center opacity-15 filter saturate-150"
        />
        {/* Soft daylight gradient overlay for clean contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-[#f8fafc]" />
        
        {/* Delicate geometric coordinate grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* Main Central Search Console Container (Image 5 & Trippoo Style) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        
        {/* 1. Live Peer Network Ticker Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-slate-200/90 text-slate-700 text-xs font-semibold mb-5 shadow-xs backdrop-blur-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-800 font-bold">Campus & Office Peer Commute Network</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-emerald-700 font-extrabold text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
            Zero Surge Fares
          </span>
        </div>

        {/* 2. Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-tight text-center mb-3">
          Share The Ride.{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
            Split The Cost.
          </span>
        </h1>

        {/* 3. Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 text-center max-w-xl mx-auto leading-relaxed mb-7 font-medium">
          Connect with verified colleagues and students sharing vehicle seats and auto
          rickshaws along your daily commute route.
        </p>

        {/* 4. Tab Mode Pill Switcher */}
        <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200 shadow-xs mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('find')}
            className={`px-5 sm:px-6 py-2 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'find'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Carpool
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full text-xs font-extrabold transition-all ${
              activeTab === 'split'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>Auto / Cab Split</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/offer-ride')}
            className="flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-emerald-700 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Offer a Seat</span>
          </button>
        </div>

        {/* 5. Floating Segmented Search Console Bar (Image 5 & Trippoo Style) */}
        <div className="w-full bg-white/95 rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xl shadow-slate-900/5 backdrop-blur-sm mb-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            
            {/* Segment 1: Pickup Location (Emerald Start Node) */}
            <div className="sm:col-span-3 bg-slate-50/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
                Pickup Location
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Thergaon, Wakad"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 font-semibold outline-none w-full placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Segment 2: Drop Destination (Rose Destination Node) */}
            <div className="sm:col-span-3 bg-slate-50/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 focus-within:border-rose-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-100 transition-all">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block mb-1">
                Drop Destination
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-700 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Ravet, Hinjawadi"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 font-semibold outline-none w-full placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Segment 3: Travel Date (Sky Calendar Node) */}
            <div className="sm:col-span-3 bg-slate-50/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition-all">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 block mb-1">
                Travel Date
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-100/80 flex items-center justify-center text-sky-700 flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 font-semibold outline-none w-full"
                />
              </div>
            </div>

            {/* Segment 4: Search Action Button (Vibrant & High Visibility) */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-[52px] bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 active:scale-[0.99] border border-slate-800"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Search Rides</span>
              </button>
            </div>

          </form>
        </div>

        {/* 6. Quick Filter Pills with Distinct Multi-Color Accents */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {[
            { name: 'All Rides', dot: 'bg-slate-700', activeBg: 'bg-slate-900 text-white border-slate-900' },
            { name: 'Tech Parks', dot: 'bg-sky-500', activeBg: 'bg-sky-100 text-sky-900 border-sky-300' },
            { name: 'Campus Routes', dot: 'bg-emerald-500', activeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
            { name: 'Daily Shifts', dot: 'bg-indigo-500', activeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
            { name: 'Auto Splits', dot: 'bg-amber-500', activeBg: 'bg-amber-100 text-amber-900 border-amber-300' }
          ].map((tag) => (
            <button
              key={tag.name}
              type="button"
              onClick={() => handleTagClick(tag.name)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedTag === tag.name
                  ? `${tag.activeBg} shadow-2xs`
                  : 'bg-white/90 text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tag.dot}`} />
              <span>{tag.name}</span>
            </button>
          ))}
        </div>

        {/* 7. Hyper User-Friendly Quick-Tap Commute Corridors */}
        <div className="w-full pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Popular Quick-Tap Corridors (Click to Auto-Fill)</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400">1-click routes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {QUICK_CORRIDORS.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickCorridorSelect(c)}
                className={`p-3 rounded-2xl border ${c.border} text-left transition-all shadow-2xs group flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span className={c.badgeColor}>{c.tag}</span>
                  <span className="text-emerald-700 font-extrabold">{c.fare} split</span>
                </div>
                <div className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <span className="truncate">{c.pickup}</span>
                  <span className="text-slate-400 font-normal">→</span>
                  <span className="truncate">{c.drop}</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 flex items-center gap-1">
                  <Navigation className="w-2.5 h-2.5 text-slate-400" />
                  <span>Est. {c.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;

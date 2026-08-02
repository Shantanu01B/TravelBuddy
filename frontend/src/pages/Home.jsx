import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Car, Shield, Leaf, Users, MapPin, ArrowRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/find-rides?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}&date=${encodeURIComponent(date)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Executive Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-100/60 via-slate-50 to-slate-50 border-b border-slate-200/60">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verified Campus & Corporate Commuter Network</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Commute Together. <span className="text-gradient-indigo">Share Costs.</span> Build Trust.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            The peer-to-peer ride sharing platform for college students and employees. Offer empty seats, split auto/cab fares along intermediate route stops, and track your carbon savings.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/find-rides"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-[1.02]"
            >
              <Search className="w-4 h-4" />
              <span>Find Rides</span>
            </Link>

            <Link
              to="/offer-ride"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-7 py-3 rounded-xl font-bold text-xs shadow-xs transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Offer Ride or Auto Split</span>
            </Link>
          </div>

          {/* Quick Search Widget */}
          <div className="mt-12 max-w-4xl mx-auto bg-white p-5 rounded-2xl border border-slate-200/90 card-shadow text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1 mb-1">
                  Pickup Stop
                </label>
                <div className="flex items-center bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200 focus-within:border-slate-400 transition-colors">
                  <MapPin className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Thergaon or Wakad"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 outline-none w-full placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1 mb-1">
                  Drop Stop
                </label>
                <div className="flex items-center bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-200 focus-within:border-slate-400 transition-colors">
                  <MapPin className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Ravet or Hinjawadi"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 outline-none w-full placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Route Matches</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Built for Daily Commuters</h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Platform Features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 card-hover">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 font-bold">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Proportional Stop Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Passengers pay fairly for intermediate legs. Prices are calculated dynamically based on pickup and drop stop indexes along the driver's route.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 card-hover">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Verified Trust Score (0-100)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commuter trust is evaluated transparently based on 4-component weighted math: Rating, Ride Completion, Low Cancellation, and Reviews.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 card-hover">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Auto & Cab Fare Split</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Booking an Auto or Uber solo? Post a fare split request to find 2 or 3 fellow commuters heading your way and share the bill.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Simple Process</h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">How TravelBuddy Works</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Post or Find', desc: 'Drivers list ordered route stops; commuters search matching pickup & drop stops.' },
              { step: '02', title: 'Pro-Rated Pricing', desc: 'Price splits automatically based on intermediate route legs traveled.' },
              { step: '03', title: 'Travel Together', desc: 'Commute safely together, split fuel or cab expenses, and reduce traffic.' },
              { step: '04', title: 'Bi-Directional Rating', desc: 'Complete rides to rate each other, earn reward points, and track carbon savings.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 card-shadow">
                <span className="text-2xl font-black text-slate-900 block mb-2">{item.step}</span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

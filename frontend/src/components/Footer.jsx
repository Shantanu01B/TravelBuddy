import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Leaf, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner: Eco Impact & Startup Tagline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 text-white flex items-center justify-center shadow-md">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Travel<span className="text-gradient-sunset">Buddy</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Travel Together. Save Together. Connect Better. A modern MERN Stack platform designed for college students, employees, and daily commuters.
            </p>
          </div>

          <div className="flex flex-col justify-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4 text-purple-400" />
              <span>Eco Community Impact</span>
            </div>
            <p className="text-2xl font-black text-white">1,240+ kg CO₂</p>
            <p className="text-[11px] text-slate-400">Estimated carbon saved by carpooling commuters this month.</p>
          </div>

          <div className="flex flex-col justify-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Verified Trust Network</span>
            </div>
            <p className="text-2xl font-black text-white">98.4% Trust Rating</p>
            <p className="text-[11px] text-slate-400">Calculated via rating formula & verified campus/company emails.</p>
          </div>
        </div>

        {/* Links & Tech Stack */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-slate-800/60 text-xs">
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/find-rides" className="hover:text-indigo-400 transition-colors">Find Local Rides</Link></li>
              <li><Link to="/offer-ride" className="hover:text-indigo-400 transition-colors">Offer Empty Seats</Link></li>
              <li><Link to="/trips" className="hover:text-indigo-400 transition-colors">Trip Planner & Expenses</Link></li>
              <li><Link to="/destinations" className="hover:text-indigo-400 transition-colors">Discover Destinations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2">
              <li><Link to="/community" className="hover:text-indigo-400 transition-colors">Travel Feed</Link></li>
              <li><span className="text-slate-500">PCCOER Commuters</span></li>
              <li><span className="text-slate-500">Infosys Tech Park</span></li>
              <li><span className="text-slate-500">COEP Student Rides</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform Features</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-400">Ordered Route Matching</span></li>
              <li><span className="text-slate-400">Trust Score (0-100)</span></li>
              <li><span className="text-slate-400">Group Expense Splitter</span></li>
              <li><span className="text-slate-400">Green CO₂ Savings</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800">React (Vite)</span>
              <span className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800">Node.js</span>
              <span className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800">Express</span>
              <span className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800">MongoDB</span>
              <span className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800">Tailwind</span>
              <span className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[10px] font-mono border border-slate-800">JWT</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TravelBuddy. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for clean code.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

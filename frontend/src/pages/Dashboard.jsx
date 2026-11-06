import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TrustScoreBadge from '../components/TrustScoreBadge';
import { Car, Search, PlusCircle, Compass, Shield, Award, Leaf, CheckCircle2, Clock, User } from 'lucide-react';
import API from '../services/api';

const Dashboard = () => {
  const { user, refreshProfile } = useContext(AuthContext);
  const [bookedRequests, setBookedRequests] = useState([]);
  const [offeredRides, setOfferedRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshProfile();
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resBooked, resOffered] = await Promise.all([
        API.get('/requests/my-booked'),
        API.get('/rides/my-offered')
      ]);
      if (resBooked.data.success) setBookedRequests(resBooked.data.data);
      if (resOffered.data.success) setOfferedRides(resOffered.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Sleek Slate Navy Welcome Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Welcome, {user?.name}!
                </h1>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span className="font-extrabold text-emerald-400">{user?.organization}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">
                  {user?.vehicle?.type && user?.vehicle?.type !== 'None'
                    ? `${user?.vehicle?.makeModel} (${user?.vehicle?.type})`
                    : 'Commuter Passenger'}
                </span>
              </p>
            </div>
          </div>

          {/* Metric Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center shadow-xs">
              <span className="text-[9px] uppercase font-extrabold text-emerald-400 block tracking-wider">Trust Score</span>
              <span className="text-xl font-black text-white">{user?.trustScore || 85} / 100</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center shadow-xs">
              <span className="text-[9px] uppercase font-bold text-amber-400 block tracking-wider">Reward Points</span>
              <span className="text-xl font-bold text-white">{user?.rewardPoints || 50} pts</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center shadow-xs">
              <span className="text-[9px] uppercase font-bold text-sky-400 block tracking-wider">Carbon Saved</span>
              <span className="text-xl font-bold text-white">{(user?.carbonSaved || 0).toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Link
          to="/find-rides"
          className="card-clean card-clean-hover p-5 rounded-3xl border border-slate-200 flex flex-col items-center text-center group shadow-xs"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-slate-900">Find Rides</span>
          <span className="text-[10px] text-slate-500">Search routes & stops</span>
        </Link>

        <Link
          to="/offer-ride"
          className="card-clean card-clean-hover p-5 rounded-3xl border border-slate-200 flex flex-col items-center text-center group shadow-xs"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-slate-900">Offer Ride / Auto Split</span>
          <span className="text-[10px] text-slate-500">Share seats & fare</span>
        </Link>

        <Link
          to="/trips"
          className="card-clean card-clean-hover p-5 rounded-3xl border border-slate-200 flex flex-col items-center text-center group shadow-xs"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-slate-900">Trip Planner</span>
          <span className="text-[10px] text-slate-500">Split trip expenses</span>
        </Link>

        <Link
          to="/my-rides"
          className="card-clean card-clean-hover p-5 rounded-3xl border border-slate-200 flex flex-col items-center text-center group shadow-xs"
        >
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-xs font-extrabold text-slate-900">My Rides</span>
          <span className="text-[10px] text-slate-500">Manage & rate rides</span>
        </Link>
      </div>

      {/* Main Content Grid: Active Requests & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Booked Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-base">My Active Ride Requests</h3>
              <Link to="/my-rides" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading dashboard...</p>
              </div>
            ) : bookedRequests.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                <Car className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No active ride requests</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Search for rides matching your route!</p>
                <Link
                  to="/find-rides"
                  className="inline-block mt-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Find a Ride Now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookedRequests.slice(0, 3).map((req) => (
                  <div key={req._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase border ${
                          req.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-xs text-slate-800 font-bold">
                          {req.pickupStop} → {req.dropStop}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">
                        Driver: {req.ride?.driver?.name || 'Commuter Driver'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">₹{req.totalPrice}</span>
                      <span className="text-[10px] text-slate-500 block">{req.seatsRequested} seat(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Badges & Trust Summary */}
        <div className="space-y-6">
          <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Earned Badges</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {(user?.badges || ['Verified Commuter']).map((badge, idx) => (
                <div key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;

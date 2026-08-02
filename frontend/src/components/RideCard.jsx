import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Bike, Calendar, Clock, UserCheck, ChevronRight, Building, Navigation } from 'lucide-react';
import TrustScoreBadge from './TrustScoreBadge';
import RouteStopsTimeline from './RouteStopsTimeline';

const RideCard = ({ ride, searchPickup = '', searchDrop = '' }) => {
  const {
    _id,
    driver,
    vehicleType,
    vehicleName,
    source,
    destination,
    routeStops,
    date,
    time,
    availableSeats,
    pricePerSeat,
    community
  } = ride;

  const isAutoShare = vehicleType === 'Auto Share' || vehicleName?.toLowerCase().includes('auto');
  const isCabShare = vehicleType === 'Cab Share' || vehicleName?.toLowerCase().includes('cab') || vehicleName?.toLowerCase().includes('uber');

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 card-shadow card-hover flex flex-col justify-between relative overflow-hidden group">
      
      {/* Accent top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isAutoShare
          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
          : isCabShare
          ? 'bg-gradient-to-r from-purple-600 to-rose-500'
          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500'
      }`} />

      <div>
        {/* Header: Driver / Poster Info & Community Badge */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={driver?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
              alt={driver?.name || 'Commuter'}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  {driver?.name || 'Commuter'}
                </h3>
                {driver?.trustScore && <TrustScoreBadge score={driver.trustScore} showLabel={false} />}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-bold text-indigo-700">
                  <Building className="w-3 h-3 text-indigo-600" />
                  {community || driver?.organization || 'General Commuter'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  {isAutoShare ? '🛺 Auto Split' : isCabShare ? '🚕 Cab Split' : vehicleType === 'Bike' ? '🏍️ Bike' : '🚗 Carpool'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-gradient-sunset">₹{pricePerSeat}</span>
            <span className="text-[10px] text-slate-400 block font-semibold">per person</span>
          </div>
        </div>

        {/* Auto Share Badge Callout */}
        {(isAutoShare || isCabShare) && (
          <div className="mb-4 p-2.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-900">
            <span className="text-base">{isAutoShare ? '🛺' : '🚕'}</span>
            <span>{isAutoShare ? 'Auto Rickshaw Fare Split Post' : 'Cab / Uber Fare Split Post'}</span>
          </div>
        )}

        {/* Route Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            <span>ROUTE STOPS & PICKUPS</span>
            <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
              {routeStops?.length || 2} Stops
            </span>
          </div>
          <RouteStopsTimeline
            routeStops={routeStops}
            highlightPickup={searchPickup}
            highlightDrop={searchDrop}
          />
        </div>

        {/* Date, Time & Seat Info */}
        <div className="flex flex-wrap items-center justify-between bg-slate-50 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 gap-2 mb-5 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-extrabold text-slate-800">{availableSeats} spot(s) left</span>
          </div>
        </div>
      </div>

      {/* Action CTA with Sunset Indigo Gradient */}
      <Link
        to={`/rides/${_id}`}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white py-3 px-4 rounded-2xl text-xs font-extrabold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
      >
        <span>View Route & Join Share</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default RideCard;

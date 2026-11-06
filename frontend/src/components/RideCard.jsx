import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Bike, Calendar, Clock, ChevronRight, Building, Users, User } from 'lucide-react';
import TrustScoreBadge from './TrustScoreBadge';

const RideCard = ({ ride, searchPickup = '', searchDrop = '' }) => {
  const {
    _id,
    driver,
    vehicleType,
    vehicleName,
    routeStops,
    date,
    time,
    availableSeats,
    pricePerSeat,
    community
  } = ride;

  const isAutoShare = vehicleType === 'Auto Share' || vehicleName?.toLowerCase().includes('auto');
  const isCabShare = vehicleType === 'Cab Share' || vehicleName?.toLowerCase().includes('cab') || vehicleName?.toLowerCase().includes('uber');
  const isBike = vehicleType === 'Bike';

  const pickupStop = routeStops && routeStops.length > 0 ? routeStops[0].stopName : 'Origin';
  const dropStop = routeStops && routeStops.length > 0 ? routeStops[routeStops.length - 1].stopName : 'Destination';

  return (
    <div className="card-clean card-clean-hover rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300">
      
      {/* Top Banner & Driver Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm tracking-tight">
                  {driver?.name || 'Commuter'}
                </h4>
                {driver?.trustScore && <TrustScoreBadge score={driver.trustScore} showLabel={false} />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-0.5">
                <Building className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                <span className="truncate max-w-[150px]">{community || driver?.organization || 'Verified Commuter'}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Category Pill */}
          <div className="text-right">
            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
              isAutoShare
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : isCabShare
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : isBike
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {isAutoShare ? 'Auto Split' : isCabShare ? 'Cab Split' : isBike ? 'Bike Pool' : 'Carpool'}
            </span>
          </div>
        </div>

        {/* Route Title */}
        <div className="mb-4">
          <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
            <span>{pickupStop}</span>
            <span className="text-slate-400">→</span>
            <span>{dropStop}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {vehicleName || (isBike ? 'Two-Wheeler' : 'Personal Vehicle')} • Departure {time}
          </p>
        </div>

        {/* Structured Route Breakdown Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-4 space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 flex justify-between items-center">
            <span>Route & Fare Breakdown</span>
            <span className="text-slate-500 font-medium">{date}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-0.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Pickup
            </span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">{pickupStop}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-0.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Drop Point
            </span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">{dropStop}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-0.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-sky-500" />
              Available Seats
            </span>
            <span className="font-bold text-slate-800">{availableSeats} seat(s) open</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
            <span className="text-slate-600 font-medium">Cost Contribution</span>
            <span className="text-sm font-black text-slate-900">₹{pricePerSeat} <span className="text-[10px] text-slate-500 font-normal">/ seat</span></span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-5 pt-0">
        <Link
          to={`/rides/${_id}`}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <span>View Ride Details</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
};

export default RideCard;

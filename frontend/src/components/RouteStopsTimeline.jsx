import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const RouteStopsTimeline = ({ routeStops = [], highlightPickup = '', highlightDrop = '' }) => {
  if (!routeStops || routeStops.length === 0) return null;

  return (
    <div className="py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {routeStops.map((stop, idx) => {
          const name = typeof stop === 'string' ? stop : stop.stopName;
          const pickupPoint = typeof stop === 'object' ? stop.pickupPoint : '';
          
          const isPickup = highlightPickup && name.toLowerCase().includes(highlightPickup.toLowerCase());
          const isDrop = highlightDrop && name.toLowerCase().includes(highlightDrop.toLowerCase());
          const isStart = idx === 0;
          const isEnd = idx === routeStops.length - 1;

          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center flex-shrink-0 text-center min-w-[90px]">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPickup || isStart
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow-xs'
                      : isDrop || isEnd
                      ? 'bg-rose-600 text-white ring-4 ring-rose-100 scale-110 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </div>

                <span className={`text-xs font-semibold mt-1.5 truncate max-w-[100px] ${
                  isPickup || isStart ? 'text-emerald-700 font-bold' : isDrop || isEnd ? 'text-rose-700 font-bold' : 'text-slate-700'
                }`}>
                  {name}
                </span>

                {pickupPoint && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px] flex items-center justify-center gap-0.5 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{pickupPoint}</span>
                  </span>
                )}
              </div>

              {idx < routeStops.length - 1 && (
                <div className="w-8 h-0.5 bg-slate-200 flex-shrink-0 relative -top-3">
                  <Navigation className="w-2.5 h-2.5 text-slate-400 absolute -top-1 left-1/2 -translate-x-1/2 rotate-90" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RouteStopsTimeline;

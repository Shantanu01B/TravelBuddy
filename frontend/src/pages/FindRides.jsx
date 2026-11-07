import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { Search, MapPin, Building, Calendar, Car, ArrowUpDown, PlusCircle, Sparkles } from 'lucide-react';
import API from '../services/api';

const FindRides = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pickup, setPickup] = useState(searchParams.get('pickup') || '');
  const [drop, setDrop] = useState(searchParams.get('drop') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [community, setCommunity] = useState(searchParams.get('community') || 'All');
  const [vehicleType, setVehicleType] = useState(searchParams.get('vehicleType') || 'All');
  const [sort, setSort] = useState('price_low');

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);

  const fetchRides = async (
    overridePickup = pickup,
    overrideDrop = drop,
    overrideDate = date,
    overrideCommunity = community,
    overrideVehicleType = vehicleType,
    overrideSort = sort
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (overridePickup) params.append('pickup', overridePickup);
      if (overrideDrop) params.append('drop', overrideDrop);
      if (overrideDate) params.append('date', overrideDate);
      if (overrideCommunity && overrideCommunity !== 'All') params.append('community', overrideCommunity);
      if (overrideVehicleType && overrideVehicleType !== 'All') params.append('vehicleType', overrideVehicleType);
      if (overrideSort) params.append('sort', overrideSort);

      const res = await API.get(`/rides/search?${params.toString()}`);
      if (res.data.success) {
        setRides(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const p = searchParams.get('pickup') || '';
    const d = searchParams.get('drop') || '';
    const dt = searchParams.get('date') || '';
    const vt = searchParams.get('vehicleType') || 'All';
    const c = searchParams.get('community') || 'All';
    setPickup(p);
    setDrop(d);
    setDate(dt);
    setVehicleType(vt);
    setCommunity(c);
    fetchRides(p, d, dt, c, vt, sort);
  }, [searchParams]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchRides(pickup, drop, date, community, vehicleType, sort);
  }, [community, vehicleType, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRides(pickup, drop, date, community, vehicleType, sort);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Title */}
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block mb-1">
          Explore Network
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Find Available Commute Rides
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Search open seats in verified cars, bikes, and shared auto rickshaws along your daily route.
        </p>
      </div>

      {/* Segmented Search Console Bar (Trippoo / Image 2 & 3 Style) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Pickup Point - Emerald */}
          <div className="sm:col-span-4 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-colors">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-0.5">
              Pickup Point
            </span>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="e.g. Thergaon, Wakad..."
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 outline-none w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Drop Destination - Rose */}
          <div className="sm:col-span-4 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-rose-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-100 transition-colors">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block mb-0.5">
              Drop Destination
            </span>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="e.g. Ravet, Hinjawadi..."
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 outline-none w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Date - Sky Blue */}
          <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition-colors">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 block mb-0.5">
              Date
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 outline-none w-full"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-[52px] bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 active:scale-[0.99]"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Search</span>
            </button>
          </div>

        </form>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          
          {/* Multi-Color Vehicle Type Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: 'All Modes', value: 'All', activeColor: 'bg-slate-900 text-white border-slate-900' },
              { label: 'Carpool', value: 'Car', activeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
              { label: 'Auto Split', value: 'Auto Share', activeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
              { label: 'Cab Split', value: 'Cab Share', activeColor: 'bg-sky-100 text-sky-900 border-sky-300' },
              { label: 'Bike Pool', value: 'Bike', activeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300' }
            ].map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setVehicleType(v.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  vehicleType === v.value
                    ? `${v.activeColor} shadow-2xs`
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Campus / Community Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-slate-500 text-[11px]">Campus:</span>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="All" className="bg-white">All Communities</option>
                <option value="PCCOER" className="bg-white">PCCOER Ravet</option>
                <option value="Infosys" className="bg-white">Infosys Pune</option>
                <option value="COEP" className="bg-white">COEP Technological Univ</option>
                <option value="TCS" className="bg-white">TCS Sahyadri Park</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-500 text-[11px]">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="price_low" className="bg-white">Lowest Fare</option>
                <option value="price_high" className="bg-white">Highest Fare</option>
                <option value="rating" className="bg-white">Highest Trust Score</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Available Rides <span className="text-indigo-600 font-bold">({rides.length} matching)</span>
        </h2>
        <Link
          to="/offer-ride"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Publish a Ride</span>
        </Link>
      </div>

      {/* Ride Cards List Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Scanning route corridors and finding rides...</p>
        </div>
      ) : rides.length === 0 ? (
        <div className="text-center py-16 card-clean rounded-2xl border border-slate-200 max-w-xl mx-auto p-8 shadow-xs">
          <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No rides found matching your filters</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Try broadening your pickup/drop points, or create a ride offer to let others join you.
          </p>
          <Link
            to="/offer-ride"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Offer a Commute Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              searchPickup={pickup}
              searchDrop={drop}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default FindRides;

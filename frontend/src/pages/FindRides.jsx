import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { Search, Filter, MapPin, Building, Calendar, Car, ArrowUpDown } from 'lucide-react';
import API from '../services/api';

const FindRides = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pickup, setPickup] = useState(searchParams.get('pickup') || '');
  const [drop, setDrop] = useState(searchParams.get('drop') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [community, setCommunity] = useState('All');
  const [vehicleType, setVehicleType] = useState('All');
  const [sort, setSort] = useState('price_low');

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, [community, vehicleType, sort]);

  const fetchRides = async (overridePickup = pickup, overrideDrop = drop) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (overridePickup) params.append('pickup', overridePickup);
      if (overrideDrop) params.append('drop', overrideDrop);
      if (date) params.append('date', date);
      if (community !== 'All') params.append('community', community);
      if (vehicleType !== 'All') params.append('vehicleType', vehicleType);
      if (sort) params.append('sort', sort);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRides();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Search Controls Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 card-shadow mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5">
            <MapPin className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Pickup location..."
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none w-full"
            />
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5">
            <MapPin className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Drop location..."
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none w-full"
            />
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5">
            <Calendar className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20"
          >
            <Search className="w-4 h-4" />
            <span>Search Rides</span>
          </button>
        </form>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            
            {/* Campus / Community Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-slate-600">Community:</span>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All Campuses / Companies</option>
                <option value="PCCOER">PCCOER College</option>
                <option value="Infosys">Infosys Tech Park</option>
                <option value="COEP">COEP Technological University</option>
                <option value="TCS">TCS Pune</option>
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
              <Car className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-semibold text-slate-600">Vehicle:</span>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All Vehicles</option>
                <option value="Car">Carpool Only</option>
                <option value="Bike">Bike Only</option>
                <option value="Scooter">Scooter Only</option>
              </select>
            </div>

          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-semibold text-slate-600">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Driver Trust Rating</option>
            </select>
          </div>
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Available Commute Rides <span className="text-sm font-normal text-slate-500">({rides.length} found)</span>
        </h2>
      </div>

      {/* Ride Cards List Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-xs text-slate-400">Matching route stops and finding rides...</p>
        </div>
      ) : rides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 card-shadow">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No rides found matching your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your pickup and drop search terms, or check back soon for new offers!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

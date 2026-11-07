import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, AlertCircle, ArrowRight } from 'lucide-react';
import API from '../services/api';

const OfferRide = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [vehicleType, setVehicleType] = useState(user?.vehicle?.type && user?.vehicle?.type !== 'None' ? user.vehicle.type : 'Car');
  const [vehicleName, setVehicleName] = useState(user?.vehicle?.makeModel || 'Honda City');
  const [source, setSource] = useState('Chinchwad');
  const [destination, setDestination] = useState('Ravet');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:30 AM');
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(40);
  const [community, setCommunity] = useState(user?.organization || 'PCCOER');
  const [description, setDescription] = useState('Daily college commute. AC on, non-smoking passengers.');

  const [routeStops, setRouteStops] = useState([
    { stopName: 'Chinchwad', pickupPoint: 'Chinchwad Railway Station Gate 1' },
    { stopName: 'Thergaon', pickupPoint: 'Thergaon DMart Signal' },
    { stopName: 'Wakad', pickupPoint: 'Wakad Flyover Bridge' },
    { stopName: 'Ravet', pickupPoint: 'PCCOER Main Gate' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVehicleTypeSelect = (type) => {
    setVehicleType(type);
    if (type === 'Auto Share') {
      setVehicleName('Auto Rickshaw (Fare Split)');
      setTotalSeats(3);
      setDescription('Booking Auto Rickshaw! Looking for 2 or 3 commuters to split the total fare evenly.');
    } else if (type === 'Cab Share') {
      setVehicleName('Uber / Ola Cab (Fare Split)');
      setTotalSeats(3);
      setDescription('Booking Uber / Ola Cab! Looking for fellow commuters to split cab payment.');
    }
  };

  const handleAddStop = () => {
    setRouteStops([...routeStops, { stopName: '', pickupPoint: '' }]);
  };

  const handleRemoveStop = (index) => {
    if (routeStops.length <= 2) return;
    setRouteStops(routeStops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index, field, value) => {
    const updated = [...routeStops];
    updated[index][field] = value;
    setRouteStops(updated);

    if (index === 0 && field === 'stopName') setSource(value);
    if (index === updated.length - 1 && field === 'stopName') setDestination(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const invalidStop = routeStops.find(s => !s.stopName.trim());
    if (invalidStop) {
      setError('Please provide names for all route stops');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      setError('Ride date cannot be in the past. Please select today or an upcoming date.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/rides', {
        vehicleType,
        vehicleName,
        source: routeStops[0].stopName,
        destination: routeStops[routeStops.length - 1].stopName,
        routeStops,
        date,
        time,
        totalSeats: Number(totalSeats),
        pricePerSeat: Number(pricePerSeat),
        community,
        description
      });

      if (res.data.success) {
        navigate('/my-rides');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to offer ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        <div className="mb-8 border-b border-slate-100 pb-4">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
            Share Seats & Split Fares
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Offer Ride or Post Fare Split</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish your empty vehicle seats or post an auto/cab split to travel together.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 block mb-2">Commute / Vehicle Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: 'Car', label: 'Carpool', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
                { type: 'Bike', label: 'Bike Ride', activeColor: 'bg-indigo-600 text-white border-indigo-600' },
                { type: 'Scooter', label: 'Scooter', activeColor: 'bg-teal-600 text-white border-teal-600' },
                { type: 'Auto Share', label: 'Auto Split', activeColor: 'bg-amber-600 text-white border-amber-600' },
                { type: 'Cab Share', label: 'Cab Split', activeColor: 'bg-sky-600 text-white border-sky-600' }
              ].map(item => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => handleVehicleTypeSelect(item.type)}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs flex items-center justify-center ${
                    vehicleType === item.type
                      ? `${item.activeColor} shadow-xs`
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Vehicle / Booking Description</label>
              <input
                type="text"
                required
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="e.g. Honda City or Auto Rickshaw Split"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Campus / Community Network</label>
              <input
                type="text"
                required
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="e.g. PCCOER, Infosys"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Ordered Route Stops */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Ordered Route Stops & Pickup Landmarks
                </h3>
                <p className="text-[10px] text-slate-500">
                  Specify your travel route from start to destination in sequence.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddStop}
                className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Stop</span>
              </button>
            </div>

            <div className="space-y-3">
              {routeStops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                    idx === 0 ? 'bg-emerald-600' : idx === routeStops.length - 1 ? 'bg-rose-600' : 'bg-slate-700'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow">
                    <input
                      type="text"
                      required
                      placeholder={`Stop ${idx + 1} Name`}
                      value={stop.stopName}
                      onChange={(e) => handleStopChange(idx, 'stopName', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />

                    <input
                      type="text"
                      placeholder="Optional Landmark / Pickup Stand"
                      value={stop.pickupPoint}
                      onChange={(e) => handleStopChange(idx, 'pickupPoint', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  {routeStops.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Travel Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Departure Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 08:30 AM"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Available Seats / Spots</label>
              <input
                type="number"
                min="1"
                max="6"
                required
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Price Per Seat / Person (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={pricePerSeat}
                onChange={(e) => setPricePerSeat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Notes & Fare Split Details</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Booking an Auto from Chinchwad Station. Looking for 2 passengers to split ₹90 fare evenly (₹30 per person)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Publishing...' : 'Publish Ride Listing'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>

        </form>

      </div>
    </div>
  );
};

export default OfferRide;

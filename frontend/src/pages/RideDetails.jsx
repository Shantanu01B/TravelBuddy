import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TrustScoreBadge from '../components/TrustScoreBadge';
import RouteStopsTimeline from '../components/RouteStopsTimeline';
import { Car, Bike, Calendar, Clock, MapPin, Building, Shield, User, CheckCircle2, AlertCircle, ArrowLeft, Star, Leaf } from 'lucide-react';
import API from '../services/api';

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pickupStop, setPickupStop] = useState('');
  const [dropStop, setDropStop] = useState('');
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    try {
      const res = await API.get(`/rides/${id}`);
      if (res.data.success) {
        const data = res.data.data;
        setRide(data);
        if (data.routeStops && data.routeStops.length >= 2) {
          setPickupStop(data.routeStops[0].stopName);
          setDropStop(data.routeStops[data.routeStops.length - 1].stopName);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setBookingMessage({ type: '', text: '' });

    try {
      const res = await API.post('/requests', {
        rideId: ride._id,
        pickupStop,
        dropStop,
        seatsRequested: Number(seatsRequested)
      });

      if (res.data.success) {
        setBookingMessage({
          type: 'success',
          text: 'Ride request sent successfully! Price split calculated based on your route stops.'
        });
        setTimeout(() => navigate('/my-rides'), 1500);
      }
    } catch (err) {
      setBookingMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit ride request'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading ride details...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Ride not found</h2>
        <button onClick={() => navigate('/find-rides')} className="mt-4 text-xs font-bold text-indigo-600 hover:underline">
          Back to Find Rides
        </button>
      </div>
    );
  }

  const { driver, vehicleType, vehicleName, routeStops = [], date, time, availableSeats, pricePerSeat, community, description } = ride;
  const VehicleIcon = vehicleType === 'Bike' ? Bike : Car;

  // Dynamic Stop-Based Price Breakdown Math
  const totalLegs = Math.max(1, routeStops.length - 1);
  const pickupIndex = routeStops.findIndex(s => s.stopName.toLowerCase() === pickupStop.toLowerCase());
  const dropIndex = routeStops.findIndex(s => s.stopName.toLowerCase() === dropStop.toLowerCase());

  const passengerLegs = Math.max(1, (dropIndex !== -1 && pickupIndex !== -1 && dropIndex > pickupIndex) ? (dropIndex - pickupIndex) : totalLegs);
  const pricePerLeg = pricePerSeat / totalLegs;
  const calculatedPricePerSeat = Math.max(10, Math.round(pricePerLeg * passengerLegs));
  const finalTotalPrice = calculatedPricePerSeat * Number(seatsRequested);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Listings</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Ride Route & Driver Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card */}
          <div className="card-clean p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-indigo-600 tracking-wider">
                  COMMUTE RIDE POST
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-0.5">
                  {routeStops[0]?.stopName} → {routeStops[routeStops.length - 1]?.stopName}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    {community}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {date} at {time}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black text-slate-900">₹{pricePerSeat}</span>
                <span className="text-xs text-slate-500 block font-normal">full route price</span>
              </div>
            </div>

            {/* Ordered Route Stops */}
            <div className="py-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Ordered Route Stops & Pickups
                </h3>
                <span className="text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                  {totalLegs} Route Legs (₹{Math.round(pricePerLeg)}/leg)
                </span>
              </div>
              <RouteStopsTimeline routeStops={routeStops} highlightPickup={pickupStop} highlightDrop={dropStop} />
            </div>

            {/* Vehicle & Description */}
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <VehicleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{vehicleName}</p>
                    <p className="text-[11px] text-slate-500">{vehicleType} Commute</p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  {availableSeats} seat(s) remaining
                </span>
              </div>

              {description && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Driver Notes</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    "{description}"
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Driver Profile Summary Card */}
          <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Driver Reputation Profile
            </h3>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-slate-900 text-base">{driver?.name}</h4>
                  <TrustScoreBadge score={driver?.trustScore || 85} />
                </div>

                <p className="text-xs text-emerald-700 font-semibold mt-0.5">{driver?.organization}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{driver?.bio}</p>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {driver?.averageRating || 5.0} Rating
                  </span>
                  <span>•</span>
                  <span>{driver?.completedRides || 0} Rides Completed</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    {(driver?.carbonSaved || 0).toFixed(1)} kg CO2 Saved
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Request Seat Booking Form with Dynamic Stop-Based Price Breakdown */}
        <div>
          <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-xl sticky top-24">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">Request Seat</h3>
            <p className="text-xs text-slate-500 mb-4">Price is calculated based on your pickup & drop stops</p>

            {bookingMessage.text && (
              <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                bookingMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {bookingMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                <span>{bookingMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Pickup Stop</label>
                <select
                  value={pickupStop}
                  onChange={(e) => setPickupStop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  {routeStops.map((stop, idx) => (
                    <option key={idx} value={stop.stopName} className="bg-white">
                      {idx + 1}. {stop.stopName} {stop.pickupPoint ? `(${stop.pickupPoint})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Drop Stop</label>
                <select
                  value={dropStop}
                  onChange={(e) => setDropStop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  {routeStops.map((stop, idx) => (
                    <option key={idx} value={stop.stopName} className="bg-white">
                      {idx + 1}. {stop.stopName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Seats Requested</label>
                <input
                  type="number"
                  min="1"
                  max={availableSeats}
                  value={seatsRequested}
                  onChange={(e) => setSeatsRequested(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Dynamic Stop-Based Price Calculation Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Full Route Price ({totalLegs} legs)</span>
                  <span className="font-semibold text-slate-700">₹{pricePerSeat}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Your Route ({passengerLegs} leg(s))</span>
                  <span className="font-bold text-indigo-700">₹{calculatedPricePerSeat} / seat</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Total Contribution</span>
                  <span className="text-slate-900 text-base font-black">₹{finalTotalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading || availableSeats === 0 || pickupIndex >= dropIndex}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-slate-900/10 disabled:opacity-50"
              >
                {bookingLoading ? 'Submitting Request...' : pickupIndex >= dropIndex ? 'Drop stop must be after pickup' : availableSeats === 0 ? 'Fully Booked' : `Send Seat Request (₹${finalTotalPrice})`}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RideDetails;

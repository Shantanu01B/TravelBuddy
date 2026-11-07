import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Compass,
  Plus,
  DollarSign,
  Calendar,
  Users,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Luggage,
  Clock,
  Car,
  X,
  Search,
  Check,
  LogOut,
  Train,
  Plane,
  Bus
} from 'lucide-react';
import API from '../services/api';

const POPULAR_DESTINATIONS = ['Udaipur', 'Rajasthan', 'Goa', 'Lonavala', 'Manali', 'Mahabaleshwar', 'Pondicherry'];

const TripPlanner = () => {
  const { user } = useContext(AuthContext);

  // Tab & Pool States: 'my_trips' | 'explore'
  const [tripTab, setTripTab] = useState('my_trips');
  const [myTrips, setMyTrips] = useState([]);
  const [exploreTrips, setExploreTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState({ totalAmount: 0, categoryTotals: {} });
  const [loading, setLoading] = useState(true);

  // Join / Leave feedback
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinFeedback, setJoinFeedback] = useState({ type: '', message: '' });

  // Manual Trip Modal
  const [showTripModal, setShowTripModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: 'Monsoon Camping & Fort Trek',
    destination: 'Lonavala',
    budget: 5000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    maxMembers: 6,
    notes: 'Remember to pack extra raincoats and trek boots!'
  });

  // Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: 'Hotel & Resort Booking',
    category: 'Hotel',
    amount: 3000
  });

  // Smart Itinerary & Budget Generator States
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiInput, setAiInput] = useState({
    destination: 'Udaipur',
    days: 3,
    budget: 8000,
    travelers: 2,
    travelStyle: 'Balanced',
    transportMode: 'Train',
    interests: 'palace heritage, lake boat rides, scenic sunsets, authentic food'
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(1);
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async (preferredSelectedId = null) => {
    setLoading(true);
    try {
      const [myRes, exploreRes] = await Promise.all([
        API.get('/trips'),
        API.get('/trips/explore')
      ]);

      const userTrips = myRes.data.success ? myRes.data.data : [];
      const communityTrips = exploreRes.data.success ? exploreRes.data.data : [];

      setMyTrips(userTrips);
      setExploreTrips(communityTrips);

      const allTripsPool = [...userTrips, ...communityTrips];
      let nextSelected = null;

      if (preferredSelectedId) {
        nextSelected = allTripsPool.find((t) => t._id === preferredSelectedId);
      }
      if (!nextSelected && selectedTrip) {
        nextSelected = allTripsPool.find((t) => t._id === selectedTrip._id);
      }
      if (!nextSelected) {
        nextSelected = tripTab === 'my_trips'
          ? (userTrips[0] || communityTrips[0] || null)
          : (communityTrips[0] || userTrips[0] || null);
      }

      setSelectedTrip(nextSelected);
      if (nextSelected) {
        fetchTripExpenses(nextSelected._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setTripTab(tab);
    const targetPool = tab === 'my_trips' ? myTrips : exploreTrips;
    if (targetPool.length > 0) {
      const currentInTarget = targetPool.find((t) => t._id === selectedTrip?._id);
      const next = currentInTarget || targetPool[0];
      setSelectedTrip(next);
      if (next) fetchTripExpenses(next._id);
    }
  };

  const fetchTripExpenses = async (tripId) => {
    try {
      const res = await API.get(`/expenses/trip/${tripId}`);
      if (res.data.success) {
        setExpenses(res.data.data);
        setExpenseSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/trips', newTrip);
      if (res.data.success) {
        setShowTripModal(false);
        setJoinFeedback({ type: 'success', message: 'Trip plan published successfully!' });
        await fetchTrips(res.data.data?._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create trip');
    }
  };

  const handleJoinTrip = async (tripId) => {
    setJoinLoading(true);
    setJoinFeedback({ type: '', message: '' });
    try {
      const res = await API.post(`/trips/${tripId}/join`);
      if (res.data.success) {
        setJoinFeedback({ type: 'success', message: res.data.message || 'Joined trip successfully!' });
        await fetchTrips(tripId);
      }
    } catch (err) {
      setJoinFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to join trip' });
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to leave this trip plan?')) return;
    setJoinLoading(true);
    setJoinFeedback({ type: '', message: '' });
    try {
      const res = await API.post(`/trips/${tripId}/leave`);
      if (res.data.success) {
        setJoinFeedback({ type: 'success', message: res.data.message || 'Left trip plan' });
        await fetchTrips(tripId);
      }
    } catch (err) {
      setJoinFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to leave trip' });
    } finally {
      setJoinLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip plan?')) return;
    try {
      const res = await API.delete(`/trips/${tripId}`);
      if (res.data.success) {
        setJoinFeedback({ type: 'success', message: 'Trip plan deleted successfully' });
        await fetchTrips();
      }
    } catch (err) {
      setJoinFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to delete trip' });
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;

    try {
      const memberIds = selectedTrip.members?.length > 0
        ? selectedTrip.members.map((m) => (m._id ? m._id : m))
        : [user._id];

      const res = await API.post('/expenses', {
        tripId: selectedTrip._id,
        title: newExpense.title,
        category: newExpense.category,
        amount: Number(newExpense.amount),
        splitBetween: memberIds
      });

      if (res.data.success) {
        setShowExpenseModal(false);
        fetchTripExpenses(selectedTrip._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const res = await API.delete(`/expenses/${expenseId}`);
      if (res.data.success) {
        fetchTripExpenses(selectedTrip._id);
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Generate Custom Trip Plan with AI
  const handleGenerateAIPlan = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError('');

    try {
      const res = await API.post('/trips/ai-plan', aiInput);
      if (res.data.success) {
        setGeneratedPlan(res.data.data);
        setExpandedDay(1);
      }
    } catch (err) {
      setAiError(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // 1-Click Save AI Plan as an Active Trip in TravelBuddy
  const handleSaveAIPlan = async () => {
    if (!generatedPlan) return;
    setSavingPlan(true);

    try {
      const today = new Date();
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + (generatedPlan.days || 3));

      const tripPayload = {
        title: generatedPlan.tripTitle || `${generatedPlan.destination} Expedition`,
        destination: generatedPlan.destination,
        budget: Number(generatedPlan.estimatedTotalBudget) || 5000,
        startDate: today.toISOString().split('T')[0],
        endDate: returnDate.toISOString().split('T')[0],
        maxMembers: Number(generatedPlan.travelers) ? Math.max(Number(generatedPlan.travelers) * 2, 6) : 6,
        notes: `${generatedPlan.summary}\n\nSmart Commute Tip: ${generatedPlan.smartCarpoolTip}`,
        aiPlan: generatedPlan
      };

      const res = await API.post('/trips', tripPayload);
      if (res.data.success) {
        setShowAIModal(false);
        setJoinFeedback({ type: 'success', message: 'Custom trip plan created & published!' });
        await fetchTrips(res.data.data?._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save trip plan');
    } finally {
      setSavingPlan(false);
    }
  };

  // Derived Helpers
  const currentPool = tripTab === 'my_trips' ? myTrips : exploreTrips;
  const displayedTrips = currentPool.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title?.toLowerCase().includes(q) ||
      t.destination?.toLowerCase().includes(q) ||
      t.creator?.name?.toLowerCase().includes(q) ||
      t.creator?.organization?.toLowerCase().includes(q)
    );
  });

  const isCreator = Boolean(
    selectedTrip && user && (
      (selectedTrip.creator?._id || selectedTrip.creator)?.toString() === user._id?.toString()
    )
  );

  const isMember = Boolean(
    selectedTrip && user && (
      isCreator ||
      (selectedTrip.members || []).some((m) => (m._id || m)?.toString() === user._id?.toString())
    )
  );

  const maxCapacity = selectedTrip?.maxMembers || 6;
  const currentMembersCount = selectedTrip?.members?.length || 1;
  const isFull = currentMembersCount >= maxCapacity;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title & Dual Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 block mb-0.5">
            Group Expeditions & Community Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trip Planner & Group Splitter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create travel plans, discover community expeditions, join peer trips, and split group expenses fairly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Smart Trip Builder CTA */}
          <button
            onClick={() => setShowAIModal(true)}
            className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 hover:from-indigo-700 hover:to-violet-900 text-white font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all active:scale-[0.99]"
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Smart Trip Builder</span>
          </button>

          {/* Standard Manual Trip */}
          <button
            onClick={() => setShowTripModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>

      {/* Dismissible Feedback Banner */}
      {joinFeedback.message && (
        <div
          className={`mb-6 p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            joinFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {joinFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-semibold">{joinFeedback.message}</span>
          </div>
          <button
            onClick={() => setJoinFeedback({ type: '', message: '' })}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md hover:bg-slate-200/50 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Filter Controls: Segmented Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200/80">
        
        {/* Segmented Pill Tabs */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs">
          <button
            onClick={() => handleTabChange('my_trips')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              tripTab === 'my_trips'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Trips & Joined</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
              tripTab === 'my_trips' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {myTrips.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('explore')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              tripTab === 'explore'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Explore Community Trips</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
              tripTab === 'explore' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {exploreTrips.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search destination, title, organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading trip expeditions...</p>
        </div>
      ) : displayedTrips.length === 0 ? (
        <div className="text-center py-16 card-clean rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto p-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
            <Compass className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {tripTab === 'my_trips' ? 'No trips planned yet' : 'No community trips matching search'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            {tripTab === 'my_trips'
              ? 'Plan an expedition or explore upcoming community trips to join fellow commuters.'
              : 'Try searching with another keyword or plan your own trip so colleagues can join you.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {tripTab === 'my_trips' ? (
              <>
                <button
                  onClick={() => handleTabChange('explore')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Explore Community</span>
                </button>
                <button
                  onClick={() => setShowAIModal(true)}
                  className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs"
                >
                  Smart Builder
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowTripModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Create Trip Plan</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Trips Catalog List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {tripTab === 'my_trips' ? 'My Expeditions' : 'Community Expeditions'}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {displayedTrips.length} available
              </span>
            </div>

            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
              {displayedTrips.map((trip) => {
                const isUserCreator = (trip.creator?._id || trip.creator)?.toString() === user?._id?.toString();
                const isUserJoined = (trip.members || []).some(
                  (m) => (m._id || m)?.toString() === user?._id?.toString()
                );
                const isSelected = selectedTrip?._id === trip._id;

                return (
                  <div
                    key={trip._id}
                    onClick={() => {
                      setSelectedTrip(trip);
                      fetchTripExpenses(trip._id);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200/50 shadow-xs'
                        : 'card-clean border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">
                        {trip.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {trip.aiPlan && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                            Curated
                          </span>
                        )}
                        {isUserCreator ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-600 text-white">
                            Organizer
                          </span>
                        ) : isUserJoined ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Joined
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium mb-3">
                      <span className="flex items-center gap-1 text-slate-800 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {trip.destination}
                      </span>
                      <span>•</span>
                      <span>₹{trip.budget} Est. Budget</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100/90">
                      <span className="truncate">By {trip.creator?.name || 'Verified Commuter'}</span>
                      <span className="font-bold text-slate-700 flex items-center gap-1 flex-shrink-0">
                        <Users className="w-3 h-3 text-indigo-600" />
                        <span>{trip.members?.length || 1}/{trip.maxMembers || 6} joined</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Selected Trip Overview, Travelers Roster, & Expense Splitter */}
          {selectedTrip && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Trip Overview Card */}
              <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                
                {/* Header Info */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        {selectedTrip.title}
                      </h2>
                      {selectedTrip.aiPlan && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-indigo-600" />
                          Curated Plan
                        </span>
                      )}
                      {selectedTrip.aiPlan?.transportMode && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          {selectedTrip.aiPlan.transportMode === 'Flight' ? (
                            <Plane className="w-3 h-3 text-indigo-600" />
                          ) : selectedTrip.aiPlan.transportMode === 'Train' ? (
                            <Train className="w-3 h-3 text-indigo-600" />
                          ) : selectedTrip.aiPlan.transportMode === 'Bus' ? (
                            <Bus className="w-3 h-3 text-indigo-600" />
                          ) : (
                            <Car className="w-3 h-3 text-indigo-600" />
                          )}
                          <span>Transit: {selectedTrip.aiPlan.transportMode}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Destination: <span className="font-semibold text-slate-800">{selectedTrip.destination}</span> • Dates: <span className="font-semibold text-slate-800">{selectedTrip.startDate} to {selectedTrip.endDate}</span>
                    </p>
                  </div>

                  {isMember && (
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Add Expense</span>
                    </button>
                  )}
                </div>

                {/* Community Join / Participation Banner */}
                {isCreator ? (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          You are the Trip Organizer
                        </span>
                        <span className="text-[11px] text-slate-600">
                          {currentMembersCount} {currentMembersCount === 1 ? 'traveler' : 'travelers'} joined your plan • Capacity: {currentMembersCount}/{maxCapacity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-xl">
                        {maxCapacity - currentMembersCount} spots open
                      </span>
                      <button
                        onClick={() => handleDeleteTrip(selectedTrip._id)}
                        title="Delete Trip"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : isMember ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-100" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-950 block">
                          You're on the Travelers Roster!
                        </span>
                        <span className="text-[11px] text-emerald-700">
                          Coordinating with organizer {selectedTrip.creator?.name || 'Commuter'} & {Math.max(0, currentMembersCount - 1)} fellow travel companion(s)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLeaveTrip(selectedTrip._id)}
                      disabled={joinLoading}
                      className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-2xs disabled:opacity-50"
                    >
                      Leave Trip
                    </button>
                  </div>
                ) : isFull ? (
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>This trip group is currently at full capacity ({currentMembersCount}/{maxCapacity} travelers).</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-slate-50/70 to-emerald-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
                          Open for Travel Companions
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          ({currentMembersCount} of {maxCapacity} joined)
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">
                        Join {selectedTrip.creator?.name || 'this commuter'}'s trip to {selectedTrip.destination}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Share fuel/cab costs, explore daily sightseeing, and coordinate seamlessly.
                      </p>
                    </div>

                    <button
                      onClick={() => handleJoinTrip(selectedTrip._id)}
                      disabled={joinLoading}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] flex-shrink-0 disabled:opacity-50"
                    >
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>{joinLoading ? 'Joining...' : 'Join This Trip'}</span>
                    </button>
                  </div>
                )}

                {/* Summary Math Grid */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Total Spend</span>
                    <span className="text-xl font-black text-slate-900">₹{expenseSummary.totalAmount}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-indigo-700 block">Travelers Joined</span>
                    <span className="text-xl font-black text-slate-900">{currentMembersCount}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-amber-700 block">Per Person Share</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{currentMembersCount ? (expenseSummary.totalAmount / currentMembersCount).toFixed(2) : 0}
                    </span>
                  </div>
                </div>

                {/* Category Totals */}
                {Object.keys(expenseSummary.categoryTotals || {}).length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(expenseSummary.categoryTotals || {}).map(([cat, amt]) => (
                      <span key={cat} className="bg-slate-100 text-slate-800 border border-slate-200 font-bold px-2.5 py-1 rounded-lg">
                        {cat}: ₹{amt}
                      </span>
                    ))}
                  </div>
                )}

                {/* Notes if any */}
                {selectedTrip.notes && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                      Organizer Instructions:
                    </strong>
                    <span>{selectedTrip.notes}</span>
                  </div>
                )}

              </div>

              {/* Joined Travelers Roster */}
              <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Joined Travelers ({currentMembersCount})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isCreator
                        ? 'Users who have joined your travel plan. You can coordinate trip details together.'
                        : 'Fellow commuters traveling together on this expedition.'}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                    {currentMembersCount} of {maxCapacity} spots filled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  
                  {/* Trip Organizer Capsule */}
                  <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {selectedTrip.creator?.name || 'Verified Commuter'}
                        </span>
                        {(selectedTrip.creator?._id || selectedTrip.creator)?.toString() === user?._id?.toString() && (
                          <span className="text-[9px] font-bold text-indigo-700 bg-white px-1.5 py-0.2 rounded border border-indigo-200">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-indigo-700 font-bold block truncate">
                        Trip Organizer
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {selectedTrip.creator?.organization || 'Verified Member'}
                      </span>
                    </div>
                  </div>

                  {/* Other Joined Travelers */}
                  {(selectedTrip.members || [])
                    .filter((m) => (m._id || m)?.toString() !== (selectedTrip.creator?._id || selectedTrip.creator)?.toString())
                    .map((member, idx) => {
                      const memberId = member._id || member;
                      const isCurrentUser = memberId?.toString() === user?._id?.toString();

                      return (
                        <div key={memberId || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {member.name || 'Traveler'}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[9px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold block truncate">
                              Joined Traveler
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {member.organization || 'Verified Commuter'}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {/* Empty Slots Indicator */}
                  {maxCapacity > currentMembersCount && (
                    <div className="p-3 rounded-2xl border border-dashed border-slate-200 flex items-center gap-3 text-slate-400">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold block">Open Spot</span>
                        <span className="text-[10px] text-slate-400 block">
                          Waiting for companions
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* If Trip has Curated Plan Attached, Display Structured Day Plan */}
              {selectedTrip.aiPlan && (
                <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-bold text-slate-900 text-sm">Curated Day-by-Day Itinerary</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {selectedTrip.aiPlan.days?.length || selectedTrip.aiPlan.days} Days Planned
                    </span>
                  </div>

                  {/* Famous Must-Visit Tourist Spots Showcase */}
                  {Array.isArray(selectedTrip.aiPlan.famousSpots) && selectedTrip.aiPlan.famousSpots.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-600" />
                          <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">
                            Famous Must-Visit Tourist Spots in {selectedTrip.destination}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {selectedTrip.aiPlan.famousSpots.length} Iconic Attractions
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedTrip.aiPlan.famousSpots.map((spot, sIdx) => (
                          <div key={sIdx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1.5 mb-1">
                                <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{spot.name}</h5>
                                {spot.category && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex-shrink-0">
                                    {spot.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {spot.description}
                              </p>
                            </div>
                            {spot.estimatedTime && (
                              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                <span>Recommended Visit:</span>
                                <span className="font-semibold text-slate-700">{spot.estimatedTime}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget Allocation Breakdown */}
                  {selectedTrip.aiPlan.budgetAmounts && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
                        Suggested Budget Allocation
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-indigo-700 font-bold block">Stay</span>
                          <span className="font-bold text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.stay}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-amber-700 font-bold block">Food</span>
                          <span className="font-bold text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.food}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-emerald-700 font-bold block">Transport</span>
                          <span className="font-bold text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.transport}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-sky-700 font-bold block">Activities</span>
                          <span className="font-bold text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.activities}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-600 font-bold block">Emergency</span>
                          <span className="font-bold text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.emergency}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Day Itinerary Schedule */}
                  {Array.isArray(selectedTrip.aiPlan.days) && (
                    <div className="space-y-3">
                      {selectedTrip.aiPlan.days.map((dayItem, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                                {dayItem.dayNumber || idx + 1}
                              </span>
                              <span>{dayItem.theme || `Day ${idx + 1}`}</span>
                            </h4>
                            {dayItem.estimatedDayCost && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                Est. ₹{dayItem.estimatedDayCost}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5 text-xs text-slate-600 pl-6 border-l-2 border-indigo-100 ml-2.5">
                            {dayItem.morning && (
                              <p><strong className="text-slate-800">Morning:</strong> {dayItem.morning}</p>
                            )}
                            {dayItem.afternoon && (
                              <p><strong className="text-slate-800">Afternoon:</strong> {dayItem.afternoon}</p>
                            )}
                            {dayItem.evening && (
                              <p><strong className="text-slate-800">Evening:</strong> {dayItem.evening}</p>
                            )}
                            {dayItem.localTips && (
                              <p className="text-[11px] text-indigo-700 italic pt-1">
                                Tip: {dayItem.localTips}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Route Tip */}
                  {selectedTrip.aiPlan.smartCarpoolTip && (
                    <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Car className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] uppercase tracking-wider text-amber-800">Commute & Transit Tip:</strong>
                        <span>{selectedTrip.aiPlan.smartCarpoolTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logged Expenses List */}
              <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Logged Expense Receipts</h3>
                    <p className="text-[11px] text-slate-500">
                      Shared costs split equally across all {currentMembersCount} travelers
                    </p>
                  </div>
                </div>

                {expenses.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No expenses logged yet. {isMember ? 'Click "Add Expense" to record a shared payment.' : 'Join this trip to participate in group expense splits.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((exp) => (
                      <div key={exp._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{exp.title}</span>
                            <span className="text-[10px] bg-slate-200 border border-slate-300 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                              {exp.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Paid by <span className="font-semibold text-slate-800">{exp.paidBy?.name}</span> • Split across {exp.splitBetween?.length || currentMembersCount} travelers
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <span className="text-sm font-bold text-slate-900">₹{exp.amount}</span>
                            <span className="text-[10px] text-emerald-700 block font-semibold">₹{exp.perPersonAmount}/person</span>
                          </div>

                          {isMember && (
                            <button
                              onClick={() => handleDeleteExpense(exp._id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================
          SMART TRIP & BUDGET PLANNER MODAL
      ======================================================== */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full my-8 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block mb-1">
                  Trip Builder
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Custom Itinerary & Budget Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate realistic day-by-day schedules, budget allocations, and commute tips.
                </p>
              </div>

              <button
                onClick={() => setShowAIModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {aiError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleGenerateAIPlan} className="space-y-4 mb-6">
              
              {/* Destination with Quick-Pick Suggestions */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination</label>
                <input
                  type="text"
                  required
                  value={aiInput.destination}
                  onChange={(e) => setAiInput({ ...aiInput, destination: e.target.value })}
                  placeholder="e.g. Goa, Lonavala, Manali, Mahabaleshwar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                />

                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  <span className="text-[10px] text-slate-400">Popular:</span>
                  {POPULAR_DESTINATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setAiInput({ ...aiInput, destination: d })}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trip Controls: Days, Budget, Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={aiInput.days}
                    onChange={(e) => setAiInput({ ...aiInput, days: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Target Budget (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={aiInput.budget}
                    onChange={(e) => setAiInput({ ...aiInput, budget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Travelers Count</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={aiInput.travelers}
                    onChange={(e) => setAiInput({ ...aiInput, travelers: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  />
                </div>
              </div>

              {/* Travel Style Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Travel Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Balanced', 'Budget / Backpacker', 'Adventure & Trekking', 'Relaxation / Leisure'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAiInput({ ...aiInput, travelStyle: st })}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        aiInput.travelStyle === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode of Transport Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mode of Transport</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Train', label: 'Train', icon: Train },
                    { id: 'Flight', label: 'Flight', icon: Plane },
                    { id: 'Bus', label: 'Bus', icon: Bus },
                    { id: 'Car', label: 'Car / Road Trip', icon: Car }
                  ].map((m) => {
                    const IconComponent = m.icon;
                    const isSelected = aiInput.transportMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setAiInput({ ...aiInput, transportMode: m.id })}
                        className={`p-2.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Interests */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Interests & Preferences (Optional)</label>
                <input
                  type="text"
                  value={aiInput.interests}
                  onChange={(e) => setAiInput({ ...aiInput, interests: e.target.value })}
                  placeholder="e.g. palace heritage, scenic viewpoints, authentic food, sunsets"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={aiLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating your itinerary & budget plan...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>Generate Itinerary & Budget Plan</span>
                  </>
                )}
              </button>

            </form>

            {/* Generated Plan Preview Box */}
            {generatedPlan && (
              <div className="pt-5 border-t border-slate-200 space-y-4">
                
                {/* Title & Overview Banner */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
                        Curated Itinerary
                      </span>
                      {generatedPlan.transportMode && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-slate-700 flex items-center gap-1">
                          {generatedPlan.transportMode === 'Flight' ? (
                            <Plane className="w-3 h-3 text-indigo-600" />
                          ) : generatedPlan.transportMode === 'Train' ? (
                            <Train className="w-3 h-3 text-indigo-600" />
                          ) : generatedPlan.transportMode === 'Bus' ? (
                            <Bus className="w-3 h-3 text-indigo-600" />
                          ) : (
                            <Car className="w-3 h-3 text-indigo-600" />
                          )}
                          <span>Transit: {generatedPlan.transportMode}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-slate-900 leading-tight">
                      {generatedPlan.tripTitle}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {generatedPlan.summary}
                    </p>
                  </div>

                  <div className="text-right sm:border-l sm:border-indigo-200 sm:pl-4 flex-shrink-0">
                    <span className="text-xs text-slate-500 block">Est. Total Budget</span>
                    <span className="text-xl font-black text-slate-900">₹{generatedPlan.estimatedTotalBudget}</span>
                    <span className="text-[10px] text-emerald-700 font-extrabold block">
                      ₹{generatedPlan.perPersonBudget} / person
                    </span>
                  </div>
                </div>

                {/* Famous Must-Visit Tourist Spots Showcase */}
                {Array.isArray(generatedPlan.famousSpots) && generatedPlan.famousSpots.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-600" />
                        <h5 className="font-extrabold text-slate-900 text-xs tracking-tight">
                          Famous Must-Visit Tourist Spots in {aiInput.destination || generatedPlan.destination}
                        </h5>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {generatedPlan.famousSpots.length} Iconic Attractions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {generatedPlan.famousSpots.map((spot, sIdx) => (
                        <div key={sIdx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <h6 className="font-bold text-slate-900 text-xs line-clamp-1">{spot.name}</h6>
                              {spot.category && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex-shrink-0">
                                  {spot.category}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">
                              {spot.description}
                            </p>
                          </div>
                          {spot.estimatedTime && (
                            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                              <span>Recommended Visit:</span>
                              <span className="font-semibold text-slate-700">{spot.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structured Budget Allocation Cards */}
                {generatedPlan.budgetAmounts && (
                  <div>
                    <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                      Budget Split Breakdown
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-indigo-700 block">Stay ({generatedPlan.budgetBreakdown?.stay || 40}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.stay}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-amber-700 block">Food ({generatedPlan.budgetBreakdown?.food || 25}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.food}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-emerald-700 block">Transit ({generatedPlan.budgetBreakdown?.transport || 20}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.transport}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-sky-700 block">Activities ({generatedPlan.budgetBreakdown?.activities || 10}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.activities}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-600 block">Buffer ({generatedPlan.budgetBreakdown?.emergency || 5}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.emergency}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Day-by-Day Accordion Plan */}
                {Array.isArray(generatedPlan.days) && (
                  <div>
                    <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                      Day-by-Day Schedule
                    </h5>
                    <div className="space-y-2">
                      {generatedPlan.days.map((day) => {
                        const dayNum = day.dayNumber || 1;
                        const isOpen = expandedDay === dayNum;

                        return (
                          <div key={dayNum} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <button
                              type="button"
                              onClick={() => setExpandedDay(isOpen ? null : dayNum)}
                              className="w-full p-3 text-left font-bold text-xs flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                                  {dayNum}
                                </span>
                                <span className="text-slate-900">{day.theme || `Day ${dayNum}`}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {day.estimatedDayCost && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    Est. ₹{day.estimatedDayCost}
                                  </span>
                                )}
                                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                              </div>
                            </button>

                            {isOpen && (
                              <div className="p-3.5 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-600 space-y-2">
                                {day.morning && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-extrabold text-indigo-900 w-16 flex-shrink-0">Morning:</span>
                                    <span>{day.morning}</span>
                                  </div>
                                )}
                                {day.afternoon && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-extrabold text-amber-900 w-16 flex-shrink-0">Afternoon:</span>
                                    <span>{day.afternoon}</span>
                                  </div>
                                )}
                                {day.evening && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-extrabold text-slate-900 w-16 flex-shrink-0">Evening:</span>
                                    <span>{day.evening}</span>
                                  </div>
                                )}
                                {day.localTips && (
                                  <div className="mt-2 pt-2 border-t border-slate-200/80 text-[11px] text-indigo-700 italic">
                                    <strong>Insider Tip:</strong> {day.localTips}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Carpool & Route Sharing Tip */}
                {generatedPlan.smartCarpoolTip && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Car className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider text-amber-800">
                        Commute & Route Tip:
                      </strong>
                      <p className="mt-0.5 text-[11px] leading-relaxed">{generatedPlan.smartCarpoolTip}</p>
                    </div>
                  </div>
                )}

                {/* Packing Checklist */}
                {Array.isArray(generatedPlan.packingEssentials) && (
                  <div>
                    <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                      <Luggage className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Packing Checklist</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedPlan.packingEssentials.map((item, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] text-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1-Click Save Plan to TravelBuddy */}
                <button
                  type="button"
                  onClick={handleSaveAIPlan}
                  disabled={savingPlan}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {savingPlan ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving your expedition plan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Save as My Trip Plan</span>
                    </>
                  )}
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Manual Trip Creation Modal */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Plan a New Group Expedition</h3>
            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Trip Title (e.g. Mahabaleshwar Weekend)"
                value={newTrip.title}
                onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
              />
              <input
                type="text"
                required
                placeholder="Destination"
                value={newTrip.destination}
                onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Target Budget (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="Budget"
                    value={newTrip.budget}
                    onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Max Travelers</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    required
                    value={newTrip.maxMembers}
                    onChange={(e) => setNewTrip({ ...newTrip, maxMembers: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">End Date</label>
                  <input
                    type="date"
                    required
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <textarea
                rows="2"
                placeholder="Notes / Instructions for travelers"
                value={newTrip.notes}
                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  Save Trip Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Trip Expense Receipt</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Expense Description (e.g. Resort Booking)"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="Hotel">Hotel / Stay</option>
                <option value="Food">Food & Dining</option>
                <option value="Fuel">Fuel & Tolls</option>
                <option value="Shopping">Shopping & Activities</option>
                <option value="Other">Other Expenses</option>
              </select>
              <input
                type="number"
                required
                placeholder="Total Amount (₹)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
                >
                  Calculate Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TripPlanner;

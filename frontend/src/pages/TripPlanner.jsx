import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Compass,
  Plus,
  DollarSign,
  Calendar,
  Users,
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
  X
} from 'lucide-react';
import API from '../services/api';

const POPULAR_DESTINATIONS = ['Goa', 'Lonavala', 'Udaipur', 'Mahabaleshwar', 'Manali', 'Pondicherry'];

const TripPlanner = () => {
  const { user } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState({ totalAmount: 0, categoryTotals: {} });
  const [loading, setLoading] = useState(true);

  // Manual Trip Modal
  const [showTripModal, setShowTripModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: 'Monsoon Camping & Fort Trek',
    destination: 'Lonavala',
    budget: 5000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
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
    destination: 'Goa',
    days: 3,
    budget: 8000,
    travelers: 2,
    travelStyle: 'Balanced',
    interests: 'beaches, sunset points, authentic seafood, scooty rides'
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(1);
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await API.get('/trips');
      if (res.data.success) {
        setTrips(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedTrip(res.data.data[0]);
          fetchTripExpenses(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        fetchTrips();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create trip');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;

    try {
      const memberIds = selectedTrip.members.map(m => m._id || m);
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

  // Generate Custom Trip Plan
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
        title: generatedPlan.tripTitle || `${generatedPlan.destination} AI Trip`,
        destination: generatedPlan.destination,
        budget: Number(generatedPlan.estimatedTotalBudget) || 5000,
        startDate: today.toISOString().split('T')[0],
        endDate: returnDate.toISOString().split('T')[0],
        notes: `${generatedPlan.summary}\n\nSmart Commute Tip: ${generatedPlan.smartCarpoolTip}`,
        aiPlan: generatedPlan
      };

      const res = await API.post('/trips', tripPayload);
      if (res.data.success) {
        setShowAIModal(false);
        await fetchTrips();
        setSelectedTrip(res.data.data);
        fetchTripExpenses(res.data.data._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save AI trip plan');
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title & Dual Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 block mb-0.5">
            Group Expeditions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trip Planner & Expense Splitter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize upcoming travels, split group expenses fairly, and create custom itineraries.
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

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading trip plans...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16 card-clean rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto p-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
            <Compass className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-base font-black text-slate-900">No trips planned yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Create a custom day-by-day itinerary and realistic budget split for your next destination in seconds.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowAIModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Trip Builder</span>
            </button>
            <button
              onClick={() => setShowTripModal(true)}
              className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs"
            >
              Manual Trip
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Trips Selection List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Trip Plans</h3>

            {trips.map((trip) => (
              <div
                key={trip._id}
                onClick={() => {
                  setSelectedTrip(trip);
                  fetchTripExpenses(trip._id);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTrip?._id === trip._id
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200/50 shadow-xs'
                    : 'card-clean border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-slate-900 text-base">{trip.title}</h4>
                  <div className="flex items-center gap-1">
                    {trip.aiPlan && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                        AI Plan
                      </span>
                    )}
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      {trip.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1 text-slate-800 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {trip.destination}
                  </span>
                  <span>•</span>
                  <span>₹{trip.budget} Budget</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  <span>{trip.startDate} - {trip.endDate}</span>
                  <span>{trip.members?.length || 1} Member(s)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right 2 Columns: Integrated Expense Splitter & AI Itinerary View */}
          {selectedTrip && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Trip Overview Card */}
              <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{selectedTrip.title}</h2>
                      {selectedTrip.aiPlan && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-indigo-600" />
                          Curated Plan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Destination: <span className="font-semibold text-slate-800">{selectedTrip.destination}</span> • Target Budget: <span className="font-bold text-slate-900">₹{selectedTrip.budget}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add Expense</span>
                  </button>
                </div>

                {/* Summary Math Grid */}
                <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Total Spend</span>
                    <span className="text-xl font-black text-slate-900">₹{expenseSummary.totalAmount}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-indigo-700 block">Members</span>
                    <span className="text-xl font-black text-slate-900">{selectedTrip.members?.length || 1}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-amber-700 block">Per Person Share</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{selectedTrip.members?.length ? (expenseSummary.totalAmount / selectedTrip.members.length).toFixed(2) : 0}
                    </span>
                  </div>
                </div>

                {/* Category Totals */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(expenseSummary.categoryTotals || {}).map(([cat, amt]) => (
                    <span key={cat} className="bg-slate-100 text-slate-800 border border-slate-200 font-bold px-2.5 py-1 rounded-lg">
                      {cat}: ₹{amt}
                    </span>
                  ))}
                </div>
              </div>

              {/* If Trip has AI Generated Plan Attached, Display Structured Day Plan */}
              {selectedTrip.aiPlan && (
                <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-black text-slate-900 text-sm">AI Day-by-Day Itinerary</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {selectedTrip.aiPlan.days?.length || selectedTrip.aiPlan.days} Days Planned
                    </span>
                  </div>

                  {/* Budget Allocation Breakdown */}
                  {selectedTrip.aiPlan.budgetAmounts && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">
                        Suggested Budget Allocation
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-indigo-700 font-bold block">Stay</span>
                          <span className="font-black text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.stay}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-amber-700 font-bold block">Food</span>
                          <span className="font-black text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.food}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-emerald-700 font-bold block">Transport</span>
                          <span className="font-black text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.transport}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-sky-700 font-bold block">Activities</span>
                          <span className="font-black text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.activities}</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-600 font-bold block">Emergency</span>
                          <span className="font-black text-slate-900">₹{selectedTrip.aiPlan.budgetAmounts.emergency}</span>
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
                              <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center">
                                {dayItem.dayNumber || idx + 1}
                              </span>
                              <span>{dayItem.theme || `Day ${idx + 1}`}</span>
                            </h4>
                            {dayItem.estimatedDayCost && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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

                  {/* Smart Commute Tip */}
                  {selectedTrip.aiPlan.smartCarpoolTip && (
                    <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Car className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] uppercase tracking-wider text-amber-800">TravelBuddy Route Tip:</strong>
                        <span>{selectedTrip.aiPlan.smartCarpoolTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logged Expenses List */}
              <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Logged Expense Receipts</h3>

                {expenses.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No expenses logged yet. Click "Add Expense" to start.</p>
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
                            Paid by <span className="font-semibold text-slate-800">{exp.paidBy?.name}</span> • Split between {exp.splitBetween?.length || 1} people
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <span className="text-sm font-bold text-slate-900">₹{exp.amount}</span>
                            <span className="text-[10px] text-emerald-700 block font-semibold">₹{exp.perPersonAmount}/person</span>
                          </div>

                          <button
                            onClick={() => handleDeleteExpense(exp._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Days, Budget, Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    required
                    value={aiInput.days}
                    onChange={(e) => setAiInput({ ...aiInput, days: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Target Budget (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
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
                    max="10"
                    required
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

              {/* Optional Interests */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Interests & Preferences (Optional)</label>
                <input
                  type="text"
                  value={aiInput.interests}
                  onChange={(e) => setAiInput({ ...aiInput, interests: e.target.value })}
                  placeholder="e.g. scenic viewpoints, fort trekking, street food, sunsets"
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
                    <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
                      Curated Itinerary
                    </span>
                    <h4 className="text-base font-black text-slate-900 leading-tight mt-1">
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
                        <span className="text-[10px] font-bold text-emerald-700 block">Transport ({generatedPlan.budgetBreakdown?.transport || 20}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.transport}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-sky-700 block">Activities ({generatedPlan.budgetBreakdown?.activities || 10}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.activities}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-600 block">Contingency ({generatedPlan.budgetBreakdown?.emergency || 5}%)</span>
                        <span className="font-black text-slate-900 text-sm">₹{generatedPlan.budgetAmounts.emergency}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Day-by-Day Expandable Itinerary */}
                {Array.isArray(generatedPlan.days) && (
                  <div>
                    <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                      Day-by-Day Itinerary Schedule
                    </h5>
                    <div className="space-y-2.5">
                      {generatedPlan.days.map((dayItem) => {
                        const dayNum = dayItem.dayNumber;
                        const isExpanded = expandedDay === dayNum;

                        return (
                          <div
                            key={dayNum}
                            className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedDay(isExpanded ? null : dayNum)}
                              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                                  {dayNum}
                                </span>
                                <div>
                                  <span className="font-bold text-slate-900 text-xs block">
                                    {dayItem.theme}
                                  </span>
                                  {dayItem.estimatedDayCost && (
                                    <span className="text-[10px] text-emerald-700 font-semibold">
                                      Est. Day Spend: ₹{dayItem.estimatedDayCost}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>

                            {isExpanded && (
                              <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs">
                                {dayItem.morning && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-extrabold text-slate-700 min-w-[70px]">Morning:</span>
                                    <span className="text-slate-600">{dayItem.morning}</span>
                                  </div>
                                )}
                                {dayItem.afternoon && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-extrabold text-slate-700 min-w-[70px]">Afternoon:</span>
                                    <span className="text-slate-600">{dayItem.afternoon}</span>
                                  </div>
                                )}
                                {dayItem.evening && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-extrabold text-slate-700 min-w-[70px]">Evening:</span>
                                    <span className="text-slate-600">{dayItem.evening}</span>
                                  </div>
                                )}
                                {dayItem.localTips && (
                                  <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 mt-2">
                                    <strong>Insider Tip:</strong> {dayItem.localTips}
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

                {/* Smart TravelBuddy Commute Tip */}
                {generatedPlan.smartCarpoolTip && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-2">
                    <Car className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider text-emerald-800">
                        TravelBuddy Commute & Fare Split Tip:
                      </strong>
                      <span className="leading-snug">{generatedPlan.smartCarpoolTip}</span>
                    </div>
                  </div>
                )}

                {/* Packing Essentials */}
                {Array.isArray(generatedPlan.packingEssentials) && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1.5 flex items-center gap-1">
                      <Luggage className="w-3.5 h-3.5 text-slate-500" />
                      Packing Essentials
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedPlan.packingEssentials.map((item, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] text-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1-Click Save as Trip Button */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAIPlan}
                    disabled={savingPlan}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {savingPlan ? (
                      <span>Saving to TravelBuddy...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save as My Trip Plan (Start Splitting Expenses)</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Manual Create Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Group Trip Plan</h3>
            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Trip Title (e.g. Goa Weekend Escape)"
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
              <input
                type="number"
                required
                placeholder="Target Budget (₹)"
                value={newTrip.budget}
                onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white font-semibold"
              />
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
                placeholder="Notes / Instructions"
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

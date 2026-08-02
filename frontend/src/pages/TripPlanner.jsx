import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Compass, Plus, DollarSign, Calendar, Users, Trash2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import API from '../services/api';

const TripPlanner = () => {
  const { user } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState({ totalAmount: 0, categoryTotals: {} });
  const [loading, setLoading] = useState(true);

  const [showTripModal, setShowTripModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: 'Monsoon Camping & Fort Trek',
    destination: 'Lonavala',
    budget: 5000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    notes: 'Remember to pack extra raincoats and trek boots!'
  });

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: 'Hotel & Resort Booking',
    category: 'Hotel',
    amount: 3000
  });

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
      await API.delete(`/expenses/${expenseId}`);
      fetchTripExpenses(selectedTrip._id);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest block mb-1">
            Group Trips & Split Calculator
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trip Planner & Expense Splitter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize upcoming group travels and calculate per-person expense splits automatically.
          </p>
        </div>

        <button
          onClick={() => setShowTripModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-12">Loading trip plans...</p>
      ) : trips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 card-shadow">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No trips planned yet</h3>
          <p className="text-xs text-slate-500 mt-1">Create your first group trip to start splitting expenses!</p>
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
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 card-shadow'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-slate-900 text-base">{trip.title}</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 uppercase">
                    {trip.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1">📍 {trip.destination}</span>
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

          {/* Right 2 Columns: Integrated Expense Splitter */}
          {selectedTrip && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Trip Overview Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 card-shadow">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedTrip.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Destination: <span className="font-semibold text-slate-800">{selectedTrip.destination}</span></p>
                  </div>

                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Expense</span>
                  </button>
                </div>

                {/* Summary Math Grid */}
                <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Total Spend</span>
                    <span className="text-xl font-black text-slate-900">₹{expenseSummary.totalAmount}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Members</span>
                    <span className="text-xl font-black text-slate-900">{selectedTrip.members?.length || 1}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Per Person Share</span>
                    <span className="text-xl font-black text-indigo-600">
                      ₹{selectedTrip.members?.length ? (expenseSummary.totalAmount / selectedTrip.members.length).toFixed(2) : 0}
                    </span>
                  </div>
                </div>

                {/* Category Totals */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(expenseSummary.categoryTotals || {}).map(([cat, amt]) => (
                    <span key={cat} className="bg-indigo-50 text-indigo-900 border border-indigo-200/60 font-bold px-2.5 py-1 rounded-lg">
                      {cat}: ₹{amt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Logged Expenses List */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 card-shadow">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Logged Expense Receipts</h3>

                {expenses.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No expenses logged yet. Click "Add Expense" to start.</p>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((exp) => (
                      <div key={exp._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{exp.title}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {exp.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Paid by <span className="font-semibold text-slate-700">{exp.paidBy?.name}</span> • Split between {exp.splitBetween?.length || 1} people
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <span className="text-sm font-bold text-slate-900">₹{exp.amount}</span>
                            <span className="text-[10px] text-indigo-600 block font-semibold">₹{exp.perPersonAmount}/person</span>
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

      {/* Create Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 card-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Group Trip Plan</h3>
            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Trip Title (e.g. Goa Weekend Escape)"
                value={newTrip.title}
                onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <input
                type="text"
                required
                placeholder="Destination"
                value={newTrip.destination}
                onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <input
                type="number"
                required
                placeholder="Target Budget (₹)"
                value={newTrip.budget}
                onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <textarea
                rows="2"
                placeholder="Notes / Instructions"
                value={newTrip.notes}
                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
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
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 card-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Trip Expense Receipt</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Expense Description (e.g. Resort Booking)"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
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

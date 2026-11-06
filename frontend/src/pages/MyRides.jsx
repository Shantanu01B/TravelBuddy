import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TrustScoreBadge from '../components/TrustScoreBadge';
import { Car, Check, X, Star, CheckCircle2, AlertCircle, User } from 'lucide-react';
import API from '../services/api';

const MyRides = () => {
  const { user, refreshProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('booked');

  const [bookedRides, setBookedRides] = useState([]);
  const [driverRequests, setDriverRequests] = useState([]);
  const [offeredRides, setOfferedRides] = useState([]);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [revieweeUser, setRevieweeUser] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Great commuter! Very punctual and friendly.');
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMyRides();
  }, [activeTab]);

  const fetchMyRides = async () => {
    setLoading(true);
    try {
      const [resRev, resBooked, resReq, resOffered] = await Promise.all([
        API.get('/reviews/my-submitted'),
        API.get('/requests/my-booked'),
        API.get('/requests/my-requests'),
        API.get('/rides/my-offered')
      ]);

      if (resRev.data.success) setSubmittedReviews(resRev.data.data);
      if (resBooked.data.success) setBookedRides(resBooked.data.data);
      if (resReq.data.success) setDriverRequests(resReq.data.data);
      if (resOffered.data.success) setOfferedRides(resOffered.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasSubmittedRating = (rideId, targetUserId) => {
    if (!rideId || !targetUserId) return false;
    const rId = typeof rideId === 'object' ? rideId._id : rideId;
    const uId = typeof targetUserId === 'object' ? targetUserId._id : targetUserId;

    return submittedReviews.some(rev => {
      const revRideId = typeof rev.ride === 'object' ? rev.ride._id : rev.ride;
      const revRevieweeId = typeof rev.reviewee === 'object' ? rev.reviewee._id : rev.reviewee;
      return revRideId === rId && revRevieweeId === uId;
    });
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const res = await API.put(`/requests/${requestId}/status`, { status });
      if (res.data.success) {
        fetchMyRides();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleCompleteRide = async (reqItem, revieweeTarget) => {
    try {
      const res = await API.put(`/requests/${reqItem._id}/complete`);
      if (res.data.success) {
        setSelectedRequest(reqItem);
        setRevieweeUser(revieweeTarget);
        setShowReviewModal(true);
        setModalMessage({ type: '', text: '' });
        refreshProfile();
        fetchMyRides();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete ride');
    }
  };

  const openRatingModal = (reqItem, revieweeTarget) => {
    setSelectedRequest(reqItem);
    setRevieweeUser(revieweeTarget);
    setShowReviewModal(true);
    setModalMessage({ type: '', text: '' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !revieweeUser) return;
    setModalMessage({ type: '', text: '' });

    try {
      const isDriver = selectedRequest.driver === user._id || selectedRequest.driver?._id === user._id;

      const res = await API.post('/reviews', {
        rideId: selectedRequest.ride?._id || selectedRequest.ride,
        revieweeId: revieweeUser._id || revieweeUser,
        rating: Number(reviewRating),
        comment: reviewComment,
        role: isDriver ? 'driver' : 'passenger'
      });

      if (res.data.success) {
        setShowReviewModal(false);
        refreshProfile();
        fetchMyRides();
      }
    } catch (err) {
      setModalMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit review'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Ride Activity</h1>
          <p className="text-xs text-slate-500 mt-1">Manage seat requests, complete rides & rate your fellow commuters</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('booked')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'booked'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Booked Rides
          </button>
          <button
            onClick={() => setActiveTab('offered')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'offered'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Offered Rides & Driver Panel
          </button>
        </div>
      </div>

      {/* Tab 1: Booked Rides */}
      {activeTab === 'booked' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading booked rides...</p>
            </div>
          ) : bookedRides.length === 0 ? (
            <div className="text-center py-12 card-clean rounded-3xl border border-slate-200 shadow-xs">
              <Car className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No booked rides found</p>
            </div>
          ) : (
            bookedRides.map((req) => {
              const driverTarget = req.ride?.driver;
              const alreadyRated = hasSubmittedRating(req.ride?._id || req.ride, driverTarget?._id || driverTarget);

              return (
                <div key={req._id} className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase border ${
                        req.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : req.status === 'completed'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : req.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {req.pickupStop} → {req.dropStop}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Driver: <span className="font-bold text-slate-900">{driverTarget?.name || 'Commuter'}</span> ({driverTarget?.organization})
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Date: {req.ride?.date} at {req.ride?.time} • Vehicle: {req.ride?.vehicleName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-xl font-black text-slate-900">₹{req.totalPrice}</span>
                      <span className="text-[10px] text-slate-500 block">{req.seatsRequested} seat(s)</span>
                    </div>

                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleCompleteRide(req, driverTarget)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs"
                      >
                        Complete & Rate Driver
                      </button>
                    )}

                    {req.status === 'completed' && (
                      alreadyRated ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Rating Submitted</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => openRatingModal(req, driverTarget)}
                          className="bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Rate Driver</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Offered Rides & Driver Panel */}
      {activeTab === 'offered' && (
        <div className="space-y-6">
          <div className="card-clean p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Passenger Seat Requests & Rating Panel</h3>

            {driverRequests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No requests received for your offered rides yet.</p>
            ) : (
              <div className="space-y-3">
                {driverRequests.map((req) => {
                  const passengerTarget = req.passenger;
                  const alreadyRated = hasSubmittedRating(req.ride?._id || req.ride, passengerTarget?._id || passengerTarget);

                  return (
                    <div key={req._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{passengerTarget?.name}</span>
                            <TrustScoreBadge score={passengerTarget?.trustScore || 85} showLabel={false} />
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Wants {req.seatsRequested} seat(s) from <span className="font-semibold text-emerald-700">{req.pickupStop}</span> to <span className="font-semibold text-rose-700">{req.dropStop}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(req._id, 'accepted')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(req._id, 'rejected')}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-rose-200"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        ) : req.status === 'accepted' ? (
                          <button
                            onClick={() => handleCompleteRide(req, passengerTarget)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs shadow-xs"
                          >
                            Complete & Rate Passenger
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-md uppercase bg-slate-100 text-slate-800 border border-slate-200">
                              {req.status}
                            </span>
                            {alreadyRated ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-extrabold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Rating Submitted</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => openRatingModal(req, passengerTarget)}
                                className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1"
                              >
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span>Rate Passenger</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Single-Submission Rating Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Rate {revieweeUser?.name || 'Commuter'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your rating directly influences their Trust Score (0-100) and unlocks community badges
            </p>

            {modalMessage.text && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Select Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2 justify-center py-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-7 h-7 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Review Comment</label>
                <textarea
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-xs"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyRides;

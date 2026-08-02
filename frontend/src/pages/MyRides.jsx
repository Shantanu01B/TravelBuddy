import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TrustScoreBadge from '../components/TrustScoreBadge';
import { Car, Check, X, Star, CheckCircle2, AlertCircle, Clock, Award } from 'lucide-react';
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
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Ride Activity</h1>
          <p className="text-xs text-slate-500 mt-1">Manage seat requests, complete rides & rate your fellow commuters</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('booked')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'booked' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Booked Rides
          </button>
          <button
            onClick={() => setActiveTab('offered')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'offered' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            <p className="text-xs text-slate-400 text-center py-8">Loading booked rides...</p>
          ) : bookedRides.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 card-shadow">
              <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No booked rides found</p>
            </div>
          ) : (
            bookedRides.map((req) => {
              const driverTarget = req.ride?.driver;
              const alreadyRated = hasSubmittedRating(req.ride?._id || req.ride, driverTarget?._id || driverTarget);

              return (
                <div key={req._id} className="bg-white p-6 rounded-3xl border border-slate-200/90 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase ${
                        req.status === 'accepted' ? 'bg-indigo-100 text-indigo-800' : req.status === 'completed' ? 'bg-purple-100 text-purple-800' : req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
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
                      <span className="text-xl font-black text-indigo-600">₹{req.totalPrice}</span>
                      <span className="text-[10px] text-slate-400 block">{req.seatsRequested} seat(s)</span>
                    </div>

                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleCompleteRide(req, driverTarget)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md shadow-indigo-500/20"
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
                          className="bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
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
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 card-shadow">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Passenger Seat Requests & Rating Panel</h3>

            {driverRequests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No requests received for your offered rides yet.</p>
            ) : (
              <div className="space-y-3">
                {driverRequests.map((req) => {
                  const passengerTarget = req.passenger;
                  const alreadyRated = hasSubmittedRating(req.ride?._id || req.ride, passengerTarget?._id || passengerTarget);

                  return (
                    <div key={req._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={passengerTarget?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                          alt={passengerTarget?.name}
                          className="w-10 h-10 rounded-2xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{passengerTarget?.name}</span>
                            <TrustScoreBadge score={passengerTarget?.trustScore || 85} showLabel={false} />
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Wants {req.seatsRequested} seat(s) from <span className="font-semibold text-slate-700">{req.pickupStop}</span> to <span className="font-semibold text-slate-700">{req.dropStop}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(req._id, 'accepted')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
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
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs"
                          >
                            Complete & Rate Passenger
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-md uppercase bg-purple-100 text-purple-800">
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
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 card-shadow">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Rate {revieweeUser?.name || 'Commuter'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your rating directly influences their Trust Score (0-100) and unlocks community badges!
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
                <div className="flex items-center gap-2 justify-center py-2.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-7 h-7 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20"
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

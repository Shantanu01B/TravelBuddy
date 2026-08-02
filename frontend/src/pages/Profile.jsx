import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import TrustScoreBadge from '../components/TrustScoreBadge';
import { Shield, Award, Leaf, Car, Building, Star, CheckCircle2, User, Edit3, Image, Upload, AlertCircle } from 'lucide-react';
import API from '../services/api';

const MALE_PRESETS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop'
];

const FEMALE_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop'
];

const Profile = () => {
  const { user, updateProfile, refreshProfile } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || 'Male',
    organization: user?.organization || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    if (user) {
      fetchReviews();
      setFormData({
        name: user.name,
        gender: user.gender || 'Male',
        organization: user.organization,
        bio: user.bio,
        avatar: user.avatar
      });
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/user/${user._id}`);
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoMessage('');

    const data = new FormData();
    data.append('avatar', file);

    try {
      const res = await API.post('/auth/upload-avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormData(prev => ({ ...prev, avatar: res.data.avatar }));
        setPhotoMessage('Profile photo uploaded successfully!');
        refreshProfile();
      }
    } catch (err) {
      setPhotoMessage(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(formData);
    if (res.success) {
      setEditing(false);
      refreshProfile();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 card-shadow mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || MALE_PRESETS[0]}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
                <TrustScoreBadge score={user?.trustScore || 85} />
              </div>
              <p className="text-xs font-bold text-indigo-700 mt-0.5">
                {user?.organization} • <span className="text-slate-500">{user?.gender || 'Male'}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md">{user?.bio}</p>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2 rounded-xl text-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editing ? 'Cancel Editing' : 'Edit Profile & Upload Photo'}</span>
          </button>
        </div>

        {/* Edit Form with File Upload */}
        {editing && (
          <form onSubmit={handleEditSubmit} className="pt-6 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 my-4 text-xs">
            
            {/* Custom Photo Upload from Device */}
            <div className="p-4 bg-white rounded-xl border border-indigo-200 shadow-xs">
              <label className="font-extrabold text-slate-900 block mb-1">
                📷 Upload Custom Profile Photo from Device
              </label>
              <p className="text-[10px] text-slate-500 mb-2">Select a JPEG or PNG image file from your computer or phone</p>
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {uploadingPhoto && <span className="text-xs text-indigo-600 font-bold">Uploading to Cloudinary...</span>}
              </div>

              {photoMessage && (
                <p className="text-[11px] font-bold text-indigo-700 mt-2">{photoMessage}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Organization / Campus</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender</label>
              <div className="flex gap-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`px-3 py-1.5 rounded-lg border font-semibold ${
                      formData.gender === g ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Avatar Presets */}
            <div>
              <label className="font-semibold text-slate-700 block mb-2">Or Choose Avatar Preset</label>
              <div className="flex items-center gap-3">
                {(formData.gender === 'Female' ? FEMALE_PRESETS : MALE_PRESETS).map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Preset Avatar"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-transform hover:scale-110 ${
                      formData.avatar === url ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105' : 'border-transparent opacity-75'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Bio</label>
              <textarea
                rows="2"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>

            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs">
              Save Profile Changes
            </button>
          </form>
        )}

        {/* Dynamic Metric Badges Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-black text-slate-400 block">Trust Score</span>
            <span className="text-xl font-black text-slate-900">{user?.trustScore || 85} / 100</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-black text-slate-400 block">Completed Rides</span>
            <span className="text-xl font-black text-indigo-600">{user?.completedRides || 0}</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-black text-slate-400 block">Carbon Saved</span>
            <span className="text-xl font-black text-emerald-600">🌱 {(user?.carbonSaved || 0).toFixed(1)} kg</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-black text-slate-400 block">Reward Points</span>
            <span className="text-xl font-black text-amber-500">⚡ {user?.rewardPoints || 50} pts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Trust Score Breakdown & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-base">Trust Score Formula Breakdown</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Average Rating (40% Weight)</span>
              <span className="font-bold text-slate-900">★ {user?.averageRating || 5.0} / 5.0</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Ride Completion Rate (30% Weight)</span>
              <span className="font-bold text-slate-900">
                {user?.totalRides ? ((user.completedRides / user.totalRides) * 100).toFixed(0) : 100}%
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Low Cancellation Rate (20% Weight)</span>
              <span className="font-bold text-slate-900">
                {user?.totalRides ? (100 - ((user.cancelledRides / user.totalRides) * 100)).toFixed(0) : 100}%
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Review Volume Bonus (10% Weight)</span>
              <span className="font-bold text-slate-900">{user?.reviewsCount || 0} reviews</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-slate-900 text-base">Vehicle & Badges</h3>
          </div>

          {user?.vehicle?.type && user?.vehicle?.type !== 'None' ? (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-4">
              <p className="font-bold text-slate-900">{user?.vehicle?.makeModel} ({user?.vehicle?.type})</p>
              <p className="text-slate-500">License Plate: {user?.vehicle?.licensePlate || 'MH 14 AB 1234'}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mb-4">No vehicle registered (Passenger account)</p>
          )}

          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Earned Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {(user?.badges || ['Verified Commuter']).map((badge, idx) => (
              <span key={idx} className="bg-indigo-50 text-indigo-900 border border-indigo-200/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                {badge}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Reviews List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 card-shadow">
        <h3 className="font-black text-slate-900 text-base mb-4">Reviews & Rating Feedback</h3>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No reviews submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900">{rev.reviewer?.name}</span>
                    <span className="text-amber-500 font-bold text-xs">★ {rev.rating}</span>
                  </div>
                  <p className="text-xs text-slate-600">"{rev.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;

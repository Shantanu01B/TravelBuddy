import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, Mail, Lock, User, Building, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Male',
    organization: 'PCCOER',
    vehicleType: 'Car',
    makeModel: '',
    licensePlate: '',
    bio: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      organization: formData.organization,
      vehicle: {
        type: formData.vehicleType,
        makeModel: formData.makeModel,
        licensePlate: formData.licensePlate,
        capacity: formData.vehicleType === 'Bike' ? 1 : 3
      },
      bio: formData.bio
    };

    const res = await register(payload);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm">
        
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">TravelBuddy</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
          <p className="text-xs text-slate-500 mt-1">Join your college or corporate commuter network</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-slate-400">
                <User className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="bg-transparent text-xs text-slate-800 outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-slate-400">
                <Mail className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@pccoer.edu.in"
                  className="bg-transparent text-xs text-slate-800 outline-none w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Password *</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-slate-400">
                <Lock className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="bg-transparent text-xs text-slate-800 outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender * (Sets Profile Avatar)</label>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      formData.gender === g
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">College / Organization *</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-slate-400">
              <Building className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                required
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. PCCOER, Infosys, COEP"
                className="bg-transparent text-xs text-slate-800 outline-none w-full"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label className="font-semibold text-slate-700 uppercase tracking-wider block text-[10px]">
              Vehicle Details (Optional - If offering rides)
            </label>

            <div className="grid grid-cols-4 gap-2">
              {['Car', 'Bike', 'Scooter', 'None'].map((vType) => (
                <button
                  type="button"
                  key={vType}
                  onClick={() => setFormData({ ...formData, vehicleType: vType })}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    formData.vehicleType === vType
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {vType}
                </button>
              ))}
            </div>

            {formData.vehicleType !== 'None' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <input
                  type="text"
                  name="makeModel"
                  value={formData.makeModel}
                  onChange={handleChange}
                  placeholder="Vehicle Model (e.g. Honda City)"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="License Plate (e.g. MH 14 AB 1234)"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Short Bio</label>
            <textarea
              name="bio"
              rows="2"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell your fellow commuters a bit about yourself..."
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-900 font-bold hover:underline">
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;

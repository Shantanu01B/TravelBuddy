import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('rahul@pccoer.edu.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="card-clean max-w-md w-full p-8 rounded-3xl border border-slate-200 shadow-xl">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 shadow-sm mx-auto mb-3 flex items-center justify-center text-white">
            <Car className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">Log in to manage your rides and trip plans</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-colors">
              <Mail className="w-4 h-4 text-indigo-600 mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu.in"
                className="bg-transparent text-xs text-slate-900 outline-none w-full placeholder:text-slate-400 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-colors">
              <Lock className="w-4 h-4 text-indigo-600 mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent text-xs text-slate-900 outline-none w-full placeholder:text-slate-400 font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center mb-2">
            Demo Credentials for Review
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setEmail('rahul@pccoer.edu.in'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 text-left transition-colors"
            >
              <p className="font-bold text-slate-900">Rahul (Student)</p>
              <p className="text-[10px] text-slate-500 truncate">rahul@pccoer.edu.in</p>
            </button>

            <button
              onClick={() => { setEmail('sneha@infosys.com'); setPassword('password123'); }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 text-left transition-colors"
            >
              <p className="font-bold text-slate-900">Sneha (IT Pro)</p>
              <p className="text-[10px] text-slate-500 truncate">sneha@infosys.com</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;

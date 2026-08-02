import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, Search, PlusCircle, Compass, MapPin, Users, Bell, User, LogOut, Shield, ChevronDown, Menu, X } from 'lucide-react';
import TrustScoreBadge from './TrustScoreBadge';
import API from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
    setMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  }, [user, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      // Silent error
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/all/read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-indigo-500/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                Travel<span className="text-gradient-indigo">Buddy</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 block -mt-1 tracking-widest uppercase">
                Commute Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/find-rides"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/find-rides')
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Rides</span>
            </Link>

            <Link
              to="/offer-ride"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/offer-ride')
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Offer Ride</span>
            </Link>

            <Link
              to="/trips"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/trips')
                  ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                  : 'text-slate-600 hover:text-purple-600 hover:bg-slate-100/70'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span>Trip Planner</span>
            </Link>

            <Link
              to="/destinations"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/destinations')
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100/70'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Destinations</span>
            </Link>

            <Link
              to="/community"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/community')
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                  : 'text-slate-600 hover:text-amber-600 hover:bg-slate-100/70'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Community</span>
            </Link>
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl relative transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 card-shadow">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] text-indigo-600 hover:underline font-bold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className={`p-2.5 rounded-xl text-xs ${
                                notif.isRead ? 'bg-slate-50 text-slate-600' : 'bg-indigo-50/80 text-indigo-950 font-medium border border-indigo-200/60'
                              }`}
                            >
                              <p className="leading-snug">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100/80 transition-colors border border-slate-200/60"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover border border-indigo-500/30"
                    />
                    <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[100px]">
                        {user.name}
                      </span>
                      <TrustScoreBadge score={user.trustScore} showLabel={false} />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 card-shadow">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-black text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <p className="text-[11px] font-bold text-indigo-600 mt-0.5">{user.organization}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-600" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/my-rides"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Car className="w-4 h-4 text-purple-600" />
                        <span>My Offered & Booked Rides</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-rose-500" />
                        <span>My Profile & Badges</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors mt-1"
                        >
                          <Shield className="w-4 h-4 text-amber-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-xs transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 text-xs font-bold card-shadow">
          <Link
            to="/find-rides"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Find Rides</span>
          </Link>

          <Link
            to="/offer-ride"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Offer Ride or Auto Split</span>
          </Link>

          <Link
            to="/trips"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Trip Planner & Expenses</span>
          </Link>

          <Link
            to="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Discover Destinations</span>
          </Link>

          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            <Users className="w-4 h-4 text-amber-500" />
            <span>Community Feed</span>
          </Link>

          {user && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl text-slate-800 bg-slate-50 font-black"
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span>My Dashboard</span>
              </Link>

              <Link
                to="/my-rides"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
              >
                <Car className="w-4 h-4 text-purple-600" />
                <span>My Rides & Bookings</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
              >
                <Shield className="w-4 h-4 text-rose-500" />
                <span>My Profile</span>
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-amber-900 bg-amber-50 font-black"
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Admin Operations Dashboard</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

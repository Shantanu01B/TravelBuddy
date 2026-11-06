import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Car,
  Search,
  PlusCircle,
  Compass,
  MapPin,
  Users,
  Bell,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import API from '../services/api';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
    setMobileOpen(false);
    setShowNotifications(false);
  }, [user, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/all/read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Find Rides', path: '/find-rides', icon: Search, color: 'text-indigo-600', activeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
    { label: 'Offer Ride', path: '/offer-ride', icon: PlusCircle, color: 'text-emerald-600', activeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    { label: 'Trip Planner', path: '/trips', icon: Compass, color: 'text-amber-600', activeClass: 'bg-amber-50 text-amber-900 border-amber-200' },
    { label: 'Destinations', path: '/destinations', icon: MapPin, color: 'text-rose-600', activeClass: 'bg-rose-50 text-rose-900 border-rose-200' },
    { label: 'Community', path: '/community', icon: Users, color: 'text-sky-600', activeClass: 'bg-sky-50 text-sky-900 border-sky-200' },
  ];

  const userLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-indigo-600', activeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
    { label: 'My Rides', path: '/my-rides', icon: Car, color: 'text-emerald-600', activeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    { label: 'My Profile', path: '/profile', icon: Shield, color: 'text-sky-600', activeClass: 'bg-sky-50 text-sky-900 border-sky-200' },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 sm:p-5">
      
      {/* Top Brand Logo */}
      <div>
        <Link to="/" className="flex items-center gap-3 px-2 py-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1">
              Travel<span className="text-indigo-600">Buddy</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 block -mt-1 tracking-widest uppercase">
              Commute Network
            </span>
          </div>
        </Link>

        {/* Primary Navigation */}
        <div className="space-y-1 mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-2">
            Main Menu
          </span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  active
                    ? `${item.activeClass} shadow-2xs`
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? item.color : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Workspace (If Logged In) */}
        {user && (
          <div className="space-y-1 mb-6 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Workspace
            </span>
            {userLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    active
                      ? `${item.activeClass} shadow-2xs`
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? item.color : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  isActive('/admin')
                    ? 'bg-rose-50 text-rose-900 border-rose-200'
                    : 'border-transparent text-slate-600 hover:text-rose-700 hover:bg-rose-50/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Admin Operations</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bottom User Profile / Auth Area */}
      <div className="pt-4 border-t border-slate-100">
        {user ? (
          <div>
            {/* Notifications Popover Toggle */}
            <div className="relative mb-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-700">Notifications</span>
                </div>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                    {unreadCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">0</span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-2.5 rounded-xl text-xs ${
                            notif.isRead
                              ? 'bg-slate-50 text-slate-500'
                              : 'bg-indigo-50 text-indigo-900 font-medium border border-indigo-200'
                          }`}
                        >
                          <p className="leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Capsule with Profile Icon (No Random Images) */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200 mb-2">
              <Link to="/profile" className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block truncate">
                    {user.organization || 'Verified Commuter'}
                  </span>
                </div>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-extrabold shadow-2xs hover:bg-slate-800 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Top App Bar (Visible on mobile screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-base font-black text-slate-900 tracking-tight">
            Travel<span className="text-indigo-600">Buddy</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
          aria-label="Open Sidebar Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex">
          <div className="w-72 bg-white h-full shadow-2xl relative">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Persistent Vertical Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 bg-white border-r border-slate-200/90 h-screen sticky top-0 flex-shrink-0 z-30 shadow-2xs">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OfferRide from './pages/OfferRide';
import FindRides from './pages/FindRides';
import RideDetails from './pages/RideDetails';
import MyRides from './pages/MyRides';
import TripPlanner from './pages/TripPlanner';
import Destinations from './pages/Destinations';
import CommunityFeed from './pages/CommunityFeed';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#fafafc] text-slate-800">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/find-rides" element={<FindRides />} />
                <Route path="/rides/:id" element={<RideDetails />} />
                <Route path="/offer-ride" element={<OfferRide />} />
                <Route path="/my-rides" element={<MyRides />} />
                <Route path="/trips" element={<TripPlanner />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/community" element={<CommunityFeed />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

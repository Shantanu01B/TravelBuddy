import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/find-rides" element={<FindRides />} />
              <Route path="/rides/:id" element={<RideDetails />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/community" element={<CommunityFeed />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/offer-ride" element={<OfferRide />} />
                <Route path="/my-rides" element={<MyRides />} />
                <Route path="/trips" element={<TripPlanner />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

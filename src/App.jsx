import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DateRangeProvider } from './context/DateRangeContext';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Home from './pages/Home';
import Product from './pages/Product';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DigitalTwin from './pages/DigitalTwin';
import SimulationLab from './pages/SimulationLab';
import Opportunities from './pages/Opportunities';
import Customers from './pages/Customers';
import Agents from './pages/Agents';
import Actions from './pages/Actions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <DateRangeProvider>
        <Routes>
          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Onboarding Flow */}
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Merchant Application Dashboard */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/twin" element={<DigitalTwin />} />
            <Route path="/simulate" element={<SimulationLab />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DateRangeProvider>
    </AuthProvider>
  );
}

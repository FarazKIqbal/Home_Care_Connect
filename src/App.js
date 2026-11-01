import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { CustomerRoute, ProviderRoute } from './components/ProtectedRoute';

import Home from "./Pages/home/Home";
import Choose from "./Pages/choose/Choose";
import UserLogin from "./Pages/login/UserLogin";
import UserRegister from "./Pages/UserRegister/UserRegister";
import UserDashboard from "./Pages/dashboard/UserDashboard";
import Dashboard from "./Pages/dashboard/Dashboard";
import ProviderDashboard from "./Pages/provider/ProviderDashboard";
import UserProfile from "./Pages/dashboard/UserProfile";
import ProviderLogin from "./Pages/login/ProviderLogin";
import ProviderRegister from "./Pages/ProviderRegister/ProviderRegister";
import PlumberDashboard from './Pages/dashboard/PlumberDashboard';
import ElectricityDashboard from './Pages/dashboard/ElectricityDashboard';
import ProviderProfile from './Pages/provider/ProviderProfile';
import ProviderHelp from './Pages/provider/ProviderHelp';
import CustomerHelp from './Pages/UserRegister/CustomerHelp';
import About from './Pages/about/About';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/choose" element={<Choose />} />

          {/* Public Routes */}
          <Route path="/login/UserLogin" element={<UserLogin />} />
          <Route path="/login/ProviderLogin" element={<ProviderLogin />} />
          <Route path="/UserRegister/UserRegister" element={<UserRegister />} />
          <Route path="/ProviderRegister/ProviderRegister" element={<ProviderRegister />} />
          <Route path="/UserRegister/CustomerHelp" element={<CustomerHelp />} />
          <Route path="/provider/ProviderHelp" element={<ProviderHelp />} />
          <Route path="/about" element={<About />} />

          {/* Protected Customer Routes */}
          <Route path="/dashboard/Dashboard" element={
            <CustomerRoute>
              <UserDashboard />
            </CustomerRoute>
          } />
          <Route path="/cleaning" element={
            <CustomerRoute>
              <Dashboard />
            </CustomerRoute>
          } />
          <Route path="/plumber" element={
            <CustomerRoute>
              <PlumberDashboard />
            </CustomerRoute>
          } />
          <Route path="/electricity" element={
            <CustomerRoute>
              <ElectricityDashboard />
            </CustomerRoute>
          } />
          <Route path="/dashboard/UserProfile" element={
            <CustomerRoute>
              <UserProfile />
            </CustomerRoute>
          } />

          {/* Protected Provider Routes */}
          <Route path="/provider/ProviderDashboard" element={
            <ProviderRoute>
              <ProviderDashboard />
            </ProviderRoute>
          } />
          <Route path="/provider/ProviderProfile" element={
            <ProviderRoute>
              <ProviderProfile />
            </ProviderRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

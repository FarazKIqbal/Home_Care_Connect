import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, UserPlus, Briefcase, ArrowLeft } from 'lucide-react';
import './Choose.css';

export const Choose = () => {
  const navigate = useNavigate();

  const handleCustomerRegister = () => {
    navigate('/UserRegister/UserRegister');
  };

  const handleProviderRegister = () => {
    navigate('/ProviderRegister/ProviderRegister');
  };

  return (
    <div className="choose-container">
      {/* Header */}
      <div className="choose-header">
        <button onClick={() => navigate('/')} className="choose-back-btn">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="choose-logo" onClick={() => navigate('/')}>
          <Home className="h-6 w-6 text-indigo-600" />
          <span className="choose-logo-text">Home Care Connect</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="choose-content">
        <h1 className="choose-title">Choose Your Role</h1>
        <p className="choose-subtitle">Select whether you're looking for services or providing them</p>

        <div className="choose-cards">
          {/* Customer Card */}
          <div className="choose-card customer-card">
            <div className="choose-card-header">
              <div className="choose-icon customer-icon">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="choose-card-title">Customer</h3>
            </div>
            <p className="choose-card-description">
              Need home services? Find, book, and track verified professionals for cleaning, plumbing, and electrical work.
            </p>
            <div className="choose-card-actions">
              <button
                onClick={() => navigate('/login/UserLogin')}
                className="choose-btn choose-btn-primary"
              >
                Login
              </button>
              <button
                onClick={handleCustomerRegister}
                className="choose-btn choose-btn-secondary"
              >
                Register
              </button>
            </div>
          </div>

          {/* Provider Card */}
          <div className="choose-card provider-card">
            <div className="choose-card-header">
              <div className="choose-icon provider-icon">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="choose-card-title">Provider</h3>
            </div>
            <p className="choose-card-description">
              Ready to provide services? Manage your bookings, availability, and grow your business with ease.
            </p>
            <div className="choose-card-actions">
              <button
                onClick={() => navigate('/login/ProviderLogin')}
                className="choose-btn choose-btn-primary provider-btn"
              >
                Login
              </button>
              <button
                onClick={handleProviderRegister}
                className="choose-btn choose-btn-secondary"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;

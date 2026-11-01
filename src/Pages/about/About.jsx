import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Shield, Calendar, ArrowLeft } from 'lucide-react';
import './About.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      {/* Header */}
      <div className="about-header">
        <button onClick={() => navigate('/')} className="about-back-btn">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="about-logo" onClick={() => navigate('/')}>
          <Home className="h-6 w-6" />
          <span className="about-logo-text">Home Care Connect</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">Connecting customers with trusted home service professionals</p>

        <div className="about-section">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            At Home Care Connect, our mission is to simplify home service booking by providing a trusted
            platform where customers can easily find verified professionals and service providers can
            grow their businesses.
          </p>
        </div>

        <div className="about-section">
          <h2 className="section-title">Our Story</h2>
          <p className="section-text">
            Founded in 2023, we recognized the need for a reliable, transparent platform that connects
            homeowners with skilled service professionals. We've grown to become a trusted name in
            home services across India.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <Shield className="about-icon" size={48} />
            <h3 className="card-title">Verified Professionals</h3>
            <p className="card-text">All our service providers undergo rigorous verification to ensure quality and trustworthiness.</p>
          </div>
          <div className="about-card">
            <Calendar className="about-icon" size={48} />
            <h3 className="card-title">On-Time Guarantee</h3>
            <p className="card-text">We guarantee that your service will be scheduled as promised, or you'll receive compensation.</p>
          </div>
          <div className="about-card">
            <Home className="about-icon" size={48} />
            <h3 className="card-title">Quality Assured</h3>
            <p className="card-text">Every service comes with our quality assurance guarantee for your peace of mind.</p>
          </div>
        </div>

        <button className="about-cta" onClick={() => navigate('/choose')}>
          Get Started
        </button>
      </div>
    </div>
  );
}
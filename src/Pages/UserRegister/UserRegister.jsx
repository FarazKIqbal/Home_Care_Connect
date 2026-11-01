import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import './UserRegister.css';

export const UserRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '', username: '', password: '', email: '', phoneNumber: '', location: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        const { fullName, username, password, email, phoneNumber, location } = formData;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                fullName, username, email, phoneNumber, location,
                role: 'user',
                createdAt: new Date().toISOString()
            });

            localStorage.setItem('userInfo', JSON.stringify({ uid: user.uid, fullName, username, email, phoneNumber, location }));
            setSuccess(true);
            setTimeout(() => navigate("/login/UserLogin"), 1500);
        } catch (error) {
            console.error("Error registering: ", error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters');
                    break;
                default:
                    setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-body">
            <div className="register-wrapper">
                {/* Header */}
                <div className="register-header">
                    <div className="register-icon">
                        <User className="h-8 w-8" />
                    </div>
                    <h1 className="register-title">Create Your Account</h1>
                    <p className="register-subtitle">Join thousands of homeowners trusting Home Care Connect</p>
                </div>

                {/* Success State */}
                {success ? (
                    <div className="register-success">
                        <div className="success-circle">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h2>
                        <p className="text-gray-600">Account created. Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="register-form">
                        {error && (
                            <div className="error-message">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" />
                                    <input type="text" name="fullName" placeholder="Enter your full name" required value={formData.fullName} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" />
                                    <input type="text" name="username" placeholder="Choose a username" required value={formData.username} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input type="email" name="email" placeholder="your@email.com" required value={formData.email} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper relative">
                                <Lock className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a strong password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div className="input-wrapper">
                                    <Phone className="input-icon" />
                                    <input type="tel" name="phoneNumber" placeholder="+91 98765 43210" required value={formData.phoneNumber} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <input type="text" name="location" placeholder="Your city/area" required value={formData.location} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="register-button">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>
                )}

                <p className="register-footer">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login/UserLogin')} className="login-link">Sign In</button>
                </p>
            </div>
        </div>
    );
};

export default UserRegister;

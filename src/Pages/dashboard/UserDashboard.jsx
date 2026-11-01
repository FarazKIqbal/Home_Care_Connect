import React, { useState, useEffect } from 'react';
import { Home, HelpCircle, User, LogOut, Trash2, Droplet, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../../firebase';

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const SIDEBAR_FROM = 'from-violet-700';
  const SIDEBAR_TO = 'to-violet-800';
  const SIDEBAR_BORDER = 'border-violet-600';
  const AVATAR_GRADIENT = 'from-violet-400 to-purple-500';
  const BUTTON_COLOR = 'bg-violet-600 hover:bg-violet-700';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/login/UserLogin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login/UserLogin');
  };

  const navItems = [
    { icon: HelpCircle, label: 'Help', path: '/UserRegister/CustomerHelp' },
    { icon: User, label: 'Profile', path: '/dashboard/UserProfile' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`w-64 bg-gradient-to-b ${SIDEBAR_FROM} ${SIDEBAR_TO} text-white flex flex-col`}>
        <div className={`p-6 border-b ${SIDEBAR_BORDER}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">Home Care Connect</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.path) ? 'bg-white/15' : 'hover:bg-white/10'}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all mt-8"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Services</h1>
            <p className="text-sm text-gray-500 mt-1">Find and book trusted professionals</p>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            )}
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cleaning Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_GRADIENT} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                    <Trash2 className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">Cleaning</h3>
                    <p className="text-sm text-gray-500">Cleaning Service</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Professional cleaning for your home or office. Deep cleaning, organization, and housekeeping services.
                </p>
                <button
                  className={`w-full py-3 text-white rounded-xl font-semibold transition-all hover:shadow-lg ${BUTTON_COLOR}`}
                  onClick={() => navigate('/cleaning')}
                >
                  Find Cleaners
                </button>
              </div>
            </div>

            {/* Plumbing Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    <Droplet className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">Plumbing</h3>
                    <p className="text-sm text-gray-500">Plumbing Service</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Expert plumbers for all your plumbing needs. Fix leaks, install fixtures, and maintain your plumbing system.
                </p>
                <button
                  className="w-full py-3 text-white rounded-xl font-semibold transition-all hover:shadow-lg bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/plumber')}
                >
                  Find Plumbers
                </button>
              </div>
            </div>

            {/* Electrical Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    <Zap className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">Electrical</h3>
                    <p className="text-sm text-gray-500">Electrical Service</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Skilled electricians for all electrical repairs. Safe wiring, installations, and electrical repairs.
                </p>
                <button
                  className="w-full py-3 text-white rounded-xl font-semibold transition-all hover:shadow-lg bg-amber-500 hover:bg-amber-600"
                  onClick={() => navigate('/electricity')}
                >
                  Find Electricians
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
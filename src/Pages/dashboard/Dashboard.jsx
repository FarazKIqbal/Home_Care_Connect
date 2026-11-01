import React, { useState, useEffect } from 'react';
import { Home, HelpCircle, User, LogOut, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [location, setLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const locationHook = useLocation();
  const isActive = (path) => locationHook.pathname === path;
  const auth = getAuth();

  const SERVICE_NAME = 'cleaning';
  const SERVICE_LABEL = 'Cleaners';
  const SERVICE_DESC = 'Find and book trusted cleaning professionals';
  const EMPTY_TITLE = 'No cleaners available';
  const LOADING_TEXT = 'Loading cleaners...';
  const SIDEBAR_FROM = 'from-violet-700';
  const SIDEBAR_TO = 'to-violet-800';
  const SIDEBAR_BORDER = 'border-violet-600';
  const AVATAR_GRADIENT = 'from-violet-400 to-purple-500';
  const MODAL_GRADIENT = 'from-violet-600 to-purple-600';
  const BUTTON_COLOR = 'bg-violet-600 hover:bg-violet-700';
  const FOCUS_RING = 'focus:border-violet-500 focus:ring-violet-100';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadWorkers();
      } else {
        navigate('/login/UserLogin');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const loadWorkers = async () => {
    try {
      const q = query(collection(db, 'workers'), where('service', '==', SERVICE_NAME));
      const snapshot = await getDocs(q);
      setWorkers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error loading workers:", error);
      setErrorMessage("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (worker) => {
    setSelectedWorker(worker);
    setShowModal(true);
    setBookingDate('');
    setBookingTime('');
    setLocation('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorker(null);
  };

  const confirmBooking = async () => {
    if (!currentUser) {
      setErrorMessage('You must be logged in to book a service.');
      return;
    }
    if (!bookingDate || !bookingTime || !location) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data() || {};
      await addDoc(collection(db, 'jobRequests'), {
        userId: currentUser.uid,
        username: userData.username || "User",
        userEmail: userData.email || currentUser.email,
        phoneNumber: userData.phoneNumber || "N/A",
        bookingDate, bookingTime, location,
        providerId: selectedWorker.id,
        providerName: selectedWorker.fullName,
        providerEmail: selectedWorker.email,
        service: SERVICE_NAME,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccessMessage(`Booking confirmed with ${selectedWorker.fullName}!`);
      setTimeout(() => closeModal(), 2000);
    } catch (error) {
      console.error("Error booking:", error);
      setErrorMessage('Failed to book. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login/UserLogin');
  };

  const minDate = new Date().toISOString().split('T')[0];

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
          {[
            { icon: Home, label: 'Dashboard', path: '/dashboard/Dashboard' },
            { icon: HelpCircle, label: 'Help', path: '/UserRegister/CustomerHelp' },
            { icon: User, label: 'Profile', path: '/dashboard/UserProfile' },
          ].map((item) => (
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
            <h1 className="text-2xl font-bold text-gray-900">Available {SERVICE_LABEL}</h1>
            <p className="text-sm text-gray-500 mt-1">{SERVICE_DESC}</p>
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className={`w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4`}></div>
                <p className="text-gray-600">{LOADING_TEXT}</p>
              </div>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-20">
              <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{EMPTY_TITLE}</h3>
              <p className="text-gray-500">Check back later or contact support</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <div key={worker.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_GRADIENT} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                        {worker.fullName?.charAt(0) || 'C'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{worker.fullName}</h3>
                        <p className="text-sm text-gray-500">@{worker.username}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{worker.about || 'Professional cleaner'}</p>
                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                      <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <span className="truncate">{worker.phoneNumber || 'No phone listed'}</span>
                    </p>
                    <button
                      onClick={() => openModal(worker)}
                      className={`w-full py-3 text-white rounded-xl font-semibold transition-all hover:shadow-lg active:scale-95 ${BUTTON_COLOR}`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {showModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className={`bg-gradient-to-r ${MODAL_GRADIENT} px-6 py-4 flex items-center justify-between`}>
              <h2 className="text-xl font-bold text-white">Book {SERVICE_LABEL}</h2>
              <button onClick={closeModal} className="text-white/80 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 p-3 bg-violet-50 rounded-xl">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${AVATAR_GRADIENT} flex items-center justify-center text-white font-bold`}>
                  {selectedWorker.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedWorker.fullName}</p>
                  <p className="text-sm text-gray-500">{SERVICE_LABEL} Professional</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                  <input type="date" min={minDate} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 ${FOCUS_RING} outline-none transition-all`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 ${FOCUS_RING} outline-none transition-all`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter your address"
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 ${FOCUS_RING} outline-none transition-all`} />
                </div>
              </div>
              {errorMessage && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{errorMessage}</div>}
              {successMessage && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{successMessage}</div>}
              <div className="flex gap-3 mt-6">
                <button onClick={closeModal} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">Cancel</button>
                <button onClick={confirmBooking} className={`flex-1 py-3 text-white rounded-xl font-semibold transition-all hover:shadow-lg ${BUTTON_COLOR}`}>Confirm Booking</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

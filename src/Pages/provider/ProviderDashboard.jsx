import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { HelpCircle, User, LogOut, Briefcase, X, CheckCircle, XCircle } from 'lucide-react';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [jobs, setJobs] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [providerEmail, setProviderEmail] = useState(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login/ProviderLogin');
        return;
      }
      setProviderEmail(user.email);
      fetchAvailability(user.uid);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAvailability = async (uid) => {
    try {
      const snap = await getDocs(collection(db, 'workers'));
      const docSnap = snap.docs.find(d => d.id === uid);
      if (docSnap) {
        setIsAvailable(docSnap.data().isAvailable ?? true);
      }
    } catch (e) {
      console.error('Error fetching availability:', e);
    }
  };

  const fetchJobRequests = useCallback(async () => {
    try {
      if (!providerEmail) return;
      const jobRequestsCollection = collection(db, 'jobRequests');
      const jobRequestsSnapshot = await getDocs(jobRequestsCollection);
      const jobRequests = jobRequestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredJobs = jobRequests.filter(job => job.providerEmail === providerEmail);
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching job requests:', error);
    }
  }, [providerEmail]);

  const fetchPreviousBookings = (acceptedJob) => {
    const booking = {
      name: acceptedJob.username,
      date: acceptedJob.bookingDate,
      time: acceptedJob.bookingTime,
      location: acceptedJob.location,
      phoneNumber: acceptedJob.phoneNumber,
      providerEmail: acceptedJob.providerEmail,
      userEmail: acceptedJob.userEmail,
    };
    setPreviousBookings((prev) => {
      const updatedBookings = [...prev, booking];
      localStorage.setItem('previousBookings', JSON.stringify(updatedBookings));
      return updatedBookings;
    });
  };

  const handleAvailabilityToggle = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const newAvailability = !isAvailable;
      setIsAvailable(newAvailability);
      await updateDoc(doc(db, 'workers', user.uid), { isAvailable: newAvailability });
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  useEffect(() => {
    if (providerEmail) {
      fetchJobRequests();
    }
  }, [providerEmail, fetchJobRequests]);

  const acceptBooking = (index) => {
    const acceptedJob = jobs[index];
    fetchPreviousBookings(acceptedJob);
    setJobs((prev) => {
      const updatedJobs = [...prev];
      updatedJobs.splice(index, 1);
      return updatedJobs;
    });
  };

  const declineBooking = (index) => {
    setJobs((prev) => {
      const updatedJobs = [...prev];
      updatedJobs.splice(index, 1);
      return updatedJobs;
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login/ProviderLogin');
  };

  const navItems = [
    { icon: Briefcase, label: 'Dashboard', path: '/provider/ProviderDashboard' },
    { icon: HelpCircle, label: 'Help', path: '/provider/ProviderHelp' },
    { icon: User, label: 'Profile', path: '/provider/ProviderProfile' },
  ];

  const sidebarNav = (
    <aside className="w-64 bg-gradient-to-b from-violet-700 to-violet-800 text-white flex flex-col">
      <div className="p-6 border-b border-violet-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">Home Care Connect</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button key={item.label} onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.path) ? 'bg-white/15' : 'hover:bg-white/10'}`}>
            <item.icon className="h-5 w-5" />{item.label}
          </button>
        ))}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all mt-8">
          <LogOut className="h-5 w-5" />Logout
        </button>
      </nav>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarNav}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your jobs and schedule</p>
          </div>
          <div className="flex items-center gap-4">
            {auth.currentUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{auth.currentUser.email}</p>
                <p className="text-xs text-gray-500">Service Provider</p>
              </div>
            )}
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Availability Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <span className={`w-4 h-4 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{isAvailable ? 'Available' : 'Unavailable'}</p>
                  <p className="text-sm text-gray-500">
                    {isAvailable ? 'You will receive new job requests' : 'You won\'t receive new requests'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isAvailable} onChange={handleAvailabilityToggle}
                  className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          </div>

          {/* Job Requests */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Job Requests</h2>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job, index) => (
                  <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{job.username || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{job.userEmail}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-gray-900 font-medium">{job.phoneNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="text-gray-900 font-medium">{job.bookingDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time:</span>
                        <span className="text-gray-900 font-medium">{job.bookingTime || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="text-gray-900 font-medium">{job.location || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => acceptBooking(index)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-all">
                        <CheckCircle className="h-4 w-4" />Accept
                      </button>
                      <button onClick={() => declineBooking(index)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all">
                        <XCircle className="h-4 w-4" />Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No job requests</h3>
                <p className="text-gray-500">New job requests will appear here</p>
              </div>
            )}
          </div>

          {/* Previous Bookings Button */}
          {previousBookings.length > 0 && (
            <button onClick={() => setShowModal(true)}
              className="w-full py-3 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl font-medium transition-all border border-violet-200">
              Previous Bookings ({previousBookings.length})
            </button>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Previous Bookings</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[60vh] p-6">
                  {previousBookings.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Time</th>
                          <th className="pb-3 font-medium">Location</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {previousBookings.map((booking, index) => (
                          <tr key={index} className="border-b border-gray-50">
                            <td className="py-3 font-medium text-gray-900">{booking.name}</td>
                            <td className="py-3 text-gray-600">{booking.date}</td>
                            <td className="py-3 text-gray-600">{booking.time}</td>
                            <td className="py-3 text-gray-600">{booking.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No previous bookings yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

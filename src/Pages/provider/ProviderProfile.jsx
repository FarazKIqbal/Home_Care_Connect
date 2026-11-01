import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, HelpCircle, User, LogOut, Briefcase, Phone, Mail, Edit3, Check, X } from 'lucide-react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const SPECIAL_EMAILS = ['aaravshah@gmail.com', 'ravikumar@gmail.com', 'poojaverma@gmail.com'];

export default function ProviderProfile() {
  const [provider, setProvider] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login/ProviderLogin');
        return;
      }
      fetchProviderData(user.uid);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchProviderData = async (uid) => {
    try {
      const providerRef = doc(db, 'workers', uid);
      const providerSnap = await getDoc(providerRef);

      if (providerSnap.exists()) {
        const data = providerSnap.data();
        setProvider(data);
        setIsAvailable(data.isAvailable || false);
        setFormData({ fullName: data.fullName || '', phoneNumber: data.phoneNumber || '', about: data.about || '' });
      } else {
        if (SPECIAL_EMAILS.includes(auth.currentUser?.email)) {
          const email = auth.currentUser.email;
          const name = email === 'aaravshah@gmail.com' ? 'Aarav Shah' :
                       email === 'ravikumar@gmail.com' ? 'Ravi Kumar' :
                       email === 'poojaverma@gmail.com' ? 'Pooja Verma' : 'Provider';
          const mockData = {
            fullName: name,
            username: name.split(' ')[0],
            email,
            phoneNumber: '1234567890',
            service: 'Plumbing',
            isAvailable: false,
            about: 'Experienced plumbing professional',
          };
          setProvider(mockData);
          setIsAvailable(mockData.isAvailable);
          setFormData({ fullName: mockData.fullName, phoneNumber: mockData.phoneNumber, about: mockData.about });
        }
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login/ProviderLogin');
  };

  const openEdit = () => {
    if (provider) {
      setFormData({
        fullName: provider.fullName || '',
        phoneNumber: provider.phoneNumber || '',
        about: provider.about || '',
      });
    }
    setEditMode(true);
    setSaveMsg('');
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormData({});
    setSaveMsg('');
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const user = auth.currentUser;
      if (!user) return;
      await updateDoc(doc(db, 'workers', user.uid), {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        about: formData.about,
      });
      setProvider(prev => ({ ...prev, ...formData }));
      setEditMode(false);
      setSaveMsg('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const newAvailability = !isAvailable;
      setIsAvailable(newAvailability);
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'workers', user.uid), { isAvailable: newAvailability });
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const navItems = [
    { icon: Briefcase, label: 'Dashboard', path: '/provider/ProviderDashboard' },
    { icon: HelpCircle, label: 'Help', path: '/provider/ProviderHelp' },
    { icon: User, label: 'Profile', path: '/provider/ProviderProfile' },
  ];

  if (!provider) {
    return (
      <div className="flex h-screen bg-gray-50">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <div className="flex items-center gap-4">
            {auth.currentUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{auth.currentUser.email}</p>
                <p className="text-xs text-gray-500">Provider</p>
              </div>
            )}
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {provider.fullName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{provider.fullName || 'Provider'}</h2>
                      <p className="text-sm text-gray-500">{provider.service || 'Service Provider'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={editMode ? cancelEdit : openEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {editMode ? (
                      <><X className="h-4 w-4" />Cancel</>
                    ) : (
                      <><Edit3 className="h-4 w-4" />Edit Profile</>
                    )}
                  </button>
                </div>
              </div>

              {editMode ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-violet-100 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-violet-100 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                    <textarea name="about" value={formData.about} onChange={handleInputChange} rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-violet-100 outline-none transition-all resize-none" />
                  </div>
                  {saveMsg && (
                    <p className={`text-sm ${saveMsg.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{saveMsg}</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={cancelEdit} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                      {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Saving...</> : <><Check className="h-4 w-4" />Save Changes</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email (cannot change)</p>
                      <p className="text-gray-900 font-medium">{provider.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="text-gray-900 font-medium">{provider.phoneNumber || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Briefcase className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service</p>
                      <p className="text-gray-900 font-medium">{provider.service || 'Not set'}</p>
                    </div>
                  </div>
                  {provider.about && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">About</p>
                      <p className="text-gray-900">{provider.about}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium">{isAvailable ? 'You are currently available' : 'You are currently unavailable'}</p>
                  <p className="text-sm text-gray-500">When unavailable, you won't receive new job requests</p>
                </div>
                <button
                  onClick={handleAvailabilityToggle}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isAvailable ? 'bg-violet-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

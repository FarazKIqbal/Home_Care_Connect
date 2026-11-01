import React, { useState, useEffect } from 'react';
import { Home, HelpCircle, User, LogOut, MapPin, Phone, Mail, Edit3, Check, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        await fetchUserData(user);
      } else {
        navigate('/login/UserLogin');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFormData({ fullName: data.fullName || '', phoneNumber: data.phoneNumber || '', location: data.location || '' });
      } else {
        console.error("User not found in Firestore.");
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login/UserLogin');
  };

  const openEdit = () => {
    setFormData({ fullName: userData.fullName || '', phoneNumber: userData.phoneNumber || '', location: userData.location || '' });
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
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
      });
      setUserData(prev => ({ ...prev, ...formData }));
      setEditMode(false);
      setSaveMsg('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { icon: User, label: 'Dashboard', path: '/dashboard/Dashboard' },
    { icon: HelpCircle, label: 'Help', path: '/UserRegister/CustomerHelp' },
    { icon: User, label: 'Profile', path: '/dashboard/UserProfile' },
  ];

  const sidebarNav = (
    <aside className="w-64 bg-gradient-to-b from-violet-700 to-violet-800 text-white flex flex-col">
      <div className="p-6 border-b border-violet-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Home className="h-6 w-6" />
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {sidebarNav}
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
      {sidebarNav}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <div className="flex items-center gap-4">
            {auth.currentUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{auth.currentUser.email}</p>
                <p className="text-xs text-gray-500">Customer</p>
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
                      {userData?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{userData?.fullName || 'User'}</h2>
                      <p className="text-sm text-gray-500">Home Owner</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-violet-100 outline-none transition-all" />
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
                      <p className="text-gray-900 font-medium truncate">{userData?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="text-gray-900 font-medium">{userData?.phoneNumber || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                      <p className="text-gray-900 font-medium">{userData?.location || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

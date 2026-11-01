import React, { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function ServiceCard({ provider, onBook, onViewProfile }) {
  const [showModal, setShowModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [location, setLocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useAuth();

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return provider.ratingAvg || provider.rating || 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleBooking = async () => {
    if (!currentUser) {
      alert('Please login first');
      return;
    }

    if (!bookingDate || !bookingTime || !location) {
      setErrorMessage('Please fill all booking details');
      return;
    }

    try {
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const bookingInfo = {
        username: userData.username || userData.fullName || 'User',
        userEmail: userData.email || currentUser.email,
        phoneNumber: userData.phoneNumber || 'N/A',
        providerEmail: provider.email,
        providerName: provider.fullName || provider.username,
        serviceName: provider.service || provider.category,
        bookingDate,
        bookingTime,
        location,
        status: 'requested'
      };

      await addDoc(collection(db, 'jobRequests'), bookingInfo);
      setSuccessMessage('Booking requested successfully!');
      setErrorMessage('');
      setBookingDate('');
      setBookingTime('');
      setLocation('');
      setTimeout(() => {
        setShowModal(false);
        onBook && onBook();
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      setErrorMessage('Error creating booking. Please try again.');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 mr-3 overflow-hidden">
              {provider.image ? (
                <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center text-gray-500">
                  {provider.fullName?.[0] || provider.username?.[0] || '?'}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{provider.fullName || provider.username}</h3>
              <p className="text-gray-600 text-sm">{provider.service || provider.category}</p>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{calculateAverageRating(provider.reviews)}</span>
            <span className="text-gray-400 text-xs ml-2">({provider.ratingCount || 0} reviews)</span>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            {provider.description || provider.about}
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{provider.city || provider.location || 'Location not specified'}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onViewProfile}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              View Profile
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 px-4 py-2 bg-[#4B49AC] text-white rounded-md text-sm font-medium hover:bg-[#3f3e91] transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Book Service with {provider.fullName || provider.username}</h2>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4B49AC] focus:border-[#4B49AC]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4B49AC] focus:border-[#4B49AC]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Enter service location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#4B49AC] focus:border-[#4B49AC]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-[#4B49AC] text-white rounded-md hover:bg-[#3f3e91] transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ServiceCard;
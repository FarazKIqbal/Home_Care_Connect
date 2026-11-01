import { db } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';

// User operations
export const createUser = async (userId, userData) => {
  await addDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp()
  });
};

export const getUser = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
};

export const updateUser = async (userId, userData) => {
  await updateDoc(doc(db, 'users', userId), {
    ...userData,
    updatedAt: serverTimestamp()
  });
};

// Provider/Worker operations
export const createProvider = async (providerId, providerData) => {
  await addDoc(doc(db, 'workers', providerId), {
    ...providerData,
    createdAt: serverTimestamp()
  });
};

export const getProvider = async (providerId) => {
  const providerDoc = await getDoc(doc(db, 'workers', providerId));
  return providerDoc.exists() ? { id: providerDoc.id, ...providerDoc.data() } : null;
};

export const getProvidersByService = async (serviceType) => {
  const q = query(collection(db, 'workers'), where('service', '==', serviceType));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProviderAvailability = async (providerId, isAvailable) => {
  await updateDoc(doc(db, 'workers', providerId), { isAvailable });
};

// Service operations
export const getServices = async (filters = {}) => {
  let q = collection(db, 'services');

  if (filters.category) {
    q = query(q, where('category', '==', filters.category));
  }
  if (filters.city) {
    q = query(q, where('city', '==', filters.city));
  }
  if (filters minPrice !== undefined || filters.maxPrice !== undefined) {
    // Price filtering requires composite index - simplified for now
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getService = async (serviceId) => {
  const serviceDoc = await getDoc(doc(db, 'services', serviceId));
  return serviceDoc.exists() ? { id: serviceDoc.id, ...serviceDoc.data() } : null;
};

export const createService = async (serviceData) => {
  await addDoc(collection(db, 'services'), {
    ...serviceData,
    isActive: true,
    createdAt: serverTimestamp()
  });
};

export const updateService = async (serviceId, serviceData) => {
  await updateDoc(doc(db, 'services', serviceId), {
    ...serviceData,
    updatedAt: serverTimestamp()
  });
};

// Booking/Job Request operations
export const createBooking = async (bookingData) => {
  const bookingRef = doc(collection(db, 'bookings'));
  await addDoc(collection(db, 'bookings'), {
    ...bookingData,
    status: 'requested',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return bookingRef.id;
};

// Transaction-based booking to prevent double-booking
export const createBookingTransaction = async (bookingData, providerEmail, bookingDate, bookingTime) => {
  const jobRequestsRef = collection(db, 'jobRequests');

  try {
    // Atomic transaction to check and create booking
    await runTransaction(db, async (transaction) => {
      const q = query(
        jobRequestsRef,
        where('providerEmail', '==', providerEmail),
        where('bookingDate', '==', bookingDate),
        where('bookingTime', '==', bookingTime)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        throw new Error('Slot already booked');
      }

      // Create the booking atomically
      const newBookingRef = doc(collection(db, 'jobRequests'));
      transaction.set(newBookingRef, {
        ...bookingData,
        status: 'requested',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const getBookingsByCustomer = async (customerEmail) => {
  const q = query(collection(db, 'jobRequests'), where('userEmail', '==', customerEmail));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBookingsByProvider = async (providerEmail) => {
  const q = query(collection(db, 'jobRequests'), where('providerEmail', '==', providerEmail));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBooking = async (bookingId) => {
  const bookingDoc = await getDoc(doc(db, 'jobRequests', bookingId));
  return bookingDoc.exists() ? { id: bookingDoc.id, ...bookingDoc.data() } : null;
};

export const updateBookingStatus = async (bookingId, status) => {
  await updateDoc(doc(db, 'jobRequests', bookingId), {
    status,
    updatedAt: serverTimestamp()
  });
};

// Review operations
export const createReview = async (reviewData) => {
  await addDoc(collection(db, 'reviews'), {
    ...reviewData,
    createdAt: serverTimestamp()
  });
};

export const getReviewsForProvider = async (providerEmail) => {
  const q = query(collection(db, 'reviews'), where('providerEmail', '==', providerEmail));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAverageRating = async (providerEmail) => {
  const reviews = await getReviewsForProvider(providerEmail);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
};
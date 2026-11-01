/**
 * Validation utilities for input validation
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && value !== '';
};

export const validateStringLength = (value, min, max = null) => {
  if (!value) return false;
  if (min && value.length < min) return false;
  if (max && value.length > max) return false;
  return true;
};

export const validateLocation = (location) => {
  return validateRequired(location) && location.trim().length >= 3;
};

export const validateBooking = (bookingData) => {
  const errors = {};

  if (!validateRequired(bookingDate)) {
    errors.bookingDate = 'Booking date is required';
  }
  if (!validateRequired(bookingTime)) {
    errors.bookingTime = 'Booking time is required';
  }
  if (!validateRequired(location)) {
    errors.location = 'Location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProviderProfile = (profileData) => {
  const errors = {};

  if (!validateRequired(profileData.fullName)) {
    errors.fullName = 'Full name is required';
  }
  if (!validateEmail(profileData.email)) {
    errors.email = 'Valid email is required';
  }
  if (!validatePhoneNumber(profileData.phoneNumber)) {
    errors.phoneNumber = 'Valid phone number is required';
  }
  if (!validateRequired(profileData.service)) {
    errors.service = 'Service type is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
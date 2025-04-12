import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Fetch doctor appointments
 * @returns {Promise<Array>} List of appointments
 */
export const fetchDoctorAppointments = async () => {
  try {
    // In a real implementation, this would make an API call
    // For demo purposes, we'll return mock data
    return [
      {
        _id: 'appt1',
        appointmentDate: '2025-04-15',
        appointmentTime: '09:30',
        patient: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543'
        },
        reason: 'Annual checkup and consultation about recent blood test results.',
        status: 'confirmed',
        notes: ''
      },
      {
        _id: 'appt2',
        appointmentDate: '2025-04-15',
        appointmentTime: '11:00',
        patient: {
          name: 'Michael Johnson',
          email: 'michael.j@example.com',
          phone: '+1 (555) 123-7890'
        },
        reason: 'Follow-up appointment after surgery.',
        status: 'confirmed',
        notes: 'Patient reported mild pain in the incision area.'
      },
      {
        _id: 'appt3',
        appointmentDate: '2025-04-16',
        appointmentTime: '14:30',
        patient: {
          name: 'Emily Wilson',
          email: 'emily.w@example.com',
          phone: '+1 (555) 456-1230'
        },
        reason: 'First consultation for persistent headaches.',
        status: 'pending',
        notes: ''
      },
      {
        _id: 'appt4',
        appointmentDate: '2025-04-17',
        appointmentTime: '10:15',
        patient: {
          name: 'Robert Brown',
          email: 'robert.b@example.com',
          phone: '+1 (555) 789-4560'
        },
        reason: 'Regular checkup for heart condition.',
        status: 'completed',
        notes: 'Patient is responding well to medication. Blood pressure normal.'
      },
      {
        _id: 'appt5',
        appointmentDate: '2025-04-18',
        appointmentTime: '15:45',
        patient: {
          name: 'Sophia Garcia',
          email: 'sophia.g@example.com',
          phone: '+1 (555) 321-6547'
        },
        reason: 'Consultation about allergies and possible treatments.',
        status: 'cancelled',
        notes: 'Patient called to cancel due to scheduling conflict.'
      }
    ];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Fetch doctor profile
 * @returns {Promise<Object>} Doctor profile
 */
export const fetchDoctorProfile = async () => {
  try {
    // In a real implementation, this would make an API call
    // For demo purposes, we'll return mock data
    return {
      _id: 'demo-doctor-id',
      name: 'Dr. John Smith',
      specialization: 'Cardiologist',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      status: 'approved',
      profilePicture: null,
      qualifications: [
        { degree: 'MD', institution: 'Harvard Medical School', year: '2010' },
        { degree: 'Cardiology Specialization', institution: 'Mayo Clinic', year: '2015' }
      ],
      about: 'Experienced cardiologist with over 10 years of practice in treating various heart conditions.',
      consultationFee: 150,
      availability: {
        monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
        tuesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
        wednesday: [{ start: '09:00', end: '12:00' }],
        thursday: [{ start: '14:00', end: '17:00' }],
        friday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
        saturday: [],
        sunday: []
      }
    };
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

/**
 * Update doctor profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated doctor profile
 */
export const updateDoctorProfile = async (profileData) => {
  try {
    // In a real implementation, this would make an API call
    // For demo purposes, we'll just return the updated data
    return { ...profileData, success: true };
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

/**
 * Fetch doctor's unavailable dates
 * @returns {Promise<Array>} List of unavailable dates
 */
export const fetchDoctorUnavailableDates = async () => {
  try {
    // In a real implementation, this would make an API call
    // For demo purposes, we'll return mock data
    return [
      { _id: 'date1', date: '2025-05-15', reason: 'Personal leave' },
      { _id: 'date2', date: '2025-06-10', reason: 'Conference attendance' },
      { _id: 'date3', date: '2025-06-11', reason: 'Conference attendance' },
      { _id: 'date4', date: '2025-07-01', reason: 'Vacation' },
      { _id: 'date5', date: '2025-07-02', reason: 'Vacation' },
      { _id: 'date6', date: '2025-07-03', reason: 'Vacation' }
    ];
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
    throw error;
  }
};

/**
 * Add an unavailable date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} reason - Reason for unavailability
 * @returns {Promise<Object>} Added unavailable date
 */
export const addUnavailableDate = async (date, reason) => {
  try {
    // In a real implementation, this would make an API call
    // For demo purposes, we'll just return the data with a generated ID
    const newDateId = 'date' + Date.now();
    return { _id: newDateId, date, reason };
  } catch (error) {
    console.error('Error adding unavailable date:', error);
    throw error;
  }
};

/**
 * Remove an unavailable date
 * @param {string} dateId - ID of the unavailable date to remove
 * @returns {Promise<Object>} Confirmation of removal
 */
export const removeUnavailableDate = async (dateId) => {
  try {
    // In a real implementation, this would make an API call
    // For demo purposes, we'll just return a success message
    return { success: true };
  } catch (error) {
    console.error('Error removing unavailable date:', error);
    throw error;
  }
};

export default api;
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDoctorProfile } from '../utils/api';

const DoctorContext = createContext();

export const useDoctorContext = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctorProfile();
        setDoctor(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to load doctor profile. Please try again later.');
        
        // For demo purposes, set mock data if API fails
        setDoctor({
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
        });
      } finally {
        setLoading(false);
      }
    };

    loadDoctorProfile();
  }, []);

  const updateDoctorInfo = async (updatedInfo) => {
    // This would normally make an API call to update the doctor profile
    // For now, just update the local state
    setDoctor({ ...doctor, ...updatedInfo });
    return { success: true };
  };

  const value = {
    doctor,
    loading,
    error,
    updateDoctorInfo
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
};

export default DoctorContext;
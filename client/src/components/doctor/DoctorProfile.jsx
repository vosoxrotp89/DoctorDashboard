import React, { useState } from 'react';
import { useDoctorContext } from '../../contexts/DoctorContext';
import { updateDoctorProfile } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaMoneyBillWave, FaEdit, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const DoctorProfile = () => {
  const { doctor, loading, error, updateDoctorInfo } = useDoctorContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize form data when doctor data is loaded
  React.useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        specialization: doctor.specialization || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        about: doctor.about || '',
        consultationFee: doctor.consultationFee || 0,
      });
    }
  }, [doctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This would typically make an API call to update the doctor profile
      // For demo purposes, we'll just update the local state
      await updateDoctorInfo(formData);
      setUpdateSuccess(true);
      setUpdateError(null);
      setIsEditing(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateError('Failed to update profile. Please try again later.');
      setUpdateSuccess(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return (
          <div className="flex items-center space-x-2 text-green-700 bg-green-100 px-3 py-2 rounded-md">
            <FaCheckCircle />
            <span>Approved</span>
          </div>
        );
      case 'not-approved':
        return (
          <div className="flex items-center space-x-2 text-yellow-700 bg-yellow-100 px-3 py-2 rounded-md">
            <FaExclamationTriangle />
            <span>Pending Approval</span>
          </div>
        );
      case 'declined':
        return (
          <div className="flex items-center space-x-2 text-red-700 bg-red-100 px-3 py-2 rounded-md">
            <FaTimesCircle />
            <span>Declined</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
            <FaExclamationTriangle />
            <span>Unknown Status</span>
          </div>
        );
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !doctor) return <AlertMessage type="error" message={error} />;

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-primary">Doctor Profile</h2>
        <p className="text-sm text-gray-500 mt-1">View and manage your professional profile</p>
      </div>
      
      {updateError && <AlertMessage type="error" message={updateError} />}
      {updateSuccess && <AlertMessage type="success" message="Profile updated successfully!" />}

      <div className="p-4">
        {/* Profile Status */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Profile Status</h3>
          {doctor && getStatusBadge(doctor.status)}
          {doctor?.status === 'not-approved' && (
            <p className="mt-2 text-sm text-gray-600">
              Your profile is under review. You'll be notified once it's approved.
            </p>
          )}
          {doctor?.status === 'declined' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <h4 className="text-sm font-medium text-red-800">Reason for Decline:</h4>
              <p className="text-sm text-red-700 mt-1">
                {doctor.declineReason || "Your profile doesn't meet our requirements. Please contact support for more information."}
              </p>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">Consultation Fee ($)</label>
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex justify-between">
                <h3 className="text-md font-medium text-gray-700 mb-4">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary hover:text-primary-hover flex items-center space-x-1"
                >
                  <FaEdit size={16} />
                  <span>Edit</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <FaUser className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium">{doctor?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaGraduationCap className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Specialization</p>
                    <p className="font-medium">{doctor?.specialization}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{doctor?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaPhone className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{doctor?.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FaMoneyBillWave className="mt-1 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Consultation Fee</p>
                    <p className="font-medium">${doctor?.consultationFee}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">About</h3>
              <p className="text-gray-600">{doctor?.about || 'No information provided.'}</p>
            </div>
            
            {doctor?.qualifications && doctor.qualifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Qualifications</h3>
                <div className="space-y-3">
                  {doctor.qualifications.map((qualification, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium">{qualification.degree}</p>
                      <p className="text-sm text-gray-600">{qualification.institution}, {qualification.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
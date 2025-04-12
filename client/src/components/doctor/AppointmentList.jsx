import React, { useState, useEffect } from 'react';
import { fetchDoctorAppointments } from '../../utils/api';
import { formatDate, formatTime } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { FaCalendarAlt, FaClock, FaUserAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctorAppointments();
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Pending</span>;
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Confirmed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Cancelled</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // Sort by date (newest first)
    return new Date(b.appointmentDate) - new Date(a.appointmentDate);
  });

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    // This would typically make an API call to update the status
    // For demo purposes, we'll just update the local state
    const updatedAppointments = appointments.map(appointment => 
      appointment._id === id ? { ...appointment, status: newStatus } : appointment
    );
    
    setAppointments(updatedAppointments);
    
    if (selectedAppointment && selectedAppointment._id === id) {
      setSelectedAppointment({ ...selectedAppointment, status: newStatus });
    }
  };

  if (loading && appointments.length === 0) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-primary">Appointment List</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your patient appointments</p>
      </div>
      
      {error && <AlertMessage type="error" message={error} />}

      <div className="p-4">
        {/* Filter buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-4 py-2 rounded-md text-sm ${filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('confirmed')} 
            className={`px-4 py-2 rounded-md text-sm ${filter === 'confirmed' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={`px-4 py-2 rounded-md text-sm ${filter === 'completed' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Completed
          </button>
          <button 
            onClick={() => setFilter('cancelled')} 
            className={`px-4 py-2 rounded-md text-sm ${filter === 'cancelled' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Cancelled
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found.</p>
          </div>
        ) : sortedAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No {filter} appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {appointment.patient?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patient?.name}</div>
                          <div className="text-sm text-gray-500">{appointment.patient?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(appointment.appointmentDate)}</div>
                      <div className="text-sm text-gray-500">{formatTime(appointment.appointmentTime)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{appointment.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(appointment)}
                        className="text-primary hover:text-primary-hover"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleCloseDetails}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Appointment Details
                    </h3>
                    
                    <div className="mt-2 border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        {getStatusBadge(selectedAppointment.status)}
                      </div>
                      
                      <div className="mb-4 bg-gray-50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Information</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center text-sm">
                            <FaUserAlt className="mr-2 text-gray-400" />
                            <span>{selectedAppointment.patient?.name}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            <span>{selectedAppointment.patient?.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FaPhoneAlt className="mr-2 text-gray-400" />
                            <span>{selectedAppointment.patient?.phone || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Date</span>
                        </div>
                        <p className="text-sm text-gray-900 ml-6">
                          {formatDate(selectedAppointment.appointmentDate)}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <FaClock className="mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Time</span>
                        </div>
                        <p className="text-sm text-gray-900 ml-6">
                          {formatTime(selectedAppointment.appointmentTime)}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Reason for Visit</h4>
                        <p className="text-sm text-gray-900">
                          {selectedAppointment.reason}
                        </p>
                      </div>
                      
                      {selectedAppointment.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Doctor's Notes</h4>
                          <p className="text-sm text-gray-900">
                            {selectedAppointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'confirmed')}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-opacity-90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'cancelled')}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                {selectedAppointment.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'completed')}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-opacity-90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Mark as Completed
                  </button>
                )}
                
                <button
                  onClick={handleCloseDetails}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
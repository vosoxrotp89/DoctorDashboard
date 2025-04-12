import React, { useState, useEffect } from 'react';
import { fetchDoctorUnavailableDates, addUnavailableDate, removeUnavailableDate } from '../../utils/api';
import { formatDate, isDateInPast, getFormattedDate } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { FaCalendarAlt, FaPlus, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const AvailabilityCalendar = () => {
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [newDate, setNewDate] = useState(getFormattedDate());
  const [newReason, setNewReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const loadUnavailableDates = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctorUnavailableDates();
        setUnavailableDates(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching unavailable dates:', err);
        setError('Failed to load unavailable dates. Please try again later.');
        
        // For demo purposes, set mock data if API fails
        setUnavailableDates([
          { _id: 'date1', date: '2025-05-15', reason: 'Personal leave' },
          { _id: 'date2', date: '2025-06-10', reason: 'Conference attendance' },
          { _id: 'date3', date: '2025-06-11', reason: 'Conference attendance' },
          { _id: 'date4', date: '2025-07-01', reason: 'Vacation' },
          { _id: 'date5', date: '2025-07-02', reason: 'Vacation' },
          { _id: 'date6', date: '2025-07-03', reason: 'Vacation' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadUnavailableDates();
  }, []);

  const handleAddDate = async (e) => {
    e.preventDefault();
    
    // Validate date is not in the past
    if (isDateInPast(newDate)) {
      setError('Cannot add unavailable dates in the past.');
      return;
    }

    // Check if date already exists
    if (unavailableDates.some(item => item.date === newDate)) {
      setError('This date is already marked as unavailable.');
      return;
    }

    try {
      setLoading(true);
      // This would typically make an API call to add an unavailable date
      // For demo purposes, we'll just update the local state
      const dateId = 'date' + (unavailableDates.length + 1);
      const newDateEntry = { _id: dateId, date: newDate, reason: newReason };
      
      setUnavailableDates([...unavailableDates, newDateEntry]);
      setNewDate(getFormattedDate());
      setNewReason('');
      setIsAddingDate(false);
      setError(null);
      
      // Show success message
      setActionSuccess(true);
      setActionMessage('Date marked as unavailable successfully!');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(false);
        setActionMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error adding unavailable date:', err);
      setError('Failed to add unavailable date. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDate = async (dateId) => {
    try {
      setLoading(true);
      // This would typically make an API call to remove an unavailable date
      // For demo purposes, we'll just update the local state
      setUnavailableDates(unavailableDates.filter(item => item._id !== dateId));
      setError(null);
      
      // Show success message
      setActionSuccess(true);
      setActionMessage('Date removed successfully!');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(false);
        setActionMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error removing unavailable date:', err);
      setError('Failed to remove unavailable date. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Group dates by month for better organization
  const groupDatesByMonth = () => {
    const grouped = {};
    
    [...unavailableDates].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(item => {
      const date = new Date(item.date);
      const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(item);
    });
    
    return grouped;
  };

  const groupedDates = groupDatesByMonth();

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-primary">Availability Calendar</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your unavailable dates</p>
      </div>
      
      {error && <AlertMessage type="error" message={error} />}
      {actionSuccess && <AlertMessage type="success" message={actionMessage} />}

      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Mark dates when you are unavailable to accept appointments.
          </p>
          
          {!isAddingDate ? (
            <button
              onClick={() => setIsAddingDate(true)}
              className="flex items-center space-x-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              <FaPlus size={12} />
              <span>Add Date</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddingDate(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
        
        {isAddingDate && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium text-gray-700 mb-3">Add Unavailable Date</h3>
            <form onSubmit={handleAddDate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label htmlFor="newDate" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    id="newDate"
                    value={newDate}
                    min={getFormattedDate()}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="newReason" className="block text-sm font-medium text-gray-700">Reason</label>
                  <input
                    type="text"
                    id="newReason"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="e.g. Vacation, Conference, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                  disabled={loading}
                >
                  Add Date
                </button>
              </div>
            </form>
          </div>
        )}
        
        {loading && unavailableDates.length === 0 ? (
          <LoadingSpinner />
        ) : unavailableDates.length === 0 ? (
          <div className="text-center py-10">
            <FaCalendarAlt className="mx-auto text-gray-300 text-5xl mb-4" />
            <p className="text-gray-500">You haven't marked any unavailable dates yet.</p>
            <p className="text-gray-500">Click the "Add Date" button to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedDates).map(([monthYear, dates]) => (
              <div key={monthYear} className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-primary">{monthYear}</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {dates.map((item) => (
                    <li key={item._id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{formatDate(item.date)}</p>
                        <p className="text-sm text-gray-600">{item.reason}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveDate(item._id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remove date"
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 bg-yellow-50 p-3 rounded-md border border-yellow-100">
          <div className="flex items-start space-x-3">
            <FaExclamationCircle className="text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Important Note:</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Patients won't be able to book appointments on dates marked as unavailable.
                Existing appointments on these dates will need to be rescheduled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaClipboardList, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';
import { useDoctorContext } from '../../contexts/DoctorContext';

const SideMenu = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { doctor, loading } = useDoctorContext();

  const menuItems = [
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <FaClipboardList className="w-5 h-5" />
    },
    {
      id: 'profile',
      label: 'Doctor Profile',
      icon: <FaUserMd className="w-5 h-5" />
    },
    {
      id: 'availability',
      label: 'Availability',
      icon: <FaCalendarAlt className="w-5 h-5" />
    }
  ];

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'not-approved':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 flex items-center p-4 md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md text-primary focus:outline-none"
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Doctor info section */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-primary">Doctor Dashboard</h2>
            {!loading && doctor && (
              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {doctor.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <p className="font-medium">{doctor.name || 'Doctor'}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doctor?.status)}`}>
                      {doctor?.status === 'approved' ? 'Approved' : 
                       doctor?.status === 'not-approved' ? 'Pending Approval' : 
                       doctor?.status === 'declined' ? 'Declined' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) {
                    setIsMenuOpen(false);
                  }
                }}
                className={`w-full flex items-center px-4 py-3 text-left text-sm rounded-md transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer with logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => {
                // For demo purposes - clear local storage and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
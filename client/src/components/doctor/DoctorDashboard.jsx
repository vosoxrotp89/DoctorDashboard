import React, { useState } from 'react';
import { DoctorProvider } from '../../contexts/DoctorContext';
import SideMenu from './SideMenu';
import AppointmentList from './AppointmentList';
import DoctorProfile from './DoctorProfile';
import AvailabilityCalendar from './AvailabilityCalendar';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'appointments':
        return <AppointmentList />;
      case 'profile':
        return <DoctorProfile />;
      case 'availability':
        return <AvailabilityCalendar />;
      default:
        return <AppointmentList />;
    }
  };

  return (
    <DoctorProvider>
      <div className="flex h-screen bg-gray-100">
        <SideMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-auto p-4 md:p-8 md:ml-64">
          <div className="mx-auto max-w-5xl">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </DoctorProvider>
  );
};

export default DoctorDashboard;
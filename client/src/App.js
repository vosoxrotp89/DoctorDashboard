import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DoctorDashboardPage from './pages/DoctorDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
        {/* Redirect root to dashboard for demo purposes */}
        <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
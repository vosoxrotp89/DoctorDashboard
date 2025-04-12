import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const AlertMessage = ({ type = 'info', message }) => {
  const alertStyles = {
    success: {
      containerClass: 'bg-green-50 border-green-200 text-green-800',
      icon: <FaCheckCircle className="text-green-500" />
    },
    error: {
      containerClass: 'bg-red-50 border-red-200 text-red-800',
      icon: <FaExclamationTriangle className="text-red-500" />
    },
    info: {
      containerClass: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <FaInfoCircle className="text-blue-500" />
    },
    warning: {
      containerClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <FaExclamationTriangle className="text-yellow-500" />
    }
  };

  const { containerClass, icon } = alertStyles[type] || alertStyles.info;

  return (
    <div className={`p-4 mb-4 border rounded-md flex items-start space-x-3 ${containerClass}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>{message}</div>
    </div>
  );
};

export default AlertMessage;
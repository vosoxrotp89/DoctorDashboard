/**
 * Format date to display in a readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time to display in a readable format
 * @param {string} time - Time string in HH:MM format
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours, 10));
  dateObj.setMinutes(parseInt(minutes, 10));
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isDateInPast = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj < today;
};

/**
 * Get date in YYYY-MM-DD format
 * @param {Date} date - Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getFormattedDate = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
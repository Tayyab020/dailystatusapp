// src/utils/dateFormatter.js

/**
 * Format current date and time for check-in messages
 * Returns: "Thursday, January 1, 2026 at 10:30 AM"
 */
export const formatDateTime = () => {
    const now = new Date();
    
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return now.toLocaleString('en-US', options).replace(',', '');
  };
  
  /**
   * Get day name (e.g., "Thursday")
   */
  export const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };
  
  /**
   * Check if it's morning (before 2 PM) or evening
   */
  export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    return hour < 14 ? 'morning' : 'evening';
  };
  
  /**
   * Generate check-in subject line
   */
  export const generateSubject = (type, location, reason = '') => {
    const dateTime = formatDateTime();
    const prefix = type === 'check-in' ? 'Check-In' : 'Check-Out';
    
    let subject = `${prefix} ${dateTime} - From ${location}`;
    
    if (location === 'Home' && reason.trim()) {
      subject += `\nReason: ${reason.trim()}`;
    }
    
    return subject;
  };
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
   * Check if it's morning (8 AM - 5:59 PM) or evening/night (6 PM - 7:59 AM)
   */
  export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    // Morning: 8:00 AM - 5:59 PM (hour 8-17)
    // Evening/Night: 6:00 PM - 7:59 AM (hour 18-23 or 0-7)
    return hour >= 8 && hour < 18 ? 'morning' : 'evening';
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
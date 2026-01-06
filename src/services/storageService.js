// src/services/storageService.js

const STORAGE_KEYS = {
  SETTINGS: "checkin_settings",
  HISTORY: "checkin_history",
  SLACK_THREAD: "morning_thread_ts",
};

/**
 * Get settings from localStorage
 */
export const getSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings
      ? JSON.parse(settings)
      : {
          attendanceEmail: import.meta.env.VITE_APP_ATTENDANCE_EMAIL || "",
          slackToken: import.meta.env.VITE_APP_SLACK_TOKEN || "",
          slackChannelId: import.meta.env.VITE_APP_SLACK_CHANNEL_ID || "",
          defaultLocation: "Office",
          savedReasons: [
            "Not feeling well",
            "Doctor appointment",
            "Personal work",
          ],
          theme: "light",
        };
  } catch (error) {
    console.error("Error getting settings:", error);
    return {};
  }
};

/**
 * Save settings to localStorage
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

/**
 * Get message history
 */
export const getHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
};

/**
 * Add message to history
 */
export const addToHistory = (message) => {
  try {
    const history = getHistory();
    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...message,
    };

    // Keep only last 100 messages
    const updatedHistory = [newMessage, ...history].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Error adding to history:", error);
    return false;
  }
};

/**
 * Clear history
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    return true;
  } catch (error) {
    console.error("Error clearing history:", error);
    return false;
  }
};

/**
 * Save morning message thread timestamp
 */
export const saveMorningThreadTs = (threadTs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SLACK_THREAD, threadTs);
  } catch (error) {
    console.error("Error saving thread ts:", error);
  }
};

/**
 * Get morning message thread timestamp
 */
export const getMorningThreadTs = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SLACK_THREAD);
  } catch (error) {
    console.error("Error getting thread ts:", error);
    return null;
  }
};

/**
 * Clear morning thread timestamp (call this at midnight or on new day)
 */
export const clearMorningThreadTs = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SLACK_THREAD);
  } catch (error) {
    console.error("Error clearing thread ts:", error);
  }
};

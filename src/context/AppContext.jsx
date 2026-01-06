// src/context/AppContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSettings, saveSettings as saveSettingsToStorage } from '../services/storageService';
import { initGmailApi, isSignedIn, getCurrentUserEmail } from '../services/gmailService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState(getSettings());
  const [gmailUser, setGmailUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Initialize Gmail API on mount
  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing Gmail API...');
        await initGmailApi();
        console.log('Gmail API initialized');
        
        // Check if already signed in
        if (isSignedIn()) {
          const email = getCurrentUserEmail();
          console.log('User already signed in:', email);
          setGmailUser(email);
        }
      } catch (error) {
        console.error('Failed to initialize Gmail API:', error);
        // Don't show error to user, they can try signing in manually
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  // Save settings
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  // Show notification
  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Update Gmail user
  const updateGmailUser = (email) => {
    setGmailUser(email);
  };

  const value = {
    settings,
    saveSettings,
    gmailUser,
    updateGmailUser,
    loading,
    notification,
    showNotification,
    closeNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
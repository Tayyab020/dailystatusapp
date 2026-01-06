// src/components/GmailAuth.jsx

import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { signInGmail, signOutGmail } from '../services/gmailService';
import { useApp } from '../context/AppContext';

const GmailAuth = () => {
  const { gmailUser, updateGmailUser, showNotification } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInGmail();
      if (result.success) {
        updateGmailUser(result.user);
        showNotification('Signed in to Gmail successfully!', 'success');
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('Failed to sign in to Gmail', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const result = await signOutGmail();
      if (result.success) {
        updateGmailUser(null);
        showNotification('Signed out from Gmail', 'info');
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('Failed to sign out', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (gmailUser) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {gmailUser}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleSignOut}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Logout'}
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
      onClick={handleSignIn}
      disabled={loading}
      sx={{ bgcolor: '#4285f4', '&:hover': { bgcolor: '#357ae8' } }}
    >
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </Button>
  );
};

export default GmailAuth;
// src/components/SlackAuth.jsx

import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { initiateSlackOAuth, exchangeSlackCode, getSlackUserInfo, signOutSlack } from '../services/slackService';
import { useApp } from '../context/AppContext';

const SlackAuth = () => {
  const { settings, saveSettings, showNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [slackUser, setSlackUser] = useState(
    settings.slackToken ? settings.slackUserName || 'Slack User' : null
  );

  const handleSignIn = async () => {
    setLoading(true);
    try {
      // Start OAuth flow
      const result = await initiateSlackOAuth();
      
      // Exchange code for token
      const tokenResult = await exchangeSlackCode(result.code);
      
      if (tokenResult.success) {
        // Try to get user info (optional - may fail without identity.basic scope)
        const userInfo = await getSlackUserInfo(tokenResult.token);
        const userName = userInfo.success ? userInfo.user.name : `User ${tokenResult.userId}`;
        
        setSlackUser(userName);
        
        // Save token to settings
        saveSettings({
          ...settings,
          slackToken: tokenResult.token,
          slackUserId: tokenResult.userId,
          slackUserName: userName,
          slackTeamName: tokenResult.teamName
        });
        
        showNotification(`✅ Connected to Slack${userInfo.success ? ` as ${userName}` : ''}!`, 'success');
      } else {
        showNotification(tokenResult.error, 'error');
      }
    } catch (error) {
      if (error.message !== 'OAuth popup was closed') {
        showNotification(error.message || 'Failed to sign in to Slack', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOutSlack();
    setSlackUser(null);
    
    // Remove token from settings
    saveSettings({
      ...settings,
      slackToken: '',
      slackUserId: '',
      slackUserName: '',
      slackChannelId: ''
    });
    
    showNotification('Signed out from Slack', 'info');
  };

  if (slackUser) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Connected as: {slackUser}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleSignOut}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Disconnect'}
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : '💬'}
      onClick={handleSignIn}
      disabled={loading}
      sx={{ bgcolor: '#611f69', '&:hover': { bgcolor: '#4a154b' } }}
    >
      {loading ? 'Connecting...' : 'Sign in with Slack'}
    </Button>
  );
};

export default SlackAuth;
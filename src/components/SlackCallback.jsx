// src/components/SlackCallback.jsx

import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { exchangeSlackCode } from '../services/slackService';
import { useNavigate } from 'react-router-dom';

const SlackCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      // If opened in popup, send message to parent
      if (window.opener) {
        if (error) {
          window.opener.postMessage({
            type: 'slack-oauth-error',
            error: error
          }, window.location.origin);
          window.close();
          return;
        }
        
        if (code) {
          window.opener.postMessage({
            type: 'slack-oauth-success',
            code: code
          }, window.location.origin);
          window.close();
        }
      } else {
        // Direct redirect - handle here
        if (error) {
          console.error('Slack OAuth error:', error);
          navigate('/?slack_error=' + encodeURIComponent(error));
          return;
        }
        
        if (code) {
          try {
            // Exchange code for token
            const tokenResult = await exchangeSlackCode(code);
            
            if (tokenResult.success) {
              // Store token in localStorage temporarily, then redirect
              localStorage.setItem('slack_oauth_token', JSON.stringify({
                token: tokenResult.token,
                userId: tokenResult.userId,
                teamId: tokenResult.teamId,
                teamName: tokenResult.teamName
              }));
              
              // Redirect to home with success
              navigate('/?slack_success=true');
            } else {
              navigate('/?slack_error=' + encodeURIComponent(tokenResult.error || 'Failed to exchange code'));
            }
          } catch (err) {
            console.error('OAuth exchange error:', err);
            navigate('/?slack_error=' + encodeURIComponent(err.message || 'Failed to connect'));
          }
        }
      }
    };

    handleCallback();
  }, [navigate]);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        bgcolor: '#FAF0E6'
      }}
    >
      <CircularProgress />
      <Typography>Connecting to Slack...</Typography>
    </Box>
  );
};

export default SlackCallback;
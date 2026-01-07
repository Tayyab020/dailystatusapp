// src/components/SlackCallback.jsx

import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const SlackCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      // Send error to parent window
      window.opener.postMessage({
        type: 'slack-oauth-error',
        error: error
      }, window.location.origin);
      window.close();
      return;
    }
    
    if (code) {
      // Send code to parent window
      window.opener.postMessage({
        type: 'slack-oauth-success',
        code: code
      }, window.location.origin);
      window.close();
    }
  }, []);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography>Connecting to Slack...</Typography>
    </Box>
  );
};

export default SlackCallback;
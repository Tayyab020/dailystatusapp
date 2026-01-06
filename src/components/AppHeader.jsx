import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge
} from '@mui/material';
import {
  Settings as SettingsIcon,
  History as HistoryIcon,
  NotificationsNone as NotificationIcon
} from '@mui/icons-material';
import Settings from './Settings';
import MessageHistory from './MessageHistory';
import { getHistory } from '../services/storageService';

const AppHeader = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const history = getHistory();
  const historyCount = history.length;

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C65 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Typography variant="h5" sx={{ color: 'white' }}>
                📨
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  lineHeight: 1.2,
                }}
              >
                Daily Check-In
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.7rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Quick & Easy Status Updates
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              color="inherit" 
              onClick={() => setOpenHistory(true)}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Badge badgeContent={historyCount} color="secondary" max={99}>
                <HistoryIcon />
              </Badge>
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={() => setOpenSettings(true)}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Settings open={openSettings} onClose={() => setOpenSettings(false)} />
      <MessageHistory open={openHistory} onClose={() => setOpenHistory(false)} />
    </>
  );
};

export default AppHeader;
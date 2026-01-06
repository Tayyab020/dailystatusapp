import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import {
  Settings as SettingsIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import Settings from './Settings';
import MessageHistory from './MessageHistory';

const AppHeader = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📨 Check-In Messenger
          </Typography>
          <Box>
            <IconButton color="inherit" onClick={() => setOpenHistory(true)}>
              <HistoryIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setOpenSettings(true)}>
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
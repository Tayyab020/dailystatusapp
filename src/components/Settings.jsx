// src/components/Settings.jsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import GmailAuth from './GmailAuth';
import SlackAuth from './SlackAuth';
import { useApp } from '../context/AppContext';
import { isValidEmail, isValidChannelId } from '../utils/validators';

const Settings = ({ open, onClose }) => {
  const { settings, saveSettings, showNotification } = useApp();
  const [formData, setFormData] = useState(settings);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!isValidEmail(formData.attendanceEmail)) {
      newErrors.attendanceEmail = 'Invalid email address';
    }

    if (formData.slackChannelId && !isValidChannelId(formData.slackChannelId)) {
      newErrors.slackChannelId = 'Invalid channel ID (should start with C or D)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showNotification('Please fix the errors', 'error');
      return;
    }

    saveSettings(formData);
    showNotification('Settings saved successfully!', 'success');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>⚙️ Settings</DialogTitle>

      <DialogContent>
        {/* Gmail Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            📧 Gmail Account
          </Typography>
          <GmailAuth />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Slack Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            💬 Slack Account
          </Typography>
          <SlackAuth />
          
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Channel ID"
              value={formData.slackChannelId}
              onChange={(e) => handleChange('slackChannelId', e.target.value)}
              placeholder="C1234567890 or D1234567890"
              error={Boolean(errors.slackChannelId)}
              helperText={errors.slackChannelId || 'Found in channel details in Slack'}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Attendance Email */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            📨 Attendance Email
          </Typography>
          <TextField
            fullWidth
            value={formData.attendanceEmail}
            onChange={(e) => handleChange('attendanceEmail', e.target.value)}
            placeholder="attendance@citrusbits.com"
            error={Boolean(errors.attendanceEmail)}
            helperText={errors.attendanceEmail}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Default Location */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">📍 Default Location</FormLabel>
            <RadioGroup
              row
              value={formData.defaultLocation}
              onChange={(e) => handleChange('defaultLocation', e.target.value)}
            >
              <FormControlLabel value="Office" control={<Radio />} label="Office" />
              <FormControlLabel value="Home" control={<Radio />} label="Home" />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} startIcon={<CloseIcon />} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;
// src/components/CheckInForm.jsx

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
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import LocationSelector from './LocationSelector';
import { generateSubject } from '../utils/dateFormatter';
import { sendGmail, isSignedIn } from '../services/gmailService';
import { sendSlackMessage } from '../services/slackService';
import { addToHistory, saveMorningThreadTs, getMorningThreadTs } from '../services/storageService';
import { useApp } from '../context/AppContext';

const CheckInForm = ({ open, onClose, type }) => {
  const { settings, showNotification, gmailUser } = useApp();
  const [location, setLocation] = useState(settings.defaultLocation || 'Office');
  const [reason, setReason] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [loading, setLoading] = useState({ gmail: false, slack: false, both: false });

  const isCheckIn = type === 'check-in';
  const title = isCheckIn ? '🌅 Morning Check-In' : '🌆 Evening Check-Out';

  const subject = generateSubject(type, location, reason);

  const handleClose = () => {
    setLocation(settings.defaultLocation || 'Office');
    setReason('');
    setAdditionalMessage('');
    onClose();
  };

  const handleSendGmail = async () => {
    if (!isSignedIn()) {
      showNotification('Please sign in to Gmail first', 'error');
      return;
    }

    setLoading({ ...loading, gmail: true });

    try {
      const result = await sendGmail(
        settings.attendanceEmail,
        subject,
        additionalMessage
      );

      if (result.success) {
        showNotification('✅ Email sent successfully!', 'success');
        
        // Add to history
        addToHistory({
          type,
          location,
          reason: reason || null,
          additionalMessage: additionalMessage || null,
          sentTo: ['gmail'],
          status: 'success'
        });

        handleClose();
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('Failed to send email', 'error');
    } finally {
      setLoading({ ...loading, gmail: false });
    }
  };

  const handleSendSlack = async () => {
    if (!settings.slackToken || !settings.slackChannelId) {
      showNotification('Please configure Slack in settings', 'error');
      return;
    }

    setLoading({ ...loading, slack: true });

    try {
      // For evening check-out, try to reply to morning thread
      let threadTs = null;
      if (!isCheckIn) {
        threadTs = getMorningThreadTs();
      }

      const result = await sendSlackMessage(
        settings.slackToken,
        settings.slackChannelId,
        subject + (additionalMessage ? `\n\n${additionalMessage}` : ''),
        threadTs
      );

      if (result.success) {
        showNotification('✅ Message sent to Slack!', 'success');
        
        // Save thread timestamp for morning check-in
        if (isCheckIn && result.ts) {
          saveMorningThreadTs(result.ts);
        }

        // Add to history
        addToHistory({
          type,
          location,
          reason: reason || null,
          additionalMessage: additionalMessage || null,
          sentTo: ['slack'],
          status: 'success',
          slackThreadTs: result.ts
        });

        handleClose();
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('Failed to send to Slack', 'error');
    } finally {
      setLoading({ ...loading, slack: false });
    }
  };

  const handleSendBoth = async () => {
    if (!isSignedIn()) {
      showNotification('Please sign in to Gmail first', 'error');
      return;
    }

    if (!settings.slackToken || !settings.slackChannelId) {
      showNotification('Please configure Slack in settings', 'error');
      return;
    }

    setLoading({ ...loading, both: true });

    try {
      // Send to both Gmail and Slack in parallel
      const [gmailResult, slackResult] = await Promise.all([
        sendGmail(settings.attendanceEmail, subject, additionalMessage),
        sendSlackMessage(
          settings.slackToken,
          settings.slackChannelId,
          subject + (additionalMessage ? `\n\n${additionalMessage}` : ''),
          !isCheckIn ? getMorningThreadTs() : null
        )
      ]);

      const gmailSuccess = gmailResult.success;
      const slackSuccess = slackResult.success;

      if (gmailSuccess && slackSuccess) {
        showNotification('✅ Sent to both Gmail and Slack!', 'success');
        
        // Save thread timestamp for morning check-in
        if (isCheckIn && slackResult.ts) {
          saveMorningThreadTs(slackResult.ts);
        }

        // Add to history
        addToHistory({
          type,
          location,
          reason: reason || null,
          additionalMessage: additionalMessage || null,
          sentTo: ['gmail', 'slack'],
          status: 'success',
          slackThreadTs: slackResult.ts
        });

        handleClose();
      } else if (gmailSuccess) {
        showNotification('⚠️ Email sent, but Slack failed', 'warning');
      } else if (slackSuccess) {
        showNotification('⚠️ Slack sent, but email failed', 'warning');
      } else {
        showNotification('❌ Failed to send to both', 'error');
      }
    } catch (error) {
      showNotification('Failed to send messages', 'error');
    } finally {
      setLoading({ ...loading, both: false });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {title}
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
          To: {settings.attendanceEmail}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Subject Preview:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              p: 1.5,
              bgcolor: 'grey.100',
              borderRadius: 1,
              whiteSpace: 'pre-line'
            }}
          >
            {subject}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <LocationSelector
          location={location}
          setLocation={setLocation}
          reason={reason}
          setReason={setReason}
          savedReasons={settings.savedReasons}
        />

        <TextField
          fullWidth
          label="Additional Message (optional)"
          placeholder="Any additional details..."
          value={additionalMessage}
          onChange={(e) => setAdditionalMessage(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Button
          onClick={handleClose}
          startIcon={<CloseIcon />}
          color="inherit"
        >
          Cancel
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          onClick={handleSendGmail}
          startIcon={loading.gmail ? <CircularProgress size={16} /> : <EmailIcon />}
          disabled={loading.gmail || loading.both}
        >
          {loading.gmail ? 'Sending...' : 'Gmail'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleSendSlack}
          startIcon={loading.slack ? <CircularProgress size={16} /> : <SendIcon />}
          disabled={loading.slack || loading.both}
        >
          {loading.slack ? 'Sending...' : 'Slack'}
        </Button>

        <Button
          variant="contained"
          onClick={handleSendBoth}
          startIcon={loading.both ? <CircularProgress size={16} /> : <SendIcon />}
          disabled={loading.gmail || loading.slack || loading.both}
        >
          {loading.both ? 'Sending...' : 'Send Both'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckInForm;
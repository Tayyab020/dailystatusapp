
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Email as EmailIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { getHistory, clearHistory } from '../services/storageService';
import { useApp } from '../context/AppContext';

const MessageHistory = ({ open, onClose }) => {
  const { showNotification } = useApp();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (open) {
      setHistory(getHistory());
    }
  }, [open]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      setHistory([]);
      showNotification('History cleared', 'info');
    }
  };

  const handleCopy = (message) => {
    const text = `${message.type === 'check-in' ? 'Check-In' : 'Check-Out'} - ${message.location}${
      message.reason ? `\nReason: ${message.reason}` : ''
    }${message.additionalMessage ? `\n\n${message.additionalMessage}` : ''}`;
    
    navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard', 'success');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        📜 Message History
        {history.length > 0 && (
          <Button
            size="small"
            color="error"
            onClick={handleClearAll}
            sx={{ float: 'right' }}
          >
            Clear All
          </Button>
        )}
      </DialogTitle>

      <DialogContent>
        {history.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No messages yet. Send your first check-in!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {history.map((message) => (
              <Card key={message.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {message.sentTo.includes('gmail') && (
                        <EmailIcon fontSize="small" color="primary" />
                      )}
                      {message.sentTo.includes('slack') && (
                        <SendIcon fontSize="small" color="secondary" />
                      )}
                      <Chip
                        label={message.type === 'check-in' ? '🌅 Check-In' : '🌆 Check-Out'}
                        size="small"
                        color={message.type === 'check-in' ? 'primary' : 'secondary'}
                      />
                      <Chip label={message.location} size="small" variant="outlined" />
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleCopy(message)}>
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {message.type === 'check-in' ? 'Check-In' : 'Check-Out'} from {message.location}
                    {message.reason && (
                      <>
                        <br />
                        <em>Reason: {message.reason}</em>
                      </>
                    )}
                  </Typography>

                  {message.additionalMessage && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {message.additionalMessage}
                      </Typography>
                    </>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {formatDate(message.timestamp)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageHistory;
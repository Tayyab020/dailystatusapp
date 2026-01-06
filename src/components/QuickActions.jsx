// src/components/QuickActions.jsx

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip
} from '@mui/material';
import {
WbSunny as MorningIcon,
NightsStay as EveningIcon
} from '@mui/icons-material';
import { formatDateTime, getTimeOfDay } from '../utils/dateFormatter';
import CheckInForm from './CheckInForm';
const QuickActions = () => {
const [openDialog, setOpenDialog] = useState(null);
const timeOfDay = getTimeOfDay();
const currentDateTime = formatDateTime();
return (
<Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
<Box sx={{ mb: 3, textAlign: 'center' }}>
<Typography variant="h6" gutterBottom>
📨 Daily Check-In
</Typography>
<Typography variant="body2" color="text.secondary">
{currentDateTime}
</Typography>
{timeOfDay === 'morning' && (
<Chip
label="Suggested: Morning Check-In"
color="primary"
size="small"
sx={{ mt: 1 }}
/>
)}
{timeOfDay === 'evening' && (
<Chip
label="Suggested: Evening Check-Out"
color="secondary"
size="small"
sx={{ mt: 1 }}
/>
)}
</Box>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Card
      elevation={timeOfDay === 'morning' ? 3 : 1}
      sx={{
        border: timeOfDay === 'morning' ? 2 : 0,
        borderColor: 'primary.main'
      }}
    >
      <CardActionArea onClick={() => setOpenDialog('check-in')}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <MorningIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" gutterBottom>
            Morning Check-In
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Email to attendance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Post to Slack
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card
      elevation={timeOfDay === 'evening' ? 3 : 1}
      sx={{
        border: timeOfDay === 'evening' ? 2 : 0,
        borderColor: 'secondary.main'
      }}
    >
      <CardActionArea onClick={() => setOpenDialog('check-out')}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <EveningIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
          <Typography variant="h5" gutterBottom>
            Evening Check-Out
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Email to attendance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Reply on Slack
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Box>

  {openDialog && (
    <CheckInForm
      open={Boolean(openDialog)}
      onClose={() => setOpenDialog(null)}
      type={openDialog}
    />
  )}
</Box>
);
};
export default QuickActions;

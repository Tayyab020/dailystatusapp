// src/components/LocationSelector.jsx

import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
  Typography,
  Card,
  CardActionArea
} from '@mui/material';
import {
  Business as OfficeIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const LocationSelector = ({ location, setLocation, reason, setReason, savedReasons = [] }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
        📍 Select Location
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Card
          elevation={location === 'Office' ? 3 : 1}
          sx={{
            flex: 1,
            border: location === 'Office' ? '2px solid' : '1px solid',
            borderColor: location === 'Office' ? 'primary.main' : 'divider',
            borderRadius: 2,
            background: location === 'Office' ? 'white' : '#FAF0E6',
            transition: 'all 0.2s',
          }}
        >
          <CardActionArea onClick={() => setLocation('Office')}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <OfficeIcon 
                sx={{ 
                  fontSize: 32, 
                  color: location === 'Office' ? 'primary.main' : 'text.secondary',
                  mb: 1,
                }} 
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: location === 'Office' ? 700 : 500,
                  color: location === 'Office' ? 'primary.main' : 'text.secondary',
                }}
              >
                Office
              </Typography>
            </Box>
          </CardActionArea>
        </Card>

        <Card
          elevation={location === 'Home' ? 3 : 1}
          sx={{
            flex: 1,
            border: location === 'Home' ? '2px solid' : '1px solid',
            borderColor: location === 'Home' ? 'primary.main' : 'divider',
            borderRadius: 2,
            background: location === 'Home' ? 'white' : '#FAF0E6',
            transition: 'all 0.2s',
          }}
        >
          <CardActionArea onClick={() => setLocation('Home')}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <HomeIcon 
                sx={{ 
                  fontSize: 32, 
                  color: location === 'Home' ? 'primary.main' : 'text.secondary',
                  mb: 1,
                }} 
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: location === 'Home' ? 700 : 500,
                  color: location === 'Home' ? 'primary.main' : 'text.secondary',
                }}
              >
                Home
              </Typography>
            </Box>
          </CardActionArea>
        </Card>
      </Box>

      {location === 'Home' && (
        <TextField
          fullWidth
          label="💭 Reason (optional)"
          placeholder="e.g., Not feeling well, Doctor appointment..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          rows={2}
          helperText="Optional: Provide a reason for working from home"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'white',
            },
          }}
        />
      )}
    </Box>
  );
};

export default LocationSelector;
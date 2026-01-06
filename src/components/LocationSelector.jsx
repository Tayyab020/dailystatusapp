// src/components/LocationSelector.jsx

import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box
} from '@mui/material';

const LocationSelector = ({ location, setLocation, reason, setReason, savedReasons = [] }) => {
  return (
    <Box>
      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <FormLabel component="legend">Location</FormLabel>
        <RadioGroup
          row
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <FormControlLabel value="Office" control={<Radio />} label="Office" />
          <FormControlLabel value="Home" control={<Radio />} label="Home" />
        </RadioGroup>
      </FormControl>

      {location === 'Home' && (
        <TextField
          fullWidth
          label="Reason (optional)"
          placeholder="e.g., Not feeling well"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          rows={2}
          helperText="Optional: Provide a reason for working from home"
          sx={{ mb: 2 }}
        />
      )}
    </Box>
  );
};

export default LocationSelector;
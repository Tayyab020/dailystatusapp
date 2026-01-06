import React, { useState } from "react";
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
  Radio,
} from "@mui/material";
import { Save as SaveIcon, Close as CloseIcon } from "@mui/icons-material";
import GmailAuth from "./GmailAuth";
import { useApp } from "../context/AppContext";
import {
  isValidEmail,
  isValidSlackToken,
  isValidChannelId,
} from "../utils/validators";

const Settings = ({ open, onClose }) => {
  const { settings, saveSettings, showNotification } = useApp();
  const [formData, setFormData] = useState(settings);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!isValidEmail(formData.attendanceEmail)) {
      newErrors.attendanceEmail = "Invalid email address";
    }

    if (formData.slackToken && !isValidSlackToken(formData.slackToken)) {
      newErrors.slackToken =
        "Invalid Slack token (should start with xoxp- or xoxb-)";
    }

    if (formData.slackChannelId && !isValidChannelId(formData.slackChannelId)) {
      newErrors.slackChannelId =
        "Invalid channel ID (should start with C or D)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showNotification("Please fix the errors", "error");
      return;
    }

    saveSettings(formData);
    showNotification("Settings saved successfully!", "success");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #FF6B35 0%, #FF8C65 100%)",
          color: "white",
          py: 2.5,
          px: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          ⚙️ Settings
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3, background: "#FAF0E6" }}>
        {/* Gmail Section */}
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            marginTop: "23px",
            background: "white",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
          >
            📧 Gmail Account
          </Typography>
          <GmailAuth />
        </Box>

        {/* Attendance Email */}
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            background: "white",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
          >
            📨 Attendance Email
          </Typography>
          <TextField
            fullWidth
            value={formData.attendanceEmail}
            onChange={(e) => handleChange("attendanceEmail", e.target.value)}
            placeholder="attendance@citrusbits.com"
            error={Boolean(errors.attendanceEmail)}
            helperText={errors.attendanceEmail}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Slack Configuration */}
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            background: "white",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
          >
            💬 Slack Configuration
          </Typography>

          <TextField
            fullWidth
            label="User OAuth Token"
            value={formData.slackToken}
            onChange={(e) => handleChange("slackToken", e.target.value)}
            placeholder="xoxp-..."
            error={Boolean(errors.slackToken)}
            helperText={errors.slackToken || "Get this from api.slack.com/apps"}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            type="password"
          />

          <TextField
            fullWidth
            label="Channel ID"
            value={formData.slackChannelId}
            onChange={(e) => handleChange("slackChannelId", e.target.value)}
            placeholder="C1234567890 or D1234567890"
            error={Boolean(errors.slackChannelId)}
            helperText={errors.slackChannelId || "Found in channel details"}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Default Location */}
        <Box
          sx={{
            mb: 2,
            p: 2.5,
            background: "white",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <FormControl component="fieldset" fullWidth>
            <FormLabel
              component="legend"
              sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
            >
              📍 Default Location
            </FormLabel>
            <RadioGroup
              row
              value={formData.defaultLocation}
              onChange={(e) => handleChange("defaultLocation", e.target.value)}
              sx={{ gap: 2 }}
            >
              <FormControlLabel
                value="Office"
                control={<Radio sx={{ color: "primary.main" }} />}
                label="Office"
                sx={{
                  flex: 1,
                  m: 0,
                  p: 1.5,
                  borderRadius: 2,
                  border:
                    formData.defaultLocation === "Office"
                      ? "2px solid"
                      : "1px solid",
                  borderColor:
                    formData.defaultLocation === "Office"
                      ? "primary.main"
                      : "divider",
                  background:
                    formData.defaultLocation === "Office"
                      ? "rgba(255, 107, 53, 0.08)"
                      : "transparent",
                }}
              />
              <FormControlLabel
                value="Home"
                control={<Radio sx={{ color: "primary.main" }} />}
                label="Home"
                sx={{
                  flex: 1,
                  m: 0,
                  p: 1.5,
                  borderRadius: 2,
                  border:
                    formData.defaultLocation === "Home"
                      ? "2px solid"
                      : "1px solid",
                  borderColor:
                    formData.defaultLocation === "Home"
                      ? "primary.main"
                      : "divider",
                  background:
                    formData.defaultLocation === "Home"
                      ? "rgba(255, 107, 53, 0.08)"
                      : "transparent",
                }}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3, pt: 2, background: "#FAF0E6", gap: 1.5 }}
      >
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          sx={{
            color: "text.secondary",
            borderRadius: 2,
            px: 2,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            borderRadius: 2,
            background: "linear-gradient(135deg, #FF6B35 0%, #FF8C65 100%)",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #E55A2B 0%, #FF6B35 100%)",
              boxShadow: "0 6px 16px rgba(255, 107, 53, 0.4)",
            },
          }}
        >
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;

// src/components/GmailAuth.jsx

import React, { useState } from "react";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { signInGmail, signOutGmail } from "../services/gmailService";
import { useApp } from "../context/AppContext";

const GmailAuth = () => {
  const { gmailUser, updateGmailUser, showNotification } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInGmail();
      if (result.success) {
        updateGmailUser(result.user);
        showNotification("Signed in to Gmail successfully!", "success");
      } else {
        showNotification(result.error, "error");
      }
    } catch (error) {
      showNotification("Failed to sign in to Gmail", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const result = await signOutGmail();
      if (result.success) {
        updateGmailUser(null);
        showNotification("Signed out from Gmail", "info");
      } else {
        showNotification(result.error, "error");
      }
    } catch (error) {
      showNotification("Failed to sign out", "error");
    } finally {
      setLoading(false);
    }
  };

  if (gmailUser) {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            borderRadius: 2,
            background: "rgba(255, 107, 53, 0.08)",
            flex: 1,
            minWidth: 200,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF6B35 0%, #FF8C65 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GoogleIcon sx={{ fontSize: 18, color: "white" }} />
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontWeight: 500, flex: 1 }}
          >
            {gmailUser}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="medium"
          onClick={handleSignOut}
          disabled={loading}
          sx={{
            borderRadius: 2,
            borderColor: "primary.main",
            color: "primary.main",
            fontWeight: 600,
            "&:hover": {
              borderColor: "primary.dark",
              background: "rgba(255, 107, 53, 0.08)",
            },
          }}
        >
          {loading ? <CircularProgress size={20} /> : "Logout"}
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <GoogleIcon />
        )
      }
      onClick={handleSignIn}
      disabled={loading}
      fullWidth
      sx={{
        borderRadius: 2,
        background: "linear-gradient(135deg, #4285f4 0%, #357ae8 100%)",
        fontWeight: 600,
        py: 1.5,
        boxShadow: "0 4px 12px rgba(66, 133, 244, 0.3)",
        "&:hover": {
          background: "linear-gradient(135deg, #357ae8 0%, #2E6BD9 100%)",
          boxShadow: "0 6px 16px rgba(66, 133, 244, 0.4)",
        },
      }}
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
};

export default GmailAuth;

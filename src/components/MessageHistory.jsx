import React, { useState, useEffect } from "react";
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
  Chip,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { getHistory, clearHistory } from "../services/storageService";
import { useApp } from "../context/AppContext";

const MessageHistory = ({ open, onClose }) => {
  const { showNotification } = useApp();
  const [history, setHistory] = useState(() => getHistory());

  useEffect(() => {
    if (open) {
      // Refresh history when dialog opens using requestAnimationFrame to avoid synchronous setState
      requestAnimationFrame(() => {
        setHistory(getHistory());
      });
    }
  }, [open]);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      clearHistory();
      setHistory([]);
      showNotification("History cleared", "info");
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
          py: 2,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            📜 Message History
          </Typography>
          {history.length > 0 && (
            <Button
              size="small"
              onClick={handleClearAll}
              sx={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                },
              }}
              variant="outlined"
            >
              Clear All
            </Button>
          )}
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ px: 2, py: 2, background: "#FAF0E6", minHeight: 400 }}
      >
        {history.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Send your first check-in to see it here!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {history.map((message) => (
              <Card
                key={message.id}
                sx={{
                  background: "white",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s",
                  mt: 2,
                  "&:first-of-type": {
                    mt: 0,
                  },
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={
                        message.type === "check-in"
                          ? "🌅 Check-In"
                          : "🌆 Check-Out"
                      }
                      size="small"
                      sx={{
                        background:
                          message.type === "check-in"
                            ? "linear-gradient(135deg, #FF6B35 0%, #FF8C65 100%)"
                            : "linear-gradient(135deg, #8B6F47 0%, #A6896D 100%)",
                        color: "white",
                        fontWeight: 600,
                        height: 24,
                      }}
                    />
                    <Chip
                      label={message.location}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        fontWeight: 500,
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 0.5, ml: 0.5 }}>
                      {message.sentTo.includes("gmail") && (
                        <EmailIcon
                          fontSize="small"
                          sx={{ color: "primary.main" }}
                        />
                      )}
                      {message.sentTo.includes("slack") && (
                        <SendIcon
                          fontSize="small"
                          sx={{ color: "primary.main" }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: "text.primary", fontWeight: 500 }}
                  >
                    {message.type === "check-in" ? "Check-In" : "Check-Out"}{" "}
                    from {message.location}
                    {message.reason && (
                      <>
                        <br />
                        <Box
                          component="span"
                          sx={{
                            color: "text.secondary",
                            fontStyle: "italic",
                            fontSize: "0.875rem",
                          }}
                        >
                          Reason: {message.reason}
                        </Box>
                      </>
                    )}
                  </Typography>

                  {message.additionalMessage && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "pre-line" }}
                      >
                        {message.additionalMessage}
                      </Typography>
                    </>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      display: "block",
                      fontSize: "0.75rem",
                    }}
                  >
                    {formatDate(message.timestamp)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 2, background: "#FAF0E6" }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: 2,
            px: 2,
            color: "text.secondary",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageHistory;

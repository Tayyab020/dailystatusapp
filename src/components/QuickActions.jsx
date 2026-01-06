// src/components/QuickActions.jsx

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import {
  WbSunny as MorningIcon,
  NightsStay as EveningIcon,
  Email as EmailIcon,
  Send as SlackIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { formatDateTime, getTimeOfDay } from "../utils/dateFormatter";
import CheckInForm from "./CheckInForm";

const QuickActions = () => {
  const [openDialog, setOpenDialog] = useState(null);
  const timeOfDay = getTimeOfDay();
  const currentDateTime = formatDateTime();

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: { xs: 2, sm: 3 },
        pb: 4,
        flex: 1,
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 1,
          }}
        >
          {timeOfDay === "morning" ? "🌅 Good Morning!" : "🌆 Good Evening!"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {currentDateTime}
        </Typography>
        {timeOfDay === "morning" && (
          <Chip
            icon={<Box sx={{ fontSize: 16 }}>🌅</Box>}
            label="Suggested: Morning Check-In"
            sx={{
              background: "rgba(255, 107, 53, 0.15)",
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 32,
              px: 1.5,
              "& .MuiChip-icon": {
                marginLeft: 1,
                marginRight: -0.5,
              },
            }}
          />
        )}
        {timeOfDay === "evening" && (
          <Chip
            icon={<Box sx={{ fontSize: 16 }}>🌆</Box>}
            label="Suggested: Evening Check-Out"
            sx={{
              background: "rgba(255, 107, 53, 0.15)",
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 32,
              px: 1.5,
              "& .MuiChip-icon": {
                marginLeft: 1,
                marginRight: -0.5,
              },
            }}
          />
        )}
      </Box>

      {/* Action Cards */}
      <Stack spacing={3}>
        {/* Morning Check-In Card */}
        <Card
          elevation={timeOfDay === "morning" ? 4 : 2}
          sx={{
            background:
              timeOfDay === "morning"
                ? "linear-gradient(135deg, #FFFFFF 0%, #FAF0E6 100%)"
                : "#FFFFFF",
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: 3,
            overflow: "hidden",
            transition: "all 0.3s ease",
            minHeight: { xs: 140, sm: 150 },
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(255, 107, 53, 0.2)",
              borderColor: "primary.dark",
            },
          }}
        >
          <CardActionArea onClick={() => setOpenDialog("check-in")}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2.5,
                    background:
                      "linear-gradient(135deg, #FF6B35 0%, #FF8C65 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(255, 107, 53, 0.35)",
                    flexShrink: 0,
                  }}
                >
                  <MorningIcon sx={{ fontSize: 36, color: "white" }} />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      mb: 0.5,
                    }}
                  >
                    Morning Check-In
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mb: 1.5,
                    }}
                  >
                    Start your day
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                        background: "rgba(255, 107, 53, 0.1)",
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 16, color: "primary.main" }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.7rem", fontWeight: 500 }}
                      >
                        Email
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                        background: "rgba(255, 107, 53, 0.1)",
                      }}
                    >
                      <SlackIcon sx={{ fontSize: 16, color: "primary.main" }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.7rem", fontWeight: 500 }}
                      >
                        Slack
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Arrow */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(255, 107, 53, 0.1)",
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <ArrowIcon sx={{ fontSize: 20, color: "primary.main" }} />
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Evening Check-Out Card */}
        <Card
          elevation={timeOfDay === "evening" ? 4 : 2}
          sx={{
            background:
              timeOfDay === "evening"
                ? "linear-gradient(135deg, #FFFFFF 0%, #FAF0E6 100%)"
                : "#FFFFFF",
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: 3,
            overflow: "hidden",
            transition: "all 0.3s ease",
            minHeight: { xs: 140, sm: 150 },
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(255, 107, 53, 0.2)",
              borderColor: "primary.dark",
            },
          }}
        >
          <CardActionArea onClick={() => setOpenDialog("check-out")}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2.5,
                    background:
                      "linear-gradient(135deg, #8B6F47 0%, #A6896D 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(139, 111, 71, 0.35)",
                    flexShrink: 0,
                  }}
                >
                  <EveningIcon sx={{ fontSize: 36, color: "white" }} />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      mb: 0.5,
                    }}
                  >
                    Evening Check-Out
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mb: 1.5,
                    }}
                  >
                    End your day
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                        background: "rgba(255, 107, 53, 0.1)",
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 16, color: "primary.main" }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.7rem", fontWeight: 500 }}
                      >
                        Email
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                        background: "rgba(255, 107, 53, 0.1)",
                      }}
                    >
                      <SlackIcon sx={{ fontSize: 16, color: "primary.main" }} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.7rem", fontWeight: 500 }}
                      >
                        Reply on Slack
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Arrow */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(255, 107, 53, 0.1)",
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <ArrowIcon sx={{ fontSize: 20, color: "primary.main" }} />
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>

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

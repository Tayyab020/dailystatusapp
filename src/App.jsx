import React from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import AppHeader from "./components/AppHeader";
import QuickActions from "./components/QuickActions";
import { AppProvider, useApp } from "./context/AppContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SlackCallback from "./components/SlackCallback";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6B35", // Vibrant orange
      light: "#FF8C65",
      dark: "#E55A2B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F5E6D3", // Warm beige/cream
      light: "#FAF0E6",
      dark: "#E8D4B8",
      contrastText: "#5C4033",
    },
    background: {
      default: "#FAF0E6", // Cream background
      paper: "#FFFFFF", // White cards
    },
    text: {
      primary: "#5C4033", // Dark brown for text
      secondary: "#8B6F47", // Lighter brown for secondary text
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});
function AppContent() {
  const { notification, closeNotification } = useApp();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/slack/callback" element={<SlackCallback />} />
        <Route
          path="/"
          element={
            <>
              <AppHeader />
              <QuickActions />
            </>
          }
        />
      </Routes>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

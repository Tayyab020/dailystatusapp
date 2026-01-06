import React from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Alert,
} from "@mui/material";
import AppHeader from "./components/AppHeader";
import QuickActions from "./components/QuickActions";
import { AppProvider, useApp } from "./context/AppContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function AppContent() {
  const { notification, closeNotification } = useApp();

  return (
    <>
      <AppHeader />
      <QuickActions />

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
    </>
  );
}
// src/App.js - Add at the top of the file

// ... existing code ...

console.log("Environment variables check:");
console.log("CLIENT_ID:", import.meta.env.VITE_GMAIL_CLIENT_ID);
console.log("SLACK_TOKEN:", import.meta.env.VITE_APP_SLACK_TOKEN);
console.log("All env vars:", import.meta.env);

// ... existing code ...

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

// src/services/gmailService.js

let gapiClient = null;
let isGapiLoaded = false;
let accessToken = null;
let currentUserEmail = null;

/**
 * Load Google Identity Services script
 */
const loadGoogleIdentityServices = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
};

/**
 * Load GAPI client library (for Gmail API calls)
 */
const loadGapiClient = () => {
  return new Promise((resolve, reject) => {
    if (isGapiLoaded && window.gapi?.client) {
      resolve();
      return;
    }

    if (window.gapi?.load) {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
            ],
          });
          isGapiLoaded = true;
          gapiClient = window.gapi.client;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
            ],
          });
          isGapiLoaded = true;
          gapiClient = window.gapi.client;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = () => reject(new Error("Failed to load GAPI"));
    document.body.appendChild(script);
  });
};

/**
 * Initialize Gmail API (loads both libraries)
 */
export const initGmailApi = async () => {
  try {
    await Promise.all([
      loadGoogleIdentityServices(),
      loadGapiClient(),
    ]);
    console.log("Gmail API initialized successfully");
  } catch (error) {
    console.error("Gmail API init error:", error);
    throw error;
  }
};

/**
 * Sign in to Gmail using Google Identity Services
 */
export const signInGmail = async () => {
  try {
    // Initialize APIs if needed
    await initGmailApi();

    return new Promise((resolve, reject) => {
      const clientId = import.meta.env.VITE_GMAIL_CLIENT_ID;
      
      if (!clientId) {
        reject(new Error("Gmail Client ID not configured"));
        return;
      }

      // Use Google Identity Services to get access token
      window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/gmail.send",
        callback: async (response) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          accessToken = response.access_token;
          
          // Set the access token for gapi.client
          if (gapiClient) {
            gapiClient.setToken({ access_token: accessToken });
          }

          // Get user info
          try {
            const profileResponse = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
            );
            const profile = await profileResponse.json();
            currentUserEmail = profile.email;

            resolve({
              success: true,
              user: currentUserEmail,
            });
          } catch (error) {
            // If we can't get email, still resolve with success
            resolve({
              success: true,
              user: "user@example.com", // fallback
            });
          }
        },
      }).requestAccessToken();
    });
  } catch (error) {
    console.error("Gmail sign in error:", error);
    
    if (error.error === "popup_closed_by_user" || error.error === "access_denied") {
      return {
        success: false,
        error: "Sign in cancelled",
      };
    }

    return {
      success: false,
      error: error.details || error.message || "Failed to sign in",
    };
  }
};

/**
 * Sign out from Gmail
 */
export const signOutGmail = async () => {
  try {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {
        console.log("Access token revoked");
      });
    }
    
    accessToken = null;
    currentUserEmail = null;
    
    if (gapiClient) {
      gapiClient.setToken(null);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Gmail sign out error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user is signed in
 */
export const isSignedIn = () => {
  return !!accessToken;
};

/**
 * Get current user email
 */
export const getCurrentUserEmail = () => {
  return currentUserEmail;
};

/**
 * Create email in RFC 2822 format
 */
const createEmail = (to, subject, body) => {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    body || "",
  ].join("\r\n");

  // Base64 encode (URL-safe)
  const base64 = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return base64;
};

/**
 * Send email via Gmail API
 */
export const sendGmail = async (to, subject, body = "") => {
  try {
    if (!isSignedIn()) {
      throw new Error("Not signed in to Gmail");
    }

    if (!gapiClient) {
      await loadGapiClient();
    }

    // Ensure token is set
    if (accessToken) {
      gapiClient.setToken({ access_token: accessToken });
    }

    const raw = createEmail(to, subject, body);

    const response = await gapiClient.gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: raw,
      },
    });

    return {
      success: true,
      messageId: response.result.id,
      message: "Email sent successfully!",
    };
  } catch (error) {
    console.error("Gmail send error:", error);
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};
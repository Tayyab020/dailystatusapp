// src/services/slackService.js

// API base URL - defaults to relative path (works with Vercel serverless functions)
const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Send message to Slack via backend proxy
 */
export const sendSlackMessage = async (
  token,
  channelId,
  text,
  threadTs = null
) => {
  try {
    const response = await fetch(`${API_URL}/slack/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        channelId,
        text,
        threadTs,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to send Slack message");
    }

    return {
      success: true,
      ts: data.ts, // Message timestamp (for threading)
      message: data.message || "Message sent to Slack successfully!",
    };
  } catch (error) {
    console.error("Slack error:", error);
    return {
      success: false,
      error: error.message || "Failed to send to Slack",
    };
  }
};

/**
 * Test Slack connection via backend proxy
 */
export const testSlackConnection = async (token) => {
  try {
    const response = await fetch(`${API_URL}/slack/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error("Slack test error:", error);
    return false;
  }
};

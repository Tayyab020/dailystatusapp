export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { token, channelId, text, threadTs } = req.body;

    // Validate required parameters
    if (!token || !channelId || !text) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required parameters: token, channelId, and text are required",
      });
    }

    // Build payload for Slack API
    const payload = {
      channel: channelId,
      text: text,
    };

    // Add thread timestamp if provided (for replying to threads)
    if (threadTs) {
      payload.thread_ts = threadTs;
    }

    // Forward request to Slack API
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Check if Slack API returned an error
    if (!data.ok) {
      return res.status(400).json({
        success: false,
        error: data.error || "Failed to send Slack message",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      ts: data.ts, // Message timestamp (for threading)
      message: "Message sent to Slack successfully!",
    });
  } catch (error) {
    console.error("Slack API proxy error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}

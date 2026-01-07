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
    const { code, redirectUri } = req.body;

    // Validate required parameters
    if (!code || !redirectUri) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: code and redirectUri are required",
      });
    }

    // Get client credentials from environment (backend only - never exposed to frontend)
    // In Node.js/Vercel, process.env is always available
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        success: false,
        error: "Server configuration error: Slack credentials not configured",
      });
    }

    // Exchange code for token via Slack API
    const response = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        error: data.error || "Failed to exchange code for token",
      });
    }

    // Return token and user info (but NOT the client secret)
    return res.status(200).json({
      success: true,
      token: data.authed_user.access_token,
      userId: data.authed_user.id,
      teamId: data.team.id,
      teamName: data.team.name,
    });
  } catch (error) {
    console.error("Slack OAuth exchange error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
    const { token } = req.body;

    // Validate required parameters
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameter: token",
      });
    }

    // Get user info from Slack API via backend (avoids CORS)
    const response = await fetch("https://slack.com/api/users.identity", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        error: data.error || "Failed to get user info",
      });
    }

    // Return user info
    return res.status(200).json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error("Slack user info error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { token } = req.body;

    // Validate required parameters
    if (!token) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameter: token' 
      });
    }

    // Forward request to Slack API auth.test endpoint
    const response = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Return test result
    return res.status(200).json({ 
      success: data.ok || false 
    });
  } catch (error) {
    console.error('Slack test proxy error:', error);
    return res.status(200).json({ 
      success: false 
    });
  }
}

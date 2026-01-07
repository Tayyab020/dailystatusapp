// src/services/slackService.js

let slackToken = null;
let slackUserId = null;

/**
 * Start Slack OAuth flow
 */
export const initiateSlackOAuth = () => {
  const clientId = import.meta.env.VITE_APP_SLACK_CLIENT_ID;
  // Ensure redirect URI is clean and properly formatted
  const redirectUri = `${window.location.origin}/slack/callback`.replace(/\/+$/, '');
  const scopes = 'chat:write,users:read';
  
  // Build URL with proper encoding
  const params = new URLSearchParams({
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri
  });
  
  const authUrl = `https://slack.com/oauth/v2/authorize?${params.toString()}`;
  
  // Open in popup
  const width = 600;
  const height = 700;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  
  const popup = window.open(
    authUrl,
    'Slack OAuth',
    `width=${width},height=${height},left=${left},top=${top}`
  );
  
  return new Promise((resolve, reject) => {
    // Listen for callback
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'slack-oauth-success') {
        window.removeEventListener('message', handleMessage);
        resolve(event.data);
      } else if (event.data.type === 'slack-oauth-error') {
        window.removeEventListener('message', handleMessage);
        reject(new Error(event.data.error));
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Check if popup was closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        reject(new Error('OAuth popup was closed'));
      }
    }, 1000);
  });
};

/**
 * Exchange code for token
 */
export const exchangeSlackCode = async (code) => {
  try {
    const clientId = import.meta.env.VITE_APP_SLACK_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_APP_SLACK_CLIENT_SECRET;
    const redirectUri = `${window.location.origin}/slack/callback`;
    
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Failed to exchange code');
    }
    
    // Store token
    slackToken = data.authed_user.access_token;
    slackUserId = data.authed_user.id;
    
    return {
      success: true,
      token: slackToken,
      userId: slackUserId,
      teamId: data.team.id,
      teamName: data.team.name
    };
    
  } catch (error) {
    console.error('Slack OAuth error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get current Slack user info
 */
export const getSlackUserInfo = async (token) => {
  try {
    const response = await fetch('https://slack.com/api/users.identity', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error);
    }
    
    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Sign out from Slack
 */
export const signOutSlack = () => {
  slackToken = null;
  slackUserId = null;
  return { success: true };
};

/**
 * Check if signed in
 */
export const isSlackSignedIn = () => {
  return slackToken !== null;
};

/**
 * Get stored token
 */
export const getSlackToken = () => {
  return slackToken;
};

/**
 * Set token (from storage)
 */
export const setSlackToken = (token) => {
  slackToken = token;
};

/**
 * Send message to Slack
 */
export const sendSlackMessage = async (token, channelId, text, threadTs = null) => {
  try {
    const payload = {
      channel: channelId,
      text: text
    };
    
    if (threadTs) {
      payload.thread_ts = threadTs;
    }
    
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Failed to send Slack message');
    }
    
    return {
      success: true,
      ts: data.ts,
      message: 'Message sent to Slack successfully!'
    };
    
  } catch (error) {
    console.error('Slack error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send to Slack'
    };
  }
};

/**
 * Test Slack connection
 */
export const testSlackConnection = async (token) => {
  try {
    const response = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Slack test error:', error);
    return false;
  }
};
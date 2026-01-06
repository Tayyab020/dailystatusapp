// src/utils/validators.js

/**
 * Validate email address
 */
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  /**
   * Validate Slack token (starts with xoxp- or xoxb-)
   */
  export const isValidSlackToken = (token) => {
    return token && (token.startsWith('xoxp-') || token.startsWith('xoxb-'));
  };
  
  /**
   * Validate Slack channel ID (starts with C or D)
   */
  export const isValidChannelId = (channelId) => {
    return channelId && /^[CD][A-Z0-9]{8,}$/.test(channelId);
  };
  
  /**
   * Validate text length
   */
  export const isValidLength = (text, maxLength) => {
    return text.length <= maxLength;
  };
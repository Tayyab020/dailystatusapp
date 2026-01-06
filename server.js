// Local development server for API routes
// This mimics Vercel serverless functions for local testing
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import and use the serverless function handlers
import messageHandler from './api/slack/message.js';
import testHandler from './api/slack/test.js';

// Convert Vercel handler format to Express
const adaptHandler = (handler) => {
  return async (req, res) => {
    try {
      // Vercel handlers expect req/res objects that are compatible with Express
      // The handler function signature matches Express middleware
      await handler(req, res);
    } catch (error) {
      console.error('Handler error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    }
  };
};

// API routes
app.post('/api/slack/message', adaptHandler(messageHandler));
app.post('/api/slack/test', adaptHandler(testHandler));
app.options('/api/slack/message', (req, res) => res.status(200).end());
app.options('/api/slack/test', (req, res) => res.status(200).end());

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at /api/slack/*`);
});

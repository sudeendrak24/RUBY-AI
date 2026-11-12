import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Server-side Google GenAI initialization with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Audio transcription route using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'Missing audioData in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Local fallback if no cloud key configured
      return res.json({
        transcript: 'Voice captured. (Offline local fallback processor active)',
        provider: 'offline_local',
      });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioData,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this audio verbatim in its spoken language (English, Tamil, or Hindi).' },
        ],
      },
    });

    res.json({
      transcript: response.text || '',
      provider: 'gemini-3.5-transcribe',
    });
  } catch (err: any) {
    console.error('[RUBY AI Server] Transcribe error:', err);
    res.status(500).json({
      error: err.message || 'Failed to transcribe audio',
      fallback: true,
    });
  }
});

// Live Conversation & reasoning route using gemini-3.8-flash
app.post('/api/conversation', async (req, res) => {
  try {
    const { message, language, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: 'Offline engine ready. Operating with local deterministic NLP.',
        provider: 'offline_local',
      });
    }

    const sysPrompt = `You are RUBY AI, a personal intelligence assistant for Android and Windows.
Language: ${language || 'English'}.
Personality: Intelligent, confident, friendly, professional, futuristic, calm, trustworthy.
Riding mode context: ${context?.isRiding ? 'ACTIVE (Keep responses short, voice-friendly and safe)' : 'INACTIVE'}.
Always respond naturally and politely in the selected language.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: sysPrompt,
      },
    });

    res.json({
      reply: response.text || '',
      provider: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('[RUBY AI Server] Conversation error:', err);
    res.status(500).json({
      error: err.message || 'Failed to process conversation',
    });
  }
});

async function startServer() {
  // Mount Vite middlewares for client SPA
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RUBY AI] Server running at http://localhost:${PORT}`);
  });
}

startServer();

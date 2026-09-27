import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  analyzeLinkPayload,
  analyzeMediaPayload,
  healthPayload,
  extractYouTubeVideoId,
  normalizeYouTubeUrl,
  extractInstagramShortcode,
  normalizeInstagramUrl,
  analyzeInstagramPayload,
} from './netlify/lib/analysis.mjs';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Re-export helper for any potential consumer
export {
  extractYouTubeVideoId,
  normalizeYouTubeUrl,
  extractInstagramShortcode,
  normalizeInstagramUrl,
  analyzeInstagramPayload,
};

// API: Health check
app.get('/api/health', (_req, res) => {
  const result = healthPayload();
  res.json({
    ...result,
    runtime: 'ai-studio-express',
  });
});

// API: Social Link Analysis (Canonical shared implementation)
app.post('/api/analyze-link', async (req, res) => {
  try {
    const { url, caption } = req.body;
    const result = await analyzeLinkPayload(url, caption);
    res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('Error in /api/analyze-link:', err);
    res.status(500).json({
      success: false,
      message: 'Link analysis failed on the server.',
      error: err?.message || 'Error processing link',
    });
  }
});

// API: Media Upload Analysis (Canonical shared implementation)
app.post('/api/analyze-media', async (req, res) => {
  try {
    const { mediaBase64, mimeType, caption } = req.body;
    const result = await analyzeMediaPayload(mediaBase64, mimeType, caption);
    res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('Error in /api/analyze-media:', err);
    res.status(500).json({
      success: false,
      message: 'Media analysis failed on the server.',
      error: err?.message || 'Error processing media',
    });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MMT Make It Real Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { analyzeMediaPayload } from '../lib/analysis.mjs';

export default async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  try {
    const body = await req.json();
    const result = await analyzeMediaPayload(body?.mediaBase64, body?.mimeType, body?.caption);
    return Response.json(result.body, { status: result.status });
  } catch (e) {
    console.error('analyze-media function error', e);
    return Response.json({ success: false, error: e?.message || String(e) }, { status: 500 });
  }
};

export const config = { path: '/api/analyze-media' };

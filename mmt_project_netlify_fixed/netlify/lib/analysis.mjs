import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest'];

const destinationAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    country: { type: Type.STRING },
    region_or_state: { type: Type.STRING },
    city_or_destination: { type: Type.STRING },
    specific_place: { type: Type.STRING },
    displayName: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
    evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
    source: { type: Type.STRING },
    travelVibes: { type: Type.ARRAY, items: { type: Type.STRING } },
    experience_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    landmarks: { type: Type.ARRAY, items: { type: Type.STRING } },
    activities: { type: Type.ARRAY, items: { type: Type.STRING } },
    visualHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
    accommodationStyle: { type: Type.STRING },
    summary: { type: Type.STRING },
  },
  required: ['confidence', 'evidence', 'travelVibes', 'activities', 'summary'],
};


// Plain JSON Schema for the Gemini Interactions API. This is intentionally
// separate from the @google/genai Type-based schema used by generateContent.
const destinationAnalysisJsonSchema = {
  type: 'object',
  properties: {
    country: { type: 'string' },
    region_or_state: { type: 'string' },
    city_or_destination: { type: 'string' },
    specific_place: { type: 'string' },
    displayName: { type: 'string' },
    confidence: { type: 'number' },
    evidence: { type: 'array', items: { type: 'string' } },
    source: { type: 'string' },
    travelVibes: { type: 'array', items: { type: 'string' } },
    experience_tags: { type: 'array', items: { type: 'string' } },
    landmarks: { type: 'array', items: { type: 'string' } },
    activities: { type: 'array', items: { type: 'string' } },
    visualHighlights: { type: 'array', items: { type: 'string' } },
    accommodationStyle: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['country', 'region_or_state', 'city_or_destination', 'specific_place', 'displayName', 'confidence', 'evidence', 'source', 'travelVibes', 'experience_tags', 'landmarks', 'activities', 'visualHighlights', 'accommodationStyle', 'summary'],
};

const DESTINATION_PROMPT_INSTRUCTIONS = `You are MakeMyTrip's TripSpark destination and experience detection engine.

Determine location from the supplied travel content. Use this evidence order:
1. explicit location tag / label
2. post title / caption / creator text
3. text overlay in the video or image
4. recognisable landmark
5. architecture, geography, language, transport, cultural markers
6. broader regional visual clues

STRICT RULES:
- Never use a default country or city.
- Never output South Korea / Seoul unless the content itself contains Korea-specific evidence such as Hangul, a Korean location label, or a recognisable Korean landmark.
- Never output dummy geography such as Global, Scenic Region, Unknown Region.
- If the location cannot be identified, leave country/region/city/displayName empty and keep confidence below 35.
- Separate destination detection from experience/vibe detection.
- For generic beach/mountain/city scenery with no unique clues, do not invent a destination.
- Evidence must describe concrete clues actually present in the supplied content.

Return JSON only according to the schema.`;

function cleanAndParseJson(rawText) {
  if (!rawText) return null;
  let text = String(rawText).trim();
  if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
  try { return JSON.parse(text); } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export function extractYouTubeVideoId(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  const shortsMatch = trimmed.match(/(?:youtube\.com|m\.youtube\.com)\/shorts\/([a-zA-Z0-9_-]{5,})/i);
  if (shortsMatch?.[1]) return shortsMatch[1].split(/[?&#]/)[0];
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{5,})/i);
  if (youtuBeMatch?.[1]) return youtuBeMatch[1].split(/[?&#]/)[0];
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{5,})/i);
  if (watchMatch?.[1]) return watchMatch[1].split(/[?&#]/)[0];
  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (u.searchParams.get('v')) return u.searchParams.get('v').split(/[?&#]/)[0];
    if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1]?.split('/')[0] || null;
    if (u.hostname.includes('youtu.be')) return u.pathname.replace(/^\/+/, '').split('/')[0] || null;
  } catch {}
  return null;
}

async function fetchYouTubeMetadata(videoUrl) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return { title: data.title || '', author: data.author_name || '' };
    }
  } catch {}
  return { title: '', author: '' };
}

function heuristicFromText(textHint = '') {
  const lower = textHint.toLowerCase();
  if (lower.includes('north goa') || lower.includes('goa') || lower.includes('anjuna') || lower.includes('vagator')) {
    const isNorth = lower.includes('north goa') || lower.includes('anjuna');
    return {
      country: 'India', region_or_state: 'Goa', city_or_destination: isNorth ? 'North Goa' : 'Goa', specific_place: '',
      displayName: isNorth ? 'North Goa, Goa, India' : 'Goa, India', confidence: 95, source: 'Post text',
      evidence: [`Location wording found in post/title: ${textHint}`], travelVibes: ['Coastal','Relaxing','Food','Nightlife'],
      experience_tags: ['Beach','Coastal','Food','Relaxing'], landmarks: [], activities: ['Beach time','Local food','Sunset'],
      visualHighlights: [], accommodationStyle: 'Boutique coastal stay', summary: 'Goa travel inspiration detected from post text.'
    };
  }
  if (lower.includes('bali') || lower.includes('ubud') || lower.includes('uluwatu') || lower.includes('indonesia')) {
    const city = lower.includes('ubud') ? 'Ubud' : (lower.includes('uluwatu') ? 'Uluwatu' : 'Bali');
    return {
      country: 'Indonesia', region_or_state: 'Bali', city_or_destination: city, specific_place: '',
      displayName: city === 'Bali' ? 'Bali, Indonesia' : `${city}, Bali, Indonesia`, confidence: 92, source: 'Post text',
      evidence: [`Location wording found in post/title: ${textHint}`], travelVibes: ['Beach','Nature','Relaxing','Culture'],
      experience_tags: ['Tropical','Beach','Nature'], landmarks: [], activities: ['Beach','Nature','Local culture'],
      visualHighlights: [], accommodationStyle: 'Boutique / villa stay', summary: 'Bali travel inspiration detected from post text.'
    };
  }
  if (lower.includes('paris') || lower.includes('eiffel') || lower.includes('france')) {
    return {
      country: 'France', region_or_state: 'Île-de-France', city_or_destination: 'Paris', specific_place: lower.includes('eiffel') ? 'Eiffel Tower' : '',
      displayName: 'Paris, Île-de-France, France', confidence: 96, source: 'Post text / landmark cue',
      evidence: [`Paris/France cue found in supplied context: ${textHint}`], travelVibes: ['Culture','Food','Architecture','Romantic'],
      experience_tags: ['City','Culture','Food'], landmarks: ['Eiffel Tower'], activities: ['Sightseeing','Cafés','Museums'],
      visualHighlights: [], accommodationStyle: 'Boutique city hotel', summary: 'Paris travel inspiration detected.'
    };
  }
  if (lower.includes('seoul') || lower.includes('south korea') || lower.includes('korea') || lower.includes('hongdae') || lower.includes('hanok')) {
    return {
      country: 'South Korea', region_or_state: 'Seoul Capital Area', city_or_destination: 'Seoul', specific_place: '',
      displayName: 'Seoul, South Korea', confidence: 95, source: 'Post text',
      evidence: [`Korea-specific wording found in supplied context: ${textHint}`], travelVibes: ['Culture','Food','Nightlife','Shopping'],
      experience_tags: ['Culture','Food','City'], landmarks: [], activities: ['Food','Culture','City exploration'],
      visualHighlights: [], accommodationStyle: 'Boutique city hotel', summary: 'South Korea travel inspiration detected from explicit text.'
    };
  }
  return {
    country: '', region_or_state: '', city_or_destination: '', specific_place: '', displayName: '', confidence: 25, source: 'Insufficient evidence',
    evidence: ['No reliable location cue found in the available text/context'], travelVibes: ['Scenic','Relaxing'], experience_tags: [], landmarks: [],
    activities: ['Sightseeing'], visualHighlights: [], accommodationStyle: 'Boutique stay', summary: 'Travel inspiration detected, but location is not confirmed.'
  };
}

async function analyzeYouTubeWithInteractions(videoUrl, prompt) {
  if (!apiKey) return { raw: null, error: 'Missing GEMINI_API_KEY' };

  const controller = new AbortController();
  // YouTube video understanding can take longer than a normal text request.
  // Netlify synchronous functions allow up to 60s, so give Gemini 50s.
  const timer = setTimeout(() => controller.abort(), 50000);

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'gemini-3.8-flash',
        store: false,
        input: [
          { type: 'video', uri: videoUrl },
          { type: 'text', text: prompt },
        ],
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: destinationAnalysisJsonSchema,
        },
      }),
    });

    const responseText = await res.text();
    if (!res.ok) {
      console.error('Gemini Interactions YouTube error', res.status, responseText.slice(0, 2000));
      return { raw: null, error: `Gemini Interactions API ${res.status}: ${responseText.slice(0, 500)}` };
    }

    let data;
    try { data = JSON.parse(responseText); }
    catch {
      console.error('Gemini Interactions returned non-JSON response', responseText.slice(0, 2000));
      return { raw: null, error: 'Gemini Interactions returned an invalid response.' };
    }

    const textBlocks = [];
    if (typeof data?.output_text === 'string') textBlocks.push(data.output_text);
    for (const step of data?.steps || []) {
      if (step?.type !== 'model_output') continue;
      for (const block of step?.content || []) {
        if (block?.type === 'text' && typeof block?.text === 'string') textBlocks.push(block.text);
      }
    }

    const outputText = textBlocks.join('\n').trim();
    const parsed = cleanAndParseJson(outputText);
    if (!parsed) {
      console.error('Gemini Interactions output could not be parsed', outputText.slice(0, 2000));
      return { raw: null, error: 'Gemini returned a response that could not be parsed.' };
    }

    parsed.geminiModelUsed = data?.model || 'gemini-3.8-flash';
    return { raw: parsed, error: null };
  } catch (e) {
    const message = e?.name === 'AbortError'
      ? 'Gemini YouTube analysis timed out after 50 seconds.'
      : (e?.message || String(e));
    console.error('Gemini Interactions YouTube request failed', message);
    return { raw: null, error: message };
  } finally {
    clearTimeout(timer);
  }
}

async function generateStructured(contents, timeoutMs = 30000) {
  if (!ai) return null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const work = ai.models.generateContent({
        model,
        contents,
        config: { responseMimeType: 'application/json', responseSchema: destinationAnalysisSchema },
      });
      const response = await Promise.race([
        work,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), timeoutMs)),
      ]);
      const parsed = cleanAndParseJson(response?.text || '');
      if (parsed && typeof parsed === 'object') {
        parsed.geminiModelUsed = model;
        return parsed;
      }
    } catch (e) {
      console.warn('Gemini candidate failed:', model, e?.message || e);
    }
  }
  return null;
}

function normalizeAnalysis(raw, { inputSource, inputUrl, actualMediaAvailable, sourceFallback }) {
  const confidenceRaw = Number(raw?.confidence ?? 0);
  const confidence = confidenceRaw > 0 && confidenceRaw <= 1 ? Math.round(confidenceRaw * 100) : Math.round(confidenceRaw || 0);
  const country = raw?.country || null;
  const region = raw?.region_or_state || null;
  const city = raw?.city_or_destination || null;
  const place = raw?.specific_place || null;
  const evidence = Array.isArray(raw?.evidence) ? raw.evidence : [];
  const destination = city || region || country || null;
  const displayName = raw?.displayName || (city && country ? `${city}${region && region !== city ? `, ${region}` : ''}, ${country}` : destination);
  return {
    destination,
    country,
    region_or_state: region,
    city_or_destination: city,
    specific_place: place,
    displayName,
    locationConfidence: confidence,
    confidence,
    evidence,
    source: raw?.source || sourceFallback,
    location: { country, region, city, place, displayName, confidence, evidence, source: raw?.source || sourceFallback },
    suggestedDestinations: [],
    sourceOfInference: actualMediaAvailable ? 'visual_content' : 'post_text',
    contentAccessStatus: actualMediaAvailable ? 'visual_analyzed' : 'text_only',
    inputSource,
    inputUrl,
    inputMimeType: actualMediaAvailable ? 'video/mp4' : 'text/html',
    actualMediaAvailable,
    experience_tags: raw?.experience_tags || raw?.activities || [],
    landmarks: raw?.landmarks || [],
    activities: raw?.activities || [],
    travelVibes: raw?.travelVibes || [],
    visualHighlights: raw?.visualHighlights || [],
    accommodationStyle: raw?.accommodationStyle || 'Boutique stay',
    summary: raw?.summary || 'Travel inspiration analysis.',
  };
}

export async function analyzeLinkPayload(url, caption = '') {
  const trimmedUrl = String(url || '').trim();
  if (!trimmedUrl) return { status: 400, body: { success: false, error: 'URL is required' } };

  if (!apiKey) {
    return {
      status: 503,
      body: {
        success: false,
        mediaRestricted: true,
        configurationError: true,
        message: 'TripSpark analysis is not configured on this deployment. Add GEMINI_API_KEY in Netlify environment variables.',
      },
    };
  }

  const isYouTube = /youtube\.com|youtu\.be/i.test(trimmedUrl);
  const isInstagram = /instagram\.com/i.test(trimmedUrl);
  const isTikTok = /tiktok\.com/i.test(trimmedUrl);

  if (isYouTube) {
    const videoId = extractYouTubeVideoId(trimmedUrl);
    if (!videoId) return { status: 400, body: { success: false, message: 'Invalid YouTube link.' } };
    const canonical = `https://www.youtube.com/watch?v=${videoId}`;
    const meta = await fetchYouTubeMetadata(canonical);
    const prompt = `${DESTINATION_PROMPT_INSTRUCTIONS}\n\nYou are analyzing this public YouTube travel video.\nTitle: ${meta.title || caption || 'Unavailable'}\nCreator: ${meta.author || 'Unavailable'}\nInspect the actual video frames and audio. Return structured JSON only.`;

    // Use the current Gemini Interactions API for direct public YouTube video input.
    // This is the API path Google currently recommends for new multimodal projects.
    const interactionResult = await analyzeYouTubeWithInteractions(canonical, prompt);
    let raw = interactionResult.raw;

    // Compatibility fallback for deployments where Interactions is temporarily unavailable.
    // Keep this secondary; the Interactions call above is the primary path.
    if (!raw) {
      console.warn('Primary YouTube analysis failed; trying generateContent compatibility path:', interactionResult.error);
      raw = await generateStructured([
        { fileData: { fileUri: canonical } },
        { text: prompt },
      ], 42000);
    }

    if (raw) {
      const analysis = normalizeAnalysis(raw, { inputSource: 'youtube_url', inputUrl: canonical, actualMediaAvailable: true, sourceFallback: 'YouTube video' });
      return { status: 200, body: { success: true, platform: 'YouTube', normalisedUrl: canonical, actualMediaAvailable: true, contentAccessStatus: 'visual_analyzed', analysis, mediaRestricted: false } };
    }

    // Safer fallback: use title only, never a default destination.
    const fallback = heuristicFromText(meta.title || caption || '');
    if (fallback.confidence >= 45) {
      const analysis = normalizeAnalysis(fallback, { inputSource: 'youtube_url', inputUrl: canonical, actualMediaAvailable: false, sourceFallback: 'YouTube title' });
      return { status: 200, body: { success: true, platform: 'YouTube', normalisedUrl: canonical, actualMediaAvailable: false, contentAccessStatus: 'text_only', analysis, mediaRestricted: false } };
    }

    return { status: 200, body: { success: false, platform: 'YouTube', normalisedUrl: canonical, actualMediaAvailable: false, contentAccessStatus: 'unaccessible', mediaRestricted: true, message: 'We could read the YouTube link, but Gemini could not complete visual analysis for this video. Try again once, or upload a screenshot/video.', debugReason: interactionResult.error || 'No structured visual result returned' } };
  }

  // Instagram/TikTok cannot reliably expose full video frames from a pasted link alone.
  // Use explicit caption/title hints only when provided; otherwise request media upload rather than hallucinating.
  if (isInstagram || isTikTok) {
    let textHint = caption || '';
    try {
      const parsed = new URL(trimmedUrl);
      textHint ||= parsed.searchParams.get('caption') || parsed.searchParams.get('title') || '';
    } catch {}
    if (textHint) {
      let raw = await generateStructured(`${DESTINATION_PROMPT_INSTRUCTIONS}\n\nOnly post text is available. Analyze this text without pretending to see the video:\n${textHint}`);
      raw ||= heuristicFromText(textHint);
      if ((raw?.confidence || 0) >= 45 && (raw.country || raw.city_or_destination)) {
        const analysis = normalizeAnalysis(raw, { inputSource: isInstagram ? 'instagram_reel' : 'tiktok_url', inputUrl: trimmedUrl, actualMediaAvailable: false, sourceFallback: 'Post text' });
        return { status: 200, body: { success: true, platform: isInstagram ? 'Instagram' : 'TikTok', normalisedUrl: trimmedUrl, actualMediaAvailable: false, contentAccessStatus: 'text_only', analysis, mediaRestricted: false } };
      }
    }
    return { status: 200, body: { success: false, platform: isInstagram ? 'Instagram' : 'TikTok', normalisedUrl: trimmedUrl, actualMediaAvailable: false, contentAccessStatus: 'unaccessible', mediaRestricted: true, message: 'We could access the link, but not enough visual content to identify the location. Upload a screenshot or short video clip.' } };
  }

  return { status: 200, body: { success: false, platform: 'Web', normalisedUrl: trimmedUrl, actualMediaAvailable: false, contentAccessStatus: 'unaccessible', mediaRestricted: true, message: 'This link type is not directly supported. Upload a screenshot or video clip.' } };
}

export async function analyzeMediaPayload(mediaBase64, mimeType = '', caption = '') {
  if (!mediaBase64) return { status: 400, body: { success: false, error: 'Media is required' } };
  if (!apiKey) return { status: 503, body: { success: false, configurationError: true, error: 'GEMINI_API_KEY is not configured in Netlify.' } };

  const cleanBase64 = String(mediaBase64).replace(/^data:[^;]+;base64,/, '');
  const isVideo = String(mimeType).startsWith('video/') || String(mediaBase64).startsWith('data:video/');
  const detectedMime = mimeType || (isVideo ? 'video/mp4' : 'image/jpeg');
  const prompt = `${DESTINATION_PROMPT_INSTRUCTIONS}\n\nAnalyze the uploaded ${isVideo ? 'video across its frames' : 'image/screenshot'}.\nCaption/file hint: ${caption || 'None'}\nInspect visible text, location tags, landmarks, architecture, geography, language and cultural cues.`;

  const raw = await generateStructured([
    { inlineData: { data: cleanBase64, mimeType: detectedMime } },
    { text: prompt },
  ]);
  if (!raw) return { status: 502, body: { success: false, error: 'Gemini could not analyze this media.' } };
  const analysis = normalizeAnalysis(raw, { inputSource: isVideo ? 'uploaded_video' : 'uploaded_image', inputUrl: '', actualMediaAvailable: true, sourceFallback: isVideo ? 'Uploaded video' : 'Uploaded image' });
  return { status: 200, body: { success: true, analysis, actualMediaAvailable: true, contentAccessStatus: 'visual_analyzed' } };
}

export function healthPayload() {
  return { status: 'ok', hasGeminiKey: Boolean(apiKey), runtime: 'netlify-functions', timestamp: new Date().toISOString() };
}

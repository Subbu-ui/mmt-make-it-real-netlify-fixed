import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Robust candidate models prioritizing high-quota / available flash models
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
];

// Track rate-limited models (e.g. 429 quota exhaustion) to failover immediately
const modelCooldowns = new Map();

export function isModelCoolingDown(model) {
  const expiry = modelCooldowns.get(model);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    modelCooldowns.delete(model);
    return false;
  }
  return true;
}

export function markModelCooldown(model, durationMs = 180000) {
  modelCooldowns.set(model, Date.now() + durationMs);
}

export function getOrderedCandidateModels(baseModels = CANDIDATE_MODELS) {
  return [...baseModels].sort((a, b) => {
    const aCool = isModelCoolingDown(a);
    const bCool = isModelCoolingDown(b);
    if (aCool && !bCool) return 1;
    if (!aCool && bCool) return -1;
    return 0;
  });
}

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

export const LOCATION_ANALYSIS_PROMPT = `You are MakeMyTrip's TripSpark destination and experience detection engine.
Inspect the ACTUAL VIDEO in detail across its frames and audio, specifically looking for:
- visible location names, text overlays, subtitles, and signs
- recognizable landmarks and iconic architecture
- distinctive geography, beaches, mountains, or streetscapes
- spoken location references in audio
- creator titles, captions, or language markers
- cultural and geographic clues

Priority order for destination detection:
1. Explicit location text visible in video
2. Explicit spoken/caption location
3. Recognizable landmark
4. City/region visual evidence
5. Broader geographic evidence

STRICT RULES:
- Do NOT only analyse "vibe". You must identify the specific location whenever clues exist.
- Never use a default country or city.
- Never output placeholder geography like "Global", "Scenic Region", "Unknown Region".
- If the location cannot be identified from any clues, leave country, region_or_state, city_or_destination, specific_place, and displayName empty ("") and set confidence below 30.
- When location is detected, provide high confidence (75-98) and cite the exact visual or audio evidence in the evidence array.

You MUST return a JSON object ONLY matching this EXACT schema:
{
  "country": "",
  "region_or_state": "",
  "city_or_destination": "",
  "specific_place": "",
  "displayName": "",
  "confidence": 0,
  "evidence": [],
  "source": "Direct YouTube video analysis",
  "travelVibes": [],
  "experience_tags": [],
  "landmarks": [],
  "activities": [],
  "visualHighlights": [],
  "accommodationStyle": "",
  "summary": ""
}`;

export function cleanAndParseJson(rawText) {
  if (!rawText) return null;
  let text = String(rawText).trim();

  // Strip markdown code fences if present
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    text = markdownMatch[1].trim();
  } else {
    // If not fenced, extract substring from first { to last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1).trim();
    }
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    // Lenient cleanup for trailing commas
    try {
      const fixed = text.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(fixed);
    } catch {
      console.warn('Failed to parse JSON from model output:', text.slice(0, 300));
      return null;
    }
  }
}

export function extractYouTubeVideoId(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // 1. Shorts: youtube.com/shorts/VIDEO_ID or m.youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/(?:youtube\.com|m\.youtube\.com)\/shorts\/([a-zA-Z0-9_-]{5,})/i);
  if (shortsMatch?.[1]) return shortsMatch[1].split(/[?&#]/)[0];

  // 2. Short links: youtu.be/VIDEO_ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{5,})/i);
  if (youtuBeMatch?.[1]) return youtuBeMatch[1].split(/[?&#]/)[0];

  // 3. Watch: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{5,})/i);
  if (watchMatch?.[1]) return watchMatch[1].split(/[?&#]/)[0];

  // 4. Embed / v: youtube.com/embed/VIDEO_ID or /v/VIDEO_ID
  const embedMatch = trimmed.match(/(?:youtube\.com|m\.youtube\.com)\/(?:embed|v)\/([a-zA-Z0-9_-]{5,})/i);
  if (embedMatch?.[1]) return embedMatch[1].split(/[?&#]/)[0];

  // 5. Standard URL parser
  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (u.searchParams.get('v')) return u.searchParams.get('v').split(/[?&#]/)[0];
    if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1]?.split('/')[0] || null;
    if (u.hostname.includes('youtu.be')) return u.pathname.replace(/^\/+/, '').split('/')[0] || null;
  } catch {}
  return null;
}

export function normalizeYouTubeUrl(rawUrl) {
  const videoId = extractYouTubeVideoId(rawUrl);
  if (!videoId) return null;
  return `https://www.youtube.com/watch?v=${videoId}`;
}

async function fetchYouTubeMetadata(videoUrl) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`, {
      signal: controller.signal,
    });
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
      country: 'India',
      region_or_state: 'Goa',
      city_or_destination: isNorth ? 'North Goa' : 'Goa',
      specific_place: '',
      displayName: isNorth ? 'North Goa, Goa, India' : 'Goa, India',
      confidence: 95,
      source: 'Post text',
      evidence: [`Location wording found in post/title: ${textHint}`],
      travelVibes: ['Coastal', 'Relaxing', 'Food', 'Nightlife'],
      experience_tags: ['Beach', 'Coastal', 'Food', 'Relaxing'],
      landmarks: [],
      activities: ['Beach time', 'Local food', 'Sunset'],
      visualHighlights: [],
      accommodationStyle: 'Boutique coastal stay',
      summary: 'Goa travel inspiration detected from post text.',
    };
  }
  if (lower.includes('pune') || lower.includes('sinhagad') || lower.includes('shaniwar wada') || lower.includes('lohagad')) {
    return {
      country: 'India',
      region_or_state: 'Maharashtra',
      city_or_destination: 'Pune',
      specific_place: 'Pune',
      displayName: 'Pune, Maharashtra, India',
      confidence: 95,
      source: 'Post text / video title',
      evidence: [`Pune destination cue in video title/text: ${textHint}`],
      travelVibes: ['Heritage', 'Culture', 'Weekend Getaway', 'Nature'],
      experience_tags: ['Heritage Forts', 'Historical Sightseeing', 'Lakes & Dams'],
      landmarks: ['Shaniwar Wada', 'Lohagad Fort', 'Sinhagad Fort'],
      activities: ['Fort trekking', 'Historical exploration', 'Garden strolls'],
      visualHighlights: ['Historic fort ramparts', 'Western Ghats scenery'],
      accommodationStyle: 'City hotels & nature resorts',
      summary: 'Pune travel inspiration detected.',
    };
  }
  if (lower.includes('bali') || lower.includes('ubud') || lower.includes('uluwatu') || lower.includes('indonesia')) {
    const city = lower.includes('ubud') ? 'Ubud' : lower.includes('uluwatu') ? 'Uluwatu' : 'Bali';
    return {
      country: 'Indonesia',
      region_or_state: 'Bali',
      city_or_destination: city,
      specific_place: '',
      displayName: city === 'Bali' ? 'Bali, Indonesia' : `${city}, Bali, Indonesia`,
      confidence: 92,
      source: 'Post text',
      evidence: [`Location wording found in post/title: ${textHint}`],
      travelVibes: ['Beach', 'Nature', 'Relaxing', 'Culture'],
      experience_tags: ['Tropical', 'Beach', 'Nature'],
      landmarks: [],
      activities: ['Beach', 'Nature', 'Local culture'],
      visualHighlights: [],
      accommodationStyle: 'Boutique / villa stay',
      summary: 'Bali travel inspiration detected from post text.',
    };
  }
  if (lower.includes('paris') || lower.includes('eiffel') || lower.includes('france')) {
    return {
      country: 'France',
      region_or_state: 'Île-de-France',
      city_or_destination: 'Paris',
      specific_place: lower.includes('eiffel') ? 'Eiffel Tower' : '',
      displayName: 'Paris, Île-de-France, France',
      confidence: 96,
      source: 'Post text / landmark cue',
      evidence: [`Paris/France cue found in supplied context: ${textHint}`],
      travelVibes: ['Culture', 'Food', 'Architecture', 'Romantic'],
      experience_tags: ['City', 'Culture', 'Food'],
      landmarks: ['Eiffel Tower'],
      activities: ['Sightseeing', 'Cafés', 'Museums'],
      visualHighlights: [],
      accommodationStyle: 'Boutique city hotel',
      summary: 'Paris travel inspiration detected.',
    };
  }
  if (
    lower.includes('seoul') ||
    lower.includes('south korea') ||
    lower.includes('korea') ||
    lower.includes('hongdae') ||
    lower.includes('hanok')
  ) {
    return {
      country: 'South Korea',
      region_or_state: 'Seoul Capital Area',
      city_or_destination: 'Seoul',
      specific_place: '',
      displayName: 'Seoul, South Korea',
      confidence: 95,
      source: 'Post text',
      evidence: [`Korea-specific wording found in supplied context: ${textHint}`],
      travelVibes: ['Culture', 'Food', 'Nightlife', 'Shopping'],
      experience_tags: ['Culture', 'Food', 'City'],
      landmarks: [],
      activities: ['Food', 'Culture', 'City exploration'],
      visualHighlights: [],
      accommodationStyle: 'Boutique city hotel',
      summary: 'South Korea travel inspiration detected from explicit text.',
    };
  }
  return {
    country: '',
    region_or_state: '',
    city_or_destination: '',
    specific_place: '',
    displayName: '',
    confidence: 25,
    source: 'Insufficient evidence',
    evidence: ['No reliable location cue found in the available text/context'],
    travelVibes: ['Scenic', 'Relaxing'],
    experience_tags: [],
    landmarks: [],
    activities: ['Sightseeing'],
    visualHighlights: [],
    accommodationStyle: 'Boutique stay',
    summary: 'Travel inspiration detected, but location is not confirmed.',
  };
}

/**
 * Direct YouTube Video Analysis using the Gemini Interactions API
 */
export async function analyzeYouTubeDirect(canonicalYouTubeUrl, customPrompt) {
  if (!ai) return { raw: null, error: 'Missing GEMINI_API_KEY' };

  const prompt = customPrompt || LOCATION_ANALYSIS_PROMPT;
  const errors = [];
  const candidateModels = getOrderedCandidateModels([
    'gemini-3.1-flash-lite',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
  ]);

  for (const model of candidateModels) {
    try {
      const interactionPromise = ai.interactions.create({
        model,
        input: [
          {
            type: 'video',
            uri: canonicalYouTubeUrl,
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`YouTube video analysis timeout (${model})`)), 25000)
      );

      const interaction = await Promise.race([interactionPromise, timeoutPromise]);
      let responseText = interaction?.output_text || '';
      if (!responseText && Array.isArray(interaction?.steps)) {
        for (const step of interaction.steps) {
          if (step.type === 'model_output') {
            const textContent = step.content?.find((c) => c.type === 'text');
            if (textContent?.text) responseText += textContent.text;
          }
        }
      }

      const parsed = cleanAndParseJson(responseText);
      if (parsed && typeof parsed === 'object') {
        parsed.geminiModelUsed = model;
        parsed.source = parsed.source || 'Direct YouTube video analysis';
        parsed.actualMediaAnalyzed = true;
        return { raw: parsed, error: null };
      }
      errors.push(`${model}: Non-JSON output from Interactions API`);
    } catch (e) {
      const msg = e?.message || String(e);
      if (
        e?.status === 429 ||
        msg.includes('429') ||
        msg.includes('Rate limit') ||
        msg.includes('Quota exceeded') ||
        msg.includes('RESOURCE_EXHAUSTED')
      ) {
        markModelCooldown(model, 180000);
      }
      console.warn('Interactions API YouTube call failed:', model, msg);
      errors.push(`${model}: ${msg}`);
    }
  }

  return { raw: null, error: errors.join(' | ').slice(0, 1800) || 'YouTube video analysis failed' };
}

async function fetchYouTubeThumbnailBase64(videoId) {
  const candidates = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
  ];
  for (const u of candidates) {
    try {
      const res = await fetch(u);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 2500) {
        return { base64: buf.toString('base64'), mimeType: 'image/jpeg', url: u };
      }
    } catch {}
  }
  return null;
}

async function analyzeYouTubeThumbnail(videoId, meta, caption = '') {
  const thumb = await fetchYouTubeThumbnailBase64(videoId);
  if (!thumb) return null;

  const prompt = `${LOCATION_ANALYSIS_PROMPT}

Context:
Title: "${meta?.title || caption || 'Travel video'}"
Creator: "${meta?.author || 'Creator'}"

Inspect this YouTube thumbnail and video title for location names, landmarks, geography, and signs.
Return JSON only.`;

  const raw = await generateStructured(
    [
      { inlineData: { data: thumb.base64, mimeType: thumb.mimeType } },
      { text: prompt },
    ],
    25000
  );
  if (raw) {
    raw.source = raw.source || 'YouTube thumbnail + title';
    raw.thumbnailUrl = thumb.url;
    raw.actualMediaAnalyzed = true;
  }
  return raw;
}

async function generateStructured(contents, timeoutMs = 25000) {
  if (!ai) return null;
  const candidateModels = getOrderedCandidateModels(CANDIDATE_MODELS);
  for (const model of candidateModels) {
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
      const msg = e?.message || String(e);
      if (
        e?.status === 429 ||
        msg.includes('429') ||
        msg.includes('Quota exceeded') ||
        msg.includes('Rate limit') ||
        msg.includes('RESOURCE_EXHAUSTED')
      ) {
        markModelCooldown(model, 180000);
      }
      console.warn('Gemini candidate failed:', model, msg);
    }
  }
  return null;
}

export function normalizeAnalysis(raw, { inputSource, inputUrl, actualMediaAvailable, sourceFallback }) {
  let confidence = 0;
  if (typeof raw?.confidence === 'number') {
    confidence = raw.confidence > 0 && raw.confidence <= 1
      ? Math.round(raw.confidence * 100)
      : Math.round(raw.confidence);
  } else if (typeof raw?.confidence === 'string') {
    const parsedNum = parseFloat(raw.confidence);
    if (!isNaN(parsedNum)) {
      confidence = parsedNum > 0 && parsedNum <= 1 ? Math.round(parsedNum * 100) : Math.round(parsedNum);
    } else {
      const lower = raw.confidence.toLowerCase();
      if (lower.includes('high')) confidence = 92;
      else if (lower.includes('med')) confidence = 65;
      else if (lower.includes('low')) confidence = 30;
      else confidence = 80;
    }
  }

  const rawCountry = (raw?.country || '').trim();
  const rawRegion = (raw?.region_or_state || '').trim();
  const rawCity = (raw?.city_or_destination || '').trim();
  const rawPlace = (raw?.specific_place || '').trim();

  const isInvalidGeo = (val) => {
    if (!val) return true;
    const l = val.toLowerCase();
    return (
      l === 'global' ||
      l === 'scenic region' ||
      l === 'unknown region' ||
      l === 'exact destination uncertain' ||
      l === 'destination' ||
      l === 'travel' ||
      l === 'unknown'
    );
  };

  const country = !isInvalidGeo(rawCountry) ? rawCountry : null;
  const region = !isInvalidGeo(rawRegion) ? rawRegion : null;
  const city = !isInvalidGeo(rawCity) ? rawCity : null;
  const place = !isInvalidGeo(rawPlace) ? rawPlace : null;

  if (confidence === 0 && (country || city || region)) {
    confidence = 85;
  }

  let evidence = [];
  if (Array.isArray(raw?.evidence)) {
    evidence = raw.evidence.map(String).filter(Boolean);
  } else if (typeof raw?.evidence === 'string' && raw.evidence.trim()) {
    evidence = [raw.evidence.trim()];
  }

  const destination = city || region || country || null;
  let displayName = raw?.displayName ? String(raw.displayName).trim() : null;
  if (!displayName || isInvalidGeo(displayName)) {
    if (city && country) {
      displayName = `${city}${region && region !== city ? `, ${region}` : ''}, ${country}`;
    } else if (city) {
      displayName = city;
    } else if (region && country) {
      displayName = `${region}, ${country}`;
    } else if (country) {
      displayName = country;
    } else {
      displayName = destination;
    }
  }

  const source = raw?.source || sourceFallback;

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
    source,
    location: {
      country,
      region,
      city,
      place,
      displayName,
      confidence,
      evidence,
      source,
    },
    suggestedDestinations: Array.isArray(raw?.suggestedDestinations) ? raw.suggestedDestinations : [],
    sourceOfInference: actualMediaAvailable ? 'visual_content' : 'post_text',
    contentAccessStatus: actualMediaAvailable ? 'visual_analyzed' : 'text_only',
    inputSource,
    inputUrl,
    inputMimeType: actualMediaAvailable ? 'video/mp4' : 'text/html',
    actualMediaAvailable,
    experience_tags:
      Array.isArray(raw?.experience_tags) && raw.experience_tags.length > 0
        ? raw.experience_tags
        : Array.isArray(raw?.activities)
        ? raw.activities
        : [],
    landmarks: Array.isArray(raw?.landmarks) ? raw.landmarks : [],
    activities: Array.isArray(raw?.activities) ? raw.activities : [],
    travelVibes: Array.isArray(raw?.travelVibes) ? raw.travelVibes : [],
    visualHighlights: Array.isArray(raw?.visualHighlights) ? raw.visualHighlights : [],
    accommodationStyle: raw?.accommodationStyle || 'Boutique stay',
    summary:
      raw?.summary ||
      (actualMediaAvailable
        ? 'Video inspiration analyzed across frames.'
        : 'Travel inspiration analysis.'),
  };
}

function decodeHtmlEntities(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractMetaContent(html, key) {
  if (!html) return '';
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`, 'i'),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return decodeHtmlEntities(match[1].trim());
  }
  return '';
}

function extractHtmlTitle(html) {
  const m = String(html || '').match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1] ? decodeHtmlEntities(m[1].trim()) : '';
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// =========================================================================
// INSTAGRAM DEDICATED PUBLIC PREVIEW PIPELINE
// =========================================================================

export function extractInstagramShortcode(rawUrl) {
  try {
    const trimmed = String(rawUrl || '').trim();
    if (!trimmed) return null;
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (!/instagram\.com/i.test(u.hostname)) return null;
    const parts = u.pathname.split('/').filter(Boolean);
    const kindIdx = parts.findIndex((x) =>
      ['reel', 'reels', 'p', 'tv'].includes(x.toLowerCase())
    );
    if (kindIdx >= 0 && parts[kindIdx + 1]) {
      return parts[kindIdx + 1];
    }
  } catch {}
  return null;
}

export function normalizeInstagramUrl(rawUrl) {
  const shortcode = extractInstagramShortcode(rawUrl);
  if (shortcode) {
    return `https://www.instagram.com/reel/${shortcode}/`;
  }
  try {
    const trimmed = String(rawUrl || '').trim();
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    return `https://${u.hostname}${u.pathname}`;
  } catch {
    return String(rawUrl || '').trim();
  }
}

export const INSTAGRAM_ANALYSIS_PROMPT = `Analyse this public Instagram travel post.

Determine the geographic destination using ONLY evidence in the supplied image and text.

Prioritize:
1. explicit location names in caption/text
2. text visible in the image
3. recognizable landmarks
4. architecture/geography
5. language/cultural clues

Do not guess a destination merely from generic scenery.
If caption says e.g. "48 hours in Ubud", return Ubud, Bali, Indonesia with high confidence (85-100).
If caption says "Best cafés in North Goa", return North Goa, Goa, India with high confidence (85-100).
Explicit caption/location text is strong evidence; a landmark is not required if explicit text is present.

If the post only exposes generic scenery (e.g. generic beach, waves, trees, pool) with NO caption/location and NO readable landmark:
Set confidence below 30, set locationConfirmed to false, and leave country, region_or_state, city_or_destination, and displayName empty strings or null.
DO NOT guess or invent default locations like Seoul, South Korea, Bali, Paris, or Goa!

Return structured JSON.`;

async function fetchInstagramThumbnail(imageUrl) {
  if (!imageUrl) return { status: 0, contentType: '', base64: null, byteLength: 0 };
  try {
    const res = await fetchWithTimeout(
      imageUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          Referer: 'https://www.instagram.com/',
        },
        redirect: 'follow',
      },
      12000
    );
    const status = res.status;
    const contentType = (res.headers.get('content-type') || '').split(';')[0];
    if (res.ok && contentType.startsWith('image/')) {
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > 500 && buffer.length < 15_000_000) {
        return {
          status,
          contentType,
          base64: buffer.toString('base64'),
          byteLength: buffer.length,
        };
      }
    }
    return { status, contentType, base64: null, byteLength: 0 };
  } catch (err) {
    return { status: 0, contentType: '', base64: null, byteLength: 0, error: err?.message };
  }
}

async function fetchInstagramPublicHtml(canonicalUrl, rawUrl) {
  const headers = {
    'User-Agent': 'Mozilla/5.0',
    Accept: 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };

  const urlsToTry = [canonicalUrl];
  if (rawUrl && rawUrl !== canonicalUrl) {
    urlsToTry.push(rawUrl);
  }

  let status = 0;
  let contentType = '';
  let length = 0;
  let html = '';

  for (const url of urlsToTry) {
    try {
      const res = await fetchWithTimeout(url, { headers, redirect: 'follow' }, 10000);
      status = res.status;
      contentType = res.headers.get('content-type') || '';
      if (!res.ok) continue;
      const text = await res.text();
      length = text.length;
      if (text && text.length > 500) {
        html = text;
        break;
      }
    } catch (e) {
      console.warn('Instagram fetch failed:', url, e?.message);
    }
  }

  return { html, status, contentType, length };
}

function parseInstagramClues(html, canonicalUrl) {
  const ogTitle = extractMetaContent(html, 'og:title');
  const ogDescription = extractMetaContent(html, 'og:description');
  const ogImage = extractMetaContent(html, 'og:image');
  const twitterTitle = extractMetaContent(html, 'twitter:title');
  const twitterDescription = extractMetaContent(html, 'twitter:description');
  const twitterImage = extractMetaContent(html, 'twitter:image');
  const canonical = extractMetaContent(html, 'og:url') || canonicalUrl;
  const pageTitle = extractHtmlTitle(html);

  let caption = '';
  let creator = '';
  let locationText = '';

  if (ogDescription) {
    const quoteMatch = ogDescription.match(/:\s*["“]([\s\S]*?)["”]\s*\.?$/);
    if (quoteMatch?.[1]) {
      caption = quoteMatch[1].trim();
    } else {
      const colonIdx = ogDescription.indexOf(':');
      if (colonIdx > 0 && colonIdx < ogDescription.length - 1) {
        caption = ogDescription.slice(colonIdx + 1).replace(/^[\s"“]+|[\s"”]+$/g, '').trim();
      }
    }

    const creatorMatch = ogDescription.match(/-\s*([a-zA-Z0-9._]+)\s+on\s+/i);
    if (creatorMatch?.[1]) {
      creator = creatorMatch[1].trim();
    }
  }

  if (!caption && ogTitle) {
    const titleQuoteMatch = ogTitle.match(/:\s*["“]([\s\S]*?)["”]\s*$/);
    if (titleQuoteMatch?.[1]) {
      caption = titleQuoteMatch[1].trim();
    }
  }

  if (!creator && twitterTitle) {
    const handleMatch = twitterTitle.match(/\(@([a-zA-Z0-9._]+)\)/);
    if (handleMatch?.[1]) {
      creator = handleMatch[1].trim();
    }
  }

  // JSON-LD parsing for additional metadata
  const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1]);
      if (data?.caption && !caption) caption = String(data.caption).trim();
      if (data?.description && !caption) caption = String(data.description).trim();
      if (data?.author?.name && !creator) creator = String(data.author.name).trim();
      if (data?.contentLocation?.name && !locationText) locationText = String(data.contentLocation.name).trim();
    } catch {}
  }

  const title = ogTitle || twitterTitle || pageTitle || '';
  const description = ogDescription || twitterDescription || '';
  const thumbnailUrl = ogImage || twitterImage || '';

  const instagramPreview = {
    title,
    description,
    caption: caption || description,
    thumbnailUrl,
    creator,
    locationText,
    canonicalUrl: canonical,
  };

  return instagramPreview;
}

export async function analyzeInstagramPayload(rawUrl, userCaption = '') {
  const canonicalUrl = normalizeInstagramUrl(rawUrl);
  const { html, status, contentType, length } = await fetchInstagramPublicHtml(canonicalUrl, rawUrl);

  const instagramPreview = parseInstagramClues(html, canonicalUrl);
  const thumbnailResult = await fetchInstagramThumbnail(instagramPreview.thumbnailUrl);

  const hasUsefulMetadata = Boolean(
    instagramPreview.thumbnailUrl ||
    instagramPreview.caption ||
    instagramPreview.title ||
    userCaption
  );

  // If Instagram blocked or exposed no useful metadata
  if (!html || status === 403 || status === 429 || !hasUsefulMetadata) {
    console.log('--- INSTAGRAM ANALYSIS DEBUG ---');
    console.log('INSTAGRAM_URL:', canonicalUrl);
    console.log('HTTP_STATUS:', status);
    console.log('PAGE_CONTENT_TYPE:', contentType);
    console.log('PAGE_LENGTH:', length);
    console.log('OG_TITLE:', instagramPreview.title);
    console.log('OG_DESCRIPTION:', instagramPreview.description);
    console.log('OG_IMAGE:', instagramPreview.thumbnailUrl);
    console.log('THUMBNAIL_FETCH_STATUS:', thumbnailResult?.status ?? 'none');
    console.log('THUMBNAIL_CONTENT_TYPE:', thumbnailResult?.contentType ?? 'none');
    console.log('GEMINI_RAW_RESULT:', 'null (blocked or insufficient metadata)');
    console.log('NORMALIZED_LOCATION:', 'none');
    console.log('CONFIDENCE:', 0);
    console.log('--------------------------------');

    return {
      status: 200,
      body: {
        success: false,
        platform: 'Instagram',
        normalisedUrl: canonicalUrl,
        inputSource: 'instagram',
        actualMediaAvailable: false,
        contentAccessStatus: 'unaccessible',
        instagramAccessStatus: 'limited',
        mediaRestricted: true,
        message:
          'We could access the Instagram link, but Instagram did not expose enough public preview information to identify the location.',
        debugReason: `Instagram fetch status ${status || 'unknown'}, no public metadata or blocked`,
      },
    };
  }

  // Build prompt context
  const textContextParts = [];
  if (userCaption) textContextParts.push(`User Hint/Caption: ${userCaption}`);
  if (instagramPreview.title) textContextParts.push(`Post Title: ${instagramPreview.title}`);
  if (instagramPreview.caption) textContextParts.push(`Caption: ${instagramPreview.caption}`);
  if (instagramPreview.locationText) textContextParts.push(`Location Tag: ${instagramPreview.locationText}`);
  if (instagramPreview.creator) textContextParts.push(`Creator: ${instagramPreview.creator}`);

  const promptText = `${INSTAGRAM_ANALYSIS_PROMPT}

Context from Instagram:
${textContextParts.join('\n') || 'None available'}`;

  const contents = [];
  if (thumbnailResult?.base64) {
    contents.push({
      inlineData: {
        data: thumbnailResult.base64,
        mimeType: thumbnailResult.contentType || 'image/jpeg',
      },
    });
  }
  contents.push({ text: promptText });

  // Call Gemini using candidate models with cooldown tracking
  let rawResult = null;
  const candidateModels = getOrderedCandidateModels(CANDIDATE_MODELS);
  for (const model of candidateModels) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: destinationAnalysisSchema,
        },
      });
      if (res.text) {
        rawResult = cleanAndParseJson(res.text);
        if (rawResult) break;
      }
    } catch (e) {
      const msg = e?.message || String(e);
      if (
        e?.status === 429 ||
        msg.includes('429') ||
        msg.includes('Quota exceeded') ||
        msg.includes('Rate limit') ||
        msg.includes('RESOURCE_EXHAUSTED')
      ) {
        markModelCooldown(model, 180000);
      }
      console.warn('Gemini candidate failed for Instagram:', model, msg);
    }
  }

  // Fallback to text heuristics if Gemini model calls failed
  if (!rawResult && textContextParts.length > 0) {
    rawResult = heuristicFromText(textContextParts.join(' | '));
  }

  let confidence = 0;
  if (typeof rawResult?.confidence === 'number') {
    confidence = rawResult.confidence > 0 && rawResult.confidence <= 1
      ? Math.round(rawResult.confidence * 100)
      : Math.round(rawResult.confidence);
  } else if (typeof rawResult?.confidence === 'string') {
    const parsedNum = parseFloat(rawResult.confidence);
    if (!isNaN(parsedNum)) {
      confidence = parsedNum > 0 && parsedNum <= 1 ? Math.round(parsedNum * 100) : Math.round(parsedNum);
    } else {
      const lower = rawResult.confidence.toLowerCase();
      if (lower.includes('high')) confidence = 92;
      else if (lower.includes('med')) confidence = 65;
      else if (lower.includes('low')) confidence = 30;
      else confidence = 75;
    }
  }

  const rawCountry = (rawResult?.country || '').trim();
  const rawRegion = (rawResult?.region_or_state || '').trim();
  const rawCity = (rawResult?.city_or_destination || '').trim();
  const rawPlace = (rawResult?.specific_place || '').trim();
  const rawDisplayName = (rawResult?.displayName || '').trim();

  const isGenericOrUnconfirmed =
    rawResult?.locationConfirmed === false ||
    confidence < 40 ||
    (!rawCountry && !rawRegion && !rawCity && !rawPlace && !rawDisplayName);

  if (isGenericOrUnconfirmed) {
    console.log('--- INSTAGRAM ANALYSIS DEBUG ---');
    console.log('INSTAGRAM_URL:', canonicalUrl);
    console.log('HTTP_STATUS:', status);
    console.log('PAGE_CONTENT_TYPE:', contentType);
    console.log('PAGE_LENGTH:', length);
    console.log('OG_TITLE:', instagramPreview.title);
    console.log('OG_DESCRIPTION:', instagramPreview.description);
    console.log('OG_IMAGE:', instagramPreview.thumbnailUrl);
    console.log('THUMBNAIL_FETCH_STATUS:', thumbnailResult?.status ?? 'none');
    console.log('THUMBNAIL_CONTENT_TYPE:', thumbnailResult?.contentType ?? 'none');
    console.log('GEMINI_RAW_RESULT:', JSON.stringify(rawResult));
    console.log('NORMALIZED_LOCATION:', 'unconfirmed');
    console.log('CONFIDENCE:', confidence);
    console.log('--------------------------------');

    return {
      status: 200,
      body: {
        success: false,
        platform: 'Instagram',
        normalisedUrl: canonicalUrl,
        inputSource: 'instagram',
        actualMediaAvailable: false,
        contentAccessStatus: 'unaccessible',
        instagramAccessStatus: 'limited',
        mediaRestricted: true,
        message:
          'We could access the Instagram link, but Instagram did not expose enough public preview information to identify the location.',
        debugReason: `Instagram location unconfirmed (confidence: ${confidence})`,
      },
    };
  }

  // Location is confirmed (confidence >= 40 with valid location)
  rawResult.source = rawResult.source || 'Instagram public preview';
  const hasThumbnail = Boolean(thumbnailResult?.base64);

  const analysis = normalizeAnalysis(rawResult, {
    inputSource: 'instagram',
    inputUrl: canonicalUrl,
    actualMediaAvailable: hasThumbnail,
    sourceFallback: hasThumbnail
      ? 'Instagram public preview thumbnail + text'
      : 'Instagram public post text',
  });

  // Preserve the high confidence and valid destination (Requirement 12)
  analysis.confidence = Math.max(analysis.confidence || 0, confidence);
  analysis.locationConfidence = analysis.confidence;
  analysis.locationConfirmed = true;
  analysis.contentAccessStatus = hasThumbnail ? 'public_preview_analyzed' : 'text_only';
  analysis.sourceOfInference = hasThumbnail ? 'public_preview_image' : 'post_text';

  console.log('--- INSTAGRAM ANALYSIS DEBUG ---');
  console.log('INSTAGRAM_URL:', canonicalUrl);
  console.log('HTTP_STATUS:', status);
  console.log('PAGE_CONTENT_TYPE:', contentType);
  console.log('PAGE_LENGTH:', length);
  console.log('OG_TITLE:', instagramPreview.title);
  console.log('OG_DESCRIPTION:', instagramPreview.description);
  console.log('OG_IMAGE:', instagramPreview.thumbnailUrl);
  console.log('THUMBNAIL_FETCH_STATUS:', thumbnailResult?.status ?? 'none');
  console.log('THUMBNAIL_CONTENT_TYPE:', thumbnailResult?.contentType ?? 'none');
  console.log('GEMINI_RAW_RESULT:', JSON.stringify(rawResult));
  console.log('NORMALIZED_LOCATION:', analysis.displayName || analysis.destination);
  console.log('CONFIDENCE:', analysis.confidence);
  console.log('--------------------------------');

  return {
    status: 200,
    body: {
      success: true,
      platform: 'Instagram',
      normalisedUrl: canonicalUrl,
      inputSource: 'instagram',
      actualMediaAvailable: hasThumbnail,
      contentAccessStatus: hasThumbnail ? 'public_preview_analyzed' : 'text_only',
      analysis,
      aiAnalysis: analysis,
      mediaRestricted: false,
      analysisMethod: hasThumbnail
        ? 'instagram_public_preview_image_plus_text'
        : 'instagram_public_metadata_text',
      thumbnailUrl: instagramPreview.thumbnailUrl || null,
      pageTitle: instagramPreview.title || null,
      description: instagramPreview.caption || instagramPreview.description || null,
    },
  };
}

async function fetchPublicSocialMetadata(rawUrl, platform) {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };

  const attempts = [rawUrl];
  if (platform === 'Instagram') {
    try {
      const u = new URL(rawUrl);
      const parts = u.pathname.split('/').filter(Boolean);
      const kindIndex = parts.findIndex((x) =>
        ['reel', 'reels', 'p', 'tv'].includes(x.toLowerCase())
      );
      if (kindIndex >= 0 && parts[kindIndex + 1]) {
        attempts.push(
          `https://www.instagram.com/${parts[kindIndex]}/${parts[kindIndex + 1]}/embed/captioned/`
        );
      }
    } catch {}
  }

  let lastStatus = null;
  for (const url of attempts) {
    try {
      const res = await fetchWithTimeout(url, { headers, redirect: 'follow' }, 9000);
      lastStatus = res.status;
      if (!res.ok) continue;
      const html = await res.text();
      if (!html || html.length < 200) continue;

      const title =
        extractMetaContent(html, 'og:title') ||
        extractMetaContent(html, 'twitter:title') ||
        extractHtmlTitle(html);
      const description =
        extractMetaContent(html, 'og:description') ||
        extractMetaContent(html, 'twitter:description') ||
        extractMetaContent(html, 'description');
      const imageUrl =
        extractMetaContent(html, 'og:image') || extractMetaContent(html, 'twitter:image');
      const canonical = extractMetaContent(html, 'og:url') || rawUrl;
      const videoUrl =
        extractMetaContent(html, 'og:video:secure_url') ||
        extractMetaContent(html, 'og:video') ||
        '';

      if (title || description || imageUrl || videoUrl) {
        return {
          ok: true,
          title,
          description,
          imageUrl,
          videoUrl,
          canonical,
          fetchedFrom: url,
          status: res.status,
        };
      }
    } catch (e) {
      console.warn(`${platform} metadata fetch failed:`, url, e?.message || e);
    }
  }
  return {
    ok: false,
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    canonical: rawUrl,
    status: lastStatus,
  };
}

async function fetchImageAsBase64(imageUrl) {
  if (!imageUrl) return null;
  try {
    const res = await fetchWithTimeout(
      imageUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          Referer: 'https://www.instagram.com/',
        },
        redirect: 'follow',
      },
      10000
    );
    if (!res.ok) return null;
    const contentType = (res.headers.get('content-type') || '').split(';')[0];
    if (!contentType.startsWith('image/')) return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length < 1500 || bytes.length > 8_000_000) return null;
    return { data: bytes.toString('base64'), mimeType: contentType || 'image/jpeg' };
  } catch (e) {
    console.warn('Social preview image fetch failed:', e?.message || e);
    return null;
  }
}

async function analyzePublicSocialPreview(rawUrl, platform, caption = '') {
  const meta = await fetchPublicSocialMetadata(rawUrl, platform);
  const textContext = [caption, meta.title, meta.description].filter(Boolean).join(' | ');
  const image = meta.imageUrl ? await fetchImageAsBase64(meta.imageUrl) : null;

  if (image) {
    const prompt = `${LOCATION_ANALYSIS_PROMPT}

You are analyzing a PUBLIC ${platform} post/reel preview, not the full private video stream. Use the supplied public preview image plus any public caption/title/description. Never claim you watched the full reel.
Public text: ${textContext || 'Unavailable'}
If the image/text does not support a location, leave geography blank and confidence below 35.`;
    const raw = await generateStructured(
      [
        { inlineData: { data: image.data, mimeType: image.mimeType } },
        { text: prompt },
      ],
      26000
    );
    if (raw) {
      raw.source = raw.source || `${platform} public preview + post text`;
      return { raw, meta, usedImage: true };
    }
  }

  if (textContext) {
    let raw = await generateStructured(
      [
        {
          text: `${LOCATION_ANALYSIS_PROMPT}

Only public ${platform} post text/metadata is available; do not pretend to see the video.
${textContext}`,
        },
      ],
      22000
    );
    raw ||= heuristicFromText(textContext);
    if (raw) {
      raw.source = raw.source || `${platform} public post text`;
      return { raw, meta, usedImage: false };
    }
  }

  return { raw: null, meta, usedImage: false };
}

/**
 * Main URL analysis payload handler - shared by server.ts and netlify/functions/analyze-link.mjs
 */
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
        message:
          'TripSpark analysis is not configured. Add GEMINI_API_KEY in environment variables.',
      },
    };
  }

  const isYouTube = /youtube\.com|youtu\.be/i.test(trimmedUrl);
  const isInstagram = /instagram\.com/i.test(trimmedUrl);
  const isTikTok = /tiktok\.com/i.test(trimmedUrl);

  // 1. YouTube & YouTube Shorts
  if (isYouTube) {
    const videoId = extractYouTubeVideoId(trimmedUrl);
    if (!videoId) {
      return {
        status: 400,
        body: {
          success: false,
          platform: 'YouTube',
          inputSource: 'youtube_url',
          inputUrl: trimmedUrl,
          message: 'Invalid YouTube link format. Could not extract video ID.',
        },
      };
    }

    const canonicalYouTubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const meta = await fetchYouTubeMetadata(canonicalYouTubeUrl);
    const videoTitle = meta.title || caption || '';
    const creator = meta.author || '';

    const prompt = `${LOCATION_ANALYSIS_PROMPT}

Context:
Title/Caption: "${videoTitle || 'Travel inspiration video'}"${creator ? ` by creator ${creator}` : ''}
Video link: ${canonicalYouTubeUrl}

Inspect the actual video frames, audio, landmarks, architecture, signs, overlays, and spoken words.
Return structured JSON matching the schema.`;

    // 1) Primary: send the public canonical YouTube URL directly to Gemini Interactions API
    console.log(`Analyzing YouTube video via Gemini Interactions API: ${canonicalYouTubeUrl}`);
    const directResult = await analyzeYouTubeDirect(canonicalYouTubeUrl, prompt);
    let raw = directResult.raw;
    let usedFullVideo = Boolean(raw);

    // 2) Fallback: if direct video stream fails, try thumbnail + metadata fallback
    if (!raw) {
      console.warn('Direct YouTube Interactions API failed; trying thumbnail + metadata fallback:', directResult.error);
      raw = await analyzeYouTubeThumbnail(videoId, meta, caption);
      usedFullVideo = false;
    }

    // 3) Last safe fallback: title/caption heuristics
    if (!raw) {
      raw = heuristicFromText([meta.title, caption].filter(Boolean).join(' | '));
    }

    if (
      raw &&
      (raw.country ||
        raw.region_or_state ||
        raw.city_or_destination ||
        raw.specific_place ||
        Number(raw.confidence || 0) >= 30)
    ) {
      const analysis = normalizeAnalysis(raw, {
        inputSource: 'youtube_url',
        inputUrl: canonicalYouTubeUrl,
        actualMediaAvailable: usedFullVideo,
        sourceFallback: usedFullVideo ? 'Direct YouTube video analysis' : 'YouTube thumbnail/title',
      });
      return {
        status: 200,
        body: {
          success: true,
          platform: 'YouTube',
          normalisedUrl: canonicalYouTubeUrl,
          actualMediaAvailable: usedFullVideo,
          contentAccessStatus: usedFullVideo ? 'visual_analyzed' : 'thumbnail_or_text_analyzed',
          analysis,
          mediaRestricted: false,
          analysisMethod: usedFullVideo ? 'youtube_video' : 'youtube_thumbnail_or_text',
        },
      };
    }

    return {
      status: 200,
      body: {
        success: false,
        platform: 'YouTube',
        normalisedUrl: canonicalYouTubeUrl,
        actualMediaAvailable: false,
        contentAccessStatus: 'unaccessible',
        mediaRestricted: true,
        message:
          'TripSpark could open this YouTube link, but there was not enough reliable visual or text evidence to identify the destination. Try another public Short or upload a screenshot.',
        debugReason: directResult.error || 'No reliable video, thumbnail, or title result',
      },
    };
  }

  // 2. Instagram: Dedicated public preview pipeline (never sends into YouTube handler)
  if (isInstagram) {
    return await analyzeInstagramPayload(trimmedUrl, caption);
  }

  // 3. TikTok: public OpenGraph / embed preview
  if (isTikTok) {
    const platform = 'TikTok';
    const preview = await analyzePublicSocialPreview(trimmedUrl, platform, caption);
    const raw = preview.raw;
    if (
      raw &&
      (Number(raw.confidence || 0) >= 30) &&
      (raw.country || raw.region_or_state || raw.city_or_destination)
    ) {
      const analysis = normalizeAnalysis(raw, {
        inputSource: 'tiktok_url',
        inputUrl: preview.meta?.canonical || trimmedUrl,
        actualMediaAvailable: Boolean(preview.usedImage),
        sourceFallback: preview.usedImage
          ? `${platform} public preview image + text`
          : `${platform} public post text`,
      });
      analysis.contentAccessStatus = preview.usedImage ? 'visual_analyzed' : 'text_only';
      analysis.sourceOfInference = preview.usedImage ? 'public_preview_image' : 'post_text';
      return {
        status: 200,
        body: {
          success: true,
          platform,
          normalisedUrl: preview.meta?.canonical || trimmedUrl,
          actualMediaAvailable: Boolean(preview.usedImage),
          contentAccessStatus: preview.usedImage ? 'public_preview_analyzed' : 'text_only',
          analysis,
          aiAnalysis: analysis,
          mediaRestricted: false,
          analysisMethod: preview.usedImage
            ? 'public_preview_image_plus_metadata'
            : 'public_metadata_text',
          thumbnailUrl: preview.meta?.imageUrl || null,
          pageTitle: preview.meta?.title || null,
          description: preview.meta?.description || null,
        },
      };
    }
    return {
      status: 200,
      body: {
        success: false,
        platform,
        normalisedUrl: preview.meta?.canonical || trimmedUrl,
        actualMediaAvailable: false,
        contentAccessStatus: 'unaccessible',
        mediaRestricted: true,
        message: `TripSpark could open this public ${platform} link, but ${platform} did not expose enough public preview text/image evidence to identify the location. Upload a screenshot or short video clip for full visual analysis.`,
        debugReason: preview.meta?.status
          ? `${platform} public page status ${preview.meta.status}; title=${Boolean(
              preview.meta.title
            )} description=${Boolean(preview.meta.description)} image=${Boolean(preview.meta.imageUrl)}`
          : `${platform} public metadata unavailable`,
      },
    };
  }

  return {
    status: 200,
    body: {
      success: false,
      platform: 'Web',
      normalisedUrl: trimmedUrl,
      actualMediaAvailable: false,
      contentAccessStatus: 'unaccessible',
      mediaRestricted: true,
      message: 'This link type is not directly supported. Upload a screenshot or video clip.',
    },
  };
}

/**
 * Main media (image/video file or base64) analysis payload handler
 */
export async function analyzeMediaPayload(mediaBase64, mimeType = '', caption = '') {
  if (!mediaBase64) return { status: 400, body: { success: false, error: 'Media is required' } };
  if (!apiKey) {
    return {
      status: 503,
      body: {
        success: false,
        configurationError: true,
        error: 'GEMINI_API_KEY is not configured.',
      },
    };
  }

  const cleanBase64 = String(mediaBase64).replace(/^data:[^;]+;base64,/, '');
  const isVideo =
    String(mimeType).startsWith('video/') || String(mediaBase64).startsWith('data:video/');
  const detectedMime = mimeType || (isVideo ? 'video/mp4' : 'image/jpeg');
  const prompt = `${LOCATION_ANALYSIS_PROMPT}

Analyze the uploaded ${isVideo ? 'video across its frames' : 'image/screenshot'}.
Caption/file hint: ${caption || 'None'}
Inspect visible text, location tags, landmarks, architecture, geography, language, and cultural cues.`;

  const raw = await generateStructured([
    { inlineData: { data: cleanBase64, mimeType: detectedMime } },
    { text: prompt },
  ]);
  if (!raw) {
    return { status: 502, body: { success: false, error: 'Gemini could not analyze this media.' } };
  }
  const analysis = normalizeAnalysis(raw, {
    inputSource: isVideo ? 'uploaded_video' : 'uploaded_image',
    inputUrl: '',
    actualMediaAvailable: true,
    sourceFallback: isVideo ? 'Uploaded video' : 'Uploaded image',
  });
  return {
    status: 200,
    body: {
      success: true,
      analysis,
      actualMediaAvailable: true,
      contentAccessStatus: 'visual_analyzed',
    },
  };
}

export function healthPayload() {
  return {
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  };
}

import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];

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

async function analyzeYouTubeDirect(videoUrl, prompt) {
  if (!ai) return { raw: null, error: 'Missing GEMINI_API_KEY' };

  const errors = [];
  for (const model of CANDIDATE_MODELS) {
    try {
      const work = ai.models.generateContent({
        model,
        contents: [
          { fileData: { fileUri: videoUrl } },
          { text: prompt },
        ],
        // Keep the YouTube request deliberately simple. Structured schemas can
        // make preview video URL calls more brittle; the prompt already asks for JSON.
        config: { responseMimeType: 'application/json' },
      });

      const response = await Promise.race([
        work,
        new Promise((_, reject) => setTimeout(() => reject(new Error('YouTube video analysis timeout')), 48000)),
      ]);

      const parsed = cleanAndParseJson(response?.text || '');
      if (parsed && typeof parsed === 'object') {
        parsed.geminiModelUsed = model;
        parsed.source = parsed.source || 'YouTube video';
        return { raw: parsed, error: null };
      }
      errors.push(`${model}: Gemini returned non-JSON output`);
    } catch (e) {
      const msg = e?.message || String(e);
      console.warn('Direct YouTube Gemini call failed:', model, msg);
      errors.push(`${model}: ${msg}`);
    }
  }
  return { raw: null, error: errors.join(' | ').slice(0, 1800) || 'No YouTube model returned a result' };
}

async function fetchYouTubeThumbnailBase64(videoId) {
  const candidates = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];
  for (const url of candidates) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('image')) continue;
      const bytes = Buffer.from(await res.arrayBuffer());
      // Tiny placeholder images are not useful evidence.
      if (bytes.length < 5000) continue;
      return { data: bytes.toString('base64'), mimeType: contentType.split(';')[0] || 'image/jpeg', url };
    } catch (e) {
      console.warn('YouTube thumbnail fetch failed:', url, e?.message || e);
    }
  }
  return null;
}

async function analyzeYouTubeThumbnail(videoId, meta, caption = '') {
  if (!ai) return null;
  const thumb = await fetchYouTubeThumbnailBase64(videoId);
  if (!thumb) return null;

  const textContext = [meta?.title, meta?.author, caption].filter(Boolean).join(' | ');
  const prompt = `${DESTINATION_PROMPT_INSTRUCTIONS}\n\nThe full YouTube video could not be processed, so analyze the public video thumbnail plus its metadata. Do NOT claim you watched the full video.\nTitle/creator/caption: ${textContext || 'Unavailable'}\nUse visible thumbnail text, landmarks, architecture, geography and explicit title wording. If location is not supported, return blank geography with confidence below 35.`;

  const raw = await generateStructured([
    { inlineData: { data: thumb.data, mimeType: thumb.mimeType } },
    { text: prompt },
  ], 25000);
  if (raw) {
    raw.source = raw.source || 'YouTube thumbnail + title';
    raw.thumbnailUrl = thumb.url;
  }
  return raw;
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



function decodeHtmlEntities(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x2F;/gi, '/')
    .replace(/&#x3D;/gi, '=')
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      try { return String.fromCharCode(Number(n)); } catch { return _; }
    });
}

function extractMetaContent(html, key) {
  if (!html) return '';
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtmlEntities(m[1].trim());
  }
  return '';
}

function extractHtmlTitle(html) {
  const m = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? decodeHtmlEntities(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) : '';
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

async function fetchPublicSocialMetadata(rawUrl, platform) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };

  const attempts = [rawUrl];
  if (platform === 'Instagram') {
    try {
      const u = new URL(rawUrl);
      const parts = u.pathname.split('/').filter(Boolean);
      const kindIndex = parts.findIndex((x) => ['reel', 'reels', 'p', 'tv'].includes(x.toLowerCase()));
      if (kindIndex >= 0 && parts[kindIndex + 1]) {
        attempts.push(`https://www.instagram.com/${parts[kindIndex]}/${parts[kindIndex + 1]}/embed/captioned/`);
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

      const title = extractMetaContent(html, 'og:title') || extractMetaContent(html, 'twitter:title') || extractHtmlTitle(html);
      const description = extractMetaContent(html, 'og:description') || extractMetaContent(html, 'twitter:description') || extractMetaContent(html, 'description');
      const imageUrl = extractMetaContent(html, 'og:image') || extractMetaContent(html, 'twitter:image');
      const canonical = extractMetaContent(html, 'og:url') || rawUrl;
      const videoUrl = extractMetaContent(html, 'og:video:secure_url') || extractMetaContent(html, 'og:video') || '';

      if (title || description || imageUrl || videoUrl) {
        return { ok: true, title, description, imageUrl, videoUrl, canonical, fetchedFrom: url, status: res.status };
      }
    } catch (e) {
      console.warn(`${platform} metadata fetch failed:`, url, e?.message || e);
    }
  }
  return { ok: false, title: '', description: '', imageUrl: '', videoUrl: '', canonical: rawUrl, status: lastStatus };
}

async function fetchImageAsBase64(imageUrl) {
  if (!imageUrl) return null;
  try {
    const res = await fetchWithTimeout(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.instagram.com/',
      },
      redirect: 'follow',
    }, 10000);
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
    const prompt = `${DESTINATION_PROMPT_INSTRUCTIONS}\n\nYou are analyzing a PUBLIC ${platform} post/reel preview, not the full private video stream. Use the supplied public preview image plus any public caption/title/description. Never claim you watched the full reel.\nPublic text: ${textContext || 'Unavailable'}\nIf the image/text does not support a location, leave geography blank and confidence below 35.`;
    const raw = await generateStructured([
      { inlineData: { data: image.data, mimeType: image.mimeType } },
      { text: prompt },
    ], 26000);
    if (raw) {
      raw.source = raw.source || `${platform} public preview + post text`;
      return { raw, meta, usedImage: true };
    }
  }

  if (textContext) {
    let raw = await generateStructured([
      { text: `${DESTINATION_PROMPT_INSTRUCTIONS}\n\nOnly public ${platform} post text/metadata is available; do not pretend to see the video.\n${textContext}` },
    ], 22000);
    raw ||= heuristicFromText(textContext);
    if (raw) {
      raw.source = raw.source || `${platform} public post text`;
      return { raw, meta, usedImage: false };
    }
  }

  return { raw: null, meta, usedImage: false };
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

    // 1) Primary: send the public YouTube URL directly to Gemini exactly as documented.
    const directResult = await analyzeYouTubeDirect(canonical, prompt);
    let raw = directResult.raw;
    let usedFullVideo = Boolean(raw);

    // 2) Fallback: if YouTube URL video processing is unavailable for this specific
    // video/model/quota, analyze the public YouTube thumbnail + title instead of
    // immediately failing the whole TripSpark flow.
    if (!raw) {
      console.warn('Full YouTube analysis failed; trying thumbnail + metadata fallback:', directResult.error);
      raw = await analyzeYouTubeThumbnail(videoId, meta, caption);
      usedFullVideo = false;
    }

    // 3) Last safe fallback: explicit title/caption location cues only. Never invent a city.
    if (!raw) raw = heuristicFromText([meta.title, caption].filter(Boolean).join(' | '));

    if (raw && (raw.country || raw.region_or_state || raw.city_or_destination || Number(raw.confidence || 0) >= 35)) {
      const analysis = normalizeAnalysis(raw, {
        inputSource: 'youtube_url',
        inputUrl: canonical,
        actualMediaAvailable: usedFullVideo,
        sourceFallback: usedFullVideo ? 'YouTube video' : 'YouTube thumbnail/title',
      });
      return {
        status: 200,
        body: {
          success: true,
          platform: 'YouTube',
          normalisedUrl: canonical,
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
        normalisedUrl: canonical,
        actualMediaAvailable: false,
        contentAccessStatus: 'unaccessible',
        mediaRestricted: true,
        message: 'TripSpark could open this YouTube link, but there was not enough reliable visual or text evidence to identify the destination. Try another public Short or upload a screenshot.',
        debugReason: directResult.error || 'No reliable video, thumbnail, or title result',
      },
    };
  }

  // Instagram/TikTok: first try PUBLIC Open Graph / embed preview metadata (caption, title, thumbnail).
  // This does not bypass platform privacy and does not claim to read the full video stream.
  if (isInstagram || isTikTok) {
    const platform = isInstagram ? 'Instagram' : 'TikTok';
    const preview = await analyzePublicSocialPreview(trimmedUrl, platform, caption);
    const raw = preview.raw;

    if (raw && (Number(raw.confidence || 0) >= 35) && (raw.country || raw.region_or_state || raw.city_or_destination)) {
      const analysis = normalizeAnalysis(raw, {
        inputSource: isInstagram ? 'instagram_reel' : 'tiktok_url',
        inputUrl: preview.meta?.canonical || trimmedUrl,
        actualMediaAvailable: Boolean(preview.usedImage),
        sourceFallback: preview.usedImage ? `${platform} public preview image + text` : `${platform} public post text`,
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
          mediaRestricted: false,
          analysisMethod: preview.usedImage ? 'public_preview_image_plus_metadata' : 'public_metadata_text',
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
        debugReason: preview.meta?.status ? `${platform} public page status ${preview.meta.status}; title=${Boolean(preview.meta.title)} description=${Boolean(preview.meta.description)} image=${Boolean(preview.meta.imageUrl)}` : `${platform} public metadata unavailable`,
      },
    };
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

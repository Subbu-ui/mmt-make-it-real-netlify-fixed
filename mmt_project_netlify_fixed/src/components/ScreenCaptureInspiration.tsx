import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  UploadCloud,
  Play,
  CheckCircle2,
  ArrowRight,
  Clipboard,
  Camera,
  HelpCircle,
  Film,
} from 'lucide-react';
import { DEMO_INSPIRATIONS } from '../data/demoData';
import { InspirationDemo, InspirationSource } from '../types';
import { normalizeSocialUrl } from '../services/socialAnalysisService';
import { generateTestImage } from '../utils/testImages';

interface ScreenCaptureInspirationProps {
  onSelectSource?: (source: InspirationSource) => void;
  onSelectInspiration?: (demo: InspirationDemo, customUrl?: string) => void;
  onSubmitInspiration?: (demoId: string) => void;
  onBackToHome?: () => void;
  onBack?: () => void;
}

export const ScreenCaptureInspiration: React.FC<ScreenCaptureInspirationProps> = ({
  onSelectSource,
  onSelectInspiration,
  onSubmitInspiration,
  onBackToHome,
  onBack,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const primaryBaliDemo =
    DEMO_INSPIRATIONS.find((d) => d.id === 'bali-villa') || DEMO_INSPIRATIONS[0];

  const TEST_GOA_REEL_URL = 'https://www.instagram.com/reel/DYqiIjOBKeC/';

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().startsWith('http')) {
          setInputUrl(text.trim());
          return;
        }
      }
    } catch {
      // ignore
    }
    setInputUrl(TEST_GOA_REEL_URL);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setScreenshotPreview(result);
        setScreenshotBase64(result);
        setScreenshotUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (typeof onBackToHome === 'function') {
      onBackToHome();
    } else if (typeof onBack === 'function') {
      onBack();
    }
  };

  const handleCustomSubmit = () => {
    if (screenshotBase64) {
      const source: InspirationSource = {
        type: 'UPLOADED_IMAGE',
        base64: screenshotBase64,
        previewUrl: screenshotPreview || undefined,
      };
      if (onSelectSource) {
        onSelectSource(source);
      }
      return;
    }

    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setInputUrl(TEST_GOA_REEL_URL);
      const normalized = normalizeSocialUrl(TEST_GOA_REEL_URL);
      const source: InspirationSource = {
        type: 'INSTAGRAM_URL',
        url: normalized.normalisedUrl,
      };
      if (onSelectSource) {
        onSelectSource(source);
      }
      return;
    }

    const normalized = normalizeSocialUrl(trimmed);
    let source: InspirationSource;

    if (normalized.platform === 'Instagram') {
      source = {
        type: 'INSTAGRAM_URL',
        url: normalized.normalisedUrl,
      };
    } else if (normalized.platform === 'YouTube') {
      source = {
        type: 'YOUTUBE_URL',
        url: normalized.normalisedUrl,
      };
    } else {
      source = {
        type: 'WEB_URL',
        url: normalized.normalisedUrl,
      };
    }

    if (onSelectSource) {
      onSelectSource(source);
    } else if (onSelectInspiration) {
      onSelectInspiration(primaryBaliDemo, trimmed);
    }
  };

  const handleTestBangalore = () => {
    const img = generateTestImage('bangalore');
    setScreenshotPreview(img);
    setScreenshotBase64(img);
    setScreenshotUploaded(true);
  };

  const handleTestRestrictedReel = () => {
    setInputUrl(TEST_GOA_REEL_URL);
  };

  const handleTestGoa = () => {
    const img = generateTestImage('goa');
    setScreenshotPreview(img);
    setScreenshotBase64(img);
    setScreenshotUploaded(true);
  };

  const handleSelectDemoCard = (demo: InspirationDemo) => {
    const source: InspirationSource = {
      type: 'DEMO',
      demoId: demo.id,
    };
    if (onSelectSource) {
      onSelectSource(source);
    } else if (onSelectInspiration) {
      onSelectInspiration(demo);
    } else if (onSubmitInspiration) {
      onSubmitInspiration(demo.id);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto pb-16">
      {/* Header & Breadcrumb */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#008CFF] transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back to MMT Home</span>
        </button>
        <span className="text-xs font-bold text-[#008CFF] bg-[#EAF6FF] px-2.5 py-0.5 rounded-full">
          MMT Make It Real
        </span>
      </div>

      {/* Main Inspiration Input Card (Section 8 Specification) */}
      <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-xs border border-slate-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6FF] text-[#008CFF] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Holiday Packages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Turn Social Inspiration into a Real Trip
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B]">
            Paste Instagram Reel, YouTube Shorts, or upload a travel screenshot.
          </p>
        </div>

        {/* Large Input Box (Section 8 Mandate) */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-2xl bg-[#F5F5F5] border-2 border-slate-200 focus-within:border-[#008CFF] focus-within:bg-white transition-all">
            <div className="flex items-center pl-3 text-slate-400">
              <LinkIcon className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
              placeholder="Paste link here (e.g. instagram.com/reel/...)"
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCustomSubmit}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#42B8F5] to-[#0065F5] hover:brightness-105 active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shrink-0"
            >
              <span>ANALYZE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Below the input: Two Action Buttons (Section 8 Mandate) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#008CFF] text-slate-800 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Clipboard className="w-3.5 h-3.5 text-[#008CFF]" />
              <span>Paste from Clipboard</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#008CFF] text-slate-800 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-[#008CFF]" />
              <span>Upload Screenshot / Video</span>
            </button>
          </div>

          {/* Screenshot Preview Card if uploaded */}
          {screenshotPreview && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={screenshotPreview}
                  alt="Uploaded preview"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-300"
                />
                <div className="text-xs">
                  <p className="font-black text-[#111111]">Screenshot Loaded</p>
                  <p className="text-[11px] text-[#6B6B6B]">Ready for Multimodal AI visual analysis.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCustomSubmit}
                className="px-4 py-2 rounded-xl bg-[#008CFF] text-white text-xs font-black shadow-xs hover:bg-[#006CFF] cursor-pointer"
              >
                Analyze Screenshot →
              </button>
            </div>
          )}

          {/* Quick Test Presets (preserved for testing) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-bold">Quick test:</span>
            <button
              type="button"
              onClick={handleTestRestrictedReel}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Instagram Reel (DYqiIjOBKeC)
            </button>
            <button
              type="button"
              onClick={handleTestBangalore}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Bangalore OCR
            </button>
            <button
              type="button"
              onClick={handleTestGoa}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Goa Sunset
            </button>
          </div>
        </div>

        {/* Section 8: Quick Inspiration Samples */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
              Or try these trending reels:
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Instant one-tap analysis
            </span>
          </div>

          {/* 3 Horizontal Cards (Section 8 Mandate): Goa, Bali, Manali */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_INSPIRATIONS.map((demo) => {
              const estimatedPrice = demo.budgetOption?.costPerPerson || 34800;

              return (
                <div
                  key={demo.id}
                  onClick={() => handleSelectDemoCard(demo)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#008CFF] transition-all bg-white hover:shadow-sm cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={demo.thumbnail}
                        alt={demo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white text-[10px]">
                        <span className="font-bold flex items-center gap-1">
                          <Film className="w-3 h-3 text-[#42B8F5]" />
                          <span>Reel</span>
                        </span>
                        <span className="bg-black/60 px-1.5 py-0.2 rounded font-mono text-[9px]">
                          0:30
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-[#111111] line-clamp-1 group-hover:text-[#008CFF] transition-colors">
                        {demo.title}
                      </h4>
                      <p className="text-[11px] text-[#008CFF] font-bold">
                        📍 {demo.destination}, {demo.country}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#6B6B6B] block">From</span>
                      <span className="font-black text-[#111111]">
                        ₹{estimatedPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-[#008CFF] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Select</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

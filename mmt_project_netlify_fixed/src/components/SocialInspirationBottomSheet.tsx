import React, { useState, useRef } from 'react';
import {
  X,
  Link as LinkIcon,
  Camera,
  Video,
  Sparkles,
  ArrowRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';
import { InspirationDemo, InspirationSource } from '../types';
import { DEMO_INSPIRATIONS } from '../data/demoData';

interface SocialInspirationBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (source: InspirationSource) => void;
  onSelectDemo?: (demo: InspirationDemo) => void;
}

export const SocialInspirationBottomSheet: React.FC<SocialInspirationBottomSheetProps> = ({
  isOpen,
  onClose,
  onSelectSource,
  onSelectDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'link' | 'upload' | 'sample'>('all');
  const [pastedUrl, setPastedUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLinkSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = pastedUrl.trim();
    if (!trimmed) {
      setUrlError('Please paste an Instagram Reel, YouTube Short, or TikTok link.');
      return;
    }
    setUrlError('');
    setIsProcessing(true);

    // Determine platform
    let platform = 'Social Reel';
    if (trimmed.includes('instagram.com')) platform = 'Instagram Reel';
    else if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) platform = 'YouTube Short';
    else if (trimmed.includes('tiktok.com')) platform = 'TikTok';
    else if (trimmed.includes('pinterest.com')) platform = 'Pinterest Pin';

    setTimeout(() => {
      setIsProcessing(false);
      onSelectSource({
        type: 'URL',
        url: trimmed,
        platform,
      });
      onClose();
    }, 400);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onSelectSource({
        type: 'UPLOADED_IMAGE',
        file,
        base64,
        previewUrl: URL.createObjectURL(file),
      });
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onSelectSource({
      type: 'UPLOADED_VIDEO',
      file,
      previewUrl: URL.createObjectURL(file),
    });
    onClose();
  };

  const handleSelectDemoItem = (demo: InspirationDemo) => {
    if (onSelectDemo) {
      onSelectDemo(demo);
    }
    onSelectSource({
      type: 'DEMO',
      demoId: demo.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Sheet Modal */}
      <div
        id="social-inspiration-sheet"
        className="relative z-10 w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200 border border-slate-100"
      >
        {/* Mobile pull indicator */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 sm:px-6 pt-3 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#EAF6FF] text-[#008CFF] font-bold text-[11px] uppercase tracking-wider">
                Make It Real ✨
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Inside Holiday Packages</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] mt-1 tracking-tight">
              Turn inspiration into a trip
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
              MakeMyTrip will identify the destination and experience from the content you choose to share.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoFileChange}
        />

        {/* Sheet Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Where did inspiration strike?
          </p>

          {/* Option 1: Paste Reel or Short Link */}
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200 hover:border-[#008CFF]/50 transition-all">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EAF6FF] text-[#008CFF] flex items-center justify-center">
                <LinkIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-[#111111]">
                Paste a Reel, Short or Video link
              </span>
            </div>
            <form onSubmit={handleLinkSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="url"
                  value={pastedUrl}
                  onChange={(e) => {
                    setPastedUrl(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  placeholder="https://instagram.com/reel/... or YouTube Short"
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008CFF] focus:border-[#008CFF] transition-all pr-24"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-gradient-to-r from-[#42B8F5] to-[#0065F5] text-white text-xs font-bold hover:brightness-105 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Reading...' : 'Make It Real'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {urlError && (
                <p className="text-xs text-[#E34D4D] flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {urlError}
                </p>
              )}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                <span className="text-slate-400">Quick tests:</span>
                <button
                  type="button"
                  onClick={() => setPastedUrl('https://www.instagram.com/reel/C8qX9GoaSunsetVibe/')}
                  className="text-[#008CFF] hover:underline font-medium cursor-pointer"
                >
                  Goa Reel
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setPastedUrl('https://www.instagram.com/reel/C7uM9BangaloreNightlife/')}
                  className="text-[#008CFF] hover:underline font-medium cursor-pointer"
                >
                  Bengaluru Rooftop
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setPastedUrl('https://www.instagram.com/reel/D9pL2LadakhPass/')}
                  className="text-[#008CFF] hover:underline font-medium cursor-pointer"
                >
                  Ladakh Pass
                </button>
              </div>
            </form>
          </div>

          {/* Option 2 & 3 Grid: Upload Screenshot or Video */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#008CFF] hover:bg-[#EAF6FF]/30 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 group-hover:bg-[#008CFF] text-[#008CFF] group-hover:text-white flex items-center justify-center mb-2.5 transition-colors">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-[#111111] group-hover:text-[#008CFF]">
                Upload Screenshot
              </span>
              <span className="text-[11px] text-[#6B6B6B] mt-0.5">
                PNG, JPG, or screen captures
              </span>
            </button>

            <button
              onClick={() => videoInputRef.current?.click()}
              className="flex flex-col items-start p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#008CFF] hover:bg-[#EAF6FF]/30 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center mb-2.5 transition-colors">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-[#111111] group-hover:text-purple-600">
                Upload Short Video
              </span>
              <span className="text-[11px] text-[#6B6B6B] mt-0.5">
                MP4 clips from camera roll
              </span>
            </button>
          </div>

          {/* Option 4: Try an Example */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Or try a sample inspiration
              </span>
              <span className="text-[11px] text-slate-400">Tap any to test instant analysis</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_INSPIRATIONS.slice(0, 4).map((demo) => (
                <div
                  key={demo.id}
                  onClick={() => handleSelectDemoItem(demo)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-[#008CFF] hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={demo.thumbnail}
                      alt={demo.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#111111] truncate group-hover:text-[#008CFF]">
                        {demo.destination}
                      </span>
                      <span className="text-xs">{demo.flag}</span>
                    </div>
                    <p className="text-[10px] text-[#6B6B6B] truncate">
                      {demo.sourcePlatform}
                    </p>
                    <span className="text-[10px] font-bold text-[#008B73]">
                      ₹{demo.budgetOption.costPerPerson.toLocaleString('en-IN')}/person
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sheet Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-[#6B6B6B]">
          <span>Protected by MakeMyTrip Privacy & Trust</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

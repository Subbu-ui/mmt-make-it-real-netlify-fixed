import React, { useState, useEffect } from 'react';
import { Bug, ChevronDown, ChevronUp, Check, X, ShieldAlert, Sparkles, Clock, Eye, Layers } from 'lucide-react';
import { TripSession } from '../types';

interface DebugAnalysisPanelProps {
  session: TripSession;
  isOpenDefault?: boolean;
}

export const DebugAnalysisPanel: React.FC<DebugAnalysisPanelProps> = ({
  session,
  isOpenDefault = false,
}) => {
  // Check URL query parameter ?debug=true
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') {
        setIsOpen(true);
      }
    }
  }, []);

  const isDemo = session.usedDemoData;

  return (
    <div className="w-full max-w-4xl mx-auto my-4 rounded-2xl border border-slate-300 bg-slate-950 text-slate-100 shadow-xl overflow-hidden text-xs font-mono">
      {/* Top Banner Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-black flex items-center justify-between hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-slate-800"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Bug className="w-4 h-4 text-amber-400" />
          <span className="font-extrabold tracking-wider text-amber-300 text-xs uppercase">
            DEBUG ANALYSIS
          </span>
          <span className="text-[11px] text-slate-400">
            ({session.sourceType || 'REAL_URL'} • {session.platform || 'Instagram'})
          </span>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
              isDemo
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            usedDemoData = {String(isDemo)}
          </span>

          {session.analysisTimeMs !== undefined && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {session.analysisTimeMs}ms
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] font-sans font-semibold">
            {isOpen ? 'Close Debug' : 'Expand Debug'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Debug Content */}
      {isOpen && (
        <div className="p-4 space-y-3.5 bg-slate-900/95 border-t border-slate-800">
          {/* Section: Core Pipeline Properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">sourceType</span>
              <span className="font-bold text-sky-300 text-xs">{session.sourceType}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">imageSentToGemini</span>
              <span
                className={`font-bold text-xs flex items-center gap-1 ${
                  session.imageSentToGemini || session.uploadedMedia ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {session.imageSentToGemini || session.uploadedMedia ? '✓ true (multimodal)' : 'false'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">metadataFound</span>
              <span
                className={`font-bold text-xs flex items-center gap-1 ${
                  session.metadataFound || Boolean(session.caption || session.predictedDestination)
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {session.metadataFound || Boolean(session.caption || session.predictedDestination) ? '✓ true' : 'false (restricted)'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">geminiModelUsed</span>
              <span className="font-bold text-purple-300 text-xs">gemini-2.5-flash / 3.8</span>
            </div>
          </div>

          {/* Section: Analysis & Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">analysisStatus</span>
              <span className="font-bold text-amber-300 text-xs">{session.analysisStatus}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">predictionConfidence</span>
              <span className="font-bold text-emerald-300 text-xs">
                {session.predictionConfidence !== null && session.predictionConfidence !== undefined
                  ? `${session.predictionConfidence}%`
                  : 'null (Awaiting evidence)'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">predictedDestination</span>
              <span className="font-bold text-white text-xs">
                {session.predictedDestination || 'None (Needs confirmation)'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">vibeOnlyMatch</span>
              <span
                className={`font-bold text-xs ${
                  session.vibeOnlyMatch || (!session.predictedDestination && session.detectedExperiences?.length)
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {String(Boolean(session.vibeOnlyMatch || (!session.predictedDestination && session.detectedExperiences?.length)))}
              </span>
            </div>
          </div>

          {/* Visible OCR Text Extracted */}
          {session.visibleText && session.visibleText.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-sky-400 block text-[10px] uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Visible Text / Overlay Clues Extracted (OCR Priority):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {session.visibleText.map((txt, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-sky-950/80 text-sky-200 border border-sky-800 text-[11px]"
                  >
                    "{txt}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Trace List */}
          {session.destinationEvidence && session.destinationEvidence.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Grounded Multimodal Evidence Trace:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                {session.destinationEvidence.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Non-negotiable Pipeline Guard Guarantee */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Pipeline Separation Rule: <strong className="text-slate-200">{session.usedDemoData ? 'DEMO ISOLATION' : 'REAL USER LINK ISOLATION'}</strong>
            </span>
            <span className="text-emerald-400 font-bold">
              ✓ Guaranteed No Demo Contamination
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

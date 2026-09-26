import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/90 backdrop-blur-xs py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
          <Award className="w-3.5 h-3.5 text-[#e41d2d]" />
          <span>MakeMyTrip Young Turks Business Challenge 2026 Submission</span>
        </div>

        {/* Mandatory Prompt Disclaimer */}
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          “Concept prototype for the MakeMyTrip Young Turks Business Challenge.
          <br className="hidden sm:inline" />
          Not an official MakeMyTrip product release.
          All prices, flight schedules and hotel availabilities shown are illustrative prototype estimates.”
        </p>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-4">
          <span>MMT Make It Real™ Concept</span>
          <span>•</span>
          <span>“Saw it. Loved it. Let’s make it happen.”</span>
          <span>•</span>
          <span>Evaluation Prototype</span>
        </div>
      </div>
    </footer>
  );
};

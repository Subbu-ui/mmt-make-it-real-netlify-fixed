import React, { useState } from 'react';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { ScreenStep } from '../types';

interface CompetitionJudgePanelProps {
  currentStep: ScreenStep;
  onJumpToStep: (step: ScreenStep) => void;
  analyticsLog: { event: string; timestamp: string; details?: string }[];
}

export const CompetitionJudgePanel: React.FC<CompetitionJudgePanelProps> = ({
  currentStep,
  onJumpToStep,
  analyticsLog,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'screens' | 'analytics'>('screens');

  const screensList: { step: ScreenStep; label: string; stage: string }[] = [
    { step: 'home', label: '1. MMT Home Entrypoint', stage: 'Discovery' },
    { step: 'capture', label: '2. Capture Inspiration Screen', stage: 'Input' },
    { step: 'analysis', label: '4. Inspiration & Vibe Analysis', stage: 'Intent' },
    { step: 'traveller_inputs', label: '5. Traveller Count & Type', stage: 'Group' },
    { step: 'trip_constraints', label: '6. Budget & Dates Constraints', stage: 'Constraints' },
    { step: 'feasibility_check', label: '7. Feasibility Check Score', stage: 'Diagnosis' },
    { step: 'hero_three_ways', label: '8. HERO: One Reel. Three Ways.', stage: 'Hero' },
    { step: 'deep_dive_recreate', label: '9. Deep Dive: Recreate It', stage: 'Detail' },
    { step: 'deep_dive_budget', label: '10. Deep Dive: Do It For Less', stage: 'Detail' },
    { step: 'deep_dive_vibe', label: '11. Deep Dive: Match The Vibe', stage: 'Detail' },
    { step: 'comparison_table', label: '12. What Stayed vs What Changed', stage: 'Matrix' },
    { step: 'trip_blueprint', label: '13. Feasible Trip Blueprint', stage: 'Itinerary' },
    { step: 'mmt_cart', label: '14. MMT Trip Cart', stage: 'Booking' },
    { step: 'price_comparison', label: '14b. Multimodal Route Comparison', stage: 'Inventory' },
    { step: 'price_savings', label: '15. Smart Savings Insights', stage: 'Optimization' },
    { step: 'group_module', label: '16. Group Travel Feature', stage: 'Social' },
    { step: 'final_cta', label: '17. Final Booking Hub', stage: 'Conversion' },
  ];

  return (
    <div className="fixed bottom-3 right-3 z-50 max-w-md w-[calc(100vw-24px)] sm:w-96">
      <div className="bg-[#041533] text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Toggle Button Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold bg-slate-900/90 hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Young Turks Jury Panel</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              60s Guide
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {isOpen ? 'Minimize' : 'Jump Screens'}
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('screens')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  activeTab === 'screens' ? 'bg-[#008cff] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                14 Prototype Screens
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === 'analytics' ? 'bg-[#008cff] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>Funnel Log ({analyticsLog.length})</span>
              </button>
            </div>

            {activeTab === 'screens' ? (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-300 mb-2">
                  Jump directly to any screen in the evaluation flow:
                </p>
                {screensList.map((s) => {
                  const isActive = currentStep === s.step;
                  return (
                    <button
                      key={s.step}
                      onClick={() => {
                        onJumpToStep(s.step);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{s.label}</span>
                      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        isActive ? 'bg-slate-900 text-amber-300' : 'text-slate-500 bg-slate-900'
                      }`}>
                        {s.stage}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300">
                  Real-time simulated MMT conversion funnel analytics:
                </p>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {analyticsLog.slice().reverse().map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px]"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-mono text-emerald-400">{log.event}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      {log.details && (
                        <p className="text-slate-300 mt-0.5 text-[10px]">{log.details}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, MessageCircle, PhoneCall, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface FloatingMyraWidgetProps {
  currentStep: string;
  destinationName?: string;
  onApplyPrompt?: (prompt: string) => void;
}

export const FloatingMyraWidget: React.FC<FloatingMyraWidgetProps> = ({
  currentStep,
  destinationName = 'Goa',
  onApplyPrompt,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  // Show only in appropriate post-analysis stages (options, blueprint, cart, etc.)
  const shouldShow = [
    'hero_three_ways',
    'why_this_option',
    'trip_blueprint',
    'mmt_cart',
    'price_comparison',
    'price_savings',
    'feasibility_check',
  ].includes(currentStep);

  if (!shouldShow) return null;

  const quickPrompts = [
    `Ask Myra to make this ${destinationName} trip cheaper`,
    'Ask Myra for a family-friendly villa option',
    'Ask Myra to add water sports on Day 2',
    'Ask Myra to optimize flight departure times',
  ];

  const handlePromptClick = (prompt: string) => {
    if (onApplyPrompt) onApplyPrompt(prompt);
    setIsOpen(false);
  };

  const handleSendQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput) return;
    setQuoteSent(true);
    setTimeout(() => {
      setIsOpen(false);
      setQuoteSent(false);
      setPhoneInput('');
    }, 2000);
  };

  return (
    <>
      {/* Floating Action Button: "GET HELP / GET A QUOTE" */}
      <div className="fixed bottom-18 sm:bottom-6 right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        <button
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2 rounded-full bg-gradient-to-r from-[#008CFF] via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <span>GET HELP / GET A QUOTE</span>
        </button>
      </div>

      {/* Slide-in Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#111111]">
                    Need help finalising your trip?
                  </h3>
                  <p className="text-[11px] text-[#6B6B6B]">
                    Assisted by MakeMyTrip Holiday Experts & Myra AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Myra AI Prompts */}
            <div className="py-3 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ask Myra AI:
              </p>
              <div className="space-y-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-[#EAF6FF] text-slate-700 hover:text-[#008CFF] text-xs font-medium border border-slate-200 hover:border-[#008CFF]/50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#008CFF] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Request Official Holiday Package Quote */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Request MMT Holiday Package Quote:
              </p>
              {quoteSent ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Request received! An MMT travel specialist will contact you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSendQuoteRequest} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008CFF]"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#008CFF] hover:bg-[#006CFF] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Call Me
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    No spam. MakeMyTrip verified travel counsellors only.
                  </span>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

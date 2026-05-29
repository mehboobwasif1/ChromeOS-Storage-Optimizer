import React, { useState } from "react";
import { ADVISOR_STEPS } from "../data";
import { AdvisorCategory } from "../types";
import { Info, HelpCircle, ArrowRight, CheckCircle2, ChevronRight, Minimize2, Trash2 } from "lucide-react";

interface GuidedStepsProps {
  hasLinux: boolean;
  hasAndroid: boolean;
}

export default function GuidedSteps({ hasLinux, hasAndroid }: GuidedStepsProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("browser-cache");

  // Filter based on selected subsystems
  const filteredCategories = ADVISOR_STEPS.filter((category) => {
    if (category.id === "linux-settings" && !hasLinux) return false;
    if (category.id === "android-apps" && !hasAndroid) return false;
    return true;
  });

  const activeCategory = filteredCategories.find((c) => c.id === selectedCategoryId) || filteredCategories[0];

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
  };

  return (
    <div id="guided-steps-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Categories Selector list (Left side: 4 cols) */}
      <div className="lg:col-span-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
          Subsystem Space Advisors
        </h3>
        {filteredCategories.map((category) => {
          const isActive = category.id === activeCategory?.id;
          return (
            <button
              key={category.id}
              id={`select-step-btn-${category.id}`}
              onClick={() => handleCategorySelect(category.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 group relative overflow-hidden ${
                isActive
                  ? "bg-slate-900 border-sky-500/50 text-white shadow-md shadow-sky-500/5"
                  : "bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-900/60 hover:border-slate-800"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded" />
              )}
              <div className={`p-2 rounded-lg transition-colors ${
                isActive ? "bg-sky-500/10 text-sky-400" : "bg-slate-950 text-slate-400 border border-slate-900 group-hover:text-slate-300"
              }`}>
                {category.id === "browser-cache" && <Trash2 className="h-4 w-4" />}
                {category.id === "google-drive-offline" && <Minimize2 className="h-4 w-4" />}
                {category.id === "linux-settings" && <CheckCircle2 className="h-4 w-4" />}
                {category.id === "android-apps" && <HelpCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm block leading-snug truncate">
                  {category.title}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5 line-clamp-1">
                  Reclams: {category.estimatedSaving}
                </span>
              </div>
              <ChevronRight className={`h-4 w-4 mt-1 transition-transform self-center ${isActive ? "text-sky-400 translate-x-0.5" : "text-slate-600 group-hover:text-slate-400"}`} />
            </button>
          );
        })}
      </div>

      {/* Steps Reader (Right side: 8 cols) */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        {activeCategory ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="font-bold text-lg text-white leading-normal">
                  {activeCategory.title}
                </h3>
              </div>
              <span className="shrink-0 self-start sm:self-center px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 rounded-full">
                Est. Reclaimed Space: {activeCategory.estimatedSaving}
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-5 leading-relaxed bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/40">
              {activeCategory.description}
            </p>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Execution Steps
              </h4>
              <ol className="space-y-4">
                {activeCategory.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm">
                    <span className="flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs h-5.5 w-5.5 rounded-full bg-slate-950 text-sky-400 border border-slate-800/80 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 leading-normal">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Info className="h-10 w-10 text-slate-600 mb-2" />
            <p className="text-sm">Please select an advisor category to view details.</p>
          </div>
        )}

        {/* Warning card footer info */}
        {activeCategory && (
          <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-start space-x-3.5 text-xs text-amber-300 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
            <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-200 uppercase tracking-wide text-[10px] mb-1">Important System Guideline</span>
              <span className="leading-normal block text-slate-300">{activeCategory.visualTip}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

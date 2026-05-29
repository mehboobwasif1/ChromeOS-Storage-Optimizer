import React, { useState } from "react";
import { DeviceProfile } from "./types";
import { DEFAULT_CHROMBOOK_PROFILES } from "./data";
import DeviceProfiler from "./components/DeviceProfiler";
import GuidedSteps from "./components/GuidedSteps";
import ScriptGenerator from "./components/ScriptGenerator";
import AIParsingCompanion from "./components/AIParsingCompanion";
import OneClickWizard from "./components/OneClickWizard";
import { HardDrive, CheckCircle2, AlertTriangle, Cpu, Terminal, Compass, ShieldAlert, Sparkles, Wand2, Zap } from "lucide-react";

export default function App() {
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile>(DEFAULT_CHROMBOOK_PROFILES[0]);
  const [activeTab, setActiveTab] = useState<"wizard" | "advisor" | "script" | "ai-assistant">("wizard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Simulated metrics based on system profile toggles
  const systemBaseSize = 18.2;
  const webSpace = activeTab === "wizard" && refreshTrigger > 0 ? 1.2 : 4.8;
  const linuxSpace = deviceProfile.hasLinux ? (activeTab === "wizard" && refreshTrigger > 0 ? 8.2 : 14.5) : 0.0;
  const androidSpace = deviceProfile.hasAndroid ? (activeTab === "wizard" && refreshTrigger > 0 ? 3.1 : 6.2) : 0.0;
  const otherUsers = 1.1;

  const totalUsed = systemBaseSize + webSpace + linuxSpace + androidSpace + otherUsers;
  const availableSpace = Math.max(0.5, deviceProfile.storageSizeGb - totalUsed);
  const usedPercent = Math.min(100, Math.round((totalUsed / deviceProfile.storageSizeGb) * 100));

  // Potential reclaim size calculation
  let potentialSavingsGb = 0.0;
  if (refreshTrigger === 0) {
    potentialSavingsGb += 2.2; // Browser caches average
    potentialSavingsGb += 4.5; // Drive offline syncs average
    if (deviceProfile.hasLinux) potentialSavingsGb += 3.8; // Linux APT caches, logs, docker
    if (deviceProfile.hasAndroid) potentialSavingsGb += 2.4; // Android apps caches
  } else {
    potentialSavingsGb = 0.5; // Already optimized state
  }

  const handleRefreshMetrics = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500/10">
      {/* Navigation Top Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl text-white shadow-lg shadow-sky-500/10">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg tracking-tight text-white leading-none">
                  ChromeOS Storage Optimizer
                </h1>
                <span className="text-[10px] bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-mono font-medium">
                  R114+ draws
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">System profile-aware disk storage diagnostics</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs bg-slate-950 border border-slate-900 rounded-lg p-1">
            <span className="inline-flex items-center gap-1.5 text-slate-400 py-1 px-2.5 rounded font-medium">
              <Cpu className="h-3.5 w-3.5" /> HP Chromebook 14 G7
            </span>
          </div>
        </div>
      </header>

      {/* Main Container contents */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Warning Alert Banner if Space is extremely Critical */}
        {usedPercent > 70 && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl flex items-start space-x-3 text-sm animate-fade-in shadow-lg shadow-amber-500/1 text-slate-350">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="font-bold text-amber-200">Storage capacity Alert!</strong> Your HP Chromebook is currently at {usedPercent}% disk capacity ({Math.round(totalUsed)}GB used). Space constraints on ChromeOS cause Android apps to crash, web sync processes to lock, and slow down core browser performance. Follow the guides below to reclaim disk space immediately.
            </div>
          </div>
        )}

        {/* Top Split Layout: System Breakdown Stats & Device Profiler */}
        <div id="dashboard-hero-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Dynamic Disk Space Visualizer card - 5 grid cols */}
          <section className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider">Device Disk partition Map</h3>
                  <p className="text-xs text-slate-500">Live simulation of your eMMC disk allocation levels</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white block">
                    {Math.round(totalUsed)}
                    <span className="text-xs font-medium text-slate-400"> / {deviceProfile.storageSizeGb} GB</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({usedPercent}% Allocated)</span>
                </div>
              </div>

              {/* Graphical Progress Segment Bar */}
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                {/* System */}
                <span style={{ width: `${(systemBaseSize / deviceProfile.storageSizeGb) * 100}%` }} className="bg-slate-650 inline-block h-full border-r border-slate-900" title="ChromeOS core" />
                {/* Web Cache */}
                <span style={{ width: `${(webSpace / deviceProfile.storageSizeGb) * 100}%` }} className="bg-sky-500 inline-block h-full border-r border-slate-900" title="Chrome cache & drive offline files" />
                {/* Linux crostini */}
                {deviceProfile.hasLinux && (
                  <span style={{ width: `${(linuxSpace / deviceProfile.storageSizeGb) * 100}%` }} className="bg-indigo-500 inline-block h-full border-r border-slate-900" title="Linux Subsystem partition" />
                )}
                {/* Android partition */}
                {deviceProfile.hasAndroid && (
                  <span style={{ width: `${(androidSpace / deviceProfile.storageSizeGb) * 100}%` }} className="bg-emerald-500 inline-block h-full border-r border-slate-900" title="Android app overlays" />
                )}
                {/* Available empty */}
                <span className="bg-slate-950 flex-1 inline-block h-full" title="Free spaces" />
              </div>

              {/* Mini Legend labels to identify partition divisions */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 text-[11px] text-slate-400 border-t border-slate-800/40">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-slate-600 block flex-shrink-0" />
                  <span className="truncate">ChromeOS Base: {Math.round(systemBaseSize)}GB</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-sky-500 block flex-shrink-0" />
                  <span className="truncate">Web cache: {Math.round(webSpace)}GB</span>
                </div>
                {deviceProfile.hasLinux && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 block flex-shrink-0" />
                    <span className="truncate">Crostini: {Math.round(linuxSpace)}GB</span>
                  </div>
                )}
                {deviceProfile.hasAndroid && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-50 block flex-shrink-0" />
                    <span className="truncate">Android Play: {Math.round(androidSpace)}GB</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 min-w-0 col-span-2 sm:col-span-1">
                  <span className="h-2 w-2 rounded-full bg-slate-900 border border-slate-800 block flex-shrink-0" />
                  <span className="truncate font-semibold text-slate-300">Free Space: {availableSpace.toFixed(1)}GB</span>
                </div>
              </div>
            </div>

            {/* Estimated Clean Savings Badge container */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 bg-sky-500/[0.02] p-4 rounded-xl border border-sky-500/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                  <Wand2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Estimated Potential Space Saved</span>
                  <span className="text-sm text-slate-200">With recommended cleanups of categories</span>
                </div>
              </div>
              <span className="text-xl font-display font-extrabold text-emerald-400 tracking-tight">
                ~{potentialSavingsGb.toFixed(1)} GB
              </span>
            </div>
          </section>

          {/* Interactive Profile Switcher - 7 grid cols */}
          <section className="lg:col-span-7">
            <DeviceProfiler profile={deviceProfile} onChange={setDeviceProfile} />
          </section>
        </div>

        {/* Tab view filters */}
        <section className="space-y-6">
          <div className="border-b border-slate-900 flex flex-wrap gap-1 md:gap-2">
            <button
              id="tab-wizard-btn"
              onClick={() => setActiveTab("wizard")}
              className={`pb-3.5 px-4 font-semibold text-sm transition-all relative ${
                activeTab === "wizard"
                  ? "text-sky-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {activeTab === "wizard" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded" />
              )}
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                ⚡ Easy 1-Click Optimizer
              </span>
            </button>

            <button
              id="tab-advisor-btn"
              onClick={() => setActiveTab("advisor")}
              className={`pb-3.5 px-4 font-semibold text-sm transition-all relative ${
                activeTab === "advisor"
                  ? "text-sky-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {activeTab === "advisor" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded" />
              )}
              <span className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Guided Chromebook UI Guides
              </span>
            </button>

            <button
              id="tab-script-btn"
              onClick={() => setActiveTab("script")}
              className={`pb-3.5 px-4 font-semibold text-sm transition-all relative ${
                activeTab === "script"
                  ? "text-sky-450"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {activeTab === "script" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded" />
              )}
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Linux Crostini Bash Script compiler
              </span>
            </button>

            <button
              id="tab-ai-btn"
              onClick={() => setActiveTab("ai-assistant")}
              className={`pb-3.5 px-4 font-semibold text-sm transition-all relative ${
                activeTab === "ai-assistant"
                  ? "text-sky-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {activeTab === "ai-assistant" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded" />
              )}
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-400" />
                AI Log & Terminal Companion
              </span>
            </button>
          </div>

          {/* Active Tab rendering container */}
          <div className="transition-all duration-305">
            {activeTab === "wizard" && (
              <OneClickWizard deviceProfile={deviceProfile} onRefreshMetrics={handleRefreshMetrics} />
            )}

            {activeTab === "advisor" && (
              <GuidedSteps hasLinux={deviceProfile.hasLinux} hasAndroid={deviceProfile.hasAndroid} />
            )}

            {activeTab === "script" && (
              <ScriptGenerator hasLinux={deviceProfile.hasLinux} hasAndroid={deviceProfile.hasAndroid} />
            )}

            {activeTab === "ai-assistant" && (
              <AIParsingCompanion deviceProfile={deviceProfile} />
            )}
          </div>
        </section>
      </main>

      {/* Footer system details */}
      <footer className="border-t border-slate-900 bg-slate-900/10 py-6 mt-16 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            Chromebook Storage Optimizer • Specifically designed for core Drawman ChromeOS versions and HP specs safely.
          </p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1" /> Ready for Safe Diagnostics
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

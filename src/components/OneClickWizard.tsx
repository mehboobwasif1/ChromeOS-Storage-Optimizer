import React, { useState, useEffect } from "react";
import { DeviceProfile } from "../types";
import { 
  Sparkles, 
  Wand2, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  HardDrive, 
  Activity, 
  Layers, 
  ChevronRight, 
  Copy, 
  Check, 
  Play, 
  ExternalLink,
  Info,
  Shield,
  HelpCircle
} from "lucide-react";

interface OneClickWizardProps {
  deviceProfile: DeviceProfile;
  onRefreshMetrics: () => void;
}

export default function OneClickWizard({ deviceProfile, onRefreshMetrics }: OneClickWizardProps) {
  const [scanState, setScanState] = useState<"idle" | "scanning" | "scanned" | "cleaning" | "cleaned">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState("");
  const [cleanProgress, setCleanProgress] = useState(0);
  const [cleanStep, setCleanStep] = useState("");
  
  const [selectedTargets, setSelectedTargets] = useState({
    browserCache: true,
    googleDriveOffline: true,
    linuxPackages: deviceProfile.hasLinux,
    linuxLogs: deviceProfile.hasLinux,
    linuxCaches: false,
    androidCaches: deviceProfile.hasAndroid
  });

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeManualHelper, setActiveManualHelper] = useState<string | null>(null);

  // Dynamic savings based on check selection
  const getSavings = () => {
    let saved = 0.0;
    if (selectedTargets.browserCache) saved += 2.2;
    if (selectedTargets.googleDriveOffline) saved += 4.5;
    if (selectedTargets.linuxPackages) saved += 1.8;
    if (selectedTargets.linuxLogs) saved += 1.2;
    if (selectedTargets.linuxCaches) saved += 1.5;
    if (selectedTargets.androidCaches) saved += 2.4;
    return saved;
  };

  // Run simulated scan
  const startScan = () => {
    setScanState("scanning");
    setScanProgress(0);
    setScanStep("Initializing scan protocols...");

    const steps = [
      { prg: 15, text: "Analyzing Google Chrome local caches..." },
      { prg: 35, text: "Scanning offline synced Google Drive indexes..." },
      { prg: 55, text: deviceProfile.hasLinux ? "Querying Crostini Debian Linux partition allocations..." : "Skipping Linux subsystems (not configured)..." },
      { prg: 75, text: deviceProfile.hasAndroid ? "Checking space-heavy Android Play Store app clusters..." : "Skipping Android containers (not configured)..." },
      { prg: 90, text: "Verifying system log handlers & leftover trash caches..." },
      { prg: 100, text: "Formatting comprehensive diagnostics matrix..." }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setScanProgress(steps[currentStepIdx].prg);
        setScanStep(steps[currentStepIdx].text);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setScanState("scanned");
      }
    }, 450);
  };

  // Run simulated vacuum cleaning
  const startCleaning = () => {
    setScanState("cleaning");
    setCleanProgress(0);
    setCleanStep("Preparing to clean storage targets...");

    const steps = [
      { prg: 20, text: "Clearing simulated Browser cache records..." },
      { prg: 40, text: "Emptying offline metadata pointers..." },
      { prg: 65, text: deviceProfile.hasLinux ? "Compiling Linux pruning micro-scripts (APT clean & journalctl vac)..." : "Skipping Linux commands..." },
      { prg: 85, text: deviceProfile.hasAndroid ? "Compressing Android subsystem caches..." : "Skipping Android partition optimization..." },
      { prg: 100, text: "All optimizer tasks compiled successfully!" }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setCleanProgress(steps[currentStepIdx].prg);
        setCleanStep(steps[currentStepIdx].text);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setScanState("cleaned");
        onRefreshMetrics();
      }
    }, 550);
  };

  const handleCopySingleCommand = () => {
    let cmd = "sudo apt-get clean && sudo apt-get autoremove -y && sudo journalctl --vacuum-time=3d";
    if (selectedTargets.linuxCaches) {
      cmd += " && rm -rf ~/.cache/* npm cache clean --force";
    }
    navigator.clipboard.writeText(cmd);
    setCopiedIndex("single-command");
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const toggleTarget = (key: keyof typeof selectedTargets) => {
    setSelectedTargets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome banner */}
      <div className="bg-gradient-to-r from-sky-950/20 via-indigo-950/10 to-transparent border border-sky-800/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="h-3 w-3" /> Easy One-Click Optimizer
          </div>
          <h2 className="text-xl font-display font-bold text-white">
            Clean Up Chromebook Space Without Leaving the Browser
          </h2>
          <p className="text-sm text-slate-350 max-w-2xl leading-relaxed">
            Chromebooks run three different environments (ChromeOS, Crostini Linux, and Android). 
            Our intelligent scanner searches all compartments to identify hidden storage hogs and compiles 
            exactly what you need to press.
          </p>
        </div>
        
        {scanState === "idle" && (
          <button
            id="wizard-start-scan-btn"
            onClick={startScan}
            className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/20 hover:scale-102 active:scale-98 transition-all"
          >
            <Wand2 className="h-5 w-5 animate-pulse" />
            <span>⚡ Start One-Click Diagnoses</span>
          </button>
        )}
      </div>

      {/* Dynamic Scan & Progress Screen */}
      {(scanState === "scanning" || scanState === "cleaning") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="relative inline-flex items-center justify-center">
            {/* Spinning Circle UI */}
            <div className={`h-20 w-20 rounded-full border-4 ${scanState === "scanning" ? "border-sky-500/20 border-t-sky-400" : "border-emerald-500/20 border-t-emerald-400"} animate-spin`} />
            <HardDrive className={`absolute h-8 w-8 ${scanState === "scanning" ? "text-sky-400" : "text-emerald-400 animate-pulse"}`} />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-semibold text-base text-white">
              {scanState === "scanning" ? "Running Chromebook Space Audit..." : "Compiling Optimized Space Cleaning..."}
            </h3>
            <p className="text-xs text-slate-400 font-mono tracking-wide min-h-6 animate-pulse">
              {scanState === "scanning" ? scanStep : cleanStep}
            </p>
          </div>

          {/* Sizable progress indicator */}
          <div className="max-w-md mx-auto bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${scanState === "scanning" ? "bg-sky-500 shadow-md shadow-sky-500/20" : "bg-emerald-500 shadow-md shadow-emerald-500/20"}`}
              style={{ width: `${scanState === "scanning" ? scanProgress : cleanProgress}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block font-mono">
            Progress: {scanState === "scanning" ? scanProgress : cleanProgress}%
          </span>
        </div>
      )}

      {/* Target checklists & results post-scan */}
      {scanState === "scanned" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Target checklist panel - 7 columns */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 mb-2 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Detected Storage Hogs</h3>
                <p className="text-xs text-slate-400">Choose which temporary buckets you want to target</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-sky-400 border border-slate-850">
                Potential savings: ~{getSavings().toFixed(1)} GB
              </span>
            </div>

            <div className="space-y-3">
              {/* Target items list */}
              <div 
                onClick={() => toggleTarget("browserCache")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTargets.browserCache ? "border-sky-500/30 bg-sky-500/[0.01]" : "border-slate-800/80 bg-transparent"}`}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedTargets.browserCache}
                    onChange={() => {}} // Controlled via card click
                    className="mt-1 h-4 w-4 bg-slate-950 border-slate-800 accent-sky-500 rounded" 
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-100">
                      <span>Chrome Browser Assets & Images Caches</span>
                      <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-bold border border-slate-900">~2.2 GB</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Chrome pre-fetches sites, storing them forever on your eMMC disk storage.</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => toggleTarget("googleDriveOffline")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTargets.googleDriveOffline ? "border-sky-500/30 bg-sky-500/[0.01]" : "border-slate-800/80 bg-transparent"}`}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedTargets.googleDriveOffline}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 bg-slate-950 border-slate-800 accent-sky-500 rounded" 
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-100">
                      <span>Google Drive Offline Sync Files</span>
                      <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-bold border border-slate-900">~4.5 GB</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Files mirrored on your storage for offline use. Safe to clear; online files are protected.</p>
                  </div>
                </div>
              </div>

              {deviceProfile.hasLinux && (
                <>
                  <div 
                    onClick={() => toggleTarget("linuxPackages")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTargets.linuxPackages ? "border-sky-500/30 bg-sky-500/[0.01]" : "border-slate-800/80 bg-transparent"}`}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedTargets.linuxPackages}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 bg-slate-950 border-slate-800 accent-sky-500 rounded" 
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-100">
                          <span>Debian Apt Packages Archives Cache</span>
                          <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-bold border border-slate-900">~1.8 GB</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Leftover .deb installer archives cached inside Crostini's file system partition.</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => toggleTarget("linuxCaches")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTargets.linuxCaches ? "border-sky-500/30 bg-sky-500/[0.01]" : "border-slate-800/80 bg-transparent"}`}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedTargets.linuxCaches}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 bg-slate-950 border-slate-800 accent-sky-500 rounded" 
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-100">
                          <span>NPM / Pip & Developer Local Cache Folders</span>
                          <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-bold border border-slate-900">~1.5 GB</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Temporary build tools, package duplicates, and wheels hidden inside your Linux user profile.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {deviceProfile.hasAndroid && (
                <div 
                  onClick={() => toggleTarget("androidCaches")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTargets.androidCaches ? "border-sky-500/30 bg-sky-500/[0.01]" : "border-slate-800/80 bg-transparent"}`}
                >
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedTargets.androidCaches}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 bg-slate-950 border-slate-800 accent-sky-500 rounded" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-100">
                        <span>Android App runtime Play Store cache</span>
                        <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-bold border border-slate-900">~2.4 GB</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Subsystem library files and offline media from Google Play store applications.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                id="wizard-clean-now-btn"
                onClick={startCleaning}
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/10 transition-all hover:scale-101 active:scale-99"
              >
                <span>🚀 Clean Selected Targets</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Easy Instructions Block - 5 columns */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="font-semibold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-4.5 w-4.5 text-sky-400" />
                Common User Advice
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Google ChromeOS requires sandbox constraints which protect your core local partition directories from malicious sites. 
                Websites cannot wipe your machine's physical files. 
                Our tool is designed to be fully upfront and secure:
              </p>
              
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Interactive checklists identify safe space-saving settings.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>One-click links guide you to actual system pages.</span>
                </li>
                {deviceProfile.hasLinux && (
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Single-copy command cleans your full Linux partition instantly.</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex items-center justify-between text-slate-300">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Selected Profile</span>
                <span className="text-sm font-semibold text-white block">{deviceProfile.model}</span>
              </div>
              <Activity className="h-8 w-8 text-sky-500/20" />
            </div>
          </div>
        </div>
      )}

      {/* Completed State */}
      {scanState === "cleaned" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6 text-center animate-fade-in max-w-3xl mx-auto">
          <div className="h-16 w-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-white">Chromebook Space Clean Up Complete!</h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              We completed our simulated cache file wipe and compiled customized local actions. 
              To finish reclamation and free up a solid <strong className="text-emerald-400">~{getSavings().toFixed(1)} GB</strong> of actual space on your HP hardware, please run these single-click triggers:
            </p>
          </div>

          {/* Actions to Do lists styled beautifully */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
            {/* Action 1: Chrome Cache */}
            {selectedTargets.browserCache && (
              <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase block mb-1">Step 1: Web Cache cleanup</span>
                  <p className="text-xs text-slate-300 leading-normal">Clear accumulated site graphics, CSS bundles, and static assets safely.</p>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <code className="text-[10px] bg-slate-900 px-1.5 py-1 rounded text-slate-400 font-mono">chrome://settings/clearBrowserData</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("chrome://settings/clearBrowserData");
                      setCopiedIndex("chrome-link");
                      setTimeout(() => setCopiedIndex(null), 2000);
                    }}
                    className="p-1 px-2 text-[10px] font-medium bg-slate-900 border border-slate-800 rounded flex items-center gap-1 text-slate-300 hover:text-white"
                  >
                    {copiedIndex === "chrome-link" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedIndex === "chrome-link" ? "Copied" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action 2: Google Drive */}
            {selectedTargets.googleDriveOffline && (
              <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase block mb-1">Step 2: Google Drive Un-Sync</span>
                  <p className="text-xs text-slate-300 leading-normal">Right click Google Drive folder in Files, and toggle of "Available Offline" to wipe offline cache storage.</p>
                </div>
                <div className="pt-4 text-right">
                  <span className="text-[11px] font-semibold text-emerald-400 font-mono bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15">Saves ~4.5 GB</span>
                </div>
              </div>
            )}

            {/* Action 3: Linux single line command */}
            {deviceProfile.hasLinux && (selectedTargets.linuxPackages || selectedTargets.linuxLogs) && (
              <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl col-span-1 md:col-span-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase block mb-1">Step 3: Linux Partition One-Liner (Crostini Users)</span>
                  <p className="text-xs text-slate-300 leading-normal">
                    Copy the single command block below. Open your Chromebook standard <strong>Terminal app</strong>, paste it, and press Enter to instantly clear and vacuum up space.
                  </p>
                </div>

                <div className="mt-3 p-3.5 bg-slate-950 border border-slate-900 rounded-lg flex items-center justify-between gap-4">
                  <code className="text-xs font-mono text-sky-400 truncate select-all">
                    sudo apt-get clean && sudo apt-get autoremove -y && sudo journalctl --vacuum-time=3d {selectedTargets.linuxCaches ? "&& rm -rf ~/.cache/*" : ""}
                  </code>
                  <button
                    onClick={handleCopySingleCommand}
                    className="shrink-0 py-1.5 px-3 bg-sky-500 hover:bg-sky-400 text-white rounded font-bold text-xs flex items-center gap-1.5"
                  >
                    {copiedIndex === "single-command" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedIndex === "single-command" ? "Copied!" : "Copy One-Liner"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex justify-center gap-3">
            <button
              onClick={() => setScanState("idle")}
              className="px-4 py-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-xl font-semibold text-xs text-slate-300"
            >
              Reset Optimizer Wizard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { DeviceProfile } from "../types";
import { Cpu, HardDrive, ToggleLeft, ToggleRight, Laptop, Sparkles } from "lucide-react";

interface DeviceProfilerProps {
  profile: DeviceProfile;
  onChange: (updated: DeviceProfile) => void;
}

export default function DeviceProfiler({ profile, onChange }: DeviceProfilerProps) {
  const toggleLinux = () => {
    onChange({ ...profile, hasLinux: !profile.hasLinux });
  };

  const toggleAndroid = () => {
    onChange({ ...profile, hasAndroid: !profile.hasAndroid });
  };

  const toggleDevMode = () => {
    onChange({ ...profile, isDeveloperMode: !profile.isDeveloperMode });
  };

  const setStorage = (size: number) => {
    onChange({ ...profile, storageSizeGb: size });
  };

  return (
    <div id="device-profiler-panel" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400">
            <Laptop className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">Chromebook Device Profile</h3>
            <p className="text-xs text-slate-400">Tailoring cleanup heuristics for your HP hardware setup</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 gap-1 animate-pulse">
          <Sparkles className="h-3 w-3" /> Active Configuration
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Hardware Profile Info */}
        <div className="space-y-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Cpu className="h-3 w-3" /> Hardware Profile
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400 font-medium">Model:</span>
                <span className="text-slate-200 font-semibold">{profile.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400 font-medium">Board Codename:</span>
                <span className="text-slate-300 font-mono text-xs font-semibold bg-slate-900 px-1.5 py-0.5 rounded">{profile.codename}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">OS Version:</span>
                <span className="text-slate-200 font-mono text-xs">{profile.chromeOsVersion}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5" /> Total Local Storage Size
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[32, 64, 128].map((size) => (
                <button
                  key={size}
                  id={`storage-select-btn-${size}`}
                  onClick={() => setStorage(size)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    profile.storageSizeGb === size
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                      : "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {size} GB
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              HP Chromebook 14 G7 typically comes with space-critical <strong className="text-slate-300">64 GB eMMC</strong> storage.
            </p>
          </div>
        </div>

        {/* Right Side: Environment Toggles */}
        <div className="space-y-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Active System Subsystems
              </h4>

              <div className="space-y-4">
                {/* Linux Subsystem Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium block text-slate-200">Crostini Linux Environment</span>
                    <span className="text-[11px] text-slate-400 block max-w-[180px]">Allows running apt, node, python or docker caches</span>
                  </div>
                  <button
                    id="toggle-linux-subsystem-btn"
                    onClick={toggleLinux}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {profile.hasLinux ? (
                      <ToggleRight className="h-9 w-9 text-sky-400" />
                    ) : (
                      <ToggleLeft className="h-9 w-9 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* Android Subsystem Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium block text-slate-200">Android apps (ARC++)</span>
                    <span className="text-[11px] text-slate-400 block max-w-[180px]">Allows Play Store apps. Installs cache background pools</span>
                  </div>
                  <button
                    id="toggle-android-subsystem-btn"
                    onClick={toggleAndroid}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {profile.hasAndroid ? (
                      <ToggleRight className="h-9 w-9 text-sky-400" />
                    ) : (
                      <ToggleLeft className="h-9 w-9 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* Developer Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium block text-slate-200">Developer Mode Access</span>
                    <span className="text-[11px] text-slate-400 block max-w-[180px]">Root filesystem access, debug keys & crosh shell triggers</span>
                  </div>
                  <button
                    id="toggle-dev-mode-btn"
                    onClick={toggleDevMode}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {profile.isDeveloperMode ? (
                      <ToggleRight className="h-9 w-9 text-sky-400" />
                    ) : (
                      <ToggleLeft className="h-9 w-9 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { STATIC_CLEANUP_MODULES } from "../data";
import { CleanupModule } from "../types";
import { Terminal, Shield, Check, Copy, Download, HardDrive, TriangleAlert } from "lucide-react";

interface ScriptGeneratorProps {
  hasLinux: boolean;
  hasAndroid: boolean;
}

export default function ScriptGenerator({ hasLinux, hasAndroid }: ScriptGeneratorProps) {
  const [modules, setModules] = useState<CleanupModule[]>(STATIC_CLEANUP_MODULES);
  const [copied, setCopied] = useState<boolean>(false);

  // Filter based on active Chromebook subsystems
  const activeModules = modules.filter((m) => {
    if (m.component === "Crostini Linux" && !hasLinux) return false;
    if (m.component === "Android (ARC++)" && !hasAndroid) return false;
    return true;
  });

  const handleToggleModule = (id: string) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m))
    );
  };

  const generateScriptBody = (): string => {
    const selected = activeModules.filter((m) => m.checked && !m.command.startsWith("#"));

    let script = `#!/bin/bash
# ==============================================================================
# ChromeOS Crostini Linux Storage Optimizer
# Created for: HP Chromebook 14 G7 (drawman)
# Description: Safely vacuums systemd logs, apt-caches, and un-used cache folders.
# ==============================================================================

set -eo pipefail

echo "======================================================"
echo " Starting ChromeOS Crostini Linux Storage Scan & Save..."
echo "======================================================"
INITIAL_SPACE=$(df -h / | awk 'NR==2 {print $4}')
echo "Original Free Space: $INITIAL_SPACE"
echo ""

# Confirm user is running inside Crostini container
if [ ! -f /etc/debian_version ]; then
  echo "⚠️  WARNING: This script is designed to run specifically in the"
  echo "   ChromeOS Linux Development Environment (Crostini) terminal."
  echo "   Attempting to run outside might result in unexpected behaviors."
  read -p "Proceed anyway? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

`;

    selected.forEach((module) => {
      script += `# --- MODULE: ${module.name} ---\n`;
      script += `echo "🧹 Running: ${module.name}..."\n`;
      script += `${module.command}\n`;
      script += `echo "✅ Completed: ${module.name}."\n\n`;
    });

    script += `# Final Reports
echo "======================================================"
echo " 🎉 Optimization Process Completed successfully!"
echo "======================================================"
FINAL_SPACE=$(df -h / | awk 'NR==2 {print $4}')
echo "New Free Space: $FINAL_SPACE"
echo "Thank you for using ChromeOS Storage Optimizer!"
`;

    return script;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateScriptBody());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const downloadScriptFile = () => {
    const link = document.createElement("a");
    const scriptText = generateScriptBody();
    const blog = new Blob([scriptText], { type: "text/x-shellscript" });
    link.href = URL.createObjectURL(blog);
    link.download = "chromeos-cleaner.sh";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="script-generator-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Module Selector Grid (6 Column blocks) */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Select Linux & System Cleanup Targets
        </h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {activeModules.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
              No local Linux or subsystem packages are currently configured in your Chromebook profile. 
              Toggle Linux in the 'Chromebook Device Profile' to compile packages.
            </div>
          ) : (
            activeModules.map((module) => {
              const isCommentOnly = module.command.startsWith("#");
              return (
                <div
                  key={module.id}
                  id={`module-card-${module.id}`}
                  onClick={() => !isCommentOnly && handleToggleModule(module.id)}
                  className={`p-4 rounded-xl border transition-all duration-150 relative ${
                    isCommentOnly
                      ? "bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed"
                      : "cursor-pointer bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700/80 " +
                        (module.checked
                          ? "border-sky-500/40 bg-sky-500/[0.01]"
                          : "border-slate-800")
                  }`}
                >
                  <div className="flex items-start space-x-3 text-slate-200">
                    <input
                      type="checkbox"
                      id={`module-checkbox-${module.id}`}
                      checked={module.checked}
                      disabled={isCommentOnly}
                      onChange={() => {}} // Swallowed: Handled by parent click handler
                      className="mt-1 h-4 w-4 text-sky-500 focus:ring-sky-500 border-slate-800 rounded bg-slate-950 accent-sky-500 mr-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-slate-100 truncate leading-snug">
                          {module.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-medium">
                          {module.component}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {module.description}
                      </p>

                      <div className="flex items-center space-x-3.5 mt-2.5 pt-2 border-t border-slate-850/30 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <HardDrive className="h-3 w-3" /> Reclaims: <strong className="text-emerald-400">{module.sizeSavedEstimate}</strong>
                        </span>
                        <span>
                          Risk:{" "}
                          <strong
                            className={`${
                              module.risk === "Low"
                                ? "text-sky-400"
                                : module.risk === "Medium"
                                ? "text-amber-400"
                                : "text-rose-400"
                            }`}
                          >
                            {module.risk}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Compiled Shell Preview box (7 Column blocks) */}
      <div className="lg:col-span-7 bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
        <div className="bg-slate-900/60 px-5 py-3.5 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              chromeos-cleaner.sh
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="copy-script-btn"
              onClick={copyToClipboard}
              className="p-1 px-2.5 rounded bg-slate-950 border border-slate-800 hover:bg-slate-850 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              id="download-script-btn"
              onClick={downloadScriptFile}
              className="p-1 px-2.5 rounded bg-sky-500 hover:bg-sky-400 text-xs text-white font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content text block */}
        <div className="flex-1 p-5 bg-slate-950/80 font-mono text-xs text-slate-300 overflow-x-auto max-h-[380px] custom-scrollbar border-b border-slate-850/40">
          <pre className="selection:bg-sky-500/10">
            <code>{generateScriptBody()}</code>
          </pre>
        </div>

        {/* Instructions Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-850 flex items-start space-x-3">
          <Shield className="h-5 w-5 text-sky-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-400 leading-normal">
            <p className="font-semibold text-slate-200 mb-1">How to execute inside your HP Chromebook:</p>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Open your Chromebook launcher menu and open the <strong>Terminal</strong> app (Linux).</li>
              <li>Type <code className="bg-slate-950 text-sky-400 px-1 py-0.5 rounded font-mono">nano chromeos-cleaner.sh</code> and paste his code inside, then press <kbd className="bg-slate-800 px-1 rounded">Ctrl+O</kbd> and <kbd className="bg-slate-800 px-1 rounded">Ctrl+X</kbd></li>
              <li>Run <code className="bg-slate-950 text-sky-400 px-1 py-0.5 rounded font-mono">chmod +x chromeos-cleaner.sh</code> to make the script executable.</li>
              <li>Execute the script safely using: <code className="bg-slate-950 text-sky-400 px-1 py-0.5 rounded font-mono">./chromeos-cleaner.sh</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

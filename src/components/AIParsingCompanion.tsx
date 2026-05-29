import React, { useState } from "react";
import { DeviceProfile, AnalysisResult } from "../types";
import { Terminal, Send, Sparkles, AlertCircle, Copy, Check, RotateCcw, Info, CheckCircle2 } from "lucide-react";

interface AIParsingCompanionProps {
  deviceProfile: DeviceProfile;
}

export default function AIParsingCompanion({ deviceProfile }: AIParsingCompanionProps) {
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sampleDfOutput = `Filesystem      Size  Used Avail Use% Mounted on
/dev/root       1.8G  1.8G     0 100% /
devtmpfs        3.9G     0  3.9G   0% /dev
tmpfs           3.9G   40K  3.9G   1% /dev/shm
/dev/sda1        48G   45G  1.2G  98% /mnt/stateful_partition
/dev/loop0      4.2G  4.2G     0 100% /var/cache/apt/archives
/home/user/.cache/pip 3.4G  3.4G   0 100% /home/user/.cache/pip`;

  const loadSample = () => {
    setInputText(sampleDfOutput);
    setError(null);
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError("Please paste some text first (such as commands or files) to run a scan.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sysInfo: deviceProfile,
          pastedContent: inputText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse log. Please retry.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during database analysis.");
    } finally {
      setLoading(false);
    }
  };

  const copyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div id="ai-companion-panel" className="space-y-6">
      {/* Intro and Input form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">AI Log & Terminal Companion Analyzer</h3>
              <p className="text-xs text-slate-400">Paste terminal dumps or log lists for precision, safe extraction commands</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              id="load-sample-btn"
              onClick={loadSample}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Load Sample Dump
            </button>
            <button
              id="clear-input-btn"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-850 text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Text Box Input fields */}
        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase text-slate-400">
            Paste terminal logs (such as <code className="bg-slate-950 text-sky-400 px-1 rounded">df -h</code>, <code className="bg-slate-950 text-sky-400 px-1 rounded">du -sh *</code>, <code className="bg-slate-950 text-sky-400 px-1 rounded">journalctl --disk-usage</code> etc.)
          </label>
          <textarea
            id="log-pasted-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Filesystem      Size  Used Avail Use% Mounted on... or paste any log file directories!"
            className="w-full h-40 bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-sky-500/50 resize-y"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-slate-500" />
            Runs client-safe analysis with Gemini 3.5 Flash
          </span>

          <button
            id="analyze-hogs-btn"
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white transition-all flex items-center space-x-2.5 ${
              loading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/10 active:scale-98"
            }`}
          >
            {loading ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin text-slate-400" />
                <span>Running analysis...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Analyze Paste Target</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Errors output */}
      {error && (
        <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-400 text-xs flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Results output section */}
      {result && (
        <div className="space-y-6">
          {/* Overview Overview block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider text-slate-200">
              Analysis Expert Breakdown
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-850/30">
              {result.overview}
            </p>
          </div>

          {/* Items detected map list */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Detected Files & Directory Space Drivers
            </h4>

            {result.itemsDetected && result.itemsDetected.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.itemsDetected.map((item, index) => (
                  <div
                    key={index}
                    id={`ai-detected-card-${index}`}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-1.5 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-sm block text-white truncate leading-snug">
                            {item.name}
                          </span>
                          {item.path && (
                            <code className="text-[10px] break-all text-slate-400 block font-mono mt-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900 leading-snug">
                              {item.path}
                            </code>
                          )}
                        </div>

                        {/* Safe indicator pills */}
                        <span
                          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            item.isSafeToDelete
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {item.isSafeToDelete ? "Safe to Vacuum" : "System / Critical"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {item.explanation}
                      </p>

                      {item.size && (
                        <div className="text-[11px] text-slate-400">
                          Detected Capacity: <strong className="text-sky-400">{item.size}</strong>
                        </div>
                      )}
                    </div>

                    {item.cleanupCommand && (
                      <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between gap-2 bg-slate-950/40 -mx-5 -mb-5 p-4 rounded-b-xl border-t border-slate-850">
                        <code className="text-[10px] font-mono text-sky-400 truncate flex-1 block select-all">
                          {item.cleanupCommand}
                        </code>
                        <button
                          id={`copy-item-command-btn-${index}`}
                          onClick={() => copyCommand(item.cleanupCommand!, index)}
                          className="p-1 px-2 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded font-medium text-slate-400 flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl text-center text-slate-400 text-xs">
                No major individual space hogs or temporary folders detected in this scan report. Paste more details if available!
              </div>
            )}
          </div>

          {/* Preventative measures footer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Preventative System Heuristics
            </h4>
            <div className="text-xs text-slate-300 leading-relaxed p-4 bg-slate-950/40 border border-slate-850/40 rounded-xl">
              {result.preventativeMeasures}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

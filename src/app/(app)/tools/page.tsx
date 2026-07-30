"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, X, Upload, History as HistoryIcon, Download, ImageIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

type HistoryEntry = {
  id: string;
  gradient: string;
  time: string;
  name: string;
};

const PROCESS_STAGES = [
  { label: "Uploading", pct: 20 },
  { label: "Detecting edges", pct: 45 },
  { label: "Removing background", pct: 75 },
  { label: "Refining mask", pct: 92 },
];

export default function ToolsPage() {
  const [tab, setTab] = useState<"remove-bg" | "history">("remove-bg");
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("image.png");
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(0);
  const [sliderX, setSliderX] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [dropTarget, setDropTarget] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropTarget(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      setUploaded(true);
      setProcessed(false);
    } else {
      showToast("Please drop an image file", "info");
    }
  }, [showToast]);

  function handleRemoveBackground() {
    if (!uploaded) return;
    setProcessing(true);
    setStage(0);
    setPct(0);

    let s = 0;
    const tick = () => {
      if (s >= PROCESS_STAGES.length) return;
      setStage(s);
      setPct(PROCESS_STAGES[s].pct);
      s++;
      if (s < PROCESS_STAGES.length) setTimeout(tick, 280 + Math.random() * 200);
    };
    tick();

    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setPct(100);
      setHistory((prev) => [
        {
          id: `hist-${Date.now()}`,
          gradient: "from-sky-400 via-indigo-500 to-fuchsia-600",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          name: fileName,
        },
        ...prev,
      ]);
      showToast("Background removed successfully");
    }, 1400);
  }

  function onSliderMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setDragging(true);
    function move(me: MouseEvent) {
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(1, (me.clientX - rect.left) / rect.width));
      setSliderX(Math.round(x * 100));
    }
    function up() { setDragging(false); window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  const tabBtn = (label: string, id: "remove-bg" | "history") => (
    <button
      onClick={() => setTab(id)}
      className={cn(
        "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
        tab === id ? "border-indigo-500 text-indigo-500" : "border-transparent hover:text-[var(--text-secondary)]"
      )}
      style={tab !== id ? { color: "var(--text-tertiary)" } : {}}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div className="flex items-center gap-6 border-b px-8 pt-5" style={{ borderColor: "var(--border)" }}>
        {tabBtn("Remove Background", "remove-bg")}
        {tabBtn(`History${history.length > 0 ? ` (${history.length})` : ""}`, "history")}
      </div>

      {tab === "remove-bg" ? (
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT */}
          <div className="flex w-[400px] flex-shrink-0 flex-col border-r p-6" style={{ borderColor: "var(--border)" }}>
            <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>✨ Remove Background</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>AI-powered background removal in seconds</p>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Upload Image</span>
                {uploaded && <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{fileName}</span>}
              </div>

              {!uploaded ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDropTarget(true); }}
                  onDragLeave={() => setDropTarget(false)}
                  onDrop={handleDrop}
                  onClick={() => { setFileName("sample.png"); setUploaded(true); setProcessed(false); }}
                  className={cn(
                    "flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center transition-all",
                    dropTarget ? "border-indigo-500 bg-indigo-500/5" : "hover:border-indigo-500/40 hover:bg-[var(--bg-hover)]"
                  )}
                  style={{ borderColor: dropTarget ? undefined : "var(--border-hover)" }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                    <Upload className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      {dropTarget ? "Drop to upload" : "Click or drag & drop"}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>PNG, JPG, WEBP up to 10 MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
                  <div className="aspect-square w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-600" />
                  {processed && (
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-[11px] font-medium text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      Processed
                    </div>
                  )}
                  <button
                    onClick={() => { setUploaded(false); setProcessed(false); setPct(0); }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="border-t px-3 py-2 text-xs flex items-center justify-between" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {fileName}
                    </span>
                    <span>1024 × 1024</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress */}
            {processing && (
              <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                <div className="mb-2 flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span>{PROCESS_STAGES[stage]?.label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-hover)" }}>
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1">
                  {PROCESS_STAGES.map((st, i) => (
                    <div key={st.label} className="flex flex-col items-center gap-1">
                      <div className={cn("h-1.5 w-full rounded-full transition-colors", i <= stage ? "bg-indigo-500" : "")}
                        style={i > stage ? { background: "var(--bg-hover)" } : {}} />
                      <span className="text-center text-[9px]" style={{ color: i <= stage ? "var(--text-secondary)" : "var(--text-tertiary)" }}>
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleRemoveBackground}
              disabled={!uploaded || processing}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="h-4 w-4" />
              {processing ? "Processing…" : processed ? "Process Again" : "Remove Background"}
            </button>

            {processed && (
              <button
                onClick={() => showToast("Downloaded", "info")}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-hover)]"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
            )}
          </div>

          {/* RIGHT — Before/After slider */}
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            {processed ? (
              <div className="w-full max-w-md">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Before / After</span>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Drag the handle to compare</span>
                </div>
                <div
                  ref={sliderRef}
                  className="relative aspect-square w-full overflow-hidden rounded-2xl border select-none"
                  style={{ borderColor: "var(--border)" }}
                >
                  {/* After (background removed) */}
                  <div className="absolute inset-0 checkered-bg">
                    <div
                      className="absolute inset-0 m-auto h-3/4 w-3/4 bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-600"
                      style={{ clipPath: "polygon(20% 5%, 80% 5%, 95% 30%, 90% 70%, 70% 95%, 30% 95%, 5% 65%, 10% 25%)" }}
                    />
                  </div>
                  {/* Before (original) clipped to left half */}
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-600" />
                  </div>
                  {/* Slider handle */}
                  <div
                    className="absolute inset-y-0 z-10 flex cursor-ew-resize items-center"
                    style={{ left: `${sliderX}%`, transform: "translateX(-50%)" }}
                    onMouseDown={onSliderMouseDown}
                  >
                    <div className="h-full w-0.5 bg-white shadow-lg" />
                    <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xl" style={{ left: "-15px" }}>
                      <span className="text-[9px] font-bold text-gray-600 select-none">⟺</span>
                    </div>
                  </div>
                  {/* Labels */}
                  <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-sm">Before</span>
                  <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur-sm">After</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center" style={{ color: "var(--text-tertiary)" }}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--bg-muted)" }}>
                  <Sparkles className="h-8 w-8 text-indigo-500/50" />
                </div>
                <h2 className="mt-4 text-base font-medium" style={{ color: "var(--text-secondary)" }}>No result yet</h2>
                <p className="mt-1 max-w-xs text-sm">
                  Upload an image and click &ldquo;Remove Background&rdquo; — you&apos;ll get a live before/after comparison.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center" style={{ color: "var(--text-tertiary)" }}>
          <HistoryIcon className="h-8 w-8" />
          <p className="text-sm">No history yet. Processed images will appear here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {history.map((h) => (
              <div key={h.id} className="group relative overflow-hidden rounded-xl border checkered-bg" style={{ borderColor: "var(--border)" }}>
                <div
                  className={cn("aspect-square bg-gradient-to-br", h.gradient)}
                  style={{ clipPath: "polygon(20% 5%, 80% 5%, 95% 30%, 90% 70%, 70% 95%, 30% 95%, 5% 65%, 10% 25%)" }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-2.5 py-2 text-[11px] text-white/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <span className="truncate">{h.name}</span>
                  <button onClick={() => showToast("Downloaded", "info")} className="ml-2 flex-shrink-0 rounded p-0.5 hover:bg-white/10">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, X, Upload, History as HistoryIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

type HistoryEntry = {
  id: string;
  gradient: string;
  time: string;
};

export default function ToolsPage() {
  const [tab, setTab] = useState<"remove-bg" | "history">("remove-bg");
  const [uploaded, setUploaded] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { showToast } = useToast();

  function handleRemoveBackground() {
    if (!uploaded) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setHistory((prev) => [
        {
          id: `hist-${Date.now()}`,
          gradient: "from-sky-400 via-indigo-500 to-fuchsia-600",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ]);
      showToast("Background removed");
    }, 900);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex items-center gap-6 border-b border-white/10 px-8 pt-5">
        <button
          onClick={() => setTab("remove-bg")}
          className={cn(
            "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
            tab === "remove-bg"
              ? "border-yellow-500 text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Remove Background
        </button>
        <button
          onClick={() => setTab("history")}
          className={cn(
            "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
            tab === "history"
              ? "border-yellow-500 text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          History{history.length > 0 ? ` (${history.length})` : ""}
        </button>
      </div>

      {tab === "remove-bg" ? (
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT */}
          <div className="flex w-[420px] flex-shrink-0 flex-col border-r border-white/10 p-6">
            <h1 className="text-lg font-semibold text-white">✨ Remove Background</h1>
            <p className="mt-1 text-sm text-zinc-500">Remove background from images with AI</p>

            <div className="mt-6">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Upload Image
              </div>

              {!uploaded ? (
                <button
                  onClick={() => setUploaded(true)}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-14 text-center hover:border-yellow-500/40 hover:bg-white/5"
                >
                  <Upload className="h-6 w-6 text-zinc-500" />
                  <span className="text-sm text-zinc-300">Click to upload an image</span>
                  <span className="text-xs text-zinc-600">PNG, JPG up to 10MB</span>
                </button>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-white/10">
                  <div className="aspect-square w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-600" />
                  <button
                    onClick={() => {
                      setUploaded(false);
                      setProcessed(false);
                    }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleRemoveBackground}
              disabled={!uploaded}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-yellow-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-yellow-500/30 disabled:text-black/40"
            >
              <Sparkles className="h-4 w-4" />
              {processing ? "Removing Background..." : "Remove Background"}
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex flex-1 items-center justify-center p-8">
            {processed ? (
              <div className="relative h-96 w-96 overflow-hidden rounded-xl border border-white/10 checkered-bg">
                <div
                  className="absolute inset-0 m-auto h-72 w-72 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-600"
                  style={{
                    clipPath:
                      "polygon(20% 5%, 80% 5%, 95% 30%, 90% 70%, 70% 95%, 30% 95%, 5% 65%, 10% 25%)",
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center text-zinc-500">
                <Sparkles className="h-8 w-8" />
                <h2 className="mt-3 text-base font-medium text-zinc-300">No result yet</h2>
                <p className="mt-1 max-w-xs text-sm">
                  Upload an image and click &quot;Remove Background&quot; to generate your result.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-zinc-500">
          <HistoryIcon className="h-8 w-8" />
          <p className="text-sm">No history yet. Processed images will show up here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {history.map((h) => (
              <div
                key={h.id}
                className="group relative overflow-hidden rounded-xl border border-white/10 checkered-bg"
              >
                <div
                  className={cn("aspect-square bg-gradient-to-br", h.gradient)}
                  style={{
                    clipPath:
                      "polygon(20% 5%, 80% 5%, 95% 30%, 90% 70%, 70% 95%, 30% 95%, 5% 65%, 10% 25%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-2.5 py-1.5 text-[11px] text-zinc-300 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  {h.time}
                  <button
                    onClick={() => showToast("Downloaded", "info")}
                    className="rounded p-1 hover:bg-white/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

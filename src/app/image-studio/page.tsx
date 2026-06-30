"use client";

import { useState } from "react";
import { Cpu, Maximize2, Hash, Paperclip, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { galleryImages, randomGradient, type GalleryImage } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";

export default function ImageStudioPage() {
  const [tab, setTab] = useState<"explore" | "creations">("explore");
  const [prompt, setPrompt] = useState("");
  const [creations, setCreations] = useState<GalleryImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const { showToast } = useToast();
  const { addUsage } = useUsage();

  function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setTab("creations");
    const id = `creation-${Date.now()}`;
    setTimeout(() => {
      setCreations((prev) => [
        { id, gradient: randomGradient(), tall: Math.random() > 0.6 },
        ...prev,
      ]);
      setGenerating(false);
      showToast("Image generated successfully");
      addUsage("Text-to-Image", "qwen-image-edit-2509", 1024, 25);
      setPrompt("");
    }, 1600);
  }

  return (
    <div className="flex h-screen flex-col overflow-y-auto">
      {/* Banner */}
      <div className="relative flex h-56 flex-shrink-0 items-end overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/40 via-indigo-600/30 to-amber-500/30 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <h1
          className="relative px-8 pb-6 text-3xl italic text-white"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Transform your ideas into stunning visuals
        </h1>
      </div>

      <div className="px-8 py-6">
        {/* Prompt bar */}
        <div className="mx-auto max-w-4xl rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10">
              <Cpu className="h-3.5 w-3.5 text-yellow-500" />
              qwen-image-edit-2509
            </button>
            <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10">
              <Maximize2 className="h-3.5 w-3.5" />
              1024x1024
            </button>
            <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10">
              <Hash className="h-3.5 w-3.5" />
              1 image
            </button>
            <button className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-1.5 text-zinc-300 hover:bg-white/10">
              <Paperclip className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-8 flex max-w-4xl items-center gap-6 border-b border-white/10">
          <button
            onClick={() => setTab("explore")}
            className={cn(
              "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              tab === "explore"
                ? "border-yellow-500 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            Explore
          </button>
          <button
            onClick={() => setTab("creations")}
            className={cn(
              "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              tab === "creations"
                ? "border-yellow-500 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            )}
          >
            My Creations{creations.length > 0 ? ` (${creations.length})` : ""}
          </button>
        </div>

        {/* Grid */}
        <div className="mt-6">
          {tab === "explore" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className={cn(
                    "rounded-xl bg-gradient-to-br opacity-90 transition-opacity hover:opacity-100",
                    img.gradient,
                    img.tall ? "aspect-[3/4]" : "aspect-square"
                  )}
                />
              ))}
            </div>
          ) : creations.length === 0 && !generating ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
              <Sparkles className="h-8 w-8" />
              <p className="mt-3 text-sm">No creations yet. Generate your first image above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {generating && (
                <div className="flex aspect-square animate-pulse items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
              )}
              {creations.map((img) => (
                <div
                  key={img.id}
                  className={cn(
                    "rounded-xl bg-gradient-to-br opacity-90 transition-opacity hover:opacity-100",
                    img.gradient,
                    img.tall ? "aspect-[3/4]" : "aspect-square"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

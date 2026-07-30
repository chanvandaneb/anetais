"use client";

import { useState, useEffect } from "react";
import { Cpu, Maximize2, Hash, Paperclip, Sparkles, Loader2, Download, ZoomIn, X, ChevronLeft, ChevronRight as ChevronRightIcon, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { galleryImages, randomCreationImage, type GalleryImage } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";

const STYLE_PRESETS = [
  { id: "none", label: "None", emoji: "✏️" },
  { id: "photo", label: "Photorealistic", emoji: "📷" },
  { id: "anime", label: "Anime", emoji: "🌸" },
  { id: "watercolor", label: "Watercolor", emoji: "🎨" },
  { id: "pixel", label: "Pixel Art", emoji: "👾" },
  { id: "cinematic", label: "Cinematic", emoji: "🎬" },
  { id: "oil", label: "Oil Painting", emoji: "🖼️" },
  { id: "3d", label: "3D Render", emoji: "💎" },
];

const SIZES = ["512×512", "768×768", "1024×1024", "1024×1792", "1792×1024"];

const GEN_STAGES = [
  { label: "Queuing", pct: 10 },
  { label: "Processing prompt", pct: 35 },
  { label: "Generating image", pct: 65 },
  { label: "Upscaling", pct: 88 },
  { label: "Finalizing", pct: 97 },
];

function LightboxModal({ images, startIdx, onClose }: { images: GalleryImage[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const img = images[idx];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx(i => Math.max(i - 1, 0));
      if (e.key === "ArrowRight") setIdx(i => Math.min(i + 1, images.length - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 backdrop-blur-md" onClick={onClose}>
      <button
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
      {idx > 0 && (
        <button
          className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
          onClick={e => { e.stopPropagation(); setIdx(i => i - 1); }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {idx < images.length - 1 && (
        <button
          className="absolute right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
          onClick={e => { e.stopPropagation(); setIdx(i => i + 1); }}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}
      <div
        className="relative mx-20 flex max-h-[85vh] max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.prompt}
          className="max-h-[75vh] w-auto object-contain"
        />
        <div className="flex items-center justify-between bg-black/70 px-4 py-3 backdrop-blur-sm">
          <div className="min-w-0 flex-1">
            {img.prompt && <p className="truncate text-sm text-white/90">{img.prompt}</p>}
            <p className="text-xs text-white/50">{idx + 1} / {images.length}</p>
          </div>
          <button className="ml-4 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/90 hover:bg-white/20 transition-colors flex-shrink-0">
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ img, onView, onDownload }: { img: GalleryImage; onView: () => void; onDownload: () => void }) {
  return (
    <div className={cn("group relative overflow-hidden rounded-xl cursor-pointer bg-[var(--bg-muted)]", img.tall ? "aspect-[3/4]" : "aspect-square")}>
      <img
        src={img.src}
        alt={img.prompt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
        <button
          onClick={onView}
          className="flex items-center gap-1.5 rounded-lg bg-black/70 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/90"
        >
          <ZoomIn className="h-3.5 w-3.5" />
          View full
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDownload(); }}
          className="flex items-center gap-1.5 rounded-lg bg-black/70 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/90"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>
      {/* Prompt tooltip at bottom */}
      {img.prompt && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/70 px-3 py-1.5 text-[11px] leading-snug text-white/90 backdrop-blur-sm transition-transform duration-200 group-hover:translate-y-0">
          {img.prompt}
        </div>
      )}
    </div>
  );
}

export default function ImageStudioPage() {
  const [tab, setTab] = useState<"explore" | "creations">("explore");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showNeg, setShowNeg] = useState(false);
  const [creations, setCreations] = useState<GalleryImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genStage, setGenStage] = useState(0);
  const [genPct, setGenPct] = useState(0);
  const [stylePreset, setStylePreset] = useState("none");
  const [size, setSize] = useState("1024×1024");
  const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; idx: number } | null>(null);
  const { showToast } = useToast();
  const { addUsage } = useUsage();

  function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setTab("creations");
    setGenStage(0);
    setGenPct(0);

    // Animate through stages
    let stageIdx = 0;
    const advance = () => {
      if (stageIdx >= GEN_STAGES.length) return;
      const stage = GEN_STAGES[stageIdx];
      setGenStage(stageIdx);
      setGenPct(stage.pct);
      stageIdx++;
      if (stageIdx < GEN_STAGES.length) {
        setTimeout(advance, 350 + Math.random() * 250);
      }
    };
    advance();

    const capturedPrompt = prompt.trim();
    setTimeout(() => {
      const newImg = randomCreationImage(Math.random() > 0.6);
      newImg.prompt = capturedPrompt;
      setCreations((prev) => [newImg, ...prev]);
      setGenerating(false);
      setGenPct(100);
      showToast("Image generated successfully");
      addUsage("Text-to-Image", "qwen-image-edit-2509", 1024, 25);
      setPrompt("");
    }, 2200);
  }

  const activePreset = STYLE_PRESETS.find(p => p.id === stylePreset);

  return (
    <div className="flex h-screen flex-col overflow-y-auto" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {lightbox && (
        <LightboxModal
          images={lightbox.images}
          startIdx={lightbox.idx}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Banner */}
      <div className="relative flex h-48 flex-shrink-0 items-end overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/40 via-indigo-600/30 to-violet-500/30 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent" />
        <div className="relative px-8 pb-6">
          <h1 className="text-3xl font-light italic" style={{ color: "var(--text-primary)", fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Transform your ideas into stunning visuals
          </h1>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Prompt bar */}
        <div className="mx-auto max-w-4xl rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            placeholder="Describe what you want to generate… (⌘+Enter to generate)"
            rows={3}
            className="w-full resize-none bg-transparent text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none"
            style={{ color: "var(--text-primary)" }}
          />

          {showNeg && (
            <textarea
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              placeholder="Negative prompt — what to avoid…"
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-xs placeholder:text-[var(--text-tertiary)] focus:outline-none"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            />
          )}

          {/* Style presets */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STYLE_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => setStylePreset(p.id)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  stylePreset === p.id
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "hover:bg-[var(--bg-hover)]"
                )}
                style={stylePreset !== p.id ? { borderColor: "var(--border)", color: "var(--text-tertiary)" } : {}}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[
              { icon: Cpu, label: "qwen-image-edit-2509", primary: true },
              { icon: Maximize2, label: size, primary: false },
              { icon: Hash, label: "1 image", primary: false },
            ].map(({ icon: Icon, label, primary }) => (
              <button key={label} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]" style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
                <Icon className={cn("h-3.5 w-3.5", primary && "text-indigo-500")} />
                {label}
              </button>
            ))}
            <button
              onClick={() => setShowNeg(v => !v)}
              className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]", showNeg && "border-indigo-500/30 bg-indigo-500/10 text-indigo-400")}
              style={!showNeg ? { borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" } : {}}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Negative
            </button>
            <button className="flex items-center justify-center rounded-full border p-1.5 transition-colors hover:bg-[var(--bg-hover)]" style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
              <Paperclip className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? GEN_STAGES[genStage]?.label ?? "Generating…" : "Generate"}
            </button>
          </div>

          {/* Progress bar */}
          {generating && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                <span>{GEN_STAGES[genStage]?.label}</span>
                <span>{genPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-muted)" }}>
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${genPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Size selector */}
        <div className="mx-auto mt-4 flex max-w-4xl items-center gap-2">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Size:</span>
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition-colors",
                size === s ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "hover:bg-[var(--bg-hover)]"
              )}
              style={size !== s ? { borderColor: "var(--border)", color: "var(--text-tertiary)" } : {}}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-6 flex max-w-4xl items-center gap-6 border-b" style={{ borderColor: "var(--border)" }}>
          {(["explore", "creations"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "border-b-2 px-1 pb-3 text-sm font-medium transition-colors capitalize",
                tab === t ? "border-indigo-500 text-indigo-500" : "border-transparent hover:text-[var(--text-secondary)]"
              )}
              style={tab !== t ? { color: "var(--text-tertiary)" } : {}}
            >
              {t === "creations" ? `My Creations${creations.length > 0 ? ` (${creations.length})` : ""}` : "Explore"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 pb-12">
          {tab === "explore" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {galleryImages.map((img, i) => (
                <ImageCard
                  key={img.id}
                  img={img}
                  onView={() => setLightbox({ images: galleryImages, idx: i })}
                  onDownload={() => showToast("Downloaded", "info")}
                />
              ))}
            </div>
          ) : creations.length === 0 && !generating ? (
            <div className="flex flex-col items-center justify-center py-20 text-center" style={{ color: "var(--text-tertiary)" }}>
              <Sparkles className="h-8 w-8" />
              <p className="mt-3 text-sm">No creations yet. Generate your first image above.</p>
              <p className="mt-1 text-xs">Try a style preset to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {generating && (
                <div className="aspect-square animate-pulse flex flex-col items-center justify-center gap-2 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{genPct}%</span>
                </div>
              )}
              {creations.map((img, i) => (
                <ImageCard
                  key={img.id}
                  img={img}
                  onView={() => setLightbox({ images: creations, idx: i })}
                  onDownload={() => showToast("Downloaded", "info")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

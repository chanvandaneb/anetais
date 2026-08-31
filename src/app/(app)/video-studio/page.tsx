"use client";

import { useState, useRef } from "react";
import {
  PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronUp,
  Upload, Film, Inbox, Sparkles, Play, Loader2, Download,
  CheckCircle2, Pause, Volume2, VolumeX, Maximize2, RefreshCw,
  Wand2, Camera, Clock, Zap, Settings2, Copy, Trash2, Share2,
  MoreHorizontal, ChevronLeft, ChevronRight, BookmarkPlus, Star,
  Layers, ArrowRight, Info, Cpu, SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { randomGradient } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";
import Link from "next/link";

/* ── Models ── */
const MODELS = [
  { id: "kling-v2",     name: "Kling v2.0",      badge: "Latest",  color: "#1D7BFF", sub: "Best quality · slow"  },
  { id: "kling-v1-6",   name: "Kling v1.6",      badge: "Popular", color: "#10B981", sub: "Balanced · recommended" },
  { id: "runway-gen3",  name: "Runway Gen-3",     badge: "Fast",    color: "#8B5CF6", sub: "Ultra fast · creative" },
  { id: "pika-2",       name: "Pika 2.0",         badge: "New",     color: "#EC4899", sub: "Stylized · artistic"   },
  { id: "sora-turbo",   name: "Sora Turbo",       badge: "OpenAI",  color: "#F59E0B", sub: "Cinematic · realistic"  },
];

/* ── Style presets ── */
const STYLE_PRESETS = [
  { id: "none",         label: "None",        emoji: "✦" },
  { id: "cinematic",    label: "Cinematic",   emoji: "🎬" },
  { id: "anime",        label: "Anime",       emoji: "✨" },
  { id: "documentary",  label: "Documentary", emoji: "📽" },
  { id: "3d-render",    label: "3D Render",   emoji: "🌐" },
  { id: "vintage",      label: "Vintage",     emoji: "📷" },
  { id: "neon",         label: "Neon",        emoji: "⚡" },
  { id: "watercolor",   label: "Watercolor",  emoji: "🎨" },
];

/* ── Camera motions ── */
const CAMERA_MOTIONS = [
  { id: "none",         label: "Static",      icon: "⬛", desc: "No camera movement" },
  { id: "pan-left",     label: "Pan Left",    icon: "←",  desc: "Horizontal pan left" },
  { id: "pan-right",    label: "Pan Right",   icon: "→",  desc: "Horizontal pan right" },
  { id: "tilt-up",      label: "Tilt Up",     icon: "↑",  desc: "Vertical tilt upward" },
  { id: "tilt-down",    label: "Tilt Down",   icon: "↓",  desc: "Vertical tilt down" },
  { id: "zoom-in",      label: "Zoom In",     icon: "⊕",  desc: "Slow push in" },
  { id: "zoom-out",     label: "Zoom Out",    icon: "⊖",  desc: "Pull back wide" },
  { id: "orbit",        label: "Orbit",       icon: "↻",  desc: "360° orbital move" },
  { id: "dolly",        label: "Dolly Shot",  icon: "⇢",  desc: "Cinematic dolly in" },
  { id: "handheld",     label: "Handheld",    icon: "〜",  desc: "Subtle shake effect" },
];

/* ── Duration options ── */
const DURATIONS = ["3s", "5s", "8s", "10s"] as const;
type Duration = typeof DURATIONS[number];

/* ── FPS options ── */
const FPS_OPTIONS = [24, 30, 60];

/* ── Aspect ratios with visual hints ── */
const RATIOS = [
  { label: "16:9",  w: 16, h: 9,  hint: "Landscape" },
  { label: "9:16",  w: 9,  h: 16, hint: "Portrait"  },
  { label: "1:1",   w: 1,  h: 1,  hint: "Square"    },
  { label: "4:3",   w: 4,  h: 3,  hint: "Classic"   },
  { label: "21:9",  w: 21, h: 9,  hint: "Cinematic" },
  { label: "3:4",   w: 3,  h: 4,  hint: "Mobile"    },
];

/* ── Gen stages ── */
const VIDEO_STAGES = [
  { label: "Queuing job",        pct: 8,  detail: "Allocating GPU resources" },
  { label: "Analyzing prompt",   pct: 20, detail: "Understanding scene & motion" },
  { label: "Generating frames",  pct: 45, detail: "Synthesizing visual content" },
  { label: "Rendering motion",   pct: 70, detail: "Applying camera & animation" },
  { label: "Encoding video",     pct: 88, detail: "Compressing to final format" },
  { label: "Post-processing",    pct: 96, detail: "Enhancing quality & color" },
];

type GeneratedVideo = {
  id: string;
  prompt: string;
  gradient: string;
  duration: Duration;
  aspectRatio: string;
  model: string;
  style: string;
  fps: number;
  createdAt: string;
};

/* ── Slider component ── */
function RangeSlider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="rounded px-1.5 py-0.5 text-[11px] font-semibold" style={{ background: "var(--bg-hover)", color: "var(--text-primary)" }}>
          {format ? format(value) : value}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full" style={{ background: "var(--bg-hover)" }}>
        <div className="absolute h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#1D7BFF,#06B6D4)" }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        <div className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `calc(${pct}% - 7px)`, background: "#1D7BFF" }} />
      </div>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: "var(--border)" }}>
      <button onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-[var(--bg-hover)]"
        style={{ color: "var(--text-tertiary)" }}>
        {title}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

export default function VideoStudioPage() {
  /* ── State ── */
  const [mode, setMode]                         = useState<"text" | "image">("text");
  const [aspectRatio, setAspectRatio]           = useState("16:9");
  const [duration, setDuration]                 = useState<Duration>("5s");
  const [fps, setFps]                           = useState(30);
  const [model, setModel]                       = useState("kling-v1-6");
  const [stylePreset, setStylePreset]           = useState("none");
  const [cameraMotion, setCameraMotion]         = useState("none");
  const [motionStrength, setMotionStrength]     = useState(50);
  const [cfgScale, setCfgScale]                 = useState(0.7);
  const [seed, setSeed]                         = useState<number | "">("");
  const [enhancePrompt, setEnhancePrompt]       = useState(true);
  const [negativePrompt, setNegativePrompt]     = useState("");
  const [prompt, setPrompt]                     = useState("");
  const [videos, setVideos]                     = useState<GeneratedVideo[]>([]);
  const [selectedVideo, setSelectedVideo]       = useState<string | null>(null);
  const [generating, setGenerating]             = useState(false);
  const [genStage, setGenStage]                 = useState(0);
  const [genPct, setGenPct]                     = useState(0);
  const [leftCollapsed, setLeftCollapsed]       = useState(false);
  const [isPlaying, setIsPlaying]               = useState(false);
  const [isMuted, setIsMuted]                   = useState(false);
  const [showModelPicker, setShowModelPicker]   = useState(false);
  const [moreMenu, setMoreMenu]                 = useState<string | null>(null);
  const [shotMode, setShotMode]                 = useState<"one" | "multi">("one");
  const [showAdvanced, setShowAdvanced]         = useState(false);
  const { showToast } = useToast();
  const { addUsage }  = useUsage();

  const selectedModel = MODELS.find(m => m.id === model) ?? MODELS[1];

  function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setGenStage(0);
    setGenPct(0);

    let s = 0;
    const tick = () => {
      if (s >= VIDEO_STAGES.length) return;
      setGenStage(s);
      setGenPct(VIDEO_STAGES[s].pct);
      s++;
      if (s < VIDEO_STAGES.length) setTimeout(tick, 500 + Math.random() * 400);
    };
    tick();

    const id = `video-${Date.now()}`;
    setTimeout(() => {
      const video: GeneratedVideo = {
        id, prompt, gradient: randomGradient(), duration, aspectRatio,
        model, style: stylePreset, fps, createdAt: new Date().toLocaleTimeString(),
      };
      setVideos(prev => [video, ...prev]);
      setSelectedVideo(id);
      setGenerating(false);
      setGenPct(100);
      showToast("Video generated successfully 🎬");
      addUsage("Text-to-Video", model, duration === "10s" ? 200 : 100, duration === "10s" ? 80 : 40);
      setPrompt("");
    }, 3200);
  }

  const activeVideo = videos.find(v => v.id === selectedVideo);
  const activeRatioObj = RATIOS.find(r => r.label === aspectRatio) ?? RATIOS[0];
  const estimatedTime = duration === "3s" ? "~30s" : duration === "5s" ? "~45s" : duration === "8s" ? "~70s" : "~90s";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ══════════════ LEFT PANEL ══════════════ */}
      {leftCollapsed ? (
        <div className="flex w-[48px] flex-shrink-0 flex-col items-center border-r py-4 gap-3"
          style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
          <button onClick={() => setLeftCollapsed(false)} title="Expand"
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: "var(--text-tertiary)" }}>
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex w-[380px] flex-shrink-0 flex-col overflow-hidden border-r"
          style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "rgba(29,123,255,0.12)" }}>
                <Film className="h-4 w-4 text-[#1D7BFF]" />
              </div>
              <div>
                <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Video Studio</h1>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>AI-powered video generation</p>
              </div>
            </div>
            <button onClick={() => setLeftCollapsed(true)}
              className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: "var(--text-tertiary)" }}>
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* §1 — Model selector */}
            <Section title="Model" defaultOpen={true}>
              <div className="relative">
                <button onClick={() => setShowModelPicker(v => !v)}
                  className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 transition-all hover:border-[#1D7BFF]/40"
                  style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${selectedModel.color}18` }}>
                    <Cpu className="h-3.5 w-3.5" style={{ color: selectedModel.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selectedModel.name}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                        style={{ background: `${selectedModel.color}18`, color: selectedModel.color }}>
                        {selectedModel.badge}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{selectedModel.sub}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
                </button>

                {showModelPicker && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl shadow-2xl"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
                    {MODELS.map(m => (
                      <button key={m.id} onClick={() => { setModel(m.id); setShowModelPicker(false); }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ background: m.id === model ? "var(--bg-active)" : undefined }}>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
                          style={{ background: `${m.color}18` }}>
                          <Cpu className="h-3.5 w-3.5" style={{ color: m.color }} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{m.name}</span>
                            <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                              style={{ background: `${m.color}18`, color: m.color }}>{m.badge}</span>
                          </div>
                          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{m.sub}</p>
                        </div>
                        {m.id === model && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#1D7BFF]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            {/* §2 — Mode */}
            <Section title="Input Mode" defaultOpen={true}>
              <div className="flex rounded-lg border p-1" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                {(["Text to Video", "Image to Video"] as const).map((m, i) => {
                  const active = (i === 0 && mode === "text") || (i === 1 && mode === "image");
                  return (
                    <button key={m} onClick={() => setMode(i === 0 ? "text" : "image")}
                      className="flex-1 rounded-md py-1.5 text-xs font-medium transition-all"
                      style={active ? { background: "#1D7BFF", color: "#fff" } : { color: "var(--text-tertiary)" }}>
                      {m}
                    </button>
                  );
                })}
              </div>

              {mode === "image" && (
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Shot mode</span>
                    <div className="flex rounded-md border p-0.5 text-[10px]" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                      {["One-shot", "Multi-shot"].map((s, i) => {
                        const active = (i === 0 && shotMode === "one") || (i === 1 && shotMode === "multi");
                        return (
                          <button key={s} onClick={() => setShotMode(i === 0 ? "one" : "multi")}
                            className={cn("rounded px-2 py-1", active ? "bg-[var(--bg-active)]" : "")}
                            style={{ color: active ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 transition-all hover:border-[#1D7BFF]/50 hover:bg-[var(--bg-hover)]"
                    style={{ borderColor: "var(--border)" }}>
                    <Upload className="h-5 w-5" style={{ color: "var(--text-tertiary)" }} />
                    <div className="text-center">
                      <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Drop images here or click to upload</p>
                      <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-tertiary)" }}>PNG, JPG, WEBP · max 10MB</p>
                    </div>
                  </button>
                </div>
              )}
            </Section>

            {/* §3 — Prompt */}
            <Section title="Prompt" defaultOpen={true}>
              <div className="relative">
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the video you want to create in detail…"
                  rows={4}
                  className="w-full resize-none rounded-xl border px-3 py-3 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#1D7BFF]/30"
                  style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }}
                />
                <div className="mt-2 flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <div onClick={() => setEnhancePrompt(v => !v)}
                      className="flex h-4 w-7 items-center rounded-full transition-all"
                      style={{ background: enhancePrompt ? "#1D7BFF" : "var(--bg-hover)", padding: "1px" }}>
                      <div className="h-3 w-3 rounded-full bg-white shadow transition-transform"
                        style={{ transform: enhancePrompt ? "translateX(12px)" : "translateX(0)" }} />
                    </div>
                    <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Enhance prompt with AI</span>
                  </label>
                  <span className="text-[10px]" style={{ color: prompt.length > 400 ? "#EF4444" : "var(--text-tertiary)" }}>
                    {prompt.length}/500
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <p className="mb-1.5 text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>QUICK PROMPTS</p>
                <div className="flex flex-wrap gap-1">
                  {["Cinematic sunrise over city", "Underwater coral reef", "Slow-mo rain droplets", "Northern lights timelapse"].map(p => (
                    <button key={p} onClick={() => setPrompt(p)}
                      className="rounded-full border px-2 py-0.5 text-[10px] transition-colors hover:border-[#1D7BFF]/50 hover:bg-[var(--bg-hover)]"
                      style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* §4 — Style */}
            <Section title="Style Preset">
              <div className="grid grid-cols-4 gap-1.5">
                {STYLE_PRESETS.map(s => (
                  <button key={s.id} onClick={() => setStylePreset(s.id)}
                    className="flex flex-col items-center gap-1 rounded-lg border py-2 text-center transition-all hover:border-[#1D7BFF]/50"
                    style={{
                      borderColor: stylePreset === s.id ? "#1D7BFF" : "var(--border)",
                      background: stylePreset === s.id ? "rgba(29,123,255,0.08)" : "var(--bg-muted)",
                    }}>
                    <span className="text-base">{s.emoji}</span>
                    <span className="text-[9px] font-medium leading-none"
                      style={{ color: stylePreset === s.id ? "#1D7BFF" : "var(--text-tertiary)" }}>
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </Section>

            {/* §5 — Camera Motion */}
            <Section title="Camera Motion">
              <div className="grid grid-cols-5 gap-1.5">
                {CAMERA_MOTIONS.map(c => (
                  <button key={c.id} onClick={() => setCameraMotion(c.id)}
                    title={c.desc}
                    className="flex flex-col items-center gap-1 rounded-lg border py-2 text-center transition-all hover:border-[#1D7BFF]/50"
                    style={{
                      borderColor: cameraMotion === c.id ? "#1D7BFF" : "var(--border)",
                      background: cameraMotion === c.id ? "rgba(29,123,255,0.08)" : "var(--bg-muted)",
                    }}>
                    <span className="font-mono text-sm"
                      style={{ color: cameraMotion === c.id ? "#1D7BFF" : "var(--text-secondary)" }}>
                      {c.icon}
                    </span>
                    <span className="text-[9px] font-medium leading-none"
                      style={{ color: cameraMotion === c.id ? "#1D7BFF" : "var(--text-tertiary)" }}>
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
              {cameraMotion !== "none" && (
                <div className="mt-3">
                  <RangeSlider label="Motion Strength" value={motionStrength} min={0} max={100} step={1}
                    onChange={setMotionStrength} format={v => `${v}%`} />
                </div>
              )}
            </Section>

            {/* §6 — Output Settings */}
            <Section title="Output Settings">
              <div className="flex flex-col gap-4">
                {/* Aspect ratio */}
                <div>
                  <p className="mb-2 text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Aspect Ratio</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {RATIOS.map(r => (
                      <button key={r.label} onClick={() => setAspectRatio(r.label)}
                        className="flex flex-col items-center gap-1.5 rounded-lg border py-2 transition-all"
                        style={{
                          borderColor: aspectRatio === r.label ? "#1D7BFF" : "var(--border)",
                          background: aspectRatio === r.label ? "rgba(29,123,255,0.08)" : "var(--bg-muted)",
                        }}>
                        {/* mini preview box */}
                        <div className="flex items-center justify-center"
                          style={{ width: 28, height: 28 }}>
                          <div className="rounded-sm border-2"
                            style={{
                              borderColor: aspectRatio === r.label ? "#1D7BFF" : "var(--border-hover)",
                              width: r.w > r.h ? 24 : Math.round(24 * r.w / r.h),
                              height: r.h > r.w ? 24 : Math.round(24 * r.h / r.w),
                            }} />
                        </div>
                        <span className="text-[10px] font-semibold"
                          style={{ color: aspectRatio === r.label ? "#1D7BFF" : "var(--text-secondary)" }}>
                          {r.label}
                        </span>
                        <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{r.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="mb-2 text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Duration</p>
                  <div className="flex gap-1.5">
                    {DURATIONS.map(d => (
                      <button key={d} onClick={() => setDuration(d)}
                        className="flex-1 rounded-lg border py-2 text-xs font-semibold transition-all"
                        style={{
                          borderColor: duration === d ? "#1D7BFF" : "var(--border)",
                          background: duration === d ? "rgba(29,123,255,0.10)" : "var(--bg-muted)",
                          color: duration === d ? "#1D7BFF" : "var(--text-secondary)",
                        }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FPS */}
                <div>
                  <p className="mb-2 text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Frame Rate</p>
                  <div className="flex gap-1.5">
                    {FPS_OPTIONS.map(f => (
                      <button key={f} onClick={() => setFps(f)}
                        className="flex-1 rounded-lg border py-2 text-xs font-semibold transition-all"
                        style={{
                          borderColor: fps === f ? "#1D7BFF" : "var(--border)",
                          background: fps === f ? "rgba(29,123,255,0.10)" : "var(--bg-muted)",
                          color: fps === f ? "#1D7BFF" : "var(--text-secondary)",
                        }}>
                        {f} fps
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* §7 — Advanced */}
            <Section title="Advanced" defaultOpen={false}>
              <div className="flex flex-col gap-4">
                <RangeSlider label="CFG Scale" value={cfgScale} min={0} max={1} step={0.01}
                  onChange={setCfgScale} format={v => v.toFixed(2)} />
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Seed (optional)</label>
                  <input type="number" value={seed} onChange={e => setSeed(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Random"
                    className="w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1D7BFF]/30"
                    style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>Negative Prompt</label>
                  <textarea placeholder="What to avoid…" rows={2}
                    value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)}
                    className="w-full resize-none rounded-lg border px-3 py-2 text-xs placeholder:text-[var(--text-tertiary)] focus:outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </Section>

          </div>

          {/* Sticky Generate button */}
          <div className="flex-shrink-0 border-t px-5 py-4" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
            {/* Cost estimate */}
            <div className="mb-3 flex items-center justify-between rounded-lg px-3 py-2"
              style={{ background: "var(--bg-muted)" }}>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                <Zap className="h-3 w-3 text-[#1D7BFF]" />
                Est. credits: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {duration === "3s" ? 60 : duration === "5s" ? 100 : duration === "8s" ? 160 : 200}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                <Clock className="h-3 w-3" /> {estimatedTime}
              </div>
            </div>

            <button type="button" onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)", boxShadow: prompt.trim() && !generating ? "0 4px 16px rgba(29,123,255,0.35)" : "none" }}>
              {generating
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                : <><Sparkles className="h-4 w-4" /> Generate Video</>}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ MAIN CANVAS ══════════════ */}
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-hidden">

          {/* Top bar */}
          <div className="flex flex-shrink-0 items-center gap-3 border-b px-5 py-3"
            style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
            {leftCollapsed && (
              <button onClick={() => setLeftCollapsed(false)}
                className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: "var(--text-tertiary)" }}>
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            )}
            <div className="flex-1">
              {activeVideo && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate max-w-xs" style={{ color: "var(--text-primary)" }}>
                    {activeVideo.prompt.slice(0, 50)}{activeVideo.prompt.length > 50 ? "…" : ""}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: "rgba(29,123,255,0.12)", color: "#1D7BFF" }}>
                    {activeVideo.aspectRatio} · {activeVideo.duration} · {activeVideo.fps}fps
                  </span>
                </div>
              )}
            </div>
            {activeVideo && (
              <div className="flex items-center gap-1.5">
                <button onClick={() => showToast("Copied share link", "info")}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
                <button onClick={() => showToast("Video downloaded", "info")}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            )}
          </div>

          {/* Video area */}
          <div className="flex flex-1 items-center justify-center overflow-auto p-8">
            {generating ? (
              /* Generation overlay */
              <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
                {/* Animated rings */}
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#1D7BFF]" style={{ animationDuration: "1.2s" }} />
                  <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-[#06B6D4]" style={{ animationDuration: "1.8s", animationDirection: "reverse" }} />
                  <div className="absolute inset-4 rounded-full" style={{ background: "rgba(29,123,255,0.10)" }} />
                  <Film className="h-8 w-8 text-[#1D7BFF]" />
                </div>

                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {VIDEO_STAGES[genStage]?.label ?? "Processing…"}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                    {VIDEO_STAGES[genStage]?.detail ?? ""}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full">
                  <div className="mb-2 flex justify-between text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    <span>Progress</span><span>{genPct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-muted)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${genPct}%`, background: "linear-gradient(90deg,#1D7BFF,#06B6D4)" }} />
                  </div>
                </div>

                {/* Stage steps */}
                <div className="grid w-full grid-cols-6 gap-1">
                  {VIDEO_STAGES.map((stage, i) => (
                    <div key={stage.label} className="flex flex-col items-center gap-1.5">
                      <div className={cn("flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all",
                        i < genStage ? "border-[#1D7BFF] bg-[#1D7BFF]" :
                        i === genStage ? "border-[#1D7BFF] bg-[#1D7BFF]/10" :
                        "border-[var(--border)]")}>
                        {i < genStage
                          ? <CheckCircle2 className="h-4 w-4 text-white" />
                          : i === genStage
                            ? <span className="h-2 w-2 animate-pulse rounded-full bg-[#1D7BFF]" />
                            : <span className="text-[9px] font-bold" style={{ color: "var(--text-tertiary)" }}>{i + 1}</span>}
                      </div>
                      <span className="text-center text-[8px] leading-tight"
                        style={{ color: i <= genStage ? "var(--text-secondary)" : "var(--text-tertiary)" }}>
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  <Clock className="h-3.5 w-3.5" /> Estimated time remaining: {estimatedTime}
                </div>
              </div>

            ) : activeVideo ? (
              /* Video player */
              <div className="flex w-full flex-col items-center gap-4">
                <div className={cn("group relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br",
                  activeVideo.gradient,
                  activeVideo.aspectRatio === "9:16" ? "w-full max-w-sm" :
                  activeVideo.aspectRatio === "1:1"  ? "w-full max-w-lg" :
                  activeVideo.aspectRatio === "21:9" ? "w-full max-w-4xl" : "w-full max-w-3xl")}
                  style={{ aspectRatio: activeVideo.aspectRatio.replace(":", "/") }}>

                  {/* Play / pause */}
                  <button onClick={() => setIsPlaying(v => !v)}
                    className="absolute inset-0 flex items-center justify-center transition-opacity"
                    style={{ opacity: isPlaying ? 0 : 1 }}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition-transform hover:scale-105"
                      style={{ background: "rgba(0,0,0,0.45)", border: "2px solid rgba(255,255,255,0.25)" }}>
                      {isPlaying ? <Pause className="h-7 w-7 fill-current text-white" /> : <Play className="h-7 w-7 fill-current text-white" />}
                    </div>
                  </button>

                  {/* Top right badges */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"
                      style={{ background: "rgba(0,0,0,0.50)" }}>
                      {activeVideo.duration} · {activeVideo.aspectRatio} · {activeVideo.fps}fps
                    </span>
                  </div>

                  {/* Bottom controls */}
                  <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
                    {/* Seekbar */}
                    <div className="mb-3 h-1 w-full cursor-pointer overflow-hidden rounded-full"
                      style={{ background: "rgba(255,255,255,0.25)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: isPlaying ? "45%" : "0%", background: "linear-gradient(90deg,#1D7BFF,#06B6D4)" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setIsPlaying(v => !v)}
                          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/20">
                          {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current text-white" /> : <Play className="h-3.5 w-3.5 fill-current text-white" />}
                        </button>
                        <button onClick={() => setIsMuted(v => !v)}
                          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/20">
                          {isMuted ? <VolumeX className="h-3.5 w-3.5 text-white" /> : <Volume2 className="h-3.5 w-3.5 text-white" />}
                        </button>
                        <span className="text-[11px] text-white/70">
                          {isPlaying ? "0:02" : "0:00"} / 0:{activeVideo.duration.replace("s","")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => showToast("Video downloaded", "info")}
                          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/20">
                          <Download className="h-3.5 w-3.5 text-white" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/20">
                          <Maximize2 className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action row below player */}
                <div className="flex items-center gap-2">
                  <button onClick={handleGenerate} disabled={generating}
                    className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all hover:bg-[var(--bg-hover)]"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </button>
                  <Link href={`/design-studio?prompt=${encodeURIComponent(activeVideo.prompt)}`}
                    className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all hover:bg-[var(--bg-hover)]"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    <Layers className="h-3.5 w-3.5" /> Edit in Design Studio
                  </Link>
                  <button onClick={() => showToast("Saved to collection", "info")}
                    className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all hover:bg-[var(--bg-hover)]"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    <BookmarkPlus className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
              </div>

            ) : (
              /* Empty state */
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(29,123,255,0.08)", border: "2px dashed rgba(29,123,255,0.25)" }}>
                  <Film className="h-10 w-10" style={{ color: "rgba(29,123,255,0.5)" }} />
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Ready to generate</h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                    Configure your settings and write a prompt to create a video
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Cinematic sunrise over a futuristic city", "Underwater coral reef with colorful fish", "Cherry blossoms falling in slow motion"].map(p => (
                    <button key={p} onClick={() => setPrompt(p)}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:border-[#1D7BFF]/50 hover:bg-[var(--bg-hover)]"
                      style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════ RIGHT PANEL — Video Library ══════════════ */}
        <div className="flex w-72 flex-shrink-0 flex-col border-l overflow-hidden"
          style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
          <div className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: "var(--border)" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              History ({videos.length})
            </span>
            {videos.length > 0 && (
              <button onClick={() => showToast("All videos downloaded", "info")}
                className="flex items-center gap-1 text-[11px] font-medium transition-colors hover:opacity-80"
                style={{ color: "#1D7BFF" }}>
                <Download className="h-3 w-3" /> Export all
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 pt-16 text-center">
                <Inbox className="h-8 w-8" style={{ color: "var(--text-tertiary)" }} />
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>No videos yet</p>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Generated videos will appear here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {videos.map(v => (
                  <div key={v.id}
                    className={cn("group relative overflow-hidden rounded-xl cursor-pointer border transition-all hover:border-[#1D7BFF]/50",
                      v.id === selectedVideo ? "border-[#1D7BFF]" : "border-transparent")}
                    onClick={() => setSelectedVideo(v.id)}>

                    {/* Thumbnail */}
                    <div className={cn("relative flex aspect-video w-full items-center justify-center bg-gradient-to-br", v.gradient)}>
                      <Play className="h-5 w-5 fill-current text-white/80" />
                      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm"
                          style={{ background: "rgba(0,0,0,0.55)" }}>
                          {v.duration} · {v.aspectRatio}
                        </span>
                      </div>
                    </div>

                    {/* Info row */}
                    <div className="px-2.5 py-2" style={{ background: "var(--bg-muted)" }}>
                      <p className="line-clamp-1 text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                        {v.prompt}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {MODELS.find(m => m.id === v.model)?.name} · {v.createdAt}
                        </span>
                        <div className="relative">
                          <button onClick={e => { e.stopPropagation(); setMoreMenu(moreMenu === v.id ? null : v.id); }}
                            className="flex h-5 w-5 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100"
                            style={{ color: "var(--text-tertiary)" }}>
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                          {moreMenu === v.id && (
                            <div className="absolute right-0 top-6 z-30 w-36 overflow-hidden rounded-lg shadow-xl"
                              style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
                              {[
                                { icon: Download, label: "Download" },
                                { icon: Copy,     label: "Copy prompt" },
                                { icon: RefreshCw,label: "Regenerate" },
                                { icon: BookmarkPlus, label: "Save" },
                                { icon: Trash2,   label: "Delete", danger: true },
                              ].map(({ icon: Icon, label, danger }) => (
                                <button key={label}
                                  onClick={e => { e.stopPropagation(); setMoreMenu(null); showToast(label, "info"); }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                                  style={{ color: danger ? "#EF4444" : "var(--text-secondary)" }}>
                                  <Icon className="h-3 w-3" /> {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

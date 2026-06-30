"use client";

import { useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Upload,
  Film,
  Inbox,
  Sparkles,
  Play,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { randomGradient } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";

const aspectRatios = ["16:9", "9:16", "1:1", "4:3", "3:4", "3:2", "2:3"];

type GeneratedVideo = {
  id: string;
  prompt: string;
  gradient: string;
  duration: "5s" | "10s";
  aspectRatio: string;
};

export default function VideoStudioPage() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [shotMode, setShotMode] = useState<"one" | "multi">("one");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState<"5s" | "10s">("5s");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [cfgScale, setCfgScale] = useState(0.7);
  const [prompt, setPrompt] = useState("");
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const { showToast } = useToast();
  const { addUsage } = useUsage();

  function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    const id = `video-${Date.now()}`;
    setTimeout(() => {
      const video: GeneratedVideo = {
        id,
        prompt,
        gradient: randomGradient(),
        duration,
        aspectRatio,
      };
      setVideos((prev) => [video, ...prev]);
      setSelectedVideo(id);
      setGenerating(false);
      showToast("Video generated successfully");
      addUsage("Text-to-Video", "kling-v1-6", duration === "10s" ? 200 : 100, duration === "10s" ? 80 : 40);
      setPrompt("");
    }, 2400);
  }

  const activeVideo = videos.find((v) => v.id === selectedVideo);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANEL */}
      {leftCollapsed ? (
        <div className="flex w-[52px] flex-shrink-0 flex-col items-center border-r border-white/10 bg-white/[0.02] py-5">
          <button
            type="button"
            onClick={() => setLeftCollapsed(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white"
            title="Expand panel"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      ) : (
      <div className="flex w-[400px] flex-shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-white/[0.02]">
        <div className="flex items-start justify-between px-5 py-5">
          <div>
            <h1 className="text-lg font-semibold text-white">🎥 Video Studio</h1>
            <p className="mt-0.5 text-xs text-zinc-500">Turn your thoughts into life</p>
          </div>
          <button
            type="button"
            onClick={() => setLeftCollapsed(true)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-white"
            title="Collapse panel"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5">
          <button className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-200 hover:bg-white/10">
            <span className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-yellow-500" />
              kling-video
            </span>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </button>
        </div>

        <div className="mt-4 px-5">
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setMode("text")}
              className={cn(
                "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                mode === "text" ? "bg-yellow-500 text-black" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Text to Video
            </button>
            <button
              onClick={() => setMode("image")}
              className={cn(
                "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                mode === "image" ? "bg-yellow-500 text-black" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Image to Video
            </button>
          </div>
        </div>

        {mode === "image" && (
          <div className="mt-4 px-5">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Reference Images</span>
                <div className="flex rounded-md border border-white/10 bg-white/5 p-0.5 text-[11px]">
                  <button
                    onClick={() => setShotMode("one")}
                    className={cn(
                      "rounded px-2 py-1",
                      shotMode === "one" ? "bg-white/10 text-white" : "text-zinc-500"
                    )}
                  >
                    One-shot
                  </button>
                  <button
                    onClick={() => setShotMode("multi")}
                    className={cn(
                      "rounded px-2 py-1",
                      shotMode === "multi" ? "bg-white/10 text-white" : "text-zinc-500"
                    )}
                  >
                    Multiple-shot
                  </button>
                </div>
              </div>
              <button className="mt-3 flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/20 px-4 py-6 text-center hover:border-yellow-500/40 hover:bg-white/5">
                <Upload className="h-5 w-5 text-zinc-500" />
                <span className="text-xs text-zinc-300">Click or drag to upload images</span>
                <span className="text-[11px] text-zinc-500">Supports multiple image selection</span>
                <span className="text-[11px] text-zinc-600">Max 1 images, 10MB each</span>
              </button>
            </Card>
          </div>
        )}

        <div className="mt-4 px-5">
          <Card className="p-4">
            <span className="text-sm font-medium text-white">Prompt</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </Card>
        </div>

        <div className="mt-4 px-5">
          <Card className="space-y-4 p-4">
            <span className="text-sm font-medium text-white">Parameters</span>
            <div>
              <div className="mb-2 text-xs text-zinc-500">Aspect Ratio</div>
              <div className="flex flex-wrap gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 text-xs",
                      aspectRatio === ratio
                        ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                    )}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs text-zinc-500">Duration</div>
              <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
                <button
                  onClick={() => setDuration("5s")}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-xs font-medium",
                    duration === "5s" ? "bg-yellow-500 text-black" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  5s
                </button>
                <button
                  onClick={() => setDuration("10s")}
                  className={cn(
                    "flex-1 rounded-md py-1.5 text-xs font-medium",
                    duration === "10s" ? "bg-yellow-500 text-black" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  10s
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4 px-5 pb-6">
          <Card className="p-4">
            <button
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex w-full items-center justify-between text-sm font-medium text-white"
            >
              Advanced Settings
              {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {advancedOpen && (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 text-xs text-zinc-500">Sub Model</div>
                  <button className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10">
                    kling-v1-6
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  </button>
                </div>
                <Slider
                  label="CFG Scale"
                  paramKey="cfg_scale"
                  value={cfgScale}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={setCfgScale}
                />
                <div>
                  <div className="mb-2 text-xs text-zinc-500">Negative Prompt</div>
                  <textarea
                    placeholder="What to avoid in the generated video..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="sticky bottom-0 border-t border-white/10 bg-white/[0.02] px-5 py-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-yellow-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
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
      )}

      {/* RIGHT PANEL */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-8 py-8">
          {generating ? (
            <div className="flex flex-col items-center text-center text-zinc-400">
              <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
              <h2 className="mt-3 text-base font-medium text-zinc-200">Rendering your video…</h2>
              <p className="mt-1 text-sm text-zinc-500">This usually takes a few seconds.</p>
            </div>
          ) : activeVideo ? (
            <div
              className={cn(
                "relative flex w-full max-w-2xl items-center justify-center rounded-2xl bg-gradient-to-br shadow-2xl",
                activeVideo.gradient,
                activeVideo.aspectRatio === "9:16" ? "aspect-[9/16] max-w-sm" : "aspect-video"
              )}
            >
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform hover:scale-105">
                <Play className="h-7 w-7 fill-current" />
              </button>
              <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/40 px-3 py-2 text-left text-xs text-white/90 backdrop-blur-sm">
                {activeVideo.prompt}
              </div>
              <span className="absolute right-3 top-3 rounded bg-black/40 px-2 py-1 text-[10px] text-white/80 backdrop-blur-sm">
                {activeVideo.duration} · {activeVideo.aspectRatio}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-zinc-500">
              <Film className="h-10 w-10" />
              <h2 className="mt-3 text-base font-medium text-zinc-300">Video Studio</h2>
              <p className="mt-1 text-sm">Select or generate a video to get started</p>
            </div>
          )}
        </div>

        {videos.length > 0 && (
          <div className="w-64 flex-shrink-0 overflow-y-auto border-l border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Generated videos
            </div>
            <div className="space-y-2">
              {videos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVideo(v.id)}
                  className={cn(
                    "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ring-2 ring-transparent",
                    v.gradient,
                    v.id === selectedVideo && "ring-yellow-500"
                  )}
                >
                  <Play className="h-5 w-5 fill-current text-white/90" />
                  <span className="absolute bottom-1 left-1.5 right-1.5 truncate text-left text-[10px] text-white/90">
                    {v.prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {videos.length === 0 && !generating && (
          <div className="hidden w-64 flex-shrink-0 flex-col items-center justify-center gap-2 border-l border-white/10 bg-white/[0.02] px-4 text-center text-zinc-500 lg:flex">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">No videos generated yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

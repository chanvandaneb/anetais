"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Cpu, Maximize2, Hash, Paperclip, Sparkles, Loader2,
  Download, X, ChevronLeft, ChevronRight, Wand2,
  Heart, Share2, BookmarkPlus, Copy, Eye, Tag, Clock, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { randomCreationImage, type GalleryImage } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";

/* ── helpers ── */
function img(seed: string, _w: number, h: number) {
  const isTall = h > _w;
  return `/gallery/${seed}${isTall ? "_tall" : "_sq"}.jpg`;
}
function formatNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ── constants ── */
const STYLE_PRESETS = [
  { id: "none",  label: "None",          emoji: "✏️" },
  { id: "photo", label: "Photorealistic", emoji: "📷" },
  { id: "anime", label: "Anime",          emoji: "🌸" },
  { id: "water", label: "Watercolor",     emoji: "🎨" },
  { id: "pixel", label: "Pixel Art",      emoji: "👾" },
  { id: "cine",  label: "Cinematic",      emoji: "🎬" },
  { id: "oil",   label: "Oil Painting",   emoji: "🖼️" },
  { id: "3d",    label: "3D Render",      emoji: "💎" },
];

const SIZES = ["512×512", "768×768", "1024×1024", "1024×1792", "1792×1024"];

const ASPECT_RATIOS = [
  { label: "1:1",  name: "Square",    w: 8,   h: 8,   size: "1024×1024"  },
  { label: "4:3",  name: "Landscape", w: 10,  h: 7.5, size: "1024×768"   },
  { label: "16:9", name: "Wide",      w: 12,  h: 6.75,size: "1792×1024"  },
  { label: "3:4",  name: "Portrait",  w: 7.5, h: 10,  size: "768×1024"   },
  { label: "9:16", name: "Mobile",    w: 5.6, h: 10,  size: "1024×1792"  },
];

const GEN_STAGES = [
  { label: "Queuing",           pct: 10 },
  { label: "Processing prompt", pct: 35 },
  { label: "Generating image",  pct: 65 },
  { label: "Upscaling",         pct: 88 },
  { label: "Finalizing",        pct: 97 },
];

type ExploreItem = {
  id: string; seed: string; prompt: string; tall: boolean; ratio: string;
  author: string; likes: number; views: string; style: string;
};

const EXPLORE_ITEMS: ExploreItem[] = [
  { id:"e1",  seed:"nature1",   prompt:"Misty mountain range at golden hour, aerial view, dramatic clouds",               tall:true,  ratio:"3/4",  author:"luna_ai",   likes:4210, views:"31k",  style:"Photorealistic" },
  { id:"e2",  seed:"city2",     prompt:"Neon-lit Tokyo street at night, cyberpunk style, rain reflections",               tall:false, ratio:"16/9", author:"alex_gen",  likes:2841, views:"18k",  style:"Cinematic"      },
  { id:"e3",  seed:"ocean3",    prompt:"Turquoise ocean waves crashing on white sand beach, paradise island",             tall:true,  ratio:"9/16", author:"vista_ai",  likes:987,  views:"6.4k", style:"Photorealistic" },
  { id:"e4",  seed:"forest4",   prompt:"Ancient redwood forest, god rays, morning mist, green moss, fantasy atmosphere",  tall:false, ratio:"4/3",  author:"wild_gen",  likes:3890, views:"28k",  style:"Oil Painting"   },
  { id:"e5",  seed:"space5",    prompt:"Nebula swirling with violet and gold cosmic dust, deep space, 8k render",         tall:false, ratio:"1/1",  author:"cosmos_x",  likes:3340, views:"24k",  style:"3D Render"      },
  { id:"e6",  seed:"arch6",     prompt:"Minimalist white concrete architecture in desert landscape, sharp shadows",        tall:true,  ratio:"3/4",  author:"arc_lab",   likes:1567, views:"11k",  style:"Photorealistic" },
  { id:"e7",  seed:"food7",     prompt:"Artisan ramen bowl with soft-boiled egg, sesame, scallions, top-down",            tall:false, ratio:"1/1",  author:"foodviz",   likes:2200, views:"16k",  style:"None"           },
  { id:"e8",  seed:"portrait8", prompt:"Cinematic portrait woman warrior, dramatic lighting, photorealistic",             tall:false, ratio:"3/4",  author:"kai_flux",  likes:4120, views:"31k",  style:"Cinematic"      },
  { id:"e9",  seed:"abstract9", prompt:"Liquid chrome fluid art, electric blue and silver, abstract macro",               tall:true,  ratio:"9/16", author:"fluid_ai",  likes:2760, views:"20k",  style:"Watercolor"     },
  { id:"e10", seed:"macro10",   prompt:"Macro dewdrop on spider web at sunrise, rainbow refraction, hyper-detailed",      tall:false, ratio:"4/3",  author:"macro_x",   likes:5100, views:"42k",  style:"Photorealistic" },
  { id:"e11", seed:"gen1",      prompt:"Futuristic megacity at dusk, flying cars, holographic ads, blade runner",         tall:false, ratio:"16/9", author:"neo_gen",   likes:4300, views:"35k",  style:"Cinematic"      },
  { id:"e12", seed:"gen5",      prompt:"Watercolor sunrise over emerald rice terraces, Bali, morning fog",                tall:true,  ratio:"3/4",  author:"travel_x",  likes:3100, views:"22k",  style:"Watercolor"     },
  { id:"e13", seed:"gen9",      prompt:"Hyper-detailed 3D crystal sphere on dark surface, refraction, caustics",          tall:false, ratio:"1/1",  author:"cgi_lab",   likes:2450, views:"18k",  style:"3D Render"      },
  { id:"e14", seed:"gen11",     prompt:"Anime girl in cherry blossom forest, studio ghibli style",                        tall:false, ratio:"3/4",  author:"ghibli_x",  likes:6800, views:"55k",  style:"Anime"          },
  { id:"e15", seed:"gen13",     prompt:"Surreal floating island with waterfalls, fantasy world, concept art",             tall:true,  ratio:"9/16", author:"dream_ai",  likes:6200, views:"51k",  style:"3D Render"      },
];

/* ── Detail Modal ── */
function DetailModal({ item, items, imgSrc, onClose, onNav }: {
  item: ExploreItem | GalleryImage;
  items: (ExploreItem | GalleryImage)[];
  imgSrc: string;
  onClose: () => void;
  onNav: (item: ExploreItem | GalleryImage) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const idx = items.findIndex(i => i.id === item.id);
  const isExplore = "author" in item;

  const author  = isExplore ? (item as ExploreItem).author : "my_creation";
  const likes   = isExplore ? (item as ExploreItem).likes  : 0;
  const views   = isExplore ? (item as ExploreItem).views  : "—";
  const style   = isExplore ? (item as ExploreItem).style  : "Custom";
  const tall    = isExplore ? (item as ExploreItem).tall   : (item as GalleryImage).tall;
  const related = items.filter((_, i) => i !== idx).slice(0, 6);
  const tags    = item.prompt.split(",").map(t => t.trim().split(" ").slice(0, 3).join(" ")).filter(Boolean).slice(0, 5);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft"  && idx > 0)              onNav(items[idx - 1]);
      if (e.key === "ArrowRight" && idx < items.length-1) onNav(items[idx + 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, items, onClose, onNav]);

  function copyPrompt() {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.78)" }} onClick={onClose}>
      <div className="relative flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <X className="h-4 w-4 text-white" />
        </button>

        {/* Left — image */}
        <div className="relative flex-shrink-0 w-[52%]" style={{ background: "#000", minHeight: 360 }}>
          {/* Prev / Next inside image panel */}
          {idx > 0 && (
            <button onClick={() => onNav(items[idx-1])}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
              style={{ background: "rgba(0,0,0,0.45)" }}>
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}
          {idx < items.length-1 && (
            <button onClick={() => onNav(items[idx+1])}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
              style={{ background: "rgba(0,0,0,0.45)" }}>
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          )}
          <div className="absolute inset-0 animate-pulse" style={{ background: "var(--bg-muted)" }} />
          <img src={imgSrc} alt={item.prompt} className="relative h-full w-full object-cover" />
          <div className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.55)" }}>
            {idx + 1} / {items.length}
          </div>
          <div className="absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm"
            style={{ background: "rgba(29,123,255,0.75)", color: "#fff" }}>
            {style}
          </div>
        </div>

        {/* Right — details */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Author */}
          <div className="flex items-center gap-3 border-b p-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
              {author.slice(0,2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>@{author}</p>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                <Clock className="h-3 w-3" /> 2 hours ago
              </div>
            </div>
            {isExplore && (
              <button className="ml-auto rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                Follow
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 p-5">
            {/* Stats */}
            {isExplore && (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <Eye className="h-4 w-4" />{views}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <Heart className="h-4 w-4" />{formatNum(likes + (liked ? 1 : 0))}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <Download className="h-4 w-4" />{formatNum(Math.floor(likes * 0.3))}
                </span>
              </div>
            )}

            {/* Prompt */}
            <div className="rounded-xl p-4" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Prompt</span>
                <button onClick={copyPrompt} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors hover:bg-white/10"
                  style={{ color: copied ? "#10B981" : "var(--text-tertiary)" }}>
                  <Copy className="h-3 w-3" />{copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{item.prompt}</p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  <Tag className="h-3 w-3" /> Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span key={tag} className="cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium hover:opacity-80"
                      style={{ background: "rgba(29,123,255,0.12)", color: "#1D7BFF", border: "1px solid rgba(29,123,255,0.25)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Model info */}
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(139,92,246,0.15)" }}>
                <Wand2 className="h-4 w-4" style={{ color: "#8B5CF6" }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>AI Image Studio</p>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Flux Pro · 1024×{tall ? "1536" : "1024"} · Steps 30 · Style: {style}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href={`/design-studio?prompt=${encodeURIComponent(item.prompt)}`}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)", boxShadow: "0 4px 16px rgba(29,123,255,0.35)" }}>
                <Layers className="h-4 w-4" /> Try in Design Studio
              </Link>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setLiked(v => !v)}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all"
                  style={{ background: liked ? "rgba(239,68,68,0.12)" : "var(--bg-muted)", color: liked ? "#EF4444" : "var(--text-secondary)", border: `1px solid ${liked ? "rgba(239,68,68,0.3)" : "var(--border)"}` }}>
                  <Heart className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} />
                  {liked ? "Liked" : "Like"}
                </button>
                <button onClick={() => setSaved(v => !v)}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all"
                  style={{ background: saved ? "rgba(29,123,255,0.12)" : "var(--bg-muted)", color: saved ? "#1D7BFF" : "var(--text-secondary)", border: `1px solid ${saved ? "rgba(29,123,255,0.3)" : "var(--border)"}` }}>
                  <BookmarkPlus className="h-3.5 w-3.5" /> Save
                </button>
                <button className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all"
                  style={{ background: "var(--bg-muted)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
              <button className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all"
                style={{ background: "var(--bg-muted)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                <Download className="h-3.5 w-3.5" /> Download HD
              </button>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Related</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {related.map((r, i) => {
                    const rSrc = "seed" in r
                      ? img((r as ExploreItem).seed, 120, 120)
                      : (r as GalleryImage).src;
                    return (
                      <button key={i} onClick={() => onNav(r)}
                        className="relative overflow-hidden rounded-lg transition-opacity hover:opacity-80"
                        style={{ aspectRatio: "1", background: "var(--bg-muted)" }}>
                        <img src={rSrc} alt={r.prompt} className="h-full w-full object-cover" loading="lazy" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Gallery card ── */
function ImageCard({ imgSrc, prompt, author, likes, views, style, processing, ratio, onOpen }: {
  imgSrc: string; prompt: string; author?: string; likes?: number;
  views?: string; style?: string; processing?: boolean; ratio?: string; onOpen: () => void;
}) {
  const [hov, setHov] = useState(false);
  const [liked, setLiked] = useState(false);

  if (processing) {
    return (
      <div className="group relative overflow-hidden rounded-xl"
        style={{ aspectRatio: "1/1", background: "var(--bg-muted)" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "rgba(29,123,255,0.25)", borderTopColor: "#1D7BFF" }} />
          <div className="text-center">
            <p className="text-xs font-semibold" style={{ color: "#1D7BFF" }}>Generating…</p>
            <p className="mt-0.5 text-[10px] line-clamp-2 px-4 text-center" style={{ color: "var(--text-tertiary)" }}>{prompt}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl cursor-pointer"
      style={{ aspectRatio: ratio ?? "1/1" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onOpen}>
      <div className="absolute inset-0 animate-pulse" style={{ background: "var(--bg-muted)" }} />
      <img src={imgSrc} alt={prompt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />

      {/* Always-visible bottom stats */}
      {(views || likes !== undefined) && (
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 pt-6"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}>
          <div className="flex items-center gap-2 text-[10px] text-white/70">
            {views && <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{views}</span>}
            {likes !== undefined && <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{formatNum(likes + (liked ? 1 : 0))}</span>}
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-2.5 transition-opacity duration-200"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.10) 55%, transparent 100%)", opacity: hov ? 1 : 0 }}>
        <div className="flex justify-end gap-1.5">
          {style && (
            <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold backdrop-blur-sm"
              style={{ background: "rgba(29,123,255,0.70)", color: "#fff" }}>{style}</span>
          )}
          <button onClick={e => { e.stopPropagation(); setLiked(v => !v); }}
            className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
            style={{ background: liked ? "rgba(239,68,68,0.8)" : "rgba(255,255,255,0.15)" }}>
            <Heart className="h-3.5 w-3.5 text-white" fill={liked ? "white" : "none"} />
          </button>
        </div>
        <div>
          <p className="mb-1.5 line-clamp-2 text-[11px] font-medium leading-snug text-white">{prompt}</p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(29,123,255,0.70)" }}>
              <Eye className="h-3 w-3" /> View detail
            </span>
            {author && <span className="text-[10px] text-white/50">@{author}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Canvas Editor ── */
const CANVAS_TOOLS = [
  { id: "select",  icon: "⬡", label: "Select"    },
  { id: "move",    icon: "✥", label: "Move"      },
  { id: "crop",    icon: "⊡", label: "Crop"      },
  { id: "brush",   icon: "✎", label: "Brush"     },
  { id: "eraser",  icon: "◻", label: "Eraser"    },
  { id: "text",    icon: "T", label: "Text"      },
  { id: "shape",   icon: "◯", label: "Shape"     },
  { id: "magic",   icon: "✦", label: "AI Enhance"},
];

const FILTERS = ["None","Vivid","Matte","Noir","Warm","Cool","Fade","Grain"];

function CanvasEditor({ creation, onClose }: { creation: GalleryImage; onClose: () => void }) {
  const [activeTool, setActiveTool] = useState("select");
  const [activeFilter, setActiveFilter] = useState("None");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filterStyle: React.CSSProperties = {
    filter: [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
      activeFilter === "Noir"  ? "grayscale(100%)"           : "",
      activeFilter === "Warm"  ? "sepia(40%)"                : "",
      activeFilter === "Cool"  ? "hue-rotate(30deg)"         : "",
      activeFilter === "Vivid" ? "saturate(160%) contrast(110%)" : "",
      activeFilter === "Matte" ? "brightness(105%) contrast(85%)" : "",
      activeFilter === "Fade"  ? "brightness(115%) saturate(80%)" : "",
      activeFilter === "Grain" ? "contrast(105%)"            : "",
    ].filter(Boolean).join(" "),
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col" style={{ background: "var(--bg-base)" }}>
      {/* Top toolbar */}
      <div className="flex h-12 flex-shrink-0 items-center gap-3 border-b px-4"
        style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]">
          <X className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
        </button>
        <div className="h-4 w-px" style={{ background: "var(--border)" }} />
        <span className="text-sm font-medium truncate max-w-xs" style={{ color: "var(--text-primary)" }}>
          {creation.prompt || "My Creation"}
        </span>
        <div className="flex-1" />
        {/* Zoom */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setZoom(z => Math.max(25, z - 25))}
            className="flex h-7 w-7 items-center justify-center rounded text-lg transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: "var(--text-tertiary)" }}>−</button>
          <span className="w-12 text-center text-xs" style={{ color: "var(--text-secondary)" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 25))}
            className="flex h-7 w-7 items-center justify-center rounded text-lg transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: "var(--text-tertiary)" }}>+</button>
        </div>
        <div className="h-4 w-px" style={{ background: "var(--border)" }} />
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
          <Download className="h-3.5 w-3.5" /> Export
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left tools */}
        <div className="flex w-14 flex-shrink-0 flex-col items-center gap-1 border-r py-3"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>
          {CANVAS_TOOLS.map(t => (
            <button key={t.id} onClick={() => setActiveTool(t.id)} title={t.label}
              className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors",
                activeTool === t.id ? "text-white" : "hover:bg-[var(--bg-hover)]")}
              style={activeTool === t.id ? { background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" } : { color: "var(--text-tertiary)" }}>
              {t.icon}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-8"
          style={{ background: "repeating-conic-gradient(var(--bg-muted) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}>
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center", transition: "transform 0.15s" }}>
            <img
              src={creation.src}
              alt={creation.prompt}
              className="block max-h-[70vh] max-w-full rounded-lg shadow-2xl"
              style={filterStyle}
              draggable={false}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex w-64 flex-shrink-0 flex-col overflow-y-auto border-l"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}>

          {/* Filters */}
          <div className="border-b p-4" style={{ borderColor: "var(--border)" }}>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Filter</p>
            <div className="grid grid-cols-4 gap-1.5">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={cn("rounded-md py-1.5 text-[10px] font-medium transition-colors",
                    activeFilter === f ? "text-white" : "hover:bg-[var(--bg-hover)]")}
                  style={activeFilter === f
                    ? { background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }
                    : { background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div className="border-b p-4" style={{ borderColor: "var(--border)" }}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Adjustments</p>
            {[
              { label: "Brightness", value: brightness, set: setBrightness },
              { label: "Contrast",   value: contrast,   set: setContrast   },
              { label: "Saturation", value: saturation, set: setSaturation },
            ].map(({ label, value, set }) => (
              <div key={label} className="mb-3">
                <div className="mb-1 flex justify-between text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  <span>{label}</span><span>{value}%</span>
                </div>
                <input type="range" min={0} max={200} value={value}
                  onChange={e => set(Number(e.target.value))}
                  className="w-full accent-[#1D7BFF]" />
              </div>
            ))}
          </div>

          {/* AI Actions */}
          <div className="p-4">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>AI Actions</p>
            {[
              { icon: "✦", label: "Enhance Quality"    },
              { icon: "⊡", label: "Remove Background"  },
              { icon: "⤢", label: "Upscale 2×"         },
              { icon: "✎", label: "Edit with Prompt"   },
            ].map(a => (
              <button key={a.label}
                className="mb-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: "var(--text-secondary)" }}>
                <span className="text-sm" style={{ color: "#1D7BFF" }}>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>

          {/* Prompt */}
          <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Prompt</p>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{creation.prompt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pre-seeded creations ── */
const INITIAL_CREATIONS: GalleryImage[] = [
  { id:"c12", src: img("gen12", 600, 600), prompt: "Snow leopard in mountain blizzard, wildlife photography, telephoto, bokeh",                tall: false, ratio: "4/3",  processing: true },
  { id:"c1",  src: img("gen1",  600, 800), prompt: "Futuristic megacity at dusk, flying cars, holographic ads, blade runner aesthetic",       tall: true,  ratio: "3/4"  },
  { id:"c2",  src: img("gen2",  600, 600), prompt: "Photorealistic wolf in northern forest, moonlight, ice crystals on fur",                  tall: false, ratio: "1/1"  },
  { id:"c3",  src: img("gen3",  800, 450), prompt: "Oil painting harbour scene, fishing boats at golden hour, impressionist style",            tall: false, ratio: "16/9" },
  { id:"c4",  src: img("gen4",  600, 800), prompt: "Anime girl in cherry blossom forest, soft pastel tones, studio ghibli inspired",          tall: true,  ratio: "3/4"  },
  { id:"c5",  src: img("gen5",  600, 450), prompt: "Watercolor sunrise over emerald rice terraces, Bali, morning fog rising",                 tall: false, ratio: "4/3"  },
  { id:"c6",  src: img("gen6",  600, 600), prompt: "3D crystal ball with galaxy inside, dark surface, caustic light beams",                    tall: false, ratio: "1/1"  },
  { id:"c7",  src: img("gen7",  450, 800), prompt: "Pixel art 8-bit mountain village, retro game style, autumn colors",                       tall: true,  ratio: "9/16" },
  { id:"c8",  src: img("gen8",  600, 800), prompt: "Cinematic portrait of a samurai, rain, neon city in background, photorealistic",           tall: true,  ratio: "3/4"  },
  { id:"c9",  src: img("gen9",  800, 450), prompt: "Surreal floating island with waterfalls, fantasy world, concept art, dramatic sky",        tall: false, ratio: "16/9" },
  { id:"c10", src: img("gen10", 600, 600), prompt: "Deep sea bioluminescent jellyfish, dark ocean, ethereal blue glow, ultra HD render",      tall: false, ratio: "1/1"  },
  { id:"c11", src: img("gen11", 600, 800), prompt: "Abstract geometric low-poly landscape at sunset, polygon art, gradient purple sky",        tall: true,  ratio: "3/4"  },
];

/* ── Page ── */
export default function ImageStudioPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"explore" | "creations">("explore");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showNeg, setShowNeg] = useState(false);
  const [creations, setCreations] = useState<GalleryImage[]>(INITIAL_CREATIONS);
  const [generating, setGenerating] = useState(false);
  const [genStage, setGenStage] = useState(0);
  const [genPct, setGenPct] = useState(0);
  const [stylePreset, setStylePreset] = useState("none");
  const [size, setSize] = useState("1024×1024");
  const [activeRatio, setActiveRatio] = useState("1:1");
  const [imageCount, setImageCount] = useState<1 | 2 | 4>(1);
  const [showRatioPicker, setShowRatioPicker] = useState(false);
  const [detail, setDetail] = useState<{ item: ExploreItem | GalleryImage; items: (ExploreItem | GalleryImage)[]; src: string } | null>(null);
  const [canvas, setCanvas] = useState<GalleryImage | null>(null);
  const { showToast } = useToast();
  const { addUsage } = useUsage();

  function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setTab("creations");
    setGenStage(0);
    setGenPct(0);
    let stageIdx = 0;
    const advance = () => {
      if (stageIdx >= GEN_STAGES.length) return;
      setGenStage(stageIdx);
      setGenPct(GEN_STAGES[stageIdx].pct);
      stageIdx++;
      if (stageIdx < GEN_STAGES.length) setTimeout(advance, 350 + Math.random() * 250);
    };
    advance();
    const capturedPrompt = prompt.trim();
    setTimeout(() => {
      const newImg = randomCreationImage(Math.random() > 0.6);
      newImg.prompt = capturedPrompt;
      setCreations(prev => [newImg, ...prev]);
      setGenerating(false);
      setGenPct(100);
      showToast("Image generated successfully");
      addUsage("Text-to-Image", "qwen-image-edit-2509", 1024, 25);
      setPrompt("");
    }, 2200);
  }

  function openExplore(item: ExploreItem) {
    setDetail({ item, items: EXPLORE_ITEMS, src: img(item.seed, 600, item.tall ? 800 : 600) });
  }
  function openCreation(creation: GalleryImage) {
    router.push(`/design-studio?prompt=${encodeURIComponent(creation.prompt)}`);
  }
  function navTo(next: ExploreItem | GalleryImage) {
    const src = "seed" in next
      ? img((next as ExploreItem).seed, 600, (next as ExploreItem).tall ? 800 : 600)
      : (next as GalleryImage).src;
    setDetail(d => d ? { ...d, item: next, src } : null);
  }

  const activeLabel = STYLE_PRESETS.find(p => p.id === stylePreset)?.label ?? "None";

  return (
    <div className="flex h-screen flex-col overflow-y-auto" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {detail && (
        <DetailModal item={detail.item} items={detail.items} imgSrc={detail.src} onClose={() => setDetail(null)} onNav={navTo} />
      )}
      {canvas && (
        <CanvasEditor creation={canvas} onClose={() => setCanvas(null)} />
      )}

      {/* Hero banner */}
      <div className="relative flex h-44 flex-shrink-0 items-end overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/40 via-[#1666E8]/30 to-violet-500/30 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent" />
        <div className="relative px-8 pb-6">
          <h1 className="text-3xl font-light italic" style={{ color: "var(--text-primary)", fontFamily: "Georgia,'Times New Roman',serif" }}>
            Transform your ideas into stunning visuals
          </h1>
        </div>
      </div>

      <div className="py-6">
        {/* Prompt bar */}
        <div className="px-8">
        <div className="mx-auto max-w-4xl rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
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
              <button key={p.id} onClick={() => setStylePreset(p.id)}
                className={cn("flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  stylePreset === p.id ? "border-[#1D7BFF] bg-[#1D7BFF]/10 text-[#60A5FA]" : "hover:bg-[var(--bg-hover)]")}
                style={stylePreset !== p.id ? { borderColor: "var(--border)", color: "var(--text-tertiary)" } : {}}>
                {p.emoji} {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Model chip */}
            <button className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
              <Cpu className="h-3.5 w-3.5 text-[#1D7BFF]" />
              qwen-image-edit-2509
            </button>

            {/* Aspect ratio picker */}
            <div className="relative">
              <button onClick={() => setShowRatioPicker(v => !v)}
                className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]",
                  showRatioPicker && "border-[#1D7BFF]/40 bg-[#1D7BFF]/10 text-[#60A5FA]")}
                style={!showRatioPicker ? { borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" } : {}}>
                <Maximize2 className="h-3.5 w-3.5" />
                {activeRatio} · {ASPECT_RATIOS.find(r => r.label === activeRatio)?.name}
              </button>
              {showRatioPicker && (
                <div className="absolute left-0 top-full z-50 mt-2 rounded-xl border shadow-xl p-3"
                  style={{ background: "var(--bg-subtle)", borderColor: "var(--border)", width: 260 }}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Aspect Ratio</p>
                  <div className="flex gap-2">
                    {ASPECT_RATIOS.map(r => (
                      <button key={r.label} onClick={() => { setActiveRatio(r.label); setSize(r.size); setShowRatioPicker(false); }}
                        className="flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-[var(--bg-hover)]"
                        style={activeRatio === r.label ? { background: "rgba(29,123,255,0.12)" } : {}}>
                        <div className="flex items-end justify-center" style={{ height: 36, width: 36 }}>
                          <div className="rounded-sm border-2 transition-colors"
                            style={{
                              width: `${r.w * 3}px`,
                              height: `${r.h * 3}px`,
                              maxWidth: 36,
                              maxHeight: 36,
                              borderColor: activeRatio === r.label ? "#1D7BFF" : "var(--text-tertiary)",
                              background: activeRatio === r.label ? "rgba(29,123,255,0.15)" : "transparent",
                            }} />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: activeRatio === r.label ? "#1D7BFF" : "var(--text-secondary)" }}>{r.label}</span>
                        <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>{r.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    Output: {ASPECT_RATIOS.find(r => r.label === activeRatio)?.size} px
                  </p>
                </div>
              )}
            </div>

            {/* Image count toggle */}
            <button onClick={() => setImageCount(c => c === 1 ? 2 : c === 2 ? 4 : 1)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
              <Hash className="h-3.5 w-3.5" />
              {imageCount} {imageCount === 1 ? "image" : "images"}
            </button>
            <button onClick={() => setShowNeg(v => !v)}
              className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]",
                showNeg && "border-[#1D7BFF]/30 bg-[#1D7BFF]/10 text-[#60A5FA]")}
              style={!showNeg ? { borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" } : {}}>
              <Wand2 className="h-3.5 w-3.5" /> Negative
            </button>
            <button className="flex items-center justify-center rounded-full border p-1.5 transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
              <Paperclip className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={handleGenerate} disabled={!prompt.trim() || generating}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-[#1D7BFF] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1666E8] disabled:cursor-not-allowed disabled:opacity-50">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? GEN_STAGES[genStage]?.label ?? "Generating…" : "Generate"}
            </button>
          </div>

          {generating && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                <span>{GEN_STAGES[genStage]?.label}</span>
                <span>{genPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-muted)" }}>
                <div className="h-full rounded-full bg-[#1D7BFF] transition-all duration-500" style={{ width: `${genPct}%` }} />
              </div>
            </div>
          )}
        </div>
        </div>{/* /px-8 prompt wrapper */}


        {/* Tabs */}
        <div className="mt-6 flex items-center gap-6 border-b px-8" style={{ borderColor: "var(--border)" }}>
          {(["explore", "creations"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("border-b-2 px-1 pb-3 text-sm font-medium capitalize transition-colors",
                tab === t ? "border-[#1D7BFF] text-[#1D7BFF]" : "border-transparent hover:text-[var(--text-secondary)]")}
              style={tab !== t ? { color: "var(--text-tertiary)" } : {}}>
              {t === "creations" ? `My Creations${creations.length > 0 ? ` (${creations.length})` : ""}` : "Explore"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 px-8 pb-12">
          {tab === "explore" ? (
            <div style={{ columns: "5 160px", columnGap: "12px" }}>
              {EXPLORE_ITEMS.map(item => (
                <div key={item.id} className="mb-3 break-inside-avoid">
                  <ImageCard
                    imgSrc={img(item.seed, 400, item.tall ? 560 : 350)}
                    prompt={item.prompt}
                    author={item.author}
                    likes={item.likes}
                    views={item.views}
                    style={item.style}
                    ratio={item.ratio}
                    onOpen={() => openExplore(item)}
                  />
                </div>
              ))}
            </div>
          ) : creations.length === 0 && !generating ? (
            <div className="flex flex-col items-center justify-center py-20 text-center" style={{ color: "var(--text-tertiary)" }}>
              <Sparkles className="h-8 w-8" />
              <p className="mt-3 text-sm">No creations yet. Generate your first image above.</p>
              <p className="mt-1 text-xs">Try a style preset to get started!</p>
            </div>
          ) : (
            <div style={{ columns: "5 160px", columnGap: "12px" }}>
              {generating && (
                <div className="mb-3 break-inside-avoid">
                  <div className="flex aspect-square animate-pulse flex-col items-center justify-center gap-2 rounded-xl border"
                    style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                    <Loader2 className="h-6 w-6 animate-spin text-[#1D7BFF]" />
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{genPct}%</span>
                  </div>
                </div>
              )}
              {creations.map((c) => (
                <div key={c.id} className="mb-3 break-inside-avoid">
                  <ImageCard
                    imgSrc={c.src}
                    prompt={c.prompt || "My creation"}
                    style={activeLabel}
                    processing={c.processing}
                    ratio={c.ratio}
                    onOpen={() => openCreation(c)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

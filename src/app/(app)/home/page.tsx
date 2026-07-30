"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare, Image as ImageIcon, Video, Wand2,
  Sparkles, ArrowRight, Play, TrendingUp, Clock, Star,
  Zap, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { galleryImages } from "@/lib/mock-data";

/* ── Feature shortcut cards ── */
const TOOLS = [
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat",
    sub: "10+ AI models",
    color: "#1D7BFF",
    bg: "rgba(29,123,255,0.12)",
    badge: null,
  },
  {
    href: "/image-studio",
    icon: ImageIcon,
    label: "Image Studio",
    sub: "8 style presets",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    badge: null,
  },
  {
    href: "/video-studio",
    icon: Video,
    label: "Video Studio",
    sub: "Multi-stage render",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.12)",
    badge: "New",
  },
  {
    href: "/tools",
    icon: Wand2,
    label: "AI Tools",
    sub: "Remove background",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    badge: null,
  },
  {
    href: "/chat",
    icon: Sparkles,
    label: "Assistants",
    sub: "4 expert personas",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    badge: null,
  },
];

/* ── Filter tabs ── */
const TABS = ["Discover", "Images", "Videos", "Trending", "New", "Cinematic", "Anime", "Portrait", "Landscape"];

/* ── Explore gallery — mix gallery images with different aspect ratios ── */
const EXPLORE = [
  { seed: "city2",     prompt: "Neon-lit Tokyo street at night",            tall: true  },
  { seed: "nature1",   prompt: "Misty mountain range at golden hour",       tall: false },
  { seed: "portrait8", prompt: "Cinematic portrait in warm studio light",   tall: true  },
  { seed: "ocean3",    prompt: "Turquoise waves crashing on white sand",    tall: false },
  { seed: "space5",    prompt: "Nebula swirling with violet and gold dust", tall: true  },
  { seed: "arch6",     prompt: "Minimalist white architecture in desert",   tall: false },
  { seed: "food7",     prompt: "Artisan ramen bowl with soft-boiled egg",   tall: false },
  { seed: "forest4",   prompt: "Ancient redwood forest with light rays",    tall: true  },
  { seed: "abstract9", prompt: "Fluid ink art in electric blue",            tall: false },
  { seed: "macro10",   prompt: "Macro dewdrop on spider web at sunrise",    tall: true  },
  { seed: "gen1",      prompt: "Futuristic megacity at dusk",               tall: false },
  { seed: "gen3",      prompt: "Oil painting style — old harbour",          tall: false },
  { seed: "gen5",      prompt: "Watercolor sunrise over rice fields",       tall: true  },
  { seed: "gen7",      prompt: "Pixel art 8-bit mountain village",          tall: false },
  { seed: "gen9",      prompt: "3D crystal sphere on dark surface",         tall: false },
  { seed: "gen11",     prompt: "Anime girl in cherry blossom forest",       tall: true  },
  { seed: "gen13",     prompt: "Surreal floating island with waterfalls",   tall: false },
  { seed: "gen15",     prompt: "Deep sea bioluminescent creatures",         tall: false },
];

function ExploreCard({ seed, prompt, tall }: { seed: string; prompt: string; tall: boolean }) {
  const [hov, setHov] = useState(false);
  const h = tall ? 380 : 220;
  return (
    <div
      className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer"
      style={{ height: h }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img
        src={`https://picsum.photos/seed/${seed}/400/${h}`}
        alt={prompt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-200"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 55%)", opacity: hov ? 1 : 0 }}
      >
        <p className="text-xs font-medium leading-snug text-white line-clamp-2">{prompt}</p>
        <div className="mt-2 flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm hover:bg-white/25 transition-colors">
            <Play className="h-3 w-3" /> Try this
          </button>
          <button className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm hover:bg-white/25 transition-colors">
            <Star className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Discover");
  const [searchVal, setSearchVal] = useState("");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── HERO BANNERS ── */}
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {/* Main banner */}
        <div
          className="relative col-span-2 overflow-hidden rounded-2xl"
          style={{ minHeight: 200, background: "linear-gradient(135deg,#1e1035 0%,#312e81 50%,#1a1a2e 100%)" }}
        >
          <div className="absolute inset-0 opacity-30">
            <img src="https://picsum.photos/seed/gen1/900/300" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(30,16,53,0.92) 0%, rgba(30,16,53,0.5) 60%, transparent 100%)" }} />
          <div className="relative z-10 flex h-full flex-col justify-end p-7" style={{ minHeight: 200 }}>
            <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(29,123,255,0.25)", color: "#93C5FD", border: "1px solid rgba(29,123,255,0.35)" }}>
              <Zap className="h-3 w-3" /> Multi-model workspace
            </div>
            <h1 className="text-2xl font-black leading-tight text-white md:text-3xl">
              Every AI model.<br />
              <span style={{ background: "linear-gradient(90deg,#60A5FA,#C084FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                One creative studio.
              </span>
            </h1>
            <p className="mt-2 max-w-sm text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
              Chat, generate images, create videos, and process media — all without switching apps.
            </p>
            <Link
              href="/chat"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "#1D7BFF", boxShadow: "0 4px 20px rgba(29,123,255,0.45)" }}
            >
              Start creating <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Side banners */}
        <div className="flex flex-col gap-3">
          <div className="relative flex-1 overflow-hidden rounded-2xl" style={{ minHeight: 92, background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)" }}>
            <img src="https://picsum.photos/seed/ocean3/400/200" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="relative z-10 flex h-full flex-col justify-between p-4" style={{ minHeight: 92 }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#67E8F9" }}>New</span>
              <div>
                <p className="text-sm font-bold text-white">Video Studio</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Multi-stage AI rendering</p>
              </div>
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl" style={{ minHeight: 92, background: "linear-gradient(135deg,#1a0533,#3b1f6b)" }}>
            <img src="https://picsum.photos/seed/space5/400/200" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
            <div className="relative z-10 flex h-full flex-col justify-between p-4" style={{ minHeight: 92 }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C084FC" }}>Featured</span>
              <div>
                <p className="text-sm font-bold text-white">Image Studio</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>8 style presets available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOL SHORTCUT CARDS ── */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 pt-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {TOOLS.map(tool => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.label}
              href={tool.href}
              className="group relative flex flex-shrink-0 items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-subtle)",
                minWidth: 160,
              }}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: tool.bg }}>
                <Icon className="h-4.5 w-4.5" style={{ color: tool.color }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{tool.label}</span>
                  {tool.badge && (
                    <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: "rgba(236,72,153,0.15)", color: "#F472B6" }}>{tool.badge}</span>
                  )}
                </div>
                <p className="truncate text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.sub}</p>
              </div>
              <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: tool.color }} />
            </Link>
          );
        })}
      </div>

      {/* ── EXPLORE HEADER ── */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
            <input
              type="text"
              placeholder="Search creations..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full rounded-xl border py-2 pl-9 pr-4 text-sm outline-none"
              style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeTab === tab
                    ? "text-white"
                    : "hover:text-[var(--text-secondary)]"
                )}
                style={activeTab === tab
                  ? { background: "#1D7BFF" }
                  : { color: "var(--text-tertiary)", background: "transparent" }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MASONRY GALLERY ── */}
      <div className="p-4" style={{ columns: "5 180px", columnGap: "12px" }}>
        {EXPLORE.map((item, i) => (
          <ExploreCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

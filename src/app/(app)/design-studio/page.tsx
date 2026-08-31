"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X, Download, Share2, Undo2, Redo2, ZoomIn, ZoomOut,
  Square, Circle, Triangle, Type, Image as ImageIcon, Palette,
  LayoutTemplate, Minus, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Layers, Lock, Trash2, Copy, ChevronDown,
  Sparkles, Wand2, Sliders, ArrowLeft, SendHorizonal, RefreshCw,
  Film, Play, Video as VideoIcon, Music, Mic, Scissors, Clock,
  ChevronRight, Plus, Ratio, LayoutGrid,
  Eye, EyeOff, GripVertical, MoreHorizontal, ChevronUp,
  Pencil, ArrowUpToLine, ArrowDownToLine, MoveUp, MoveDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */
type ElemType = "rect" | "circle" | "text" | "image" | "line" | "triangle" | "video";
type GenMode = "image" | "video";

interface CanvasEl {
  id: string;
  type: ElemType;
  x: number; y: number;
  w: number; h: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  name: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
  shadow: boolean;
  content: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: "left" | "center" | "right";
  color: string;
  fontFamily: string;
  letterSpacing: number;
  lineHeight: number;
  src: string;
  filterBrightness: number;
  filterContrast: number;
  filterSaturation: number;
  useGradient: boolean;
  gradientA: string;
  gradientB: string;
  gradientAngle: number;
  // video
  videoDuration?: string;
  videoLabel?: string;
}

function makeId() { return Math.random().toString(36).slice(2, 9); }

function makeEl(type: ElemType, patch: Partial<CanvasEl> = {}): CanvasEl {
  return {
    id: makeId(), type,
    x: 200, y: 200, w: 200, h: 200,
    rotation: 0, opacity: 100, locked: false, visible: true,
    name: type === "text" ? "Text Layer" : type === "image" ? "Image Layer" : type === "video" ? "Video Layer" : type === "rect" ? "Rectangle" : type === "circle" ? "Circle" : type === "triangle" ? "Triangle" : "Layer",
    fill: "#1D7BFF", stroke: "transparent", strokeWidth: 0,
    borderRadius: type === "circle" ? 9999 : 8,
    shadow: false,
    content: "Text", fontSize: 40, fontWeight: "700",
    fontStyle: "normal", textDecoration: "none",
    textAlign: "center", color: "#ffffff",
    fontFamily: "Inter, sans-serif",
    letterSpacing: 0, lineHeight: 1.2,
    src: "", filterBrightness: 100, filterContrast: 100, filterSaturation: 100,
    useGradient: false, gradientA: "#1D7BFF", gradientB: "#06B6D4", gradientAngle: 135,
    videoDuration: "0:15",
    ...patch,
  };
}

/* ── Templates ── */
interface Template {
  id: string; name: string; category: string;
  bg: string; canvasBg: string;
  elements: Partial<CanvasEl>[];
}

const TEMPLATES: Template[] = [
  {
    id: "t1", name: "Bold Headline", category: "Social",
    bg: "linear-gradient(135deg,#1D7BFF,#06B6D4)", canvasBg: "#0a0a1a",
    elements: [
      { type:"rect", x:0, y:0, w:1080, h:1080, fill:"#0a0a1a", stroke:"transparent", borderRadius:0, shadow:false, useGradient:false },
      { type:"rect", x:40, y:40, w:1000, h:1000, fill:"transparent", stroke:"#1D7BFF", strokeWidth:3, borderRadius:12, shadow:false, useGradient:false },
      { type:"rect", x:80, y:380, w:920, h:8, fill:"#1D7BFF", borderRadius:4, stroke:"transparent", useGradient:false },
      { type:"text", x:80, y:200, w:920, h:160, content:"DESIGN\nSTUDIO", fontSize:110, fontWeight:"900", color:"#ffffff", textAlign:"left", fill:"transparent", stroke:"transparent" },
      { type:"text", x:80, y:420, w:920, h:80, content:"Create stunning visuals effortlessly", fontSize:36, fontWeight:"400", color:"rgba(255,255,255,0.6)", textAlign:"left", fill:"transparent", stroke:"transparent" },
      { type:"rect", x:80, y:560, w:260, h:70, fill:"#1D7BFF", borderRadius:35, stroke:"transparent", shadow:true, useGradient:false },
      { type:"text", x:80, y:560, w:260, h:70, content:"Get Started", fontSize:28, fontWeight:"700", color:"#ffffff", textAlign:"center", fill:"transparent", stroke:"transparent" },
    ],
  },
  {
    id: "t2", name: "Gradient Pop", category: "Social",
    bg: "linear-gradient(135deg,#8B5CF6,#EC4899)", canvasBg: "#ffffff",
    elements: [
      { type:"rect", x:0, y:0, w:1080, h:1080, useGradient:true, gradientA:"#8B5CF6", gradientB:"#EC4899", gradientAngle:135, fill:"#8B5CF6", stroke:"transparent", borderRadius:0, shadow:false },
      { type:"rect", x:90, y:90, w:900, h:900, fill:"rgba(255,255,255,0.08)", stroke:"rgba(255,255,255,0.25)", strokeWidth:1, borderRadius:24, shadow:false, useGradient:false },
      { type:"text", x:140, y:350, w:800, h:200, content:"✦ New Collection ✦", fontSize:52, fontWeight:"700", color:"rgba(255,255,255,0.9)", textAlign:"center", fill:"transparent", stroke:"transparent" },
      { type:"text", x:140, y:470, w:800, h:120, content:"SUMMER\n2026", fontSize:100, fontWeight:"900", color:"#ffffff", textAlign:"center", fill:"transparent", stroke:"transparent" },
      { type:"rect", x:340, y:700, w:400, h:70, fill:"rgba(255,255,255,0.2)", stroke:"rgba(255,255,255,0.5)", strokeWidth:1, borderRadius:35, shadow:false, useGradient:false },
      { type:"text", x:340, y:700, w:400, h:70, content:"Shop Now →", fontSize:26, fontWeight:"600", color:"#ffffff", textAlign:"center", fill:"transparent", stroke:"transparent" },
    ],
  },
  {
    id: "t3", name: "Minimal Clean", category: "Presentation",
    bg: "#f5f5f0", canvasBg: "#fafaf8",
    elements: [
      { type:"rect", x:0, y:0, w:1080, h:1080, fill:"#fafaf8", stroke:"transparent", borderRadius:0, shadow:false, useGradient:false },
      { type:"rect", x:0, y:0, w:6, h:1080, fill:"#1a1a1a", stroke:"transparent", borderRadius:0, shadow:false, useGradient:false },
      { type:"text", x:80, y:300, w:900, h:200, content:"Minimal.\nPowerful.", fontSize:100, fontWeight:"800", color:"#1a1a1a", textAlign:"left", fill:"transparent", stroke:"transparent", letterSpacing:-2 },
      { type:"rect", x:80, y:540, w:200, h:4, fill:"#1a1a1a", stroke:"transparent", borderRadius:2, shadow:false, useGradient:false },
      { type:"text", x:80, y:580, w:800, h:80, content:"Design that speaks without words.", fontSize:32, fontWeight:"400", color:"#666666", textAlign:"left", fill:"transparent", stroke:"transparent" },
    ],
  },
  {
    id: "t4", name: "Neon Glow", category: "Social",
    bg: "linear-gradient(135deg,#0a0a0a,#111)", canvasBg: "#0a0a0a",
    elements: [
      { type:"rect", x:0, y:0, w:1080, h:1080, fill:"#0a0a0a", stroke:"transparent", borderRadius:0, shadow:false, useGradient:false },
      { type:"circle", x:200, y:200, w:700, h:700, fill:"rgba(29,123,255,0.05)", stroke:"rgba(29,123,255,0.15)", strokeWidth:1, borderRadius:9999, shadow:false, useGradient:false },
      { type:"text", x:80, y:380, w:920, h:160, content:"NEON", fontSize:160, fontWeight:"900", color:"transparent", textAlign:"center", fill:"transparent", stroke:"#1D7BFF", strokeWidth:2 },
      { type:"text", x:80, y:530, w:920, h:80, content:"DESIGN", fontSize:80, fontWeight:"900", color:"#1D7BFF", textAlign:"center", fill:"transparent", stroke:"transparent" },
      { type:"text", x:80, y:650, w:920, h:60, content:"Make it glow.", fontSize:32, fontWeight:"300", color:"rgba(255,255,255,0.4)", textAlign:"center", fill:"transparent", stroke:"transparent", letterSpacing:8 },
    ],
  },
  {
    id: "t5", name: "Product Card", category: "Marketing",
    bg: "linear-gradient(135deg,#F59E0B,#EF4444)", canvasBg: "#ffffff",
    elements: [
      { type:"rect", x:0, y:0, w:1080, h:480, useGradient:true, gradientA:"#F59E0B", gradientB:"#EF4444", gradientAngle:135, fill:"#F59E0B", stroke:"transparent", borderRadius:0, shadow:false },
      { type:"rect", x:0, y:480, w:1080, h:600, fill:"#ffffff", stroke:"transparent", borderRadius:0, shadow:false, useGradient:false },
      { type:"text", x:80, y:140, w:920, h:120, content:"★ FEATURED", fontSize:32, fontWeight:"700", color:"rgba(255,255,255,0.9)", textAlign:"center", fill:"transparent", stroke:"transparent", letterSpacing:6 },
      { type:"text", x:80, y:240, w:920, h:180, content:"Premium\nProduct", fontSize:88, fontWeight:"900", color:"#ffffff", textAlign:"center", fill:"transparent", stroke:"transparent" },
      { type:"text", x:80, y:570, w:920, h:100, content:"Discover the difference quality makes", fontSize:36, fontWeight:"400", color:"#666666", textAlign:"center", fill:"transparent", stroke:"transparent" },
      { type:"rect", x:340, y:750, w:400, h:80, useGradient:true, gradientA:"#F59E0B", gradientB:"#EF4444", gradientAngle:135, fill:"#F59E0B", stroke:"transparent", borderRadius:40, shadow:true },
      { type:"text", x:340, y:750, w:400, h:80, content:"Buy Now", fontSize:28, fontWeight:"700", color:"#ffffff", textAlign:"center", fill:"transparent", stroke:"transparent" },
    ],
  },
  {
    id: "t6", name: "Story Slide", category: "Story",
    bg: "linear-gradient(135deg,#10B981,#06B6D4)", canvasBg: "#ffffff",
    elements: [
      { type:"rect", x:0, y:0, w:1080, h:1920, useGradient:true, gradientA:"#10B981", gradientB:"#06B6D4", gradientAngle:180, fill:"#10B981", stroke:"transparent", borderRadius:0, shadow:false },
      { type:"rect", x:60, y:60, w:960, h:1800, fill:"rgba(255,255,255,0.1)", stroke:"rgba(255,255,255,0.2)", strokeWidth:1, borderRadius:24, shadow:false, useGradient:false },
      { type:"text", x:100, y:600, w:880, h:200, content:"Your Story\nStarts Here", fontSize:90, fontWeight:"900", color:"#ffffff", textAlign:"center", fill:"transparent", stroke:"transparent" },
      { type:"text", x:100, y:860, w:880, h:100, content:"Swipe up to explore", fontSize:36, fontWeight:"400", color:"rgba(255,255,255,0.7)", textAlign:"center", fill:"transparent", stroke:"transparent" },
    ],
  },
];

const CATEGORIES = ["All", "Social", "Presentation", "Marketing", "Story"];

const SHAPES = [
  { type: "rect" as ElemType, icon: Square, label: "Rectangle", fill: "#1D7BFF", w: 240, h: 160 },
  { type: "circle" as ElemType, icon: Circle, label: "Circle", fill: "#06B6D4", w: 200, h: 200 },
  { type: "triangle" as ElemType, icon: Triangle, label: "Triangle", fill: "#8B5CF6", w: 200, h: 200 },
  { type: "rect" as ElemType, icon: Minus, label: "Line", fill: "#1a1a1a", w: 300, h: 4 },
];

const FONTS = ["Inter", "Georgia", "Courier New", "Impact", "Brush Script MT", "Arial Black"];
const COLORS = ["#ffffff","#000000","#1D7BFF","#06B6D4","#8B5CF6","#EC4899","#F59E0B","#EF4444","#10B981","#6366F1","#F97316","#84CC16"];
const CANVAS_SIZES = [
  { label: "Square 1:1",     w: 1080, h: 1080, icon: "■" },
  { label: "Portrait 4:5",   w: 1080, h: 1350, icon: "▮" },
  { label: "Story 9:16",     w: 1080, h: 1920, icon: "▯" },
  { label: "Landscape 16:9", w: 1920, h: 1080, icon: "▬" },
  { label: "A4 Portrait",    w: 794,  h: 1123, icon: "▮" },
  { label: "Presentation",   w: 1280, h: 720,  icon: "▬" },
];

const STOCK_PHOTOS = [
  { seed:"nature1", label:"Mountains" },
  { seed:"city2",   label:"City"      },
  { seed:"ocean3",  label:"Ocean"     },
  { seed:"forest4", label:"Forest"    },
  { seed:"space5",  label:"Space"     },
  { seed:"arch6",   label:"Architecture" },
  { seed:"food7",   label:"Food"      },
  { seed:"portrait8",label:"Portrait" },
];

const IMAGE_GEN_STAGES = [
  { label: "Analyzing prompt…",     pct: 12 },
  { label: "Composing layout…",     pct: 35 },
  { label: "Rendering textures…",   pct: 60 },
  { label: "Applying style…",       pct: 80 },
  { label: "Finalizing image…",     pct: 96 },
];

const VIDEO_GEN_STAGES = [
  { label: "Parsing scene prompt…", pct: 10 },
  { label: "Building storyboard…",  pct: 28 },
  { label: "Generating frames…",    pct: 52 },
  { label: "Rendering motion…",     pct: 74 },
  { label: "Encoding video…",       pct: 90 },
  { label: "Finalizing output…",    pct: 98 },
];

const AI_PROMPT_SUGGESTIONS = [
  "A futuristic city skyline at sunset with neon lights",
  "Minimalist product photo on white background",
  "Abstract fluid gradient art in blue and purple",
  "Cinematic portrait with dramatic lighting",
  "Vintage retro poster with bold typography",
  "3D rendered geometric shapes on dark background",
];

const VIDEO_PROMPT_SUGGESTIONS = [
  "Drone flyover of mountain peaks at golden hour",
  "Product reveal with smooth zoom and particles",
  "Animated logo intro with light streak effects",
  "Slow motion ocean waves on a tropical beach",
  "Time-lapse of a city from day to night",
];

function picsumUrl(seed: string, _w: number, h: number) {
  // Use numeric seeds mapped to local ds files, named seeds as-is
  const numSeed = parseInt(seed);
  if (!isNaN(numSeed)) {
    const idx = ((numSeed - 1) % 30) + 1;
    return `/gallery/ds${idx}.svg`;
  }
  const isTall = h > _w;
  return `/gallery/${seed}${isTall ? "_tall" : "_sq"}.jpg`;
}

/* ── Resize handle ── */
function ResizeHandle({ pos, onMouseDown }: { pos: string; onMouseDown: (e: React.MouseEvent, pos: string) => void }) {
  const posStyles: Record<string, React.CSSProperties> = {
    nw: { top: -5, left: -5, cursor: "nwse-resize" },
    ne: { top: -5, right: -5, cursor: "nesw-resize" },
    sw: { bottom: -5, left: -5, cursor: "nesw-resize" },
    se: { bottom: -5, right: -5, cursor: "nwse-resize" },
    n:  { top: -5, left: "calc(50% - 5px)", cursor: "n-resize" },
    s:  { bottom: -5, left: "calc(50% - 5px)", cursor: "s-resize" },
    w:  { top: "calc(50% - 5px)", left: -5, cursor: "w-resize" },
    e:  { top: "calc(50% - 5px)", right: -5, cursor: "e-resize" },
  };
  return (
    <div
      onMouseDown={e => { e.stopPropagation(); onMouseDown(e, pos); }}
      style={{ position:"absolute", width:10, height:10, background:"#ffffff", border:"2px solid #1D7BFF", borderRadius:2, ...posStyles[pos] }}
    />
  );
}

/* ── Canvas element renderer ── */
function CanvasElement({ el, selected, scale, onMouseDown, onResizeMouseDown, onDoubleClick }: {
  el: CanvasEl; selected: boolean; scale: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent, pos: string) => void;
  onDoubleClick: () => void;
}) {
  const commonStyle: React.CSSProperties = {
    position: "absolute",
    left: el.x * scale, top: el.y * scale,
    width: el.w * scale, height: el.h * scale,
    transform: `rotate(${el.rotation}deg)`,
    opacity: el.opacity / 100,
    cursor: el.locked ? "not-allowed" : "move",
    userSelect: "none",
  };

  const bg = el.useGradient
    ? `linear-gradient(${el.gradientAngle}deg, ${el.gradientA}, ${el.gradientB})`
    : el.fill;

  const filterStyle = (el.type === "image" || el.type === "video")
    ? `brightness(${el.filterBrightness}%) contrast(${el.filterContrast}%) saturate(${el.filterSaturation}%)`
    : undefined;

  const boxShadow = el.shadow ? "0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)" : undefined;
  const handles = ["nw","ne","sw","se","n","s","w","e"];
  const selBorder: React.CSSProperties = selected ? { outline: "2px solid #1D7BFF", outlineOffset: 1 } : {};

  if (el.type === "text") {
    return (
      <div style={{ ...commonStyle, ...selBorder, display:"flex", alignItems:"center", justifyContent: el.textAlign === "left" ? "flex-start" : el.textAlign === "right" ? "flex-end" : "center", padding:"4px 8px", boxSizing:"border-box", boxShadow }}
        onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}>
        <div style={{ width:"100%", fontSize: el.fontSize*scale, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textDecoration: el.textDecoration, textAlign: el.textAlign, color: el.color, fontFamily: el.fontFamily, letterSpacing: el.letterSpacing, lineHeight: el.lineHeight, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
          {el.content}
        </div>
        {selected && handles.map(p => <ResizeHandle key={p} pos={p} onMouseDown={onResizeMouseDown} />)}
      </div>
    );
  }

  if (el.type === "image") {
    return (
      <div style={{ ...commonStyle, ...selBorder, overflow:"hidden", borderRadius: el.borderRadius*scale, boxShadow }}
        onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}>
        <img src={el.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:filterStyle, display:"block" }} draggable={false} />
        {selected && handles.map(p => <ResizeHandle key={p} pos={p} onMouseDown={onResizeMouseDown} />)}
      </div>
    );
  }

  if (el.type === "video") {
    return (
      <div style={{ ...commonStyle, ...selBorder, overflow:"hidden", borderRadius: el.borderRadius*scale, boxShadow, background:"#000" }}
        onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}>
        {/* thumbnail */}
        <img src={el.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:filterStyle, display:"block", opacity:0.8 }} draggable={false} />
        {/* play button overlay */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap: 8*scale }}>
          <div style={{ width:52*scale, height:52*scale, borderRadius:"50%", background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,255,255,0.5)" }}>
            <Play style={{ width:20*scale, height:20*scale, color:"#fff", marginLeft:3*scale }} fill="#fff" />
          </div>
        </div>
        {/* duration badge */}
        <div style={{ position:"absolute", bottom:8*scale, right:8*scale, background:"rgba(0,0,0,0.7)", color:"#fff", fontSize:10*scale, fontWeight:600, padding:`${2*scale}px ${6*scale}px`, borderRadius:4*scale }}>
          {el.videoDuration ?? "0:15"}
        </div>
        {/* video label */}
        {el.videoLabel && (
          <div style={{ position:"absolute", top:8*scale, left:8*scale, background:"rgba(29,123,255,0.85)", color:"#fff", fontSize:9*scale, fontWeight:700, padding:`${2*scale}px ${6*scale}px`, borderRadius:4*scale, textTransform:"uppercase", letterSpacing:1 }}>
            {el.videoLabel}
          </div>
        )}
        {selected && handles.map(p => <ResizeHandle key={p} pos={p} onMouseDown={onResizeMouseDown} />)}
      </div>
    );
  }

  if (el.type === "triangle") {
    return (
      <div style={{ ...commonStyle, ...selBorder, boxShadow }}
        onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="50,0 100,100 0,100" fill={bg} stroke={el.stroke} strokeWidth={el.strokeWidth} />
        </svg>
        {selected && handles.map(p => <ResizeHandle key={p} pos={p} onMouseDown={onResizeMouseDown} />)}
      </div>
    );
  }

  return (
    <div style={{ ...commonStyle, ...selBorder, background:bg, border: el.strokeWidth > 0 ? `${el.strokeWidth*scale}px solid ${el.stroke}` : undefined, borderRadius: el.type === "circle" ? "9999px" : el.borderRadius*scale, boxShadow }}
      onMouseDown={onMouseDown} onDoubleClick={onDoubleClick}>
      {selected && handles.map(p => <ResizeHandle key={p} pos={p} onMouseDown={onResizeMouseDown} />)}
    </div>
  );
}

/* ── Slider ── */
function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-[10px]" style={{ color:"var(--text-tertiary)" }}>
        <span>{label}</span><span>{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-[#1D7BFF]" />
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b px-4 py-3" style={{ borderColor:"var(--border)" }}>
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color:"var(--text-tertiary)" }}>{title}</p>
      {children}
    </div>
  );
}

/* ── Context Menu ── */
interface CtxMenu { x: number; y: number; layerId: string }

function LayerContextMenu({ menu, elements, selected, onClose, onAction }: {
  menu: CtxMenu;
  elements: CanvasEl[];
  selected: string | null;
  onClose: () => void;
  onAction: (action: string, id: string) => void;
}) {
  const el = elements.find(e => e.id === menu.layerId);
  if (!el) return null;
  const idx = elements.findIndex(e => e.id === menu.layerId);
  const items = [
    { label: "Rename",        icon: Pencil,         action: "rename"    },
    { label: "Duplicate",     icon: Copy,           action: "duplicate" },
    { sep: true },
    { label: "Move to Front", icon: ArrowUpToLine,  action: "front",    disabled: idx === elements.length - 1 },
    { label: "Move Up",       icon: MoveUp,         action: "up",       disabled: idx === elements.length - 1 },
    { label: "Move Down",     icon: MoveDown,       action: "down",     disabled: idx === 0 },
    { label: "Move to Back",  icon: ArrowDownToLine,action: "back",     disabled: idx === 0 },
    { sep: true },
    { label: el.locked  ? "Unlock" : "Lock",       icon: Lock,    action: "lock"    },
    { label: el.visible ? "Hide"   : "Show",       icon: Eye,     action: "visible" },
    { sep: true },
    { label: "Delete",        icon: Trash2,         action: "delete",   danger: true },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[200]" onClick={onClose} />
      <div className="fixed z-[201] w-48 overflow-hidden rounded-xl border shadow-2xl"
        style={{ left: menu.x, top: menu.y, background: "var(--bg-base)", borderColor: "var(--border)" }}>
        {items.map((item, i) => {
          if ("sep" in item && item.sep) return <div key={i} className="my-1 h-px" style={{ background: "var(--border)" }} />;
          const Icon = (item as any).icon;
          const disabled = (item as any).disabled;
          const danger = (item as any).danger;
          return (
            <button key={i}
              disabled={disabled}
              onClick={() => { onAction((item as any).action, menu.layerId); onClose(); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-30">
              <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: danger ? "#EF4444" : "var(--text-tertiary)" }} />
              <span style={{ color: danger ? "#EF4444" : "var(--text-primary)" }}>{(item as any).label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ── Layers Panel ── */
function LayersPanel({ elements, selected, onSelect, onClose, onReorder, onAction, onRename }: {
  elements: CanvasEl[];
  selected: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  onReorder: (from: number, to: number) => void;
  onAction: (action: string, id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal]   = useState("");
  const [dragIdx, setDragIdx]       = useState<number | null>(null);
  const [overIdx, setOverIdx]       = useState<number | null>(null);
  const [ctxMenu, setCtxMenu]       = useState<CtxMenu | null>(null);

  const reversed = [...elements].reverse(); // top layer first

  function startRename(el: CanvasEl) {
    setRenamingId(el.id);
    setRenameVal(el.name);
  }
  function commitRename() {
    if (renamingId && renameVal.trim()) onRename(renamingId, renameVal.trim());
    setRenamingId(null);
  }

  function getIcon(type: ElemType) {
    if (type === "text") return Type;
    if (type === "image") return ImageIcon;
    if (type === "video") return Film;
    if (type === "circle") return Circle;
    if (type === "triangle") return Triangle;
    return Square;
  }

  // Convert reversed index back to elements index
  function revToReal(revIdx: number) { return elements.length - 1 - revIdx; }

  return (
    <>
      <div className="absolute bottom-[88px] left-3 z-40 flex w-64 flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{ background: "var(--bg-base)", borderColor: "var(--border)", maxHeight: 360 }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Layers ({elements.length})</span>
          <button onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]">
            <X className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
          </button>
        </div>

        {/* Layer list */}
        <div className="flex-1 overflow-y-auto py-1">
          {reversed.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>No layers yet</p>
          ) : reversed.map((el, revIdx) => {
            const realIdx = revToReal(revIdx);
            const Icon = getIcon(el.type);
            const isSelected = selected === el.id;
            const isDragging = dragIdx === revIdx;
            const isOver = overIdx === revIdx;

            return (
              <div key={el.id}
                draggable
                onDragStart={() => setDragIdx(revIdx)}
                onDragOver={e => { e.preventDefault(); setOverIdx(revIdx); }}
                onDrop={() => {
                  if (dragIdx !== null && dragIdx !== revIdx) {
                    onReorder(revToReal(dragIdx), revToReal(revIdx));
                  }
                  setDragIdx(null); setOverIdx(null);
                }}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, layerId: el.id }); }}
                onClick={() => onSelect(el.id)}
                className="group flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-[var(--bg-hover)]"
                style={{
                  background: isSelected ? "rgba(29,123,255,0.1)" : isDragging ? "rgba(29,123,255,0.05)" : undefined,
                  borderTop: isOver && !isDragging ? "2px solid #1D7BFF" : "2px solid transparent",
                  opacity: isDragging ? 0.5 : 1,
                  cursor: "grab",
                }}>
                {/* Drag handle */}
                <GripVertical className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-40" style={{ color: "var(--text-tertiary)" }} />

                {/* Type icon */}
                <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: isSelected ? "#1D7BFF" : "var(--text-tertiary)" }} />

                {/* Name */}
                <div className="flex-1 min-w-0">
                  {renamingId === el.id ? (
                    <input autoFocus value={renameVal}
                      onChange={e => setRenameVal(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenamingId(null); }}
                      onClick={e => e.stopPropagation()}
                      className="w-full rounded border px-1 py-0.5 text-xs outline-none"
                      style={{ borderColor: "#1D7BFF", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                  ) : (
                    <span onDoubleClick={e => { e.stopPropagation(); startRename(el); }}
                      className="block truncate text-xs" style={{ color: isSelected ? "#1D7BFF" : "var(--text-primary)" }}>
                      {el.name}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button onClick={e => { e.stopPropagation(); onAction("visible", el.id); }}
                    className="flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-[var(--bg-muted)]">
                    {el.visible
                      ? <Eye className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />
                      : <EyeOff className="h-3 w-3 text-[#1D7BFF]" />}
                  </button>
                  <button onClick={e => { e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, layerId: el.id }); }}
                    className="flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-[var(--bg-muted)]">
                    <MoreHorizontal className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />
                  </button>
                </div>

                {el.locked && <Lock className="h-3 w-3 flex-shrink-0 opacity-40" style={{ color: "var(--text-tertiary)" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {ctxMenu && (
        <LayerContextMenu menu={ctxMenu} elements={elements} selected={selected}
          onClose={() => setCtxMenu(null)}
          onAction={(action, id) => {
            if (action === "rename") {
              const el = elements.find(e => e.id === id);
              if (el) startRename(el);
            } else {
              onAction(action, id);
            }
          }} />
      )}
    </>
  );
}

/* ── Layers Sidebar (renders inside left panel) ── */
function LayersSidebar({ elements, selected, onSelect, onReorder, onAction, onRename }: {
  elements: CanvasEl[];
  selected: string | null;
  onSelect: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onAction: (action: string, id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal]   = useState("");
  const [dragIdx, setDragIdx]       = useState<number | null>(null);
  const [overIdx, setOverIdx]       = useState<number | null>(null);
  const [ctxMenu, setCtxMenu]       = useState<CtxMenu | null>(null);

  const reversed = [...elements].reverse();

  function startRename(el: CanvasEl) { setRenamingId(el.id); setRenameVal(el.name); }
  function commitRename() {
    if (renamingId && renameVal.trim()) onRename(renamingId, renameVal.trim());
    setRenamingId(null);
  }
  function revToReal(i: number) { return elements.length - 1 - i; }
  function getIcon(type: ElemType) {
    if (type === "text") return Type;
    if (type === "image") return ImageIcon;
    if (type === "video") return Film;
    if (type === "circle") return Circle;
    if (type === "triangle") return Triangle;
    return Square;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Layers</span>
        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: "var(--bg-muted)", color: "var(--text-tertiary)" }}>{elements.length}</span>
      </div>

      {/* Empty state */}
      {elements.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <Layers className="h-8 w-8 opacity-20" style={{ color: "var(--text-tertiary)" }} />
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>No layers yet.<br />Add elements to see them here.</p>
        </div>
      )}

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto py-1">
        {reversed.map((el, revIdx) => {
          const Icon = getIcon(el.type);
          const isSelected = selected === el.id;
          const isDragging = dragIdx === revIdx;
          const isOver = overIdx === revIdx && dragIdx !== revIdx;

          return (
            <div key={el.id}
              draggable
              onDragStart={() => setDragIdx(revIdx)}
              onDragOver={e => { e.preventDefault(); setOverIdx(revIdx); }}
              onDrop={() => {
                if (dragIdx !== null && dragIdx !== revIdx) onReorder(revToReal(dragIdx), revToReal(revIdx));
                setDragIdx(null); setOverIdx(null);
              }}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, layerId: el.id }); }}
              onClick={() => onSelect(el.id)}
              className="group flex cursor-grab items-center gap-2 px-3 py-2 transition-colors hover:bg-[var(--bg-hover)] active:cursor-grabbing"
              style={{
                background: isSelected ? "rgba(29,123,255,0.08)" : isDragging ? "var(--bg-muted)" : undefined,
                borderLeft: isSelected ? "2px solid #1D7BFF" : "2px solid transparent",
                borderTop: isOver ? "2px solid #1D7BFF" : undefined,
                opacity: isDragging ? 0.4 : el.visible === false ? 0.4 : 1,
              }}>

              {/* Drag grip */}
              <GripVertical className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-30" style={{ color: "var(--text-tertiary)" }} />

              {/* Thumbnail / icon */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border"
                style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                {(el.type === "image" || el.type === "video") && el.src ? (
                  <img src={el.src} alt="" className="h-full w-full object-cover" />
                ) : el.type === "rect" || el.type === "circle" ? (
                  <div className="h-5 w-5 rounded-sm" style={{ background: el.useGradient ? `linear-gradient(135deg,${el.gradientA},${el.gradientB})` : el.fill, borderRadius: el.type === "circle" ? "9999px" : 2 }} />
                ) : (
                  <Icon className="h-3.5 w-3.5" style={{ color: isSelected ? "#1D7BFF" : "var(--text-tertiary)" }} />
                )}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                {renamingId === el.id ? (
                  <input autoFocus value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenamingId(null); }}
                    onClick={e => e.stopPropagation()}
                    className="w-full rounded border px-1.5 py-0.5 text-xs outline-none"
                    style={{ borderColor: "#1D7BFF", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                ) : (
                  <span onDoubleClick={e => { e.stopPropagation(); startRename(el); }}
                    className="block truncate text-xs leading-tight" style={{ color: isSelected ? "#1D7BFF" : "var(--text-primary)" }}>
                    {el.name}
                  </span>
                )}
                <span className="text-[9px] capitalize" style={{ color: "var(--text-tertiary)" }}>{el.type}</span>
              </div>

              {/* Quick actions (hover) */}
              <div className="flex flex-shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
                <button title={el.visible === false ? "Show" : "Hide"}
                  onClick={e => { e.stopPropagation(); onAction("visible", el.id); }}
                  className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--bg-muted)]">
                  {el.visible === false
                    ? <EyeOff className="h-3 w-3 text-[#1D7BFF]" />
                    : <Eye className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />}
                </button>
                <button title="More options"
                  onClick={e => { e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, layerId: el.id }); }}
                  className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--bg-muted)]">
                  <MoreHorizontal className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />
                </button>
              </div>

              {el.locked && <Lock className="h-3 w-3 flex-shrink-0" style={{ color: "var(--text-tertiary)", opacity: 0.5 }} />}
            </div>
          );
        })}
      </div>

      {/* Tip */}
      {elements.length > 0 && (
        <div className="border-t px-4 py-2.5 text-[10px]" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
          Drag to reorder · Double-click to rename · Right-click for more
        </div>
      )}

      {ctxMenu && (
        <LayerContextMenu menu={ctxMenu} elements={elements} selected={selected}
          onClose={() => setCtxMenu(null)}
          onAction={(action, id) => {
            if (action === "rename") { const el = elements.find(e => e.id === id); if (el) startRename(el); }
            else onAction(action, id);
          }} />
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function DesignStudioPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [docName, setDocName]         = useState("Untitled Design");
  const [editingName, setEditingName] = useState(false);
  const [canvasBg, setCanvasBg]       = useState("#ffffff");
  const [canvasW, setCanvasW]         = useState(1080);
  const [canvasH, setCanvasH]         = useState(1080);
  const [zoom, setZoom]               = useState(52);

  const [elements, setElements]       = useState<CanvasEl[]>([]);
  const [selected, setSelected]       = useState<string | null>(null);
  const [history, setHistory]         = useState<CanvasEl[][]>([[]]);
  const [histIdx, setHistIdx]         = useState(0);

  const [leftTab, setLeftTab]         = useState<"layers"|"templates"|"elements"|"text"|"photos"|"backgrounds">("templates");
  const [templateCat, setTemplateCat] = useState("All");
  const [editingText, setEditingText] = useState<string | null>(null);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [ctxMenu, setCtxMenu]               = useState<CtxMenu | null>(null);

  // AI generation
  const [genMode, setGenMode]         = useState<GenMode>("image");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [aiPanelPrompt, setAiPanelPrompt] = useState("");
  const [aiPanelMode, setAiPanelMode] = useState<GenMode>("image");
  const [generating, setGenerating]   = useState(false);
  const [genStage, setGenStage]       = useState(0);
  const [promptFocused, setPromptFocused] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const aiPanelPromptRef = useRef<HTMLTextAreaElement>(null);

  const GEN_STAGES = genMode === "video" ? VIDEO_GEN_STAGES : IMAGE_GEN_STAGES;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("prompt");
    const mode = (params.get("mode") as GenMode) ?? "image";
    if (p) {
      setCurrentPrompt(p);
      setAiPanelPrompt(p);
      setGenMode(mode);
      setAiPanelMode(mode);
      setDocName(p.split(",")[0].trim().slice(0, 40) || "Untitled Design");
      triggerGenerate(p, mode);
    }
  }, []);

  function triggerGenerate(promptText: string, mode?: GenMode) {
    const m = mode ?? genMode;
    if (!promptText.trim() || generating) return;
    setGenerating(true);
    setGenStage(0);
    setSelected(null);

    const stages = m === "video" ? VIDEO_GEN_STAGES : IMAGE_GEN_STAGES;
    stages.forEach((_, i) => {
      setTimeout(() => setGenStage(i), i * 700);
    });

    const totalMs = stages.length * 700 + 500;
    setTimeout(() => {
      const seed = Math.abs(promptText.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 1000);

      if (m === "video") {
        const duration = ["0:15", "0:30", "1:00"][Math.floor(Math.random() * 3)];
        const videoEl = makeEl("video", {
          src: picsumUrl(String(seed), 1920, 1080),
          x: 0, y: 0, w: canvasW, h: canvasH,
          borderRadius: 0, shadow: false, fill: "transparent",
          stroke: "transparent", useGradient: false,
          videoDuration: duration,
          videoLabel: "AI VIDEO",
        });
        const next = [videoEl];
        setElements(next); pushHistory(next);
      } else {
        const imgEl = makeEl("image", {
          src: picsumUrl(String(seed), 1080, 1080),
          x: 0, y: 0, w: canvasW, h: canvasH,
          borderRadius: 0, shadow: false, fill: "transparent",
          stroke: "transparent", useGradient: false,
        });
        const next = [imgEl];
        setElements(next); pushHistory(next);
      }

      setGenerating(false);
      setGenStage(0);
    }, totalMs);
  }

  const dragRef = useRef<{ id: string; startMouseX: number; startMouseY: number; startElemX: number; startElemY: number } | null>(null);
  const resizeRef = useRef<{ id: string; pos: string; startMouseX: number; startMouseY: number; startX: number; startY: number; startW: number; startH: number } | null>(null);
  const scale = zoom / 100;

  function pushHistory(els: CanvasEl[]) {
    const next = history.slice(0, histIdx + 1);
    next.push(els);
    setHistory(next);
    setHistIdx(next.length - 1);
  }
  function undo() { if (histIdx <= 0) return; const prev = history[histIdx-1]; setElements(prev); setHistIdx(histIdx-1); }
  function redo() { if (histIdx >= history.length-1) return; const next = history[histIdx+1]; setElements(next); setHistIdx(histIdx+1); }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setSelected(null); setEditingText(null); }
      if ((e.metaKey||e.ctrlKey) && e.key==="z") { e.preventDefault(); undo(); }
      if ((e.metaKey||e.ctrlKey) && e.key==="y") { e.preventDefault(); redo(); }
      if ((e.key==="Delete"||e.key==="Backspace") && selected && editingText===null) {
        const next = elements.filter(el => el.id !== selected);
        setElements(next); pushHistory(next); setSelected(null);
      }
      if ((e.metaKey||e.ctrlKey) && e.key==="d") {
        e.preventDefault();
        if (selected) { const el = elements.find(el => el.id===selected); if (el) addElement({...el, x:el.x+20, y:el.y+20}); }
      }
      if (selected && !editingText && ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        setElements(prev => prev.map(el => el.id === selected ? { ...el, x: el.x + (e.key==="ArrowLeft"?-delta:e.key==="ArrowRight"?delta:0), y: el.y + (e.key==="ArrowUp"?-delta:e.key==="ArrowDown"?delta:0) } : el));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function addElement(patch: Partial<CanvasEl> & { type: ElemType }) {
    const el = makeEl(patch.type, patch);
    const next = [...elements, el];
    setElements(next); pushHistory(next); setSelected(el.id);
  }

  function updateEl(id: string, patch: Partial<CanvasEl>) {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...patch } : el));
  }

  function updateSelected(patch: Partial<CanvasEl>) {
    if (!selected) return;
    setElements(prev => prev.map(el => el.id === selected ? { ...el, ...patch } : el));
  }

  function commitUpdate() { pushHistory(elements); }

  function reorderLayers(fromIdx: number, toIdx: number) {
    const next = [...elements];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setElements(next); pushHistory(next);
  }

  function handleLayerAction(action: string, id: string) {
    const idx = elements.findIndex(e => e.id === id);
    if (idx === -1) return;
    if (action === "delete") {
      const next = elements.filter(e => e.id !== id);
      setElements(next); pushHistory(next); if (selected === id) setSelected(null);
    } else if (action === "duplicate") {
      const el = elements[idx];
      addElement({ ...el, x: el.x + 20, y: el.y + 20 });
    } else if (action === "lock") {
      updateEl(id, { locked: !elements[idx].locked }); commitUpdate();
    } else if (action === "visible") {
      updateEl(id, { visible: !elements[idx].visible }); commitUpdate();
    } else if (action === "front") {
      reorderLayers(idx, elements.length - 1);
    } else if (action === "back") {
      reorderLayers(idx, 0);
    } else if (action === "up" && idx < elements.length - 1) {
      reorderLayers(idx, idx + 1);
    } else if (action === "down" && idx > 0) {
      reorderLayers(idx, idx - 1);
    }
  }

  function renameLayer(id: string, name: string) {
    updateEl(id, { name }); commitUpdate();
  }

  function loadTemplate(t: Template) {
    setCanvasBg(t.canvasBg);
    const els = t.elements.map(e => makeEl(e.type ?? "rect", { ...e, id: makeId() }));
    setElements(els); pushHistory(els); setSelected(null);
  }

  function handleElemMouseDown(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (e.button !== 0) return;
    const el = elements.find(el => el.id === id);
    if (!el || el.locked) return;
    setSelected(id);
    dragRef.current = { id, startMouseX: e.clientX, startMouseY: e.clientY, startElemX: el.x, startElemY: el.y };
  }

  function handleResizeMouseDown(e: React.MouseEvent, id: string, pos: string) {
    e.stopPropagation();
    const el = elements.find(el => el.id === id);
    if (!el) return;
    resizeRef.current = { id, pos, startMouseX: e.clientX, startMouseY: e.clientY, startX: el.x, startY: el.y, startW: el.w, startH: el.h };
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragRef.current) {
      const { id, startMouseX, startMouseY, startElemX, startElemY } = dragRef.current;
      const dx = (e.clientX - startMouseX) / scale;
      const dy = (e.clientY - startMouseY) / scale;
      updateEl(id, { x: Math.round(startElemX + dx), y: Math.round(startElemY + dy) });
    }
    if (resizeRef.current) {
      const { id, pos, startMouseX, startMouseY, startX, startY, startW, startH } = resizeRef.current;
      const dx = (e.clientX - startMouseX) / scale;
      const dy = (e.clientY - startMouseY) / scale;
      const patch: Partial<CanvasEl> = {};
      if (pos.includes("e")) { patch.w = Math.max(20, Math.round(startW + dx)); }
      if (pos.includes("s")) { patch.h = Math.max(20, Math.round(startH + dy)); }
      if (pos.includes("w")) { patch.x = Math.round(startX + dx); patch.w = Math.max(20, Math.round(startW - dx)); }
      if (pos.includes("n")) { patch.y = Math.round(startY + dy); patch.h = Math.max(20, Math.round(startH - dy)); }
      updateEl(id, patch);
    }
  }, [scale, elements]);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current || resizeRef.current) {
      dragRef.current = null; resizeRef.current = null;
      pushHistory(elements);
    }
  }, [elements]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

  const selEl = selected ? elements.find(el => el.id === selected) ?? null : null;
  const filteredTemplates = templateCat === "All" ? TEMPLATES : TEMPLATES.filter(t => t.category === templateCat);

  /* ── Left panel: AI tab content ── */
  const renderAITab = () => (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b px-3 py-3" style={{ borderColor:"var(--border)" }}>
        <p className="text-xs font-semibold" style={{ color:"var(--text-primary)" }}>AI Generate</p>
        {/* Mode toggle */}
        <div className="mt-2 flex rounded-xl p-0.5" style={{ background:"var(--bg-muted)" }}>
          {(["image","video"] as GenMode[]).map(m => (
            <button key={m} onClick={() => setAiPanelMode(m)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all"
              style={{
                background: aiPanelMode === m ? "var(--bg-base)" : "transparent",
                color: aiPanelMode === m ? "var(--text-primary)" : "var(--text-tertiary)",
                boxShadow: aiPanelMode === m ? "0 1px 4px rgba(0,0,0,0.1)" : undefined,
              }}>
              {m === "image" ? <ImageIcon className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
              {m === "image" ? "Image" : "Video"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {/* Prompt area */}
        <div className="rounded-xl border" style={{ borderColor:"var(--border)", background:"var(--bg-muted)" }}>
          <textarea
            ref={aiPanelPromptRef}
            value={aiPanelPrompt}
            onChange={e => setAiPanelPrompt(e.target.value)}
            rows={3}
            placeholder={aiPanelMode === "video"
              ? "Describe a video scene to generate…"
              : "Describe an image to generate…"}
            className="w-full resize-none rounded-t-xl bg-transparent p-3 text-xs outline-none placeholder:opacity-40"
            style={{ color:"var(--text-primary)" }}
          />
          <div className="flex items-center justify-between border-t px-3 py-2" style={{ borderColor:"var(--border)" }}>
            {aiPanelMode === "video" && (
              <div className="flex items-center gap-1">
                {["0:05","0:10","0:15","0:30"].map(d => (
                  <span key={d} className="rounded-md px-2 py-0.5 text-[9px] font-medium cursor-pointer hover:bg-[var(--bg-hover)]" style={{ color:"var(--text-tertiary)" }}>{d}</span>
                ))}
              </div>
            )}
            {aiPanelMode === "image" && <span className="text-[10px]" style={{ color:"var(--text-tertiary)" }}>Press ⌘↵ to generate</span>}
            <button
              onClick={() => {
                if (!aiPanelPrompt.trim()) return;
                setCurrentPrompt(aiPanelPrompt);
                setGenMode(aiPanelMode);
                triggerGenerate(aiPanelPrompt, aiPanelMode);
              }}
              disabled={generating || !aiPanelPrompt.trim()}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background:"linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
              {generating ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Sparkles className="h-3 w-3" />}
              Generate
            </button>
          </div>
        </div>

        {/* Aspect ratio quick pick (video) */}
        {aiPanelMode === "video" && (
          <div className="mt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color:"var(--text-tertiary)" }}>Aspect Ratio</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label:"16:9", w:1920, h:1080 },
                { label:"9:16", w:1080, h:1920 },
                { label:"1:1",  w:1080, h:1080 },
              ].map(r => (
                <button key={r.label}
                  onClick={() => { setCanvasW(r.w); setCanvasH(r.h); }}
                  className="flex flex-col items-center justify-center rounded-xl border py-2 text-[10px] font-medium transition-colors hover:border-[#1D7BFF]"
                  style={{
                    borderColor: canvasW===r.w && canvasH===r.h ? "#1D7BFF" : "var(--border)",
                    color: canvasW===r.w && canvasH===r.h ? "#1D7BFF" : "var(--text-secondary)",
                    background: canvasW===r.w && canvasH===r.h ? "rgba(29,123,255,0.08)" : "var(--bg-muted)",
                  }}>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color:"var(--text-tertiary)" }}>
            Suggestions
          </p>
          <div className="flex flex-col gap-1">
            {(aiPanelMode === "video" ? VIDEO_PROMPT_SUGGESTIONS : AI_PROMPT_SUGGESTIONS).map(s => (
              <button key={s}
                onClick={() => setAiPanelPrompt(s)}
                className="flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-[10px] transition-colors hover:border-[#1D7BFF] hover:bg-[rgba(29,123,255,0.05)]"
                style={{ borderColor:"var(--border)", color:"var(--text-secondary)" }}>
                <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#1D7BFF]" />
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Style presets (image only) */}
        {aiPanelMode === "image" && (
          <div className="mt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color:"var(--text-tertiary)" }}>Style Presets</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label:"Photorealistic", color:"#1D7BFF" },
                { label:"Illustration",   color:"#8B5CF6" },
                { label:"Minimalist",     color:"#6366F1" },
                { label:"Cinematic",      color:"#EF4444" },
                { label:"Watercolor",     color:"#06B6D4" },
                { label:"3D Render",      color:"#F59E0B" },
              ].map(s => (
                <button key={s.label}
                  onClick={() => setAiPanelPrompt(p => p ? `${p}, ${s.label.toLowerCase()} style` : `${s.label.toLowerCase()} style`)}
                  className="flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-[10px] font-medium transition-colors hover:border-[#1D7BFF]"
                  style={{ borderColor:"var(--border)", color:"var(--text-secondary)", borderLeft:`3px solid ${s.color}` }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video style presets */}
        {aiPanelMode === "video" && (
          <div className="mt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color:"var(--text-tertiary)" }}>Motion Style</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label:"Smooth Pan",     color:"#1D7BFF" },
                { label:"Zoom In",        color:"#8B5CF6" },
                { label:"Slow Motion",    color:"#06B6D4" },
                { label:"Time-lapse",     color:"#F59E0B" },
                { label:"Dolly Shot",     color:"#10B981" },
                { label:"Orbit",          color:"#EF4444" },
              ].map(s => (
                <button key={s.label}
                  onClick={() => setAiPanelPrompt(p => p ? `${p}, ${s.label.toLowerCase()}` : s.label.toLowerCase())}
                  className="flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-[10px] font-medium transition-colors hover:border-[#1D7BFF]"
                  style={{ borderColor:"var(--border)", color:"var(--text-secondary)", borderLeft:`3px solid ${s.color}` }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background:"var(--bg-base)", color:"var(--text-primary)" }}>

      {/* ── TOP BAR ── */}
      <div className="flex h-[52px] flex-shrink-0 items-center gap-2 border-b px-3"
        style={{ background:"var(--bg-subtle)", borderColor:"var(--border)" }}>

        <button onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]">
          <ArrowLeft className="h-4 w-4" style={{ color:"var(--text-tertiary)" }} />
        </button>

        <div className="flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0"
          style={{ background:"linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
          <Layers className="h-3.5 w-3.5 text-white" />
        </div>

        {/* File name */}
        {editingName ? (
          <input autoFocus value={docName} onChange={e => setDocName(e.target.value)}
            onBlur={() => setEditingName(false)} onKeyDown={e => e.key==="Enter" && setEditingName(false)}
            className="rounded border px-2 py-1 text-sm outline-none"
            style={{ borderColor:"#1D7BFF", background:"var(--bg-muted)", color:"var(--text-primary)", width:200 }} />
        ) : (
          <button onClick={() => setEditingName(true)}
            className="rounded px-2 py-1 text-sm font-medium transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color:"var(--text-primary)" }}>
            {docName}
          </button>
        )}

        {/* Mode badge */}
        <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: genMode==="video" ? "rgba(239,68,68,0.12)" : "rgba(29,123,255,0.12)", color: genMode==="video" ? "#EF4444" : "#1D7BFF" }}>
          {genMode==="video" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
          {genMode==="video" ? "Video" : "Image"}
        </div>

        {/* Size picker */}
        <div className="relative">
          <button onClick={() => setShowSizePicker(v => !v)}
            className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderColor:"var(--border)", color:"var(--text-tertiary)" }}>
            {canvasW}×{canvasH} <ChevronDown className="h-3 w-3" />
          </button>
          {showSizePicker && (
            <div className="absolute left-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-xl border shadow-xl"
              style={{ background:"var(--bg-base)", borderColor:"var(--border)" }}>
              {CANVAS_SIZES.map(s => (
                <button key={s.label} onClick={() => { setCanvasW(s.w); setCanvasH(s.h); setShowSizePicker(false); }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color:"var(--text-secondary)" }}>
                  <span>{s.label}</span>
                  <span style={{ color:"var(--text-tertiary)" }}>{s.w}×{s.h}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px mx-1" style={{ background:"var(--border)" }} />

        <button onClick={undo} disabled={histIdx<=0}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-30" title="Undo (⌘Z)">
          <Undo2 className="h-4 w-4" style={{ color:"var(--text-tertiary)" }} />
        </button>
        <button onClick={redo} disabled={histIdx>=history.length-1}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-30" title="Redo (⌘Y)">
          <Redo2 className="h-4 w-4" style={{ color:"var(--text-tertiary)" }} />
        </button>

        <div className="flex-1" />

        <div className="h-4 w-px mx-1" style={{ background:"var(--border)" }} />

        <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
          style={{ borderColor:"var(--border)", color:"var(--text-secondary)" }}>
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background:"linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="flex flex-shrink-0" style={{ width:300 }}>
          {/* Tab icons */}
          <div className="flex w-14 flex-col items-center gap-0.5 border-r py-3"
            style={{ background:"var(--bg-subtle)", borderColor:"var(--border)" }}>
            {([
              { id:"layers",      icon:Layers,        label:"Layers"    },
              { id:"templates",   icon:LayoutTemplate,label:"Templates" },
              { id:"elements",    icon:Square,        label:"Elements"  },
              { id:"text",        icon:Type,          label:"Text"      },
              { id:"photos",      icon:ImageIcon,     label:"Photos"    },
              { id:"backgrounds", icon:Palette,       label:"BG"        },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setLeftTab(id as any)} title={label}
                className="flex w-10 flex-col items-center gap-0.5 rounded-xl py-2 text-[9px] font-medium transition-colors"
                style={{
                  background: leftTab===id ? "var(--bg-active)" : undefined,
                  color: leftTab===id ? "#1D7BFF" : "var(--text-tertiary)",
                }}>
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex flex-1 flex-col overflow-hidden border-r" style={{ background:"var(--bg-base)", borderColor:"var(--border)" }}>

            {leftTab === "layers" && (
              <LayersSidebar
                elements={elements}
                selected={selected}
                onSelect={id => setSelected(id)}
                onReorder={reorderLayers}
                onAction={handleLayerAction}
                onRename={renameLayer}
              />
            )}

            {leftTab === "templates" && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="px-3 py-3">
                  <p className="text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Templates</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => setTemplateCat(c)}
                        className="rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors"
                        style={{ background: templateCat===c ? "rgba(29,123,255,0.15)" : "var(--bg-muted)", color: templateCat===c ? "#1D7BFF" : "var(--text-tertiary)" }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredTemplates.map(t => (
                      <button key={t.id} onClick={() => loadTemplate(t)}
                        className="group relative overflow-hidden rounded-xl border-2 transition-all hover:border-[#1D7BFF]"
                        style={{ aspectRatio:"1/1", background:t.bg, borderColor:"transparent" }}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                          <span className="text-[9px] font-bold text-white/90 drop-shadow-sm">{t.name}</span>
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[8px] font-medium text-white/70">{t.category}</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ background:"rgba(29,123,255,0.75)" }}>
                          <span className="text-xs font-semibold text-white">Use template</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {leftTab === "elements" && (
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <p className="mb-3 text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Shapes</p>
                <div className="grid grid-cols-4 gap-2">
                  {SHAPES.map(s => {
                    const Icon = s.icon;
                    return (
                      <button key={s.label}
                        onClick={() => addElement({ type:s.type, fill:s.fill, w:s.w, h:s.h, x:canvasW/2-s.w/2, y:canvasH/2-s.h/2, stroke:"transparent", strokeWidth:0, useGradient:false })}
                        className="flex flex-col items-center gap-1 rounded-xl p-2 text-[9px] transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ color:"var(--text-secondary)" }}>
                        <Icon className="h-8 w-8" style={{ color:s.fill }} />
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                <p className="mb-3 mt-5 text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Lines & Dividers</p>
                {[2,4,8].map(h => (
                  <button key={h}
                    onClick={() => addElement({ type:"rect", fill:"#1a1a1a", w:400, h, x:canvasW/2-200, y:canvasH/2, borderRadius:0, stroke:"transparent", strokeWidth:0, useGradient:false })}
                    className="mb-2 flex w-full items-center gap-3 rounded-xl p-3 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color:"var(--text-secondary)" }}>
                    <div className="flex-1 rounded" style={{ height:h, background:"#1a1a1a" }} />
                    <span className="text-[10px]">{h}px</span>
                  </button>
                ))}

                <p className="mb-3 mt-5 text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Gradient Shapes</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { a:"#1D7BFF", b:"#06B6D4" },
                    { a:"#8B5CF6", b:"#EC4899" },
                    { a:"#F59E0B", b:"#EF4444" },
                    { a:"#10B981", b:"#06B6D4" },
                  ].map(({ a, b }) => (
                    <button key={a}
                      onClick={() => addElement({ type:"rect", fill:a, useGradient:true, gradientA:a, gradientB:b, gradientAngle:135, w:200, h:200, x:canvasW/2-100, y:canvasH/2-100, stroke:"transparent", strokeWidth:0, borderRadius:16, shadow:true })}
                      className="h-14 rounded-xl transition-all hover:scale-105"
                      style={{ background:`linear-gradient(135deg,${a},${b})` }} />
                  ))}
                </div>
              </div>
            )}

            {leftTab === "text" && (
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <p className="mb-3 text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Add Text</p>
                {[
                  { label:"Add a heading",    fontSize:80, fontWeight:"900", content:"Heading",              color:"#1a1a1a" },
                  { label:"Add a subheading", fontSize:48, fontWeight:"600", content:"Subheading",           color:"#333333" },
                  { label:"Add body text",    fontSize:28, fontWeight:"400", content:"Body text goes here",  color:"#666666" },
                  { label:"Add a caption",    fontSize:20, fontWeight:"400", content:"Caption text",         color:"#999999" },
                ].map(t => (
                  <button key={t.label}
                    onClick={() => addElement({ type:"text", content:t.content, fontSize:t.fontSize, fontWeight:t.fontWeight, color:t.color, w:600, h:t.fontSize*1.4, x:canvasW/2-300, y:canvasH/2, fill:"transparent", stroke:"transparent", textAlign:"left", useGradient:false })}
                    className="mb-2 flex w-full items-start rounded-xl border px-4 py-3 text-left transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ borderColor:"var(--border)" }}>
                    <span style={{ fontSize:Math.min(t.fontSize*0.2,18), fontWeight:t.fontWeight, color:t.color, lineHeight:1.2 }}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {leftTab === "photos" && (
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <p className="mb-3 text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Stock Photos</p>
                <div className="grid grid-cols-2 gap-2">
                  {STOCK_PHOTOS.map(p => (
                    <button key={p.seed}
                      onClick={() => addElement({ type:"image", src:picsumUrl(p.seed,600,600), w:400, h:400, x:canvasW/2-200, y:canvasH/2-200, fill:"transparent", stroke:"transparent", borderRadius:8, shadow:false, useGradient:false })}
                      className="group relative overflow-hidden rounded-xl" style={{ aspectRatio:"1/1" }}>
                      <img src={picsumUrl(p.seed,300,300)} alt={p.label}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-end p-2 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                        <span className="text-[10px] font-medium text-white">{p.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {leftTab === "backgrounds" && (
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <p className="mb-3 text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Solid Colors</p>
                <div className="flex flex-wrap gap-2">
                  {[...COLORS,"#F3F4F6","#1F2937","#111827"].map(c => (
                    <button key={c} onClick={() => setCanvasBg(c)}
                      className="h-9 w-9 rounded-lg border-2 transition-all hover:scale-110"
                      style={{ background:c, borderColor:canvasBg===c ? "#1D7BFF" : "transparent" }} />
                  ))}
                </div>
                <p className="mb-2 mt-5 text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Gradients</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["#1D7BFF","#06B6D4"],["#8B5CF6","#EC4899"],["#F59E0B","#EF4444"],
                    ["#10B981","#06B6D4"],["#0a0a1a","#1a1a2e"],["#F97316","#F59E0B"],
                  ].map(([a,b]) => (
                    <button key={a} onClick={() => setCanvasBg(`linear-gradient(135deg,${a},${b})`)}
                      className="h-14 rounded-xl transition-all hover:scale-105"
                      style={{ background:`linear-gradient(135deg,${a},${b})` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CANVAS AREA ── */}
        <div className="relative flex flex-1 flex-col overflow-hidden"
          style={{ background:"repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>

          {/* Scrollable workspace */}
          <div className="relative flex flex-1 items-center justify-center overflow-auto"
            onClick={() => { setSelected(null); setShowSizePicker(false); }}>

            {/* Page label */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-medium shadow pointer-events-none"
              style={{ background:"var(--bg-subtle)", color:"var(--text-tertiary)", border:"1px solid var(--border)", zIndex:10 }}>
              Page 1
            </div>

            {/* Canvas */}
            <div ref={canvasRef} className="relative flex-shrink-0 shadow-2xl"
              style={{ width:canvasW*scale, height:canvasH*scale, background:canvasBg, overflow:"hidden" }}>

              {/* Empty state */}
              {elements.length === 0 && !generating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                  style={{ background:"rgba(255,255,255,0.04)" }}
                  onClick={e => e.stopPropagation()}>
                  <div className="flex flex-col items-center gap-3 rounded-2xl border p-8 text-center"
                    style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(16px)", borderColor:"rgba(0,0,0,0.08)", maxWidth:300*scale }}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ background:"linear-gradient(135deg,#1D7BFF,#06B6D4)", transform:`scale(${scale})`, transformOrigin:"center" }}>
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ fontSize:14*scale, color:"#1a1a1a" }}>Start with AI</p>
                      <p className="mt-1" style={{ fontSize:11*scale, color:"#666", lineHeight:1.5 }}>
                        Describe your idea in the prompt bar below and let AI generate your design
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {(["image","video"] as GenMode[]).map(m => (
                        <button key={m}
                          onClick={() => { setGenMode(m); setAiPanelMode(m); setLeftTab("ai"); }}
                          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 font-medium transition-colors"
                          style={{ fontSize:10*scale, borderColor: genMode===m ? "#1D7BFF" : "rgba(0,0,0,0.12)", color: genMode===m ? "#1D7BFF" : "#666", background: genMode===m ? "rgba(29,123,255,0.08)" : "transparent" }}>
                          {m === "image" ? <ImageIcon style={{ width:11*scale, height:11*scale }} /> : <Film style={{ width:11*scale, height:11*scale }} />}
                          {m === "image" ? "Image" : "Video"}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize:10*scale, color:"#999" }}>Or pick a template from the left panel</p>
                  </div>
                </div>
              )}

              {elements.filter(el => el.visible !== false).map(el => (
                <CanvasElement key={el.id} el={el} selected={selected===el.id} scale={scale}
                  onMouseDown={e => handleElemMouseDown(e, el.id)}
                  onResizeMouseDown={(e, pos) => handleResizeMouseDown(e, el.id, pos)}
                  onDoubleClick={() => { if (el.type==="text") setEditingText(el.id); }} />
              ))}

              {/* Inline text editor */}
              {editingText && (() => {
                const el = elements.find(e => e.id===editingText);
                if (!el) return null;
                return (
                  <textarea autoFocus value={el.content}
                    onChange={e => updateEl(editingText, { content:e.target.value })}
                    onBlur={() => { setEditingText(null); pushHistory(elements); }}
                    style={{ position:"absolute", left:el.x*scale, top:el.y*scale, width:el.w*scale, height:el.h*scale, fontSize:el.fontSize*scale, fontWeight:el.fontWeight, fontStyle:el.fontStyle, textAlign:el.textAlign, color:el.color, fontFamily:el.fontFamily, letterSpacing:el.letterSpacing, lineHeight:el.lineHeight, background:"transparent", border:"2px dashed #1D7BFF", outline:"none", resize:"none", padding:"4px 8px", boxSizing:"border-box", zIndex:100 }} />
                );
              })()}

              {/* Generation overlay */}
              {generating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                  style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(6px)", zIndex:200 }}>
                  {/* Icon */}
                  <div className="relative flex items-center justify-center" style={{ width:72*scale, height:72*scale }}>
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent"
                      style={{ borderTopColor:"#1D7BFF", borderRightColor:"rgba(29,123,255,0.3)", width:"100%", height:"100%" }} />
                    <div className="absolute animate-spin rounded-full border-4 border-transparent"
                      style={{ borderTopColor:"#06B6D4", borderRightColor:"rgba(6,182,212,0.2)", animationDirection:"reverse", animationDuration:"0.75s", inset:"12%", width:"76%", height:"76%" }} />
                    <div className="flex items-center justify-center rounded-full"
                      style={{ width:"44%", height:"44%", background:"linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                      {genMode==="video"
                        ? <Film style={{ width:14*scale, height:14*scale, color:"#fff" }} />
                        : <Sparkles style={{ width:14*scale, height:14*scale, color:"#fff" }} />}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold text-white" style={{ fontSize:14*scale }}>
                      {(genMode==="video" ? VIDEO_GEN_STAGES : IMAGE_GEN_STAGES)[genStage]?.label}
                    </p>
                    <p className="mt-1" style={{ fontSize:11*scale, color:"rgba(255,255,255,0.4)" }}>
                      {genMode==="video" ? "AI Video Generation" : "AI Image Generation"}
                    </p>
                  </div>

                  {/* Progress */}
                  <div style={{ width:160*scale, height:3*scale, borderRadius:999, background:"rgba(255,255,255,0.12)", overflow:"hidden" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width:`${(genMode==="video" ? VIDEO_GEN_STAGES : IMAGE_GEN_STAGES)[genStage]?.pct ?? 0}%`, background:"linear-gradient(90deg,#1D7BFF,#06B6D4)" }} />
                  </div>
                  <p className="text-center" style={{ fontSize:10*scale, color:"rgba(255,255,255,0.3)", maxWidth:200*scale }}>
                    "{currentPrompt.slice(0,60)}{currentPrompt.length>60?"…":""}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="flex h-9 flex-shrink-0 items-center justify-between border-t px-3"
            style={{ background: "var(--bg-subtle)", borderColor: "var(--border)", zIndex: 30 }}>
            {/* Left: layers + page */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLeftTab(t => t === "layers" ? "templates" : "layers")}
                className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-colors", leftTab === "layers" ? "" : "hover:bg-[var(--bg-hover)]")}
                style={{ background: leftTab === "layers" ? "rgba(29,123,255,0.1)" : undefined, color: leftTab === "layers" ? "#1D7BFF" : "var(--text-tertiary)" }}>
                <Layers className="h-3.5 w-3.5" />
                Layers
                {elements.length > 0 && (
                  <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: leftTab === "layers" ? "#1D7BFF" : "var(--bg-muted)", color: leftTab === "layers" ? "#fff" : "var(--text-tertiary)" }}>
                    {elements.length}
                  </span>
                )}
              </button>
              <div className="mx-1 h-3.5 w-px" style={{ background: "var(--border)" }} />
              <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                <button className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--bg-hover)]">
                  <ChevronUp className="h-3 w-3" />
                </button>
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>Page 1 / 1</span>
                <button className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--bg-hover)]">
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button className="ml-1 flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
                  <Plus className="h-3 w-3" /> Add Page
                </button>
              </div>
            </div>

            {/* Right: zoom */}
            <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              <button onClick={() => setZoom(z => Math.max(20,z-10))}
                className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--bg-hover)]">
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center font-medium" style={{ color: "var(--text-secondary)" }}>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200,z+10))}
                className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[var(--bg-hover)]">
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setZoom(52)}
                className="ml-1 rounded-lg border px-2 py-0.5 text-[10px] transition-colors hover:bg-[var(--bg-hover)]"
                style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
                Fit
              </button>
            </div>
          </div>

          {/* ── Floating Prompt Bar ── */}
          <div className="absolute bottom-9 left-0 right-0 flex justify-center pb-3 pointer-events-none" style={{ zIndex:50 }}>
            <div className={cn("pointer-events-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-200", promptFocused && "shadow-[0_8px_40px_rgba(29,123,255,0.28)]")}
              style={{ background:"var(--bg-subtle)", borderColor:promptFocused ? "#1D7BFF" : "var(--border)", backdropFilter:"blur(20px)" }}
              onClick={e => e.stopPropagation()}>

              {/* Mode tab strip */}
              <div className="flex items-center gap-1 border-b px-3 pt-2 pb-0" style={{ borderColor:"var(--border)" }}>
                {(["image","video"] as GenMode[]).map(m => (
                  <button key={m} onClick={() => setGenMode(m)}
                    className="flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-[10px] font-semibold transition-colors"
                    style={{
                      color: genMode===m ? "#1D7BFF" : "var(--text-tertiary)",
                      borderBottom: genMode===m ? "2px solid #1D7BFF" : "2px solid transparent",
                      marginBottom: -1,
                    }}>
                    {m==="image" ? <ImageIcon className="h-3 w-3" /> : <Film className="h-3 w-3" />}
                    {m==="image" ? "Image" : "Video"}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex items-end gap-2 px-3 py-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background:"linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                  {genMode==="video" ? <Film className="h-3.5 w-3.5 text-white" /> : <Sparkles className="h-3.5 w-3.5 text-white" />}
                </div>

                <textarea ref={promptRef} value={currentPrompt}
                  onChange={e => setCurrentPrompt(e.target.value)}
                  onFocus={() => setPromptFocused(true)}
                  onBlur={() => setPromptFocused(false)}
                  onKeyDown={e => { if (e.key==="Enter" && (e.metaKey||e.ctrlKey)) { e.preventDefault(); triggerGenerate(currentPrompt); } }}
                  rows={1}
                  placeholder={genMode==="video" ? "Describe a video scene to generate… (⌘↵)" : "Describe your image design… (⌘↵ to generate)"}
                  className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:opacity-35"
                  style={{ color:"var(--text-primary)", maxHeight:100, lineHeight:"1.5", paddingTop:6 }}
                  onInput={e => { const t=e.currentTarget; t.style.height="auto"; t.style.height=Math.min(t.scrollHeight,100)+"px"; }} />

                <div className="flex flex-shrink-0 items-center gap-1">
                  {currentPrompt && (
                    <button onClick={() => { setCurrentPrompt(""); promptRef.current?.focus(); }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color:"var(--text-tertiary)" }}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {elements.length>0 && (
                    <button onClick={() => triggerGenerate(currentPrompt)}
                      disabled={generating||!currentPrompt.trim()}
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-30"
                      style={{ color:"var(--text-tertiary)" }} title="Regenerate">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => triggerGenerate(currentPrompt)}
                    disabled={generating||!currentPrompt.trim()}
                    className="flex h-8 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ background:"linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                    {generating
                      ? <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Generating…</>
                      : <><SendHorizonal className="h-3.5 w-3.5" /> Generate</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex w-[260px] flex-shrink-0 flex-col overflow-y-auto border-l"
          style={{ background:"var(--bg-subtle)", borderColor:"var(--border)" }}>

          {selEl ? (
            <>
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor:"var(--border)" }}>
                <span className="text-xs font-semibold capitalize" style={{ color:"var(--text-primary)" }}>
                  {selEl.type==="rect" ? "Shape" : selEl.type==="circle" ? "Circle" : selEl.type==="video" ? "Video" : selEl.type}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateEl(selEl.id,{locked:!selEl.locked})}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]">
                    <Lock className="h-3.5 w-3.5" style={{ color:selEl.locked ? "#1D7BFF" : "var(--text-tertiary)" }} />
                  </button>
                  <button onClick={() => { addElement({...selEl, x:selEl.x+20, y:selEl.y+20}); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-hover)]">
                    <Copy className="h-3.5 w-3.5" style={{ color:"var(--text-tertiary)" }} />
                  </button>
                  <button onClick={() => { const next=elements.filter(el=>el.id!==selEl.id); setElements(next); pushHistory(next); setSelected(null); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>

              <PanelSection title="Position & Size">
                <div className="grid grid-cols-2 gap-2">
                  {([["X","x"],["Y","y"],["W","w"],["H","h"]] as [string, keyof CanvasEl][]).map(([label,key]) => (
                    <div key={key}>
                      <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>{label}</div>
                      <input type="number" value={Math.round(selEl[key] as number)}
                        onChange={e => updateEl(selEl.id,{[key]:Number(e.target.value)})}
                        onBlur={commitUpdate}
                        className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none"
                        style={{ borderColor:"var(--border)", background:"var(--bg-muted)", color:"var(--text-primary)" }} />
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Rotation</div>
                  <input type="range" min={-180} max={180} value={selEl.rotation}
                    onChange={e => updateEl(selEl.id,{rotation:Number(e.target.value)})}
                    onMouseUp={commitUpdate} className="w-full accent-[#1D7BFF]" />
                  <div className="text-right text-[10px]" style={{ color:"var(--text-tertiary)" }}>{selEl.rotation}°</div>
                </div>
              </PanelSection>

              <PanelSection title="Opacity">
                <Slider label="Opacity" value={selEl.opacity} min={0} max={100}
                  onChange={v => updateEl(selEl.id,{opacity:v})} />
              </PanelSection>

              {selEl.type==="text" && (
                <PanelSection title="Typography">
                  <textarea value={selEl.content} onChange={e => updateEl(selEl.id,{content:e.target.value})} onBlur={commitUpdate}
                    rows={3} className="mb-2 w-full resize-none rounded-lg border p-2 text-xs outline-none"
                    style={{ borderColor:"var(--border)", background:"var(--bg-muted)", color:"var(--text-primary)" }} />
                  <select value={selEl.fontFamily} onChange={e => { updateEl(selEl.id,{fontFamily:e.target.value}); commitUpdate(); }}
                    className="mb-2 w-full rounded-lg border px-2 py-1.5 text-xs outline-none"
                    style={{ borderColor:"var(--border)", background:"var(--bg-muted)", color:"var(--text-primary)" }}>
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="mb-2 flex gap-1.5">
                    <input type="number" value={selEl.fontSize} onChange={e => updateEl(selEl.id,{fontSize:Number(e.target.value)})} onBlur={commitUpdate}
                      className="flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none"
                      style={{ borderColor:"var(--border)", background:"var(--bg-muted)", color:"var(--text-primary)" }} />
                    <div className="flex gap-0.5">
                      {[
                        { icon:Bold, key:"fontWeight", on:"700", off:"400", prop:selEl.fontWeight==="700" },
                        { icon:Italic, key:"fontStyle", on:"italic", off:"normal", prop:selEl.fontStyle==="italic" },
                        { icon:Underline, key:"textDecoration", on:"underline", off:"none", prop:selEl.textDecoration==="underline" },
                      ].map(({ icon:Icon,key,on,off,prop }) => (
                        <button key={key} onClick={() => { updateEl(selEl.id,{[key]:prop?off:on} as any); commitUpdate(); }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          style={{ background:prop?"rgba(29,123,255,0.15)":"var(--bg-muted)", color:prop?"#1D7BFF":"var(--text-tertiary)" }}>
                          <Icon className="h-3.5 w-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2 flex gap-1">
                    {([{icon:AlignLeft,val:"left"},{icon:AlignCenter,val:"center"},{icon:AlignRight,val:"right"}] as const).map(({icon:Icon,val}) => (
                      <button key={val} onClick={() => { updateEl(selEl.id,{textAlign:val}); commitUpdate(); }}
                        className="flex flex-1 items-center justify-center rounded-lg py-1.5 transition-colors"
                        style={{ background:selEl.textAlign===val?"rgba(29,123,255,0.15)":"var(--bg-muted)", color:selEl.textAlign===val?"#1D7BFF":"var(--text-tertiary)" }}>
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                  <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Color</div>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => { updateEl(selEl.id,{color:c}); commitUpdate(); }}
                        className="h-6 w-6 rounded-md border-2 transition-all hover:scale-110"
                        style={{ background:c, borderColor:selEl.color===c?"#1D7BFF":"transparent" }} />
                    ))}
                    <input type="color" value={selEl.color} onChange={e => updateEl(selEl.id,{color:e.target.value})} onBlur={commitUpdate}
                      className="h-6 w-6 cursor-pointer rounded-md border-0 p-0" />
                  </div>
                </PanelSection>
              )}

              {/* Video-specific controls */}
              {selEl.type==="video" && (
                <>
                  <PanelSection title="Video">
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Duration</div>
                        <div className="flex gap-1">
                          {["0:05","0:10","0:15","0:30","1:00"].map(d => (
                            <button key={d} onClick={() => updateEl(selEl.id,{videoDuration:d})}
                              className="flex-1 rounded-lg py-1 text-[9px] font-medium transition-colors"
                              style={{ background:selEl.videoDuration===d?"rgba(29,123,255,0.15)":"var(--bg-muted)", color:selEl.videoDuration===d?"#1D7BFF":"var(--text-tertiary)" }}>
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Label</div>
                        <input value={selEl.videoLabel??""} onChange={e => updateEl(selEl.id,{videoLabel:e.target.value})} onBlur={commitUpdate}
                          placeholder="e.g. AI VIDEO"
                          className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none"
                          style={{ borderColor:"var(--border)", background:"var(--bg-muted)", color:"var(--text-primary)" }} />
                      </div>
                    </div>
                  </PanelSection>
                  <PanelSection title="Video Adjustments">
                    <Slider label="Brightness" value={selEl.filterBrightness} min={0} max={200} onChange={v => updateEl(selEl.id,{filterBrightness:v})} />
                    <Slider label="Contrast"   value={selEl.filterContrast}   min={0} max={200} onChange={v => updateEl(selEl.id,{filterContrast:v})} />
                    <Slider label="Saturation" value={selEl.filterSaturation} min={0} max={200} onChange={v => updateEl(selEl.id,{filterSaturation:v})} />
                  </PanelSection>
                  <PanelSection title="AI Video Actions">
                    {[
                      { icon:RefreshCw, label:"Regenerate scene"  },
                      { icon:Scissors,  label:"Trim & cut"        },
                      { icon:Music,     label:"Add background music" },
                      { icon:Wand2,     label:"Enhance motion"    },
                    ].map(({ icon:Icon,label }) => (
                      <button key={label}
                        className="mb-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ color:"var(--text-secondary)" }}>
                        <Icon className="h-3.5 w-3.5 text-[#1D7BFF]" /> {label}
                      </button>
                    ))}
                  </PanelSection>
                </>
              )}

              {selEl.type!=="text" && selEl.type!=="video" && (
                <PanelSection title="Fill">
                  <div className="mb-2 flex gap-1.5">
                    <button onClick={() => updateEl(selEl.id,{useGradient:false})}
                      className="flex-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors"
                      style={{ background:!selEl.useGradient?"rgba(29,123,255,0.15)":"var(--bg-muted)", color:!selEl.useGradient?"#1D7BFF":"var(--text-secondary)" }}>
                      Solid
                    </button>
                    <button onClick={() => updateEl(selEl.id,{useGradient:true})}
                      className="flex-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors"
                      style={{ background:selEl.useGradient?"rgba(29,123,255,0.15)":"var(--bg-muted)", color:selEl.useGradient?"#1D7BFF":"var(--text-secondary)" }}>
                      Gradient
                    </button>
                  </div>
                  {selEl.useGradient ? (
                    <>
                      <div className="mb-2 h-8 rounded-lg" style={{ background:`linear-gradient(${selEl.gradientAngle}deg,${selEl.gradientA},${selEl.gradientB})` }} />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>From</div>
                          <input type="color" value={selEl.gradientA} onChange={e => updateEl(selEl.id,{gradientA:e.target.value})} onBlur={commitUpdate}
                            className="h-8 w-full cursor-pointer rounded-lg border-0 p-0.5" style={{ background:selEl.gradientA }} />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>To</div>
                          <input type="color" value={selEl.gradientB} onChange={e => updateEl(selEl.id,{gradientB:e.target.value})} onBlur={commitUpdate}
                            className="h-8 w-full cursor-pointer rounded-lg border-0 p-0.5" style={{ background:selEl.gradientB }} />
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Angle {selEl.gradientAngle}°</div>
                        <input type="range" min={0} max={360} value={selEl.gradientAngle}
                          onChange={e => updateEl(selEl.id,{gradientAngle:Number(e.target.value)})} onMouseUp={commitUpdate}
                          className="w-full accent-[#1D7BFF]" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => { updateEl(selEl.id,{fill:c}); commitUpdate(); }}
                          className="h-6 w-6 rounded-md border-2 transition-all hover:scale-110"
                          style={{ background:c, borderColor:selEl.fill===c?"#1D7BFF":"transparent" }} />
                      ))}
                      <input type="color" value={selEl.fill.startsWith("#")?selEl.fill:"#1D7BFF"}
                        onChange={e => updateEl(selEl.id,{fill:e.target.value})} onBlur={commitUpdate}
                        className="h-6 w-6 cursor-pointer rounded-md border-0 p-0" />
                    </div>
                  )}
                </PanelSection>
              )}

              {selEl.type==="image" && (
                <PanelSection title="Image Adjustments">
                  <Slider label="Brightness" value={selEl.filterBrightness} min={0} max={200} onChange={v => updateEl(selEl.id,{filterBrightness:v})} />
                  <Slider label="Contrast"   value={selEl.filterContrast}   min={0} max={200} onChange={v => updateEl(selEl.id,{filterContrast:v})} />
                  <Slider label="Saturation" value={selEl.filterSaturation} min={0} max={200} onChange={v => updateEl(selEl.id,{filterSaturation:v})} />
                </PanelSection>
              )}

              {selEl.type!=="text" && selEl.type!=="video" && (
                <PanelSection title="Border">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Color</div>
                      <input type="color" value={selEl.stroke==="transparent"?"#000000":selEl.stroke}
                        onChange={e => updateEl(selEl.id,{stroke:e.target.value, strokeWidth:Math.max(selEl.strokeWidth,1)})} onBlur={commitUpdate}
                        className="h-8 w-full cursor-pointer rounded-lg border-0" />
                    </div>
                    <div>
                      <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Width</div>
                      <input type="number" min={0} max={20} value={selEl.strokeWidth}
                        onChange={e => updateEl(selEl.id,{strokeWidth:Number(e.target.value)})} onBlur={commitUpdate}
                        className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none"
                        style={{ borderColor:"var(--border)", background:"var(--bg-muted)", color:"var(--text-primary)" }} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 text-[9px]" style={{ color:"var(--text-tertiary)" }}>Corner Radius</div>
                    <input type="range" min={0} max={100} value={selEl.borderRadius}
                      onChange={e => updateEl(selEl.id,{borderRadius:Number(e.target.value)})} onMouseUp={commitUpdate}
                      className="w-full accent-[#1D7BFF]" />
                  </div>
                </PanelSection>
              )}

              <PanelSection title="Effects">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color:"var(--text-secondary)" }}>Drop Shadow</span>
                  <button onClick={() => { updateEl(selEl.id,{shadow:!selEl.shadow}); commitUpdate(); }}>
                    {selEl.shadow
                      ? <div className="h-5 w-9 rounded-full bg-[#1D7BFF] flex items-center justify-end pr-0.5"><div className="h-4 w-4 rounded-full bg-white" /></div>
                      : <div className="h-5 w-9 rounded-full flex items-center pl-0.5" style={{background:"var(--bg-muted)"}}><div className="h-4 w-4 rounded-full bg-white" /></div>
                    }
                  </button>
                </div>
              </PanelSection>

              <PanelSection title="AI Actions">
                {[
                  { icon:Wand2,    label:"AI Enhance"        },
                  { icon:Sparkles, label:"Remove Background" },
                  { icon:Sliders,  label:"Auto-adjust"       },
                ].map(({ icon:Icon,label }) => (
                  <button key={label}
                    className="mb-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color:"var(--text-secondary)" }}>
                    <Icon className="h-3.5 w-3.5 text-[#1D7BFF]" /> {label}
                  </button>
                ))}
              </PanelSection>
            </>
          ) : (
            <>
              <div className="border-b px-4 py-3" style={{ borderColor:"var(--border)" }}>
                <p className="text-xs font-semibold" style={{ color:"var(--text-primary)" }}>Document</p>
              </div>

              <PanelSection title="Canvas Background">
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setCanvasBg(c)}
                      className="h-6 w-6 rounded-md border-2 transition-all hover:scale-110"
                      style={{ background:c, borderColor:canvasBg===c?"#1D7BFF":"transparent" }} />
                  ))}
                  <input type="color" value={canvasBg.startsWith("#")?canvasBg:"#ffffff"}
                    onChange={e => setCanvasBg(e.target.value)}
                    className="h-6 w-6 cursor-pointer rounded-md border-0 p-0" />
                </div>
              </PanelSection>

              <PanelSection title="Canvas Size">
                <div className="flex flex-col gap-1.5">
                  {CANVAS_SIZES.map(s => (
                    <button key={s.label} onClick={() => { setCanvasW(s.w); setCanvasH(s.h); }}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ background:canvasW===s.w&&canvasH===s.h?"rgba(29,123,255,0.1)":"var(--bg-muted)", color:canvasW===s.w&&canvasH===s.h?"#1D7BFF":"var(--text-secondary)" }}>
                      <span>{s.label}</span>
                      <span style={{ color:"var(--text-tertiary)" }}>{s.w}×{s.h}</span>
                    </button>
                  ))}
                </div>
              </PanelSection>

              <PanelSection title={`Layers (${elements.length})`}>
                {elements.length===0 ? (
                  <p className="text-xs" style={{ color:"var(--text-tertiary)" }}>No elements yet.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {[...elements].reverse().map(el => (
                      <button key={el.id} onClick={() => setSelected(el.id)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ background:selected===el.id?"rgba(29,123,255,0.1)":undefined, color:selected===el.id?"#1D7BFF":"var(--text-secondary)" }}>
                        {el.type==="text" ? <Type className="h-3 w-3 flex-shrink-0" /> :
                         el.type==="image" ? <ImageIcon className="h-3 w-3 flex-shrink-0" /> :
                         el.type==="video" ? <Film className="h-3 w-3 flex-shrink-0" /> :
                         <Square className="h-3 w-3 flex-shrink-0" />}
                        <span className="flex-1 truncate text-left">
                          {el.type==="text" ? el.content.slice(0,20) :
                           el.type==="video" ? `Video ${el.videoDuration}` :
                           `${el.type} layer`}
                        </span>
                        {el.locked && <Lock className="h-3 w-3 flex-shrink-0 opacity-40" />}
                      </button>
                    ))}
                  </div>
                )}
              </PanelSection>

              <PanelSection title="Shortcuts">
                <div className="space-y-1.5 text-[10px]" style={{ color:"var(--text-tertiary)" }}>
                  <p>• ⌘↵ Generate from prompt bar</p>
                  <p>• ⌘Z / ⌘Y  Undo / Redo</p>
                  <p>• Delete  Remove selected</p>
                  <p>• ⌘D  Duplicate selected</p>
                  <p>• Arrow keys  Nudge 1px (⇧=10px)</p>
                  <p>• Double-click text  Inline edit</p>
                </div>
              </PanelSection>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

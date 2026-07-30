"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, X, ChevronRight, Play, Star } from "lucide-react";

/* ── helpers ── */
function useInterval(fn: () => void, ms: number) {
  useEffect(() => {
    const t = setInterval(fn, ms);
    return () => clearInterval(t);
  }, [fn, ms]);
}

/* ── Marquee of AI-generated images ── */
const MARQUEE_IMAGES = [
  { seed: "city2",     label: "Neon Tokyo at night" },
  { seed: "nature1",   label: "Mountain golden hour" },
  { seed: "space5",    label: "Nebula in deep space" },
  { seed: "arch6",     label: "Desert white villa" },
  { seed: "portrait8", label: "Cinematic portrait" },
  { seed: "ocean3",    label: "Turquoise waves" },
  { seed: "food7",     label: "Artisan ramen bowl" },
  { seed: "forest4",   label: "Redwood light rays" },
  { seed: "abstract9", label: "Ink art in blue" },
  { seed: "macro10",   label: "Dewdrop web" },
  { seed: "gen1",      label: "Futuristic city" },
  { seed: "gen3",      label: "Oil painting style" },
  { seed: "gen5",      label: "Watercolor sunrise" },
  { seed: "gen7",      label: "Pixel art landscape" },
  { seed: "gen9",      label: "3D render crystal" },
];

function MarqueeRow({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  const imgs = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES]; // duplicate for seamless loop
  const duration = reverse ? "55s" : "45s";
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3"
        style={{
          animation: `marquee${reverse ? "Rev" : ""} ${duration} linear infinite`,
          width: "max-content",
        }}
      >
        {imgs.map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 overflow-hidden rounded-xl"
            style={{ width: 180, height: 130 }}
          >
            <img
              src={`https://picsum.photos/seed/${img.seed}/360/260`}
              alt={img.label}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
            <span className="absolute bottom-2 left-2.5 text-[10px] font-medium text-white/80 leading-tight">{img.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bento card ── */
function BentoCard({
  label, title, desc, img, wide, tall, accent, tag,
}: {
  label: string; title: string; desc: string; img?: string;
  wide?: boolean; tall?: boolean; accent?: string; tag?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="group relative flex flex-col justify-end overflow-hidden rounded-2xl transition-transform duration-300"
      style={{
        gridColumn: wide ? "span 2" : "span 1",
        gridRow: tall ? "span 2" : "span 1",
        minHeight: tall ? 480 : 240,
        background: img ? undefined : "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transform: hov ? "scale(1.01)" : "scale(1)",
      }}
    >
      {img && (
        <>
          <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        </>
      )}
      {!img && accent && (
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 30% 30%, ${accent}, transparent 70%)` }} />
      )}

      <div className="relative z-10 p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent ?? "#6366F1" }}>{label}</span>
          {tag && (
            <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase" style={{ background: accent ? `${accent}25` : "rgba(99,102,241,0.2)", color: accent ?? "#6366F1", border: `1px solid ${accent ?? "#6366F1"}40` }}>
              {tag}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold leading-tight text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── Pricing ── */
const PLANS = [
  { name: "FREE", price: "$0", period: "/mo", features: ["1,000 credits/month", "All chat models", "5 images/day", "Community support"], cta: "Get started", highlight: false },
  { name: "PRO", price: "$9.99", period: "/mo", features: ["20,000 credits/month", "Unlimited image gen", "Video Studio", "Priority speed", "API access"], cta: "Start free trial", highlight: true },
  { name: "TEAM", price: "$29.99", period: "/mo", features: ["80,000 shared credits", "5 seats included", "Admin dashboard", "Usage analytics", "Dedicated support"], cta: "Contact sales", highlight: false },
];

/* ── Model pill ticker ── */
const MODELS = ["GPT-4o", "Claude 3.7 Sonnet", "Gemini 2.0 Flash", "DeepSeek V3", "Grok 4", "Qwen 2.5-VL", "Mistral Large", "Llama 3.3"];

export default function LandingPage() {
  const [barDismissed, setBarDismissed] = useState(false);
  const [modelIdx, setModelIdx] = useState(0);
  const [modelFading, setModelFading] = useState(false);

  // Model ticker
  useEffect(() => {
    const t = setInterval(() => {
      setModelFading(true);
      setTimeout(() => {
        setModelIdx(i => (i + 1) % MODELS.length);
        setModelFading(false);
      }, 300);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#08080c", color: "#F9FAFB", fontFamily: "var(--font-inter, Inter, sans-serif)", overflowX: "hidden" }}>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes marquee    { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marqueeRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5) } 50% { box-shadow: 0 0 0 8px rgba(99,102,241,0) } }
        .animate-fade-up { animation: fadeUp 0.7s ease both; }
      `}</style>

      {/* ── ANNOUNCEMENT BAR ── */}
      {!barDismissed && (
        <div className="relative flex items-center justify-center gap-3 px-6 py-2.5 text-sm font-medium" style={{ background: "linear-gradient(90deg,#4F46E5,#7C3AED,#6366F1)", color: "white" }}>
          <Sparkles className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Free forever plan.</strong> No credit card required — start generating with GPT-4o, Claude & more today.
          </span>
          <Link href="/register" className="flex-shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-bold transition-colors hover:bg-white/30">
            Sign up free →
          </Link>
          <button onClick={() => setBarDismissed(true)} className="absolute right-4 text-white/60 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3" style={{ background: "rgba(8,8,12,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/landing" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">AnetAIS</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {["Chat", "Image", "Video", "Tools"].map(item => (
            <Link
              key={item}
              href="/chat"
              className="rounded-lg px-3.5 py-2 text-sm transition-colors hover:bg-white/5 hover:text-white"
              style={{ color: "#9CA3AF" }}
            >
              {item}
            </Link>
          ))}
          <span className="mx-2 h-4 w-px" style={{ background: "rgba(255,255,255,0.10)" }} />
          <a href="#pricing" className="rounded-lg px-3.5 py-2 text-sm transition-colors hover:bg-white/5 hover:text-white" style={{ color: "#9CA3AF" }}>Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm transition-colors hover:text-white md:block" style={{ color: "#9CA3AF" }}>Log in</Link>
          <Link
            href="/register"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#6366F1" }}
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 pb-8 pt-20 text-center">
        {/* BIG glow */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
          <div style={{ width: 800, height: 500, background: "radial-gradient(ellipse at center top, rgba(99,102,241,0.20) 0%, transparent 65%)" }} />
        </div>

        {/* Badge */}
        <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ border: "1px solid rgba(99,102,241,0.35)", background: "rgba(99,102,241,0.08)", color: "#A5B4FC", animationDelay: "0ms" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          10+ AI models — one workspace
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up mx-auto max-w-5xl text-6xl font-black leading-[1.05] tracking-tight md:text-8xl" style={{ animationDelay: "80ms" }}>
          EVERY AI.<br />
          <span style={{ background: "linear-gradient(135deg,#818CF8 0%,#C084FC 40%,#F472B6 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ONE PLACE.
          </span>
        </h1>

        {/* Sub */}
        <p className="animate-fade-up mx-auto mt-6 max-w-lg text-lg leading-relaxed" style={{ color: "#9CA3AF", animationDelay: "160ms" }}>
          Chat with{" "}
          <span
            className="font-semibold transition-opacity duration-300"
            style={{ color: "#A5B4FC", opacity: modelFading ? 0 : 1 }}
          >
            {MODELS[modelIdx]}
          </span>
          {" "}— and generate images, videos, and more without switching apps.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "240ms" }}>
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", boxShadow: "0 0 30px rgba(99,102,241,0.45)", animation: "pulse-ring 2.5s ease infinite" }}
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-semibold transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#E5E7EB" }}
          >
            <Play className="h-4 w-4" style={{ color: "#6366F1" }} />
            Try the demo
          </Link>
        </div>

        {/* Social proof avatars */}
        <div className="animate-fade-up mt-10 flex items-center justify-center gap-3" style={{ animationDelay: "320ms" }}>
          <div className="flex -space-x-2.5">
            {["u1","u2","u3","u4","u5"].map(s => (
              <img key={s} src={`https://picsum.photos/seed/${s}/32/32`} className="h-8 w-8 rounded-full border-2 object-cover" style={{ borderColor: "#08080c" }} alt="" />
            ))}
          </div>
          <div className="text-left text-xs" style={{ color: "#6B7280" }}>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" style={{ color: "#FBBF24" }} />)}
            </div>
            <span>Loved by <strong style={{ color: "#D1D5DB" }}>12,000+</strong> creators</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE GALLERY ── */}
      <section className="mt-10 flex flex-col gap-3 py-4" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
        <MarqueeRow />
        <MarqueeRow reverse />
      </section>

      {/* ── BENTO GRID ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#4B5563" }}>What you can build</span>
          </div>
          <h2 className="mb-10 text-center text-4xl font-black tracking-tight md:text-5xl">ONE WORKSPACE.<br />INFINITE POSSIBILITIES.</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ gridAutoRows: "240px" }}>
            {/* Wide tall card — Chat */}
            <BentoCard
              label="Multi-Model Chat"
              tag="10+ Models"
              title="Talk to any AI. Switch in one click."
              desc="GPT-4o, Claude 3.7, Gemini, DeepSeek — all in one thread. No tab-switching, no re-explaining context."
              img="https://picsum.photos/seed/city2/800/600"
              wide
              accent="#6366F1"
            />

            {/* Tall card — Image */}
            <BentoCard
              label="Image Studio"
              tag="8 Style Presets"
              title="Words → visuals in seconds."
              desc="Photorealistic, anime, watercolor, cinematic — pick a style and generate."
              img="https://picsum.photos/seed/portrait8/400/600"
              tall
              accent="#A78BFA"
            />

            {/* Normal — Video */}
            <BentoCard
              label="Video Studio"
              title="Prompts become motion."
              desc="Multi-stage rendering with live progress and download."
              img="https://picsum.photos/seed/ocean3/400/300"
              accent="#EC4899"
            />

            {/* Normal — Tools */}
            <BentoCard
              label="AI Tools"
              title="Remove backgrounds. Instantly."
              desc="Drag & drop any image. Get a clean cutout with before/after comparison."
              img="https://picsum.photos/seed/forest4/400/300"
              accent="#10B981"
            />

            {/* Wide — Assistants */}
            <BentoCard
              label="Smart Assistants"
              tag="4 Personas"
              title="Pre-built AI experts, ready to go."
              desc="Academic writer, code reviewer, recipe critic, storyteller — already configured and waiting."
              img="https://picsum.photos/seed/arch6/800/300"
              wide
              accent="#F59E0B"
            />
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL SCROLLER — Provider logos ── */}
      <section className="py-12" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div style={{ display: "flex", gap: "3rem", animation: "marquee 20s linear infinite", width: "max-content" }}>
            {[...["OpenAI","Anthropic","Google","DeepSeek","xAI","Alibaba Cloud","Mistral","Meta AI","Cohere","Together AI"],
              ...["OpenAI","Anthropic","Google","DeepSeek","xAI","Alibaba Cloud","Mistral","Meta AI","Cohere","Together AI"]].map((n, i) => (
              <span key={i} className="flex-shrink-0 text-sm font-bold uppercase tracking-widest" style={{ color: "#2D3748", letterSpacing: "0.15em" }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#4B5563" }}>How it works</span>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">ZERO SETUP.<br />START IN 30 SECONDS.</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Create free account", desc: "No credit card. No trials. Instant access to every AI model on the platform.", color: "#6366F1" },
              { step: "02", title: "Pick your tool", desc: "Chat, generate an image, create a video, or drop a file into the background remover.", color: "#8B5CF6" },
              { step: "03", title: "Create anything", desc: "Switch models mid-conversation. Generate images from chat. Everything talks to everything.", color: "#EC4899" },
            ].map(item => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="text-5xl font-black" style={{ color: item.color, opacity: 0.25 }}>{item.step}</div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-6 py-20" style={{ background: "rgba(99,102,241,0.04)", borderTop: "1px solid rgba(99,102,241,0.10)", borderBottom: "1px solid rgba(99,102,241,0.10)" }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-tight md:text-4xl">WHAT CREATORS SAY</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { q: "Replaced four AI subscriptions. The image studio alone is worth it.", name: "Sarah K.", role: "Product Designer", seed: "sarah" },
              { q: "Switching models mid-conversation without losing context is a genuine superpower.", name: "Marcus T.", role: "Full-Stack Engineer", seed: "marcus" },
              { q: "The streaming responses feel so natural. Closest thing I've used to talking to a real assistant.", name: "Priya R.", role: "Content Strategist", seed: "priya" },
            ].map(t => (
              <div key={t.name} className="flex flex-col gap-5 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "#FBBF24" }} />)}
                </div>
                <p className="flex-1 text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>&ldquo;{t.q}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={`https://picsum.photos/seed/${t.seed}/40/40`} className="h-9 w-9 rounded-full object-cover" alt={t.name} />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs" style={{ color: "#6B7280" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#4B5563" }}>Pricing</span>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">SIMPLE.<br />TRANSPARENT.</h2>
            <p className="mt-4 text-base" style={{ color: "#6B7280" }}>Start free. Scale when you're ready. Cancel any time.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-2xl p-8"
                style={{
                  background: plan.highlight ? "rgba(99,102,241,0.10)" : "rgba(255,255,255,0.02)",
                  border: plan.highlight ? "1px solid rgba(99,102,241,0.45)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.highlight ? "0 0 50px rgba(99,102,241,0.18)" : "none",
                }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-black uppercase text-white" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                    Most popular
                  </div>
                )}
                <div className="mb-1 text-xs font-black uppercase tracking-widest" style={{ color: plan.highlight ? "#A5B4FC" : "#6B7280" }}>{plan.name}</div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="mb-1.5 text-sm" style={{ color: "#6B7280" }}>{plan.period}</span>
                </div>
                <ul className="my-8 flex flex-col gap-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className="h-4 w-4 flex-shrink-0" style={{ color: plan.highlight ? "#818CF8" : "#4B5563" }} />
                      <span style={{ color: plan.highlight ? "#E5E7EB" : "#9CA3AF" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: plan.highlight ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(255,255,255,0.06)",
                    color: "white",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  {plan.cta} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIG CTA ── */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)", border: "1px solid rgba(99,102,241,0.30)" }}>
          {/* decorative images */}
          <img src="https://picsum.photos/seed/gen1/200/200" alt="" className="absolute right-0 top-0 h-48 w-36 object-cover opacity-20" style={{ clipPath: "polygon(0 0,100% 0,100% 100%,40% 100%)" }} />
          <img src="https://picsum.photos/seed/gen3/200/200" alt="" className="absolute bottom-0 right-32 h-36 w-36 object-cover opacity-10 rounded-tl-2xl" />

          <div className="relative z-10 flex flex-col items-center px-10 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.10)" }}>
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
              START CREATING<br />TODAY.
            </h2>
            <p className="mt-4 max-w-md text-base" style={{ color: "rgba(255,255,255,0.60)" }}>
              Free forever. No credit card. Access every model — GPT-4o, Claude, Gemini, and more — in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>
                Already have an account? Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 pb-10 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/landing" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">AnetAIS</span>
          </Link>
          <div className="flex gap-6 text-xs" style={{ color: "#374151" }}>
            {["Privacy","Terms","Status","Docs","GitHub"].map(l => (
              <span key={l} className="cursor-pointer transition-colors hover:text-white">{l}</span>
            ))}
          </div>
          <p className="text-xs" style={{ color: "#374151" }}>© 2025 AnetAIS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

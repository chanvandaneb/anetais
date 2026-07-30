"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, MessageSquare, Image, Video, Wand2, Zap,
  ChevronRight, Star, Check, ArrowRight, Play, Globe,
  Shield, Brain, Layers, Users, TrendingUp, Code2,
} from "lucide-react";

const MODELS = ["GPT-4o", "Claude 3.7", "Gemini 2.0", "DeepSeek V3", "Grok 4", "Qwen 2.5"];
const HERO_PROMPTS = [
  "Generate a photorealistic sunset over Tokyo",
  "Write a marketing email that converts",
  "Create a cinematic sci-fi video clip",
  "Refactor my React component to use hooks",
  "Summarize this 40-page research paper",
];

function useTypewriter(texts: string[], speed = 45) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx(i => i + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(i => i - 1), speed / 2);
    } else {
      setDeleting(false);
      setTextIdx(i => (i + 1) % texts.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx, texts, speed]);

  return display;
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / 60;
      const tick = () => {
        start += step;
        if (start >= target) { setVal(target); return; }
        setVal(Math.floor(start));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Multi-Model Chat",
    desc: "Switch between GPT-4o, Claude, Gemini, DeepSeek and more in a single conversation. Compare answers side-by-side.",
    color: "#6366F1",
  },
  {
    icon: Image,
    title: "Image Studio",
    desc: "Generate stunning visuals with style presets — Photorealistic, Anime, Cinematic, Oil Painting and more.",
    color: "#8B5CF6",
  },
  {
    icon: Video,
    title: "Video Studio",
    desc: "Turn prompts into short AI-generated video clips with multi-stage rendering and live progress tracking.",
    color: "#EC4899",
  },
  {
    icon: Wand2,
    title: "AI Tools",
    desc: "Remove backgrounds, upscale images, and process media with real-time before/after comparison sliders.",
    color: "#F59E0B",
  },
  {
    icon: Brain,
    title: "Smart Assistants",
    desc: "Pre-built AI personas for code review, academic writing, creative storytelling, and more.",
    color: "#10B981",
  },
  {
    icon: Zap,
    title: "Streaming Responses",
    desc: "Real-time character-by-character streaming with copy, react, and regenerate controls on every message.",
    color: "#3B82F6",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Product Designer",
    avatar: "https://picsum.photos/seed/sarah/48/48",
    quote: "AnetAIS replaced four different AI subscriptions for me. The image studio alone is worth it.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    role: "Full-Stack Engineer",
    avatar: "https://picsum.photos/seed/marcus/48/48",
    quote: "Being able to switch models mid-conversation without losing context is a game-changer.",
    stars: 5,
  },
  {
    name: "Priya R.",
    role: "Content Strategist",
    avatar: "https://picsum.photos/seed/priya/48/48",
    quote: "The streaming responses feel so natural. It's the closest thing to talking to a real assistant.",
    stars: 5,
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["1,000 credits/mo", "All chat models", "5 images/day", "Community support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    features: ["20,000 credits/mo", "Unlimited image generation", "Video Studio access", "Priority speed", "API access"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29.99",
    period: "/month",
    features: ["80,000 shared credits", "5 seats included", "Shared workspaces", "Admin dashboard", "Dedicated support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function LandingPage() {
  const typed = useTypewriter(HERO_PROMPTS);
  const [modelIdx, setModelIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setModelIdx(i => (i + 1) % MODELS.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#0a0a0f", color: "#F9FAFB", fontFamily: "var(--font-inter, Inter, sans-serif)" }}>

      {/* ── NAV ── */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md" style={{ background: "rgba(10,10,15,0.8)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">AnetAIS</span>
        </div>
        <div className="hidden items-center gap-7 text-sm md:flex" style={{ color: "#9CA3AF" }}>
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          <a href="#testimonials" className="transition-colors hover:text-white">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm transition-colors hover:text-white md:block" style={{ color: "#9CA3AF" }}>Sign in</Link>
          <Link
            href="/register"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)" }} />
          <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)" }} />
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium" style={{ border: "1px solid rgba(99,102,241,0.35)", background: "rgba(99,102,241,0.08)", color: "#A5B4FC" }}>
          <Sparkles className="h-3.5 w-3.5" />
          Powered by 10+ leading AI models
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Every AI model.{" "}
          <span style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            One platform.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "#9CA3AF" }}>
          Chat, generate images, create videos, and process media — all powered by the world's best AI models in a single unified workspace.
        </p>

        {/* Animated prompt bar */}
        <div className="mt-10 flex w-full max-w-xl items-center gap-3 rounded-2xl border px-5 py-4 text-left" style={{ border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}>
          <Sparkles className="h-5 w-5 flex-shrink-0" style={{ color: "#6366F1" }} />
          <span className="flex-1 text-sm" style={{ color: "#D1D5DB" }}>
            {typed}
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" style={{ background: "#6366F1" }} />
          </span>
          <div className="rounded-lg px-3 py-1.5 text-xs font-medium text-white" style={{ background: "#6366F1" }}>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* Model carousel */}
        <div className="mt-5 flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
          <span>Currently using</span>
          <span className="rounded-full border px-3 py-1 text-xs font-semibold transition-all" style={{ border: "1px solid rgba(99,102,241,0.40)", background: "rgba(99,102,241,0.10)", color: "#A5B4FC" }}>
            {MODELS[modelIdx]}
          </span>
          <span>and {MODELS.length - 1} more</span>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
            style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", boxShadow: "0 4px 30px rgba(99,102,241,0.4)" }}
          >
            Start for free
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-semibold transition-all hover:border-indigo-500/50 hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#E5E7EB" }}
          >
            <Play className="h-4 w-4" />
            Live demo
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center gap-6 text-sm" style={{ color: "#6B7280" }}>
          <div className="flex -space-x-2">
            {["u1","u2","u3","u4"].map(s => (
              <img key={s} src={`https://picsum.photos/seed/${s}/28/28`} className="h-7 w-7 rounded-full border-2 object-cover" style={{ borderColor: "#0a0a0f" }} alt="" />
            ))}
          </div>
          <span>Trusted by <strong style={{ color: "#E5E7EB" }}>12,000+</strong> creators</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { label: "AI Models", value: 12, suffix: "+" },
            { label: "Images Generated", value: 2400000, suffix: "+" },
            { label: "Active Users", value: 12000, suffix: "+" },
            { label: "Uptime", value: 99, suffix: ".9%" },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#6366F1,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm" style={{ color: "#6B7280" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium" style={{ background: "rgba(99,102,241,0.10)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.25)" }}>
              <Layers className="h-3.5 w-3.5" />
              Everything you need
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">One workspace for all AI</h2>
            <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "#9CA3AF" }}>
              Stop juggling 5 different AI tools. AnetAIS brings chat, image, video, and media processing into one beautiful interface.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 30% 30%, ${f.color}10 0%, transparent 60%)` }} />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${f.color}18` }}>
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO PREVIEW ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
            {/* Window bar */}
            <div className="flex items-center gap-2 border-b px-5 py-3.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <div className="ml-4 flex-1 rounded-md px-3 py-1 text-center text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#6B7280" }}>
                anetais.app/chat
              </div>
            </div>
            {/* Fake chat UI */}
            <div className="p-6 md:p-10">
              <div className="flex flex-col gap-5">
                <div className="flex justify-end">
                  <div className="max-w-sm rounded-2xl rounded-tr-sm px-4 py-3 text-sm" style={{ background: "#6366F1", color: "white" }}>
                    Explain quantum entanglement like I'm 10 years old
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="max-w-lg rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed" style={{ background: "rgba(255,255,255,0.06)", color: "#E5E7EB" }}>
                    Imagine you have two magic coins. No matter how far apart you put them — even on opposite sides of the universe — when you flip one, the other <em>instantly</em> lands on the opposite side. That's quantum entanglement: two particles connected by an invisible thread that doesn't care about distance. ✨
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-sm rounded-2xl rounded-tr-sm px-4 py-3 text-sm" style={{ background: "#6366F1", color: "white" }}>
                    Now generate an image of those magic coins in space
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="overflow-hidden rounded-2xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <img src="https://picsum.photos/seed/space5/320/180" alt="Generated" className="h-40 w-72 object-cover" />
                    <div className="px-4 py-2 text-xs" style={{ color: "#9CA3AF" }}>Generated with Qwen Image · 1024×1024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-10 text-sm uppercase tracking-widest" style={{ color: "#4B5563" }}>Works with all leading providers</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["OpenAI", "Anthropic", "Google", "DeepSeek", "xAI", "Alibaba Cloud", "Mistral"].map(name => (
              <span key={name} className="text-sm font-semibold" style={{ color: "#374151" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold">Loved by creators</h2>
            <p className="mt-3 text-base" style={{ color: "#9CA3AF" }}>Real words from real users</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="flex flex-col gap-4 rounded-2xl border p-6" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: "#F59E0B" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <img src={t.avatar} className="h-9 w-9 rounded-full object-cover" alt={t.name} />
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
            <h2 className="text-4xl font-bold">Simple pricing</h2>
            <p className="mt-3 text-base" style={{ color: "#9CA3AF" }}>Start free. Scale when you're ready.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-2xl border p-7"
                style={{
                  border: plan.highlight ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  background: plan.highlight ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.02)",
                  boxShadow: plan.highlight ? "0 0 40px rgba(99,102,241,0.15)" : undefined,
                }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                    Most Popular
                  </div>
                )}
                <div className="mb-1 text-base font-semibold">{plan.name}</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="mb-1 text-sm" style={{ color: "#6B7280" }}>{plan.period}</span>
                </div>
                <ul className="my-7 flex flex-col gap-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#6366F1" }} />
                      <span style={{ color: "#D1D5DB" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: plan.highlight ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(255,255,255,0.06)",
                    color: plan.highlight ? "white" : "#E5E7EB",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  {plan.cta}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl p-12 text-center" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.20) 50%, rgba(236,72,153,0.15) 100%)", border: "1px solid rgba(99,102,241,0.25)" }}>
          <div className="mb-4 flex justify-center">
            <Sparkles className="h-10 w-10" style={{ color: "#A78BFA" }} />
          </div>
          <h2 className="text-4xl font-bold md:text-5xl">Ready to create?</h2>
          <p className="mx-auto mt-4 max-w-md text-base" style={{ color: "#9CA3AF" }}>
            Join 12,000+ creators already using AnetAIS. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", boxShadow: "0 4px 30px rgba(99,102,241,0.5)" }}
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: "#9CA3AF" }}>
              Already have an account? Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t px-6 py-10" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">AnetAIS</span>
          </div>
          <div className="flex gap-6 text-xs" style={{ color: "#6B7280" }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Status</span>
            <span>Docs</span>
          </div>
          <p className="text-xs" style={{ color: "#4B5563" }}>© 2025 AnetAIS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

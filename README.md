# AnetAIS

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-green)

AnetAIS is a multi-provider AI SaaS platform UI mockup — a dark-themed dashboard for chat, image generation, video generation, AI utility tools, and usage-based billing, modeled after a real product reference. This is a **UI/UX prototype**: all data is mocked and held in client-side React state — there's no backend, database, or real model calls.

## Modules

- **Chat** — multi-provider model picker (Bailian, Anthropic, Google, xAI, Doubao, OpenAI, DeepSeek, Grok), per-chat threads, assistant marketplace with persona-based greetings, FAQ shortcuts, a generation-params popover (temperature, top_p, presence/frequency penalty), and a collapsible chat list with live search.
- **Image Studio** — prompt-to-image flow with model/size/count controls, an Explore gallery, and a working "My Creations" tab that fills in as you generate.
- **Video Studio** — text-to-video and image-to-video modes, aspect ratio/duration/advanced settings (CFG scale, negative prompt, sub-model), and a generated-video sidebar with a mock player.
- **AI Tools** — Remove Background tool with upload → process → result flow, plus a History tab of past results.
- **Billing** — usage dashboard (Used Quota / RPM / TPM) wired to a shared `UsageContext` that updates in real time as you use Chat/Image/Video, a compute-credits usage table, and a Plans & Pricing tab (Free / Pro / Team).
- **Account** — profile panel reachable from the sidebar avatar, with session/message stats and profile detail editing.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4
- [lucide-react](https://lucide.dev/) for icons

All interactivity (chat threads, generation flows, toasts, usage tracking) is local client state — no API routes or persistence layer.

## License

MIT

## Getting started

> **Node version:** this project needs Node **≥ 20.9** (Next.js 16 requirement).

```bash
git clone https://github.com/chanvandaneb/anetais.git
cd anetais
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/chat`.

## Project structure

```
src/
  app/
    chat/             Chat module
    image-studio/      Image Studio module
    video-studio/       Video Studio module
    tools/             AI Tools (Remove Background)
    billing/           Usage + Plans
    account/           Profile / account settings
  components/
    layout/            Sidebar, AppShell, ProfileMenu
    chat/               ModelPicker, GenerationParams
    ui/                 Card, IconButton, Slider, Toast, UsageContext
  lib/
    mock-data.ts        Mock chats, providers, assistants, plans, gallery data
    utils.ts            cn() class-merging helper
```

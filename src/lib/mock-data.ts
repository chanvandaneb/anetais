export type ChatItem = {
  id: string;
  title: string;
  model: string;
  timestamp: string;
};

export const mockChats: ChatItem[] = [
  { id: "1", title: "Chit chat", model: "gemini-flash-latest", timestamp: "22:58" },
  { id: "2", title: "Refactor auth flow", model: "gpt-oss-20b", timestamp: "12-12" },
  { id: "3", title: "Marketing copy ideas", model: "deepseek-v3", timestamp: "12-11" },
  { id: "4", title: "Recipe for dinner", model: "claude-sonnet-4.6", timestamp: "12-10" },
  { id: "5", title: "Trip planning to Kyoto", model: "grok-4", timestamp: "12-08" },
];

export type AIModel = {
  id: string;
  name: string;
  label: string;
  provider: string;
  color: string;       // brand accent
  bg: string;         // logo bg
  tag?: string;       // "Latest" | "Fast" | "Vision" etc.
  description: string;
};

export const AI_MODELS: AIModel[] = [
  // Anthropic
  { id: "claude-opus-5",        name: "claude-opus-5",        label: "Claude Opus 5",       provider: "Anthropic", color: "#D97757", bg: "#2A1F1A", tag: "Powerful",  description: "Most capable Claude model for complex tasks" },
  { id: "claude-sonnet-5",      name: "claude-sonnet-5",      label: "Claude Sonnet 5",     provider: "Anthropic", color: "#D97757", bg: "#2A1F1A", tag: "Latest",    description: "Balanced performance and speed" },
  { id: "claude-haiku-4-5",     name: "claude-haiku-4-5",     label: "Claude Haiku 4.5",    provider: "Anthropic", color: "#D97757", bg: "#2A1F1A", tag: "Fast",      description: "Lightning-fast for everyday tasks" },
  // OpenAI
  { id: "gpt-4o",               name: "gpt-4o",               label: "GPT-4o",              provider: "OpenAI",    color: "#10A37F", bg: "#0D2119", tag: "Vision",    description: "Multimodal flagship with vision" },
  { id: "gpt-4o-mini",          name: "gpt-4o-mini",          label: "GPT-4o Mini",         provider: "OpenAI",    color: "#10A37F", bg: "#0D2119", tag: "Fast",      description: "Affordable and capable everyday model" },
  { id: "o3",                   name: "o3",                   label: "o3",                  provider: "OpenAI",    color: "#10A37F", bg: "#0D2119", tag: "Reasoning", description: "Advanced reasoning and problem-solving" },
  // Google
  { id: "gemini-2.5-pro",       name: "gemini-2.5-pro",       label: "Gemini 2.5 Pro",      provider: "Google",    color: "#4285F4", bg: "#0D1A2E", tag: "Latest",    description: "Google's most capable thinking model" },
  { id: "gemini-2.5-flash",     name: "gemini-2.5-flash",     label: "Gemini 2.5 Flash",    provider: "Google",    color: "#4285F4", bg: "#0D1A2E", tag: "Fast",      description: "Fastest Gemini with great quality" },
  { id: "gemini-flash-latest",  name: "gemini-flash-latest",  label: "Gemini Flash",        provider: "Google",    color: "#4285F4", bg: "#0D1A2E",                   description: "Efficient and versatile" },
  // xAI
  { id: "grok-4",               name: "grok-4",               label: "Grok 4",              provider: "xAI",       color: "#FFFFFF", bg: "#111111", tag: "Latest",    description: "xAI's most powerful model" },
  { id: "grok-3-mini",          name: "grok-3-mini",          label: "Grok 3 Mini",         provider: "xAI",       color: "#FFFFFF", bg: "#111111", tag: "Fast",      description: "Quick and efficient reasoning" },
  // DeepSeek
  { id: "deepseek-v3",          name: "deepseek-v3",          label: "DeepSeek V3",         provider: "DeepSeek",  color: "#4D6FFF", bg: "#0D1433", tag: "Open",      description: "Open-source frontier model" },
  { id: "deepseek-r2",          name: "deepseek-r2",          label: "DeepSeek R2",         provider: "DeepSeek",  color: "#4D6FFF", bg: "#0D1433", tag: "Reasoning", description: "Advanced chain-of-thought reasoning" },
];

// Keep backward compat
export type Provider = { id: string; name: string; subtitle?: string };
export const providers: Provider[] = [
  { id: "anthropic", name: "Anthropic" },
  { id: "openai",    name: "OpenAI"    },
  { id: "google",    name: "Google"    },
  { id: "xai",       name: "xAI"       },
  { id: "deepseek",  name: "DeepSeek"  },
];

export type Assistant = {
  id: string;
  emoji: string;
  name: string;
  description: string;
  greeting: string;
};

export const assistants: Assistant[] = [
  {
    id: "turtle-soup",
    emoji: "🐢",
    name: "Turtle Soup Host",
    description: "Hosts lateral-thinking mystery puzzles and gives you yes/no clues.",
    greeting:
      "Welcome to Turtle Soup! I'll describe a strange scenario, and you ask yes/no questions to uncover the truth. Ready to begin?",
  },
  {
    id: "gourmet",
    emoji: "🍜",
    name: "Gourmet Reviewer",
    description: "Writes witty, detailed restaurant and recipe reviews on demand.",
    greeting:
      "Bon appétit! Tell me a dish, restaurant, or recipe and I'll cook up a witty, detailed review.",
  },
  {
    id: "academic",
    emoji: "📚",
    name: "Academic Writing Assistant",
    description: "Helps polish essays, citations, and research papers with rigor.",
    greeting:
      "Hi, I'm your academic writing assistant. Share a draft, thesis, or citation question and I'll help tighten it up.",
  },
  {
    id: "minecraft",
    emoji: "⛏️",
    name: "Minecraft Senior Developer",
    description: "Builds redstone contraptions and writes plugin code for your server.",
    greeting:
      "Yo! Tell me what you're building — a redstone build, a Forge/Fabric mod, or a server plugin — and let's get to work.",
  },
];

export const faqs: string[] = [
  "Does it support local language models?",
  "What is the pricing for AnetAI?",
];

export const faqAnswers: Record<string, string> = {
  "Does it support local language models?":
    "Yes — AnetAIS supports connecting local models via Ollama or LM Studio, in addition to all major cloud providers like OpenAI, Anthropic, Google, and DeepSeek. You can configure local endpoints from Settings → Model Providers.",
  "What is the pricing for AnetAI?":
    "AnetAIS uses a credit-based system. The free tier includes 1,000 credits per month, and paid plans start at $9.99/month for 20,000 credits, with pay-as-you-go top-ups available for image and video generation.",
};

export type GalleryImage = {
  id: string;
  src: string;
  prompt: string;
  tall?: boolean;
  ratio?: string;
  gradient?: string;
  processing?: boolean;
};

const GALLERY_ITEMS: { seed: string; prompt: string; tall?: boolean }[] = [
  { seed: "nature1",    prompt: "Misty mountain range at golden hour" },
  { seed: "city2",      prompt: "Neon-lit Tokyo street at night", tall: true },
  { seed: "ocean3",     prompt: "Turquoise ocean waves crashing on white sand" },
  { seed: "forest4",    prompt: "Ancient redwood forest with light rays" },
  { seed: "space5",     prompt: "Nebula swirling with violet and gold dust" },
  { seed: "arch6",      prompt: "Minimalist white architecture in desert", tall: true },
  { seed: "food7",      prompt: "Artisan ramen bowl with soft-boiled egg" },
  { seed: "portrait8",  prompt: "Cinematic portrait in warm studio light" },
  { seed: "abstract9",  prompt: "Fluid ink art in electric blue and magenta" },
  { seed: "macro10",    prompt: "Macro dewdrop on spider web at sunrise", tall: true },
];

export const galleryImages: GalleryImage[] = GALLERY_ITEMS.map((item, i) => ({
  id: `img-${i}`,
  src: `https://picsum.photos/seed/${item.seed}/600/${item.tall ? 800 : 600}`,
  prompt: item.prompt,
  tall: item.tall,
}));

const CREATION_SEEDS = [
  "gen1","gen2","gen3","gen4","gen5","gen6","gen7","gen8","gen9","gen10",
  "gen11","gen12","gen13","gen14","gen15",
];
let _creationIdx = 0;
export function randomCreationImage(tall?: boolean): GalleryImage {
  const seed = CREATION_SEEDS[_creationIdx % CREATION_SEEDS.length];
  _creationIdx++;
  const w = 600;
  const h = tall ? 800 : 600;
  return {
    id: `creation-${Date.now()}-${_creationIdx}`,
    src: `https://picsum.photos/seed/${seed}/${w}/${h}`,
    prompt: "",
    tall,
  };
}

export type BillingRow = {
  id: string;
  createdAt: string;
  type: string;
  model: string;
  totalTokens: number;
  credits: number;
};

export const billingRows: BillingRow[] = [];

export const sidebarUser = {
  name: "Connor N",
  handle: "connor6162",
  initials: "CO",
  sessions: 2,
  messages: 7,
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  credits: string;
  highlight?: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    credits: "1,000 credits / mo",
    features: ["Access to all chat models", "5 images / day", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "/month",
    credits: "20,000 credits / mo",
    highlight: true,
    features: [
      "Everything in Free",
      "Unlimited image generation",
      "Video Studio access",
      "Priority response speed",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$29.99",
    period: "/month",
    credits: "80,000 credits / mo, shared",
    features: [
      "Everything in Pro",
      "5 seats included",
      "Shared project workspaces",
      "Usage analytics & admin controls",
    ],
  },
];

export const gradientPalette = [
  "from-pink-500 via-fuchsia-500 to-purple-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-cyan-400 via-blue-500 to-[#06B6D4]",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-violet-500 via-purple-500 to-fuchsia-600",
  "from-lime-400 via-green-500 to-emerald-600",
];

export function randomGradient() {
  return gradientPalette[Math.floor(Math.random() * gradientPalette.length)];
}

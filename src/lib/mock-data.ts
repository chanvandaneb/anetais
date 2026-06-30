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

export type Provider = {
  id: string;
  name: string;
  subtitle?: string;
};

export const providers: Provider[] = [
  { id: "bailian", name: "Bailian", subtitle: "阿里云百炼" },
  { id: "anthropic", name: "Anthropic" },
  { id: "google", name: "Google" },
  { id: "xai", name: "xAI" },
  { id: "doubao", name: "Doubao", subtitle: "豆包" },
  { id: "openai", name: "OpenAI" },
  { id: "deepseek", name: "DeepSeek" },
  { id: "grok", name: "Grok", subtitle: "xAI" },
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
  gradient: string;
  tall?: boolean;
};

const gradients = [
  "from-pink-500 via-fuchsia-500 to-purple-600",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-violet-500 via-purple-500 to-fuchsia-600",
  "from-lime-400 via-green-500 to-emerald-600",
  "from-red-500 via-rose-500 to-pink-600",
  "from-sky-400 via-indigo-500 to-violet-600",
  "from-yellow-400 via-amber-500 to-orange-600",
  "from-teal-400 via-cyan-500 to-blue-600",
];

export const galleryImages: GalleryImage[] = gradients.map((gradient, i) => ({
  id: `img-${i}`,
  gradient,
  tall: i % 3 === 1,
}));

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
  "from-cyan-400 via-blue-500 to-indigo-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-violet-500 via-purple-500 to-fuchsia-600",
  "from-lime-400 via-green-500 to-emerald-600",
];

export function randomGradient() {
  return gradientPalette[Math.floor(Math.random() * gradientPalette.length)];
}

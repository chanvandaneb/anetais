"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare, Image as ImageIcon, Video, Wand2,
  Sparkles, ArrowRight, Play, Zap, Search,
  Heart, Download, Share2, Eye, X, Copy,
  BookmarkPlus, ChevronLeft, ChevronRight, ChevronUp,
  Clock, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── AI-style image via Unsplash ── */
function aiImg(_prompt: string, w: number, h: number, seed: number) {
  return `https://picsum.photos/seed/ai${seed}/${w}/${h}`;
}

/* ── Feature shortcut cards ── */
const TOOLS = [
  { href: "/chat",         icon: MessageSquare, label: "Chat",         sub: "10+ AI models",      color: "#1D7BFF", bg: "rgba(29,123,255,0.12)",  badge: null  },
  { href: "/image-studio", icon: ImageIcon,     label: "Image Studio", sub: "8 style presets",    color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",  badge: null  },
  { href: "/video-studio", icon: Video,         label: "Video Studio", sub: "Multi-stage render", color: "#EC4899", bg: "rgba(236,72,153,0.12)",  badge: "New" },
  { href: "/tools",        icon: Wand2,         label: "AI Tools",     sub: "Remove background",  color: "#10B981", bg: "rgba(16,185,129,0.12)",  badge: null  },
  { href: "/chat",         icon: Sparkles,      label: "Assistants",   sub: "4 expert personas",  color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  badge: null  },
];

/* ── Filter tabs ── */
const TABS = ["Discover", "Images", "Videos", "Trending", "New", "Cinematic", "Anime", "Portrait", "Landscape"];

type GItem = { prompt: string; tall: boolean; ratio?: string; seed: number; likes: number; views: string; author: string; model?: string; createdAt?: string; status?: "completed" | "processing" | "failed" };

/* ── Per-tab content ── */
const TAB_CONTENT: Record<string, GItem[]> = {
  Discover: [
    { prompt: "Neon-lit Tokyo street at night, cyberpunk style, rain reflections, ultra detailed",              tall: true,  ratio: "3/4",  seed: 101, likes: 2841, views: "18.2k", author: "alex_gen" },
    { prompt: "Misty mountain range at golden hour, aerial view, dramatic clouds",                              tall: false, ratio: "1/1",  seed: 102, likes: 1203, views: "9.1k",  author: "luna_ai"  },
    { prompt: "Cinematic portrait woman warrior, dramatic lighting, photorealistic",                            tall: true,  ratio: "9/16", seed: 103, likes: 4120, views: "31k",   author: "kai_flux"  },
    { prompt: "Turquoise ocean waves crashing on white sand beach, paradise island, drone view",               tall: false, ratio: "4/3",  seed: 104, likes: 987,  views: "6.4k",  author: "vista_ai" },
    { prompt: "Nebula swirling with violet and gold cosmic dust, deep space, 8k render",                      tall: false, ratio: "1/1",  seed: 105, likes: 3340, views: "24k",   author: "cosmos_x" },
    { prompt: "Minimalist white concrete architecture in desert landscape, brutalist, sharp shadows",           tall: false, ratio: "16/9", seed: 106, likes: 1567, views: "11k",   author: "arc_lab"  },
    { prompt: "Artisan ramen bowl with soft-boiled egg, sesame, scallions, top-down food photography",        tall: false, ratio: "1/1",  seed: 107, likes: 2200, views: "16k",   author: "foodviz"  },
    { prompt: "Ancient redwood forest, god rays, morning mist, green moss, fantasy atmosphere",                tall: true,  ratio: "3/4",  seed: 108, likes: 3890, views: "28k",   author: "wild_gen" },
    { prompt: "Liquid chrome fluid art, electric blue and silver, abstract macro photography",                 tall: false, ratio: "4/3",  seed: 109, likes: 2760, views: "20k",   author: "fluid_ai" },
    { prompt: "Macro dewdrop on spider web at sunrise, rainbow refraction, hyper-detailed",                   tall: true,  ratio: "9/16", seed: 110, likes: 5100, views: "42k",   author: "macro_x"  },
    { prompt: "Futuristic megacity at dusk, flying cars, holographic ads, blade runner aesthetic",             tall: false, ratio: "1/1",  seed: 111, likes: 4300, views: "35k",   author: "neo_gen"  },
    { prompt: "Impressionist oil painting style old harbour, boats, golden sunset reflections",                tall: false, ratio: "16/9", seed: 112, likes: 1890, views: "13k",   author: "art_ai"   },
    { prompt: "Watercolor sunrise over emerald rice terraces, Bali, morning fog",                              tall: true,  ratio: "3/4",  seed: 113, likes: 3100, views: "22k",   author: "travel_x" },
    { prompt: "Hyper-detailed 3D crystal sphere on dark surface, refraction, caustics, studio light",         tall: false, ratio: "1/1",  seed: 114, likes: 2450, views: "18k",   author: "cgi_lab"  },
    { prompt: "Surreal floating island with waterfalls, fantasy world, epic clouds, concept art",              tall: false, ratio: "4/3",  seed: 115, likes: 6200, views: "51k",   author: "dream_ai" },
    { prompt: "Deep sea bioluminescent jellyfish, dark ocean, ethereal blue glow, ultra HD",                  tall: true,  ratio: "9/16", seed: 116, likes: 3800, views: "29k",   author: "ocean_x"  },
    { prompt: "Snow leopard in mountain blizzard, wildlife photography, telephoto, bokeh background",          tall: false, ratio: "1/1",  seed: 117, likes: 4700, views: "38k",   author: "wild_ai"  },
    { prompt: "Abstract geometric low-poly landscape at sunset, polygon art, gradient sky",                   tall: false, ratio: "16/9", seed: 118, likes: 1650, views: "12k",   author: "poly_gen" },
  ],
  Images: [
    { prompt: "Studio portrait of a woman with dramatic side lighting, film grain, monochrome",               tall: true,  ratio: "3/4",  seed: 201, likes: 3210, views: "24k",   author: "lens_ai"  },
    { prompt: "Hyperrealistic red rose with morning dew drops, macro photography, black background",          tall: false, ratio: "1/1",  seed: 202, likes: 2870, views: "21k",   author: "flora_x"  },
    { prompt: "Golden hour cityscape from rooftop, silhouette skyline, orange sky",                          tall: false, ratio: "16/9", seed: 203, likes: 4500, views: "36k",   author: "urban_ai" },
    { prompt: "Detailed illustration of dragon perched on castle, fantasy art, mist valley below",            tall: false, ratio: "4/3",  seed: 204, likes: 5900, views: "48k",   author: "myth_gen" },
    { prompt: "Crystalline ice cave glowing blue, arctic, explorer silhouette, expedition",                   tall: false, ratio: "1/1",  seed: 205, likes: 3400, views: "26k",   author: "polar_x"  },
    { prompt: "Neon signs and rain reflections on wet asphalt, Hong Kong night photography",                  tall: true,  ratio: "9/16", seed: 206, likes: 4100, views: "33k",   author: "noir_ai"  },
    { prompt: "Intricate mandala pattern, vibrant colors, sacred geometry, digital art",                      tall: false, ratio: "1/1",  seed: 207, likes: 2100, views: "16k",   author: "sacred_x" },
    { prompt: "Lush tropical greenhouse interior, glass ceiling, exotic plants, botanical garden",            tall: false, ratio: "4/3",  seed: 208, likes: 1980, views: "15k",   author: "green_ai" },
    { prompt: "Vintage motorcycle on desert highway at sunset, retro chrome, dust clouds",                    tall: false, ratio: "16/9", seed: 209, likes: 3700, views: "29k",   author: "retro_x"  },
    { prompt: "Ethereal fairy sitting on mushroom in enchanted forest, soft glow, fantasy art",              tall: true,  ratio: "3/4",  seed: 210, likes: 6100, views: "50k",   author: "fae_gen"  },
    { prompt: "Aerochrome infrared photography style, trees in red and pink, surreal landscape",              tall: false, ratio: "1/1",  seed: 211, likes: 2800, views: "21k",   author: "infra_ai" },
    { prompt: "Origami crane flock transforming into real birds, surreal composite photography",              tall: false, ratio: "4/3",  seed: 212, likes: 4200, views: "34k",   author: "paper_x"  },
  ],
  Videos: [
    { prompt: "Time-lapse of storm clouds rolling over mountain peaks, epic sky, motion blur",               tall: false, ratio: "16/9", seed: 301, likes: 7200, views: "62k",   author: "storm_ai" },
    { prompt: "Slow motion water splash in neon light, high speed photography, colorful droplets",           tall: false, ratio: "1/1",  seed: 302, likes: 4800, views: "39k",   author: "splash_x" },
    { prompt: "Cinematic drone fly-through ancient Greek ruins at sunrise, golden light sweeping",            tall: false, ratio: "16/9", seed: 303, likes: 5400, views: "45k",   author: "drone_ai" },
    { prompt: "Particle explosion of a flower blooming, abstract motion art, slow motion",                   tall: false, ratio: "1/1",  seed: 304, likes: 3900, views: "31k",   author: "bloom_x"  },
    { prompt: "Loop animation cyberpunk city rain, neon reflections on wet street, night",                   tall: false, ratio: "16/9", seed: 305, likes: 6800, views: "57k",   author: "cyber_ai" },
    { prompt: "Underwater world slow motion, coral reef, school of fish turning, sunbeams",                  tall: true,  ratio: "9/16", seed: 306, likes: 4100, views: "33k",   author: "reef_x"   },
    { prompt: "Abstract fluid simulation, golden ink in water, hypnotic loop, 4k",                          tall: false, ratio: "4/3",  seed: 307, likes: 3300, views: "26k",   author: "ink_ai"   },
    { prompt: "Aurora borealis dancing over frozen lake, reflection, timelapse, Finland winter",             tall: false, ratio: "16/9", seed: 308, likes: 8900, views: "74k",   author: "aurora_x" },
    { prompt: "Sand dune shifting in desert wind, minimalist, slow motion, golden light",                    tall: false, ratio: "4/3",  seed: 309, likes: 2700, views: "20k",   author: "sand_ai"  },
  ],
  Trending: [
    { prompt: "Surreal portrait with flowers blooming from face, editorial fashion photography",              tall: true,  ratio: "3/4",  seed: 401, likes: 12400, views: "98k",  author: "bloom_ai" },
    { prompt: "AI-generated cityscape at night with glowing purple skyscrapers, vaporwave",                  tall: false, ratio: "16/9", seed: 402, likes: 9800,  views: "81k",  author: "vapor_x"  },
    { prompt: "Hyperrealistic robot hand holding delicate butterfly, contrast, chrome and nature",            tall: true,  ratio: "9/16", seed: 403, likes: 15300, views: "124k", author: "mech_ai"  },
    { prompt: "Studio Ghibli inspired meadow scene at golden hour, anime style, windmill farm",              tall: false, ratio: "4/3",  seed: 404, likes: 11200, views: "91k",  author: "ghibli_x" },
    { prompt: "Ultra-detailed close-up human eye with galaxy reflection, macro, surreal",                    tall: false, ratio: "1/1",  seed: 405, likes: 18700, views: "152k", author: "eye_gen"  },
    { prompt: "Dramatic storm approaching over Great Plains farm, lightning, ominous sky",                   tall: false, ratio: "16/9", seed: 406, likes: 8400,  views: "69k",  author: "storm_x"  },
    { prompt: "Neon jellyfish forest underwater city, sci-fi concept art, bioluminescent",                   tall: false, ratio: "1/1",  seed: 407, likes: 13600, views: "111k", author: "jelly_ai" },
    { prompt: "Burning rose with frozen petals, fire and ice contrast, dramatic black background",            tall: true,  ratio: "3/4",  seed: 408, likes: 10100, views: "83k",  author: "duality_x"},
    { prompt: "Ancient temple ruins overgrown by jungle, Angkor Wat style, misty morning",                   tall: false, ratio: "4/3",  seed: 409, likes: 7300,  views: "60k",  author: "ruin_ai"  },
  ],
  New: [
    { prompt: "Photorealistic futuristic Tokyo 2077, holographic billboards, crowded street",                 tall: false, ratio: "16/9", seed: 501, likes: 340,  views: "1.2k",  author: "new_gen1"  },
    { prompt: "Marble bust sculpture with colorful graffiti, classical meets street art",                    tall: false, ratio: "1/1",  seed: 502, likes: 210,  views: "890",   author: "artsy_ai"  },
    { prompt: "Crystal palace interior, prismatic light, gothic arches, photorealistic",                     tall: true,  ratio: "3/4",  seed: 503, likes: 560,  views: "2.3k",  author: "crystal_x" },
    { prompt: "Solarpunk rooftop garden city, sustainable architecture, green utopia, morning",              tall: false, ratio: "4/3",  seed: 504, likes: 180,  views: "740",   author: "solar_ai"  },
    { prompt: "Dark academia library at midnight, candles, floating books, mystery atmosphere",              tall: false, ratio: "1/1",  seed: 505, likes: 890,  views: "3.7k",  author: "books_x"   },
    { prompt: "Mechanical flower blooming in slow motion, steampunk gears, brass and copper",               tall: true,  ratio: "9/16", seed: 506, likes: 420,  views: "1.8k",  author: "steam_ai"  },
    { prompt: "Minimalist Japanese Zen garden in rain, raked sand, moss stone, serene",                     tall: false, ratio: "4/3",  seed: 507, likes: 300,  views: "1.1k",  author: "zen_gen"   },
    { prompt: "Retrofuturism 1960s space age kitchen interior, pastel colors, atomic design",               tall: false, ratio: "16/9", seed: 508, likes: 150,  views: "610",   author: "retro_ai"  },
    { prompt: "Bioluminescent forest at night, glowing mushrooms and ferns, fantasy nature",                tall: true,  ratio: "3/4",  seed: 509, likes: 670,  views: "2.8k",  author: "bio_x"     },
  ],
  Cinematic: [
    { prompt: "Epic war scene at sunset, soldiers silhouettes, smoke and fire, IMAX cinematic",             tall: false, ratio: "16/9", seed: 601, likes: 8900,  views: "73k",  author: "epic_ai"   },
    { prompt: "Noir detective office rainy night, venetian blind shadows, cigarette smoke, film grain",     tall: false, ratio: "4/3",  seed: 602, likes: 5400,  views: "44k",  author: "noir_x"    },
    { prompt: "Fantasy queen on throne room, dramatic light shafts, guards, cinematic shot",                tall: true,  ratio: "3/4",  seed: 603, likes: 7200,  views: "59k",  author: "royal_ai"  },
    { prompt: "Astronaut floating in deep space, earth reflection in visor, lonely, epic scale",            tall: false, ratio: "16/9", seed: 604, likes: 9100,  views: "75k",  author: "space_ai"  },
    { prompt: "Western cowboy at sunset on horseback, long shadows, dust trail, Sergio Leone style",       tall: false, ratio: "4/3",  seed: 605, likes: 6300,  views: "52k",  author: "west_x"    },
    { prompt: "Post-apocalyptic cityscape, overgrown ruins, lone survivor, orange haze, cinematic",        tall: false, ratio: "16/9", seed: 606, likes: 11200, views: "92k",  author: "post_ai"   },
    { prompt: "Underwater mermaid queen in sunken palace, cinematic, shafts of light, epic",               tall: true,  ratio: "9/16", seed: 607, likes: 7800,  views: "64k",  author: "sea_gen"   },
    { prompt: "Viking longship in northern storm, lightning, dramatic waves, painted sky",                  tall: false, ratio: "4/3",  seed: 608, likes: 6700,  views: "55k",  author: "viking_x"  },
    { prompt: "Final duel on volcano rim at dusk, two warriors, extreme backlight, silhouette",            tall: false, ratio: "1/1",  seed: 609, likes: 10400, views: "86k",  author: "duel_ai"   },
  ],
  Anime: [
    { prompt: "Anime girl in traditional kimono, cherry blossom festival, studio ghibli style",            tall: true,  ratio: "3/4",  seed: 701, likes: 14200, views: "115k", author: "ghibli_ai" },
    { prompt: "Shonen anime protagonist mid-battle, energy aura, dramatic pose, manga panel style",        tall: false, ratio: "1/1",  seed: 702, likes: 9800,  views: "80k",  author: "shonen_x"  },
    { prompt: "Cozy anime cafe scene, rain window, warm interior lighting, slice of life",                 tall: true,  ratio: "9/16", seed: 703, likes: 11500, views: "94k",  author: "cozy_ai"   },
    { prompt: "Magical girl transformation sequence, sparkles, pastel colors, shoujo art style",           tall: false, ratio: "4/3",  seed: 704, likes: 8700,  views: "71k",  author: "magic_x"   },
    { prompt: "Samurai anime warrior in bamboo forest, ink wash painting style, dramatic lighting",        tall: false, ratio: "1/1",  seed: 705, likes: 12300, views: "100k", author: "samurai_ai"},
    { prompt: "Anime mecha robot battle in futuristic Tokyo, giant explosion, sunset backdrop",            tall: false, ratio: "16/9", seed: 706, likes: 16700, views: "137k", author: "mecha_x"   },
    { prompt: "Ethereal anime spirit forest, white fox spirit, lanterns, Japanese mythology",              tall: true,  ratio: "3/4",  seed: 707, likes: 13400, views: "109k", author: "spirit_ai" },
    { prompt: "Chibi anime characters in fantasy RPG dungeon, cute monsters, kawaii style",               tall: false, ratio: "4/3",  seed: 708, likes: 7200,  views: "59k",  author: "chibi_x"   },
    { prompt: "Anime school rooftop at twilight, two characters, emotional scene, dramatic clouds",        tall: false, ratio: "1/1",  seed: 709, likes: 9100,  views: "74k",  author: "emo_ai"    },
  ],
  Portrait: [
    { prompt: "Dramatic chiaroscuro portrait, oil painting style, Renaissance master technique",           tall: true,  ratio: "3/4",  seed: 801, likes: 6700,  views: "55k",  author: "rennai_x"  },
    { prompt: "Ethereal portrait with floating flower petals, soft studio light, editorial fashion",       tall: true,  ratio: "9/16", seed: 802, likes: 8200,  views: "67k",  author: "petal_ai"  },
    { prompt: "Cyberpunk portrait, neon face paint, holographic tattoos, purple backlight",               tall: true,  ratio: "3/4",  seed: 803, likes: 10400, views: "85k",  author: "cyber_x"   },
    { prompt: "Elderly wise woman portrait, deep wrinkles, kind eyes, natural morning light",             tall: false, ratio: "1/1",  seed: 804, likes: 5100,  views: "42k",  author: "elder_ai"  },
    { prompt: "Double exposure portrait with wolf, surreal composite, forest inside face",                tall: true,  ratio: "9/16", seed: 805, likes: 9800,  views: "80k",  author: "wolf_x"    },
    { prompt: "Avant-garde fashion editorial, geometric makeup, bold colors, Vogue style",               tall: true,  ratio: "3/4",  seed: 806, likes: 12100, views: "99k",  author: "vogue_ai"  },
    { prompt: "Child portrait in meadow, golden hour bokeh, candid, film grain, joyful",                 tall: false, ratio: "4/3",  seed: 807, likes: 4300,  views: "35k",  author: "gold_x"    },
    { prompt: "Male model with geometric shadow patterns, black and white, high contrast",                tall: true,  ratio: "3/4",  seed: 808, likes: 7600,  views: "62k",  author: "mono_ai"   },
    { prompt: "Portrait through frosted glass, blurred silhouette, mystery, minimalist",                 tall: false, ratio: "1/1",  seed: 809, likes: 6400,  views: "52k",  author: "glass_x"   },
  ],
  Landscape: [
    { prompt: "Vast lavender fields in Provence France, rolling hills, golden hour, aerial view",         tall: false, ratio: "16/9", seed: 901, likes: 9200,  views: "75k",  author: "provence_x"},
    { prompt: "Norwegian fjord at sunrise, mirror reflection, dramatic mountain peaks, fog",              tall: true,  ratio: "3/4",  seed: 902, likes: 11400, views: "93k",  author: "fjord_ai"  },
    { prompt: "Atacama Desert salt flats, starry night sky reflection, milky way, long exposure",        tall: false, ratio: "16/9", seed: 903, likes: 13700, views: "112k", author: "atacama_x" },
    { prompt: "Tuscan countryside rolling hills, cypress trees, winding road, golden light",            tall: false, ratio: "4/3",  seed: 904, likes: 8900,  views: "73k",  author: "tuscany_ai"},
    { prompt: "Iceland black sand beach, sea stacks, dramatic stormy sky, crashing waves",              tall: false, ratio: "16/9", seed: 905, likes: 10200, views: "84k",  author: "iceland_x" },
    { prompt: "Giant sequoia forest from below, cathedral trees, misty shafts of light",               tall: true,  ratio: "3/4",  seed: 906, likes: 7400,  views: "61k",  author: "sequoia_ai"},
    { prompt: "Patagonia mountain range at sunset, lone hiker, dramatic clouds, end of world",          tall: false, ratio: "16/9", seed: 907, likes: 12800, views: "105k", author: "patag_x"   },
    { prompt: "Cherry blossom tunnel path in Kyoto Japan, spring, soft pink petals falling",            tall: false, ratio: "4/3",  seed: 908, likes: 15300, views: "125k", author: "sakura_ai" },
    { prompt: "Sahara desert dunes at sunset, orange gold sand, lone camel caravan",                   tall: true,  ratio: "9/16", seed: 909, likes: 9600,  views: "79k",  author: "sahara_x"  },
    { prompt: "Canadian Rockies lake reflection at dawn, emerald water, wildflowers, mirror",          tall: false, ratio: "4/3",  seed: 910, likes: 11100, views: "91k",  author: "rocky_ai"  },
  ],
};

function formatLikes(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ── Detail Modal ── */
function DetailModal({ item, items, onClose, onNav }: {
  item: GItem;
  items: GItem[];
  onClose: () => void;
  onNav: (item: GItem) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const idx = items.indexOf(item);
  const related = items.filter((_, i) => i !== idx).slice(0, 6);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && idx > 0) onNav(items[idx - 1]);
      if (e.key === "ArrowRight" && idx < items.length - 1) onNav(items[idx + 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, items, onClose, onNav]);

  function copyPrompt() {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tags = item.prompt.split(",").map(t => t.trim().split(" ").slice(0, 2).join(" ")).slice(0, 5);
  const imgH = item.tall ? 520 : 360;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
          style={{ background: "rgba(0,0,0,0.40)" }}>
          <X className="h-4 w-4 text-white" />
        </button>

        {/* Left — image */}
        <div className="relative flex-shrink-0 w-[52%]" style={{ background: "#000" }}>
          {/* Prev / Next inside image panel */}
          {idx > 0 && (
            <button onClick={() => onNav(items[idx - 1])}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
              style={{ background: "rgba(0,0,0,0.45)" }}>
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}
          {idx < items.length - 1 && (
            <button onClick={() => onNav(items[idx + 1])}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
              style={{ background: "rgba(0,0,0,0.45)" }}>
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          )}
          <div className="absolute inset-0 animate-pulse" style={{ background: "var(--bg-muted)" }} />
          <img
            src={aiImg(item.prompt, 600, imgH, item.seed)}
            alt={item.prompt}
            className="relative h-full w-full object-cover"
            style={{ minHeight: 360 }}
          />
          {/* image counter */}
          <div className="absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.55)" }}>
            {idx + 1} / {items.length}
          </div>
        </div>

        {/* Right — details */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 border-b p-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
              {item.author.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>@{item.author}</p>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                <Clock className="h-3 w-3" /> <span>2 hours ago</span>
              </div>
            </div>
            <button className="ml-auto rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
              Follow
            </button>
          </div>

          <div className="flex flex-col gap-5 p-5">
            {/* Stats row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Eye className="h-4 w-4" /><span>{item.views}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Heart className="h-4 w-4" /><span>{formatLikes(item.likes + (liked ? 1 : 0))}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Download className="h-4 w-4" /><span>{formatLikes(Math.floor(item.likes * 0.3))}</span>
              </div>
            </div>

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
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                <Tag className="h-3 w-3" /> Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer hover:opacity-80"
                    style={{ background: "rgba(29,123,255,0.12)", color: "#1D7BFF", border: "1px solid rgba(29,123,255,0.25)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Model info */}
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(139,92,246,0.15)" }}>
                <Wand2 className="h-4 w-4" style={{ color: "#8B5CF6" }} />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>AI Image Studio</p>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Flux Pro · 1024×{item.tall ? "1536" : "1024"} · Steps 30</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <Link href="/image-studio"
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)", boxShadow: "0 4px 16px rgba(29,123,255,0.35)" }}>
                <Play className="h-4 w-4" /> Try this prompt
              </Link>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setLiked(v => !v)}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all"
                  style={{
                    background: liked ? "rgba(239,68,68,0.15)" : "var(--bg-muted)",
                    color: liked ? "#EF4444" : "var(--text-secondary)",
                    border: `1px solid ${liked ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
                  }}>
                  <Heart className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} />
                  {liked ? "Liked" : "Like"}
                </button>
                <button onClick={() => setSaved(v => !v)}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all"
                  style={{
                    background: saved ? "rgba(29,123,255,0.15)" : "var(--bg-muted)",
                    color: saved ? "#1D7BFF" : "var(--text-secondary)",
                    border: `1px solid ${saved ? "rgba(29,123,255,0.3)" : "var(--border)"}`,
                  }}>
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
                  {related.map((r, i) => (
                    <button key={i} onClick={() => onNav(r)}
                      className="relative overflow-hidden rounded-lg transition-opacity hover:opacity-80"
                      style={{ aspectRatio: "1", background: "var(--bg-muted)" }}>
                      <img src={aiImg(r.prompt, 120, 120, r.seed)} alt={r.prompt}
                        className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  completed:  { label: "Completed",  color: "#10B981", bg: "rgba(16,185,129,0.15)"  },
  processing: { label: "Processing", color: "#F59E0B", bg: "rgba(245,158,11,0.15)"  },
  failed:     { label: "Failed",     color: "#EF4444", bg: "rgba(239,68,68,0.15)"   },
};

function GalleryCard({ item, onClick }: { item: GItem; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const [liked, setLiked] = useState(false);
  const status = item.status ? STATUS_STYLE[item.status] : null;

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer"
      style={{ aspectRatio: item.ratio ?? "1 / 1", background: "var(--bg-muted)" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={item.status !== "failed" ? onClick : undefined}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 animate-pulse" style={{ background: "var(--bg-muted)" }} />

      {item.status === "failed" ? (
        /* Failed state */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: "var(--bg-muted)" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(239,68,68,0.15)" }}>
            <X className="h-5 w-5" style={{ color: "#EF4444" }} />
          </div>
          <p className="text-xs font-medium" style={{ color: "#EF4444" }}>Generation failed</p>
          <button className="mt-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:opacity-80"
            style={{ background: "#1D7BFF" }}>Retry</button>
        </div>
      ) : item.status === "processing" ? (
        /* Processing state */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--bg-muted)" }}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "rgba(245,158,11,0.3)", borderTopColor: "#F59E0B" }} />
          <div className="text-center">
            <p className="text-xs font-semibold" style={{ color: "#F59E0B" }}>Generating…</p>
            <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-tertiary)" }}>{item.model}</p>
          </div>
        </div>
      ) : (
        /* Normal image */
        <img
          src={aiImg(item.prompt, 400, 400, item.seed)}
          alt={item.prompt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Always-visible bottom stats */}
      {item.status !== "failed" && item.status !== "processing" && (
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 pt-8"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)" }}>
          <div className="flex items-center gap-2 text-[10px] text-white/70">
            <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{item.views}</span>
            <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{formatLikes(item.likes + (liked ? 1 : 0))}</span>
          </div>
        </div>
      )}


      {/* Hover overlay */}
      {item.status !== "failed" && item.status !== "processing" && (
        <div
          className="absolute inset-0 flex flex-col justify-between p-2.5 transition-opacity duration-200"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.10) 55%, transparent 100%)", opacity: hov ? 1 : 0 }}
        >
          <div className="flex justify-end gap-1.5">
            <button onClick={e => { e.stopPropagation(); setLiked(v => !v); }}
              className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
              style={{ background: liked ? "rgba(239,68,68,0.8)" : "rgba(255,255,255,0.15)" }}>
              <Heart className="h-3.5 w-3.5 text-white" fill={liked ? "white" : "none"} />
            </button>
            <button onClick={e => e.stopPropagation()} className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/25" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Download className="h-3.5 w-3.5 text-white" />
            </button>
            <button onClick={e => e.stopPropagation()} className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-colors hover:bg-white/25" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Share2 className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-[11px] font-medium leading-snug text-white line-clamp-2 mb-1.5">{item.prompt}</p>
            <div className="flex items-center gap-2">
              <button onClick={e => e.stopPropagation()} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                style={{ background: "rgba(29,123,255,0.70)" }}>
                <Play className="h-3 w-3" /> Try this
              </button>
              <span className="text-[10px] text-white/50">@{item.author}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Discover");
  const [searchVal, setSearchVal] = useState("");
  const [selected, setSelected] = useState<GItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = TAB_CONTENT[activeTab] ?? TAB_CONTENT.Discover;
  const filtered = searchVal.trim()
    ? items.filter(i => i.prompt.toLowerCase().includes(searchVal.toLowerCase()) || i.author.toLowerCase().includes(searchVal.toLowerCase()))
    : items;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── HERO BANNERS ── */}
      <div className="grid gap-3 p-4 md:grid-cols-3">
        <div
          className="relative col-span-2 overflow-hidden rounded-2xl"
          style={{ minHeight: 200, background: "linear-gradient(135deg,#1e1035 0%,#312e81 50%,#1a1a2e 100%)" }}
        >
          <div className="absolute inset-0 opacity-40">
            <img src={aiImg("futuristic AI creative studio, glowing screens, neon lights, photorealistic", 900, 300, 999)} alt="" className="h-full w-full object-cover" loading="lazy" />
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
            <Link href="/chat" className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: "#1D7BFF", boxShadow: "0 4px 20px rgba(29,123,255,0.45)" }}>
              Start creating <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative flex-1 overflow-hidden rounded-2xl" style={{ minHeight: 92, background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)" }}>
            <img src={aiImg("AI video generation, cinematic render, futuristic studio", 400, 200, 998)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" loading="lazy" />
            <div className="relative z-10 flex h-full flex-col justify-between p-4" style={{ minHeight: 92 }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#67E8F9" }}>New</span>
              <div><p className="text-sm font-bold text-white">Video Studio</p><p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Multi-stage AI rendering</p></div>
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl" style={{ minHeight: 92, background: "linear-gradient(135deg,#1a0533,#3b1f6b)" }}>
            <img src={aiImg("AI image generation studio, glowing artwork, digital painting", 400, 200, 997)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" loading="lazy" />
            <div className="relative z-10 flex h-full flex-col justify-between p-4" style={{ minHeight: 92 }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C084FC" }}>Featured</span>
              <div><p className="text-sm font-bold text-white">Image Studio</p><p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>8 style presets available</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOL SHORTCUT CARDS ── */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 pt-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {TOOLS.map(tool => {
          const Icon = tool.icon;
          return (
            <Link key={tool.label} href={tool.href}
              className="group relative flex flex-shrink-0 items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderColor: "var(--border)", background: "var(--bg-subtle)", minWidth: 160 }}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: tool.bg }}>
                <Icon className="h-4.5 w-4.5" style={{ color: tool.color }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{tool.label}</span>
                  {tool.badge && <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ background: "rgba(236,72,153,0.15)", color: "#F472B6" }}>{tool.badge}</span>}
                </div>
                <p className="truncate text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.sub}</p>
              </div>
              <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: tool.color }} />
            </Link>
          );
        })}
      </div>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchVal(""); }}
                className={cn("flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeTab === tab ? "text-white" : "hover:text-[var(--text-secondary)]")}
                style={activeTab === tab ? { background: "#1D7BFF" } : { color: "var(--text-tertiary)", background: "transparent" }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GALLERY GRID ── */}
      <div className="px-8 pb-8 pt-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>No results for &ldquo;{searchVal}&rdquo;</div>
        ) : (
          <div style={{ columns: "5 180px", columnGap: "12px" }}>
            {filtered.map((item, i) => (
              <div key={`${activeTab}-${i}`} className="mb-3 break-inside-avoid">
                <GalleryCard
                  item={item}
                  onClick={() => setSelected(item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <DetailModal
          item={selected}
          items={filtered}
          onClose={() => setSelected(null)}
          onNav={setSelected}
        />
      )}

      {/* ── SCROLL TO TOP ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)", boxShadow: "0 4px 20px rgba(29,123,255,0.45)" }}
          title="Scroll to top"
        >
          <ChevronUp className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
}

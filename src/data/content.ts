/**
 * TNS DIGITAL - Content Data
 * ------------------------
 * Centralized configuration for the story content.
 * Each slide's data including text, images, colors, and features is defined here.
 */

export interface Feature {
  label: string;
  icon?: string;
}

export interface CornerStat {
  label: string;
  value: string;
}

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  centerImage?: string;
  color: string;
  features: Feature[];
  extraText?: string;
  productName: string;
  flavorDescription: string;
  stats: CornerStat[];
}

export const STORY_CONTENT: SlideData[] = [
  {
    id: "01",
    title: "VIOLET",
    subtitle: "Electric Pulse",
    description: "Experience the rush of pure electric energy. A shocking twist on traditional grape flavor.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    centerImage: "/img/violet.png",
    color: "#7c3aed", // Violet 600 (Lighter)
    features: [
      { label: "Smooth", icon: "🌊" },
      { label: "Responsive", icon: "🎮" },
      { label: "Physics", icon: "⚛️" }
    ],
    productName: "VIOLET STORM",
    flavorDescription: "Intense Grape & Acai Berry",
    stats: [
      { label: "Energy", value: "180mg" },
      { label: "Sugar", value: "0g" },
      { label: "Focus", value: "100%" }
    ]
  },
  {
    id: "02",
    title: "EMERALD",
    subtitle: "Nature's Force",
    description: "Straight from the source. The TNS Green blend brings you back to your roots with natural vitality.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2064&auto=format&fit=crop",
    centerImage: "/img/vert.png",
    color: "#059669", // Emerald 600 (Lighter)
    features: [
      { label: "Sync", icon: "🔄" },
      { label: "Cloud", icon: "☁️" }
    ],
    extraText: "Always on.",
    productName: "TNS GREEN",
    flavorDescription: "Crisp Apple & Kiwi Extract",
    stats: [
      { label: "Organic", value: "Yes" },
      { label: "Vitamins", value: "B12+C" },
      { label: "Origin", value: "Brazil" }
    ]
  },
  {
    id: "03",
    title: "AZURE",
    subtitle: "Deep Freeze",
    description: "Cool down your core. A refreshing blast of arctic berries designed to keep you chill under pressure.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    centerImage: "/img/bleu.png",
    color: "#2563eb", // Blue 600 (Lighter)
    features: [
      { label: "AI Ready", icon: "🤖" },
      { label: "Scalable", icon: "📈" },
      { label: "Secure", icon: "🔒" }
    ],
    productName: "BLUE FROST",
    flavorDescription: "Blue Raspberry Ice",
    stats: [
      { label: "Temp", value: "3°C" },
      { label: "Refresh", value: "Max" },
      { label: "Ice", value: "Yes" }
    ]
  },
  {
    id: "04",
    title: "MAGENTA",
    subtitle: "Berry Blast",
    description: "Explosive flavor meets smooth energy. The perfect balance of sweet and tart for the bold.",
    image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop",
    centerImage: "/img/mov.png",
    color: "#db2777", // Pink 600 (Lighter)
    features: [
      { label: "Layered", icon: "🍰" },
      { label: "Deep", icon: "🕳️" }
    ],
    productName: "PINK FUSION",
    flavorDescription: "Dragonfruit & Pomegranate",
    stats: [
      { label: "Antiox", value: "High" },
      { label: "Taste", value: "Bold" },
      { label: "Sweet", value: "Low" }
    ]
  },
  {
    id: "05",
    title: "JUNGLE",
    subtitle: "Wild Instinct",
    description: "Unleash your wild side. A tropical mix that transports you to the heart of the rainforest.",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop",
    centerImage: "/img/green.png",
    color: "#16a34a", // Green 600 (Lighter)
    features: [
      { label: "Open", icon: "👐" },
      { label: "Balanced", icon: "⚖️" }
    ],
    extraText: "Breathing room.",
    productName: "FOREST MIST",
    flavorDescription: "Lime & Mint Mojito",
    stats: [
      { label: "Zest", value: "100%" },
      { label: "Natural", value: "100%" },
      { label: "Vibe", value: "Chill" }
    ]
  },
  {
    id: "06",
    title: "SOLAR",
    subtitle: "Sun Kissed",
    description: "Brighten your day. A citrus explosion that wakes up your senses like the morning sun.",
    image: "https://images.unsplash.com/photo-1506318137071-a8bcbf675b27?q=80&w=2070&auto=format&fit=crop",
    centerImage: "/img/orange.png",
    color: "#ea580c", // Orange 600 (Lighter)
    features: [
      { label: "Shadows", icon: "🌑" },
      { label: "Highlights", icon: "💡" },
      { label: "Contrast", icon: "🌓" }
    ],
    productName: "SUNRISE ZEST",
    flavorDescription: "Orange & Mango Twist",
    stats: [
      { label: "Vit C", value: "200%" },
      { label: "Bright", value: "Very" },
      { label: "Acid", value: "Med" }
    ]
  }
];

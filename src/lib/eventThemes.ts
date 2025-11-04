// Event theme presets and categories

export type ThemeType =
  | "minimal"
  | "quantum"
  | "warp"
  | "emoji"
  | "confetti"
  | "pattern"
  | "seasonal";

export type PresetCategory =
  | "featured"
  | "thanksgiving"
  | "christmas"
  | "new-year"
  | "tech"
  | "business"
  | "party"
  | "crypto"
  | "abstract"
  | "food"
  | "drinks"
  | "wedding"
  | "outdoors"
  | "pride"
  | "sports";

export interface ThemeConfig {
  type: ThemeType;
  color?: string;
  style?: string;
  font?: string;
  display?: "auto" | "light" | "dark";
}

export interface PresetImage {
  id: string;
  url: string;
  category: PresetCategory;
  keywords: string[];
}

// Preset images organized by category
// In a real app, these would be actual image URLs from your CDN/storage
export const PRESET_IMAGES: PresetImage[] = [
  // Featured
  {
    id: "f1",
    url: "/presets/featured-1.jpg",
    category: "featured",
    keywords: ["featured", "colorful", "abstract"],
  },
  {
    id: "f2",
    url: "/presets/featured-2.jpg",
    category: "featured",
    keywords: ["featured", "modern", "gradient"],
  },
  {
    id: "f3",
    url: "/presets/featured-3.jpg",
    category: "featured",
    keywords: ["featured", "minimal", "clean"],
  },
  {
    id: "f4",
    url: "/presets/featured-4.jpg",
    category: "featured",
    keywords: ["featured", "vibrant"],
  },

  // Thanksgiving
  {
    id: "t1",
    url: "/presets/thanksgiving-1.jpg",
    category: "thanksgiving",
    keywords: ["thanksgiving", "autumn", "fall"],
  },
  {
    id: "t2",
    url: "/presets/thanksgiving-2.jpg",
    category: "thanksgiving",
    keywords: ["thanksgiving", "pumpkin", "harvest"],
  },
  {
    id: "t3",
    url: "/presets/thanksgiving-3.jpg",
    category: "thanksgiving",
    keywords: ["thanksgiving", "fall", "leaves"],
  },
  {
    id: "t4",
    url: "/presets/thanksgiving-4.jpg",
    category: "thanksgiving",
    keywords: ["thanksgiving", "festive"],
  },

  // Christmas
  {
    id: "c1",
    url: "/presets/christmas-1.jpg",
    category: "christmas",
    keywords: ["christmas", "winter", "holiday"],
  },
  {
    id: "c2",
    url: "/presets/christmas-2.jpg",
    category: "christmas",
    keywords: ["christmas", "snow", "festive"],
  },
  {
    id: "c3",
    url: "/presets/christmas-3.jpg",
    category: "christmas",
    keywords: ["christmas", "tree", "lights"],
  },

  // Tech
  {
    id: "tech1",
    url: "/presets/tech-1.jpg",
    category: "tech",
    keywords: ["technology", "code", "digital"],
  },
  {
    id: "tech2",
    url: "/presets/tech-2.jpg",
    category: "tech",
    keywords: ["tech", "ai", "future"],
  },
  {
    id: "tech3",
    url: "/presets/tech-3.jpg",
    category: "tech",
    keywords: ["tech", "networking", "conference"],
  },

  // Crypto
  {
    id: "crypto1",
    url: "/presets/crypto-1.jpg",
    category: "crypto",
    keywords: ["crypto", "blockchain", "web3"],
  },
  {
    id: "crypto2",
    url: "/presets/crypto-2.jpg",
    category: "crypto",
    keywords: ["bitcoin", "cryptocurrency", "digital"],
  },
  {
    id: "crypto3",
    url: "/presets/crypto-3.jpg",
    category: "crypto",
    keywords: ["nft", "defi", "blockchain"],
  },

  // Abstract
  {
    id: "abs1",
    url: "/presets/abstract-1.jpg",
    category: "abstract",
    keywords: ["abstract", "art", "modern"],
  },
  {
    id: "abs2",
    url: "/presets/abstract-2.jpg",
    category: "abstract",
    keywords: ["abstract", "colorful", "gradient"],
  },
  {
    id: "abs3",
    url: "/presets/abstract-3.jpg",
    category: "abstract",
    keywords: ["abstract", "minimal", "geometric"],
  },

  // Business
  {
    id: "biz1",
    url: "/presets/business-1.jpg",
    category: "business",
    keywords: ["business", "professional", "office"],
  },
  {
    id: "biz2",
    url: "/presets/business-2.jpg",
    category: "business",
    keywords: ["business", "meeting", "corporate"],
  },

  // Party
  {
    id: "party1",
    url: "/presets/party-1.jpg",
    category: "party",
    keywords: ["party", "celebration", "fun"],
  },
  {
    id: "party2",
    url: "/presets/party-2.jpg",
    category: "party",
    keywords: ["party", "balloons", "festive"],
  },
];

// Get images by category
export function getImagesByCategory(category: PresetCategory): PresetImage[] {
  return PRESET_IMAGES.filter((img) => img.category === category);
}

// Get random image from category
export function getRandomImage(category?: PresetCategory): PresetImage {
  const images = category ? getImagesByCategory(category) : PRESET_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

// Search images
export function searchImages(query: string): PresetImage[] {
  const lowerQuery = query.toLowerCase();
  return PRESET_IMAGES.filter(
    (img) =>
      img.keywords.some((keyword) => keyword.includes(lowerQuery)) ||
      img.category.includes(lowerQuery)
  );
}

// Categories for the modal
export const CATEGORIES: { id: PresetCategory; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "thanksgiving", label: "Thanksgiving" },
  { id: "christmas", label: "Christmas" },
  { id: "new-year", label: "New Year" },
  { id: "tech", label: "Tech" },
  { id: "business", label: "Business" },
  { id: "party", label: "Party" },
  { id: "crypto", label: "Crypto" },
  { id: "abstract", label: "Abstract" },
  { id: "food", label: "Food" },
  { id: "drinks", label: "Drinks" },
  { id: "wedding", label: "Wedding" },
  { id: "outdoors", label: "Outdoors" },
  { id: "pride", label: "Pride" },
  { id: "sports", label: "Sports" },
];

// Theme configurations
export const THEMES: { type: ThemeType; label: string; icon: string }[] = [
  { type: "minimal", label: "Minimal", icon: "⬜" },
  { type: "quantum", label: "Quantum", icon: "🌈" },
  { type: "warp", label: "Warp", icon: "〰️" },
  { type: "emoji", label: "Emoji", icon: "😊" },
  { type: "confetti", label: "Confetti", icon: "🎊" },
  { type: "pattern", label: "Pattern", icon: "▦" },
  { type: "seasonal", label: "Seasonal", icon: "🍂" },
];

// Font options
export const FONTS = [
  { value: "geist-mono", label: "Geist Mono" },
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "helvetica", label: "Helvetica" },
  { value: "georgia", label: "Georgia" },
  { value: "times", label: "Times New Roman" },
];

export type ProductColor = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  details: string;
  price: number;
  old_price: number | null;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  is_new: boolean;
  is_best_seller: boolean;
  sold_out: boolean;
  stock: number;
  rating: number;
  created_at: string;
};

export type Governorate = { id: string; name: string; shipping_cost: number; sort_order: number };

export type Testimonial = {
  id: string;
  customer_name: string;
  location: string;
  rating: number;
  quote: string;
  sort_order: number;
};

export const CATEGORIES = ["FULL SUITE", "PANTS", "HOODIES", "CREW-NECK"] as const;

export const CATEGORY_COPY: Record<string, string> = {
  "FULL SUITE": "Complete formal outfits for a sharp, professional look.",
  PANTS: "Structured trousers and cargos with a considered fall.",
  HOODIES: "450 GSM loopback fleece built to outlast seasons.",
  "CREW-NECK": "Classic crew-neck styles for comfort and versatility.",
};

/** Neutral placeholder tones used instead of product photography. */
export const TONES: Record<string, string> = {
  "tone-1": "linear-gradient(150deg,#efece5 0%,#dcd6c9 55%,#cbc4b4 100%)",
  "tone-2": "linear-gradient(150deg,#e4e1dc 0%,#c9c5bd 55%,#a9a59c 100%)",
  "tone-3": "linear-gradient(150deg,#dedad3 0%,#b9b4aa 55%,#8f8b83 100%)",
};

export function toneStyle(tone: string | undefined) {
  return { backgroundImage: TONES[tone ?? "tone-1"] ?? TONES["tone-1"] };
}

export function formatEGP(value: number) {
  return `EGP ${Math.round(value).toLocaleString("en-US")}`;
}

export function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function categoryFromSlug(slug: string) {
  return CATEGORIES.find((c) => slugifyCategory(c) === slug.toLowerCase());
}

export function generatePromoCode() {
  const random = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `MORTH15-${random.slice(0, 5).padEnd(5, "X")}`;
}

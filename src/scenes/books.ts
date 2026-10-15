/** The books on the shelf, their covers and spine colours. */
import libraryData from "@/data/library.json";

export interface Book {
  isbn: string;
  title?: string;
  author?: string;
  shelf?: string;
  rating?: number | null;
  note?: string;
  pages?: number;
  cover?: string;
  spine?: { color?: string; textColor?: string; image?: string };
}

export const books = (libraryData as { books: Book[] }).books.filter((b) => b.isbn);

// covers fetched by `npm run covers`, keyed by isbn
const fetchedCovers = import.meta.glob<string>("../assets/library/covers/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});
// hand-supplied covers referenced from library.json's `cover` field
const customCovers = import.meta.glob<string>("../assets/library/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

export const coverSrc = (b: Book): string | undefined => {
  if (b.cover && !b.cover.startsWith("TODO")) return customCovers[`../assets/library/${b.cover}`];
  return Object.entries(fetchedCovers).find(([k]) => k.includes(`/${b.isbn}.`))?.[1];
};

export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
};

// vintage cloth colours for books with no cover to sample from
export const CLOTH = ["#6d2f2b", "#2f4a3d", "#2c3d5c", "#7a5a1e", "#4a3a5e", "#5c4033"];

const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
};
export const inkFor = (bg: string) => (luminance(bg) > 150 ? "#2b2118" : "#efe4c9");

/** Pick the most-present saturated colour from a cover image, then dim it a touch. */
const dominantColor = (img: HTMLImageElement): string => {
  const S = 24;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return CLOTH[0];
  ctx.drawImage(img, 0, 0, S, S);
  const { data } = ctx.getImageData(0, 0, S, S);
  const buckets = new Map<number, { r: number; g: number; b: number; score: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max > 238) continue; // ignore white scan borders
    const sat = max === 0 ? 0 : (max - min) / max;
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const e = buckets.get(key) ?? { r: 0, g: 0, b: 0, score: 0, n: 0 };
    e.r += r; e.g += g; e.b += b; e.score += 0.3 + sat; e.n++;
    buckets.set(key, e);
  }
  let best: { r: number; g: number; b: number; score: number; n: number } | null = null;
  for (const e of buckets.values()) if (!best || e.score > best.score) best = e;
  if (!best) return CLOTH[0];
  const n = best.n;
  // pull toward the site's muted grade: 18% toward mid-grey, slightly dimmed
  const tone = (v: number) => Math.round(Math.min(255, ((v / n) * 0.74 + 150 * 0.26) * 0.97));
  return `#${[tone(best.r), tone(best.g), tone(best.b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

export const colorCache = new Map<string, string>();
const colorLoads = new Map<string, Promise<string | undefined>>();
/** Load a cover once and sample its spine colour; shared by every caller. */
export const loadSpineColor = (src: string) => {
  let p = colorLoads.get(src);
  if (!p) {
    p = new Promise<string | undefined>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = dominantColor(img);
          colorCache.set(src, c);
          resolve(c);
        } catch {
          resolve(undefined);
        }
      };
      img.onerror = () => resolve(undefined);
      img.src = src;
    });
    colorLoads.set(src, p);
  }
  return p;
};
/** Resolves once every spine colour is known, so the shelf can appear in one go. */
export const loadAllSpineColors = () =>
  Promise.all(
    books.flatMap((b) => {
      const src = coverSrc(b);
      return src && !b.spine?.color ? [loadSpineColor(src)] : [];
    })
  );

// unscaled thickness of a spine: roughly 1px per 12 pages at full size
export const thickness = (b: Book) => Math.max(15, (b.pages ?? 300) / 12);

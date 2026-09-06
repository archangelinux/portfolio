import React, { CSSProperties, useEffect, useState } from "react";
import { motion } from "framer-motion";
import libraryData from "@/data/library.json";
import useMediaQuery from "@/hooks/useMediaQuery";
import "./library.css";

interface Book {
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

const books = (libraryData as { books: Book[] }).books.filter((b) => b.isbn);

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

const coverSrc = (b: Book): string | undefined => {
  if (b.cover && !b.cover.startsWith("TODO")) return customCovers[`../assets/library/${b.cover}`];
  return Object.entries(fetchedCovers).find(([k]) => k.includes(`/${b.isbn}.`))?.[1];
};

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
};

// vintage cloth colours for books with no cover to sample from
const CLOTH = ["#6d2f2b", "#2f4a3d", "#2c3d5c", "#7a5a1e", "#4a3a5e", "#5c4033"];

const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
};
const inkFor = (bg: string) => (luminance(bg) > 150 ? "#2b2118" : "#efe4c9");

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
  const tone = (v: number) => Math.round(Math.min(255, (v / n) * 0.86)); // slightly dimmed, like worn cloth
  return `#${[tone(best.r), tone(best.g), tone(best.b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const colorCache = new Map<string, string>();
const useSpineColor = (src: string | undefined, fallback: string, override?: string) => {
  const [color, setColor] = useState(override ?? (src && colorCache.get(src)) ?? fallback);
  useEffect(() => {
    if (override || !src) return;
    const cached = colorCache.get(src);
    if (cached) { setColor(cached); return; }
    const img = new Image();
    img.src = src;
    img.onload = () => {
      try {
        const c = dominantColor(img);
        colorCache.set(src, c);
        setColor(c);
      } catch { /* keep fallback */ }
    };
  }, [src, override]);
  return color;
};

const CH = 0.6 * 1.04; // JetBrains Mono advance per glyph, plus letter-spacing
const MIN_FS = 7;
const SPINE_PAD = 30 + 6; // spine padding plus slack
const textUnits = (b: Book) =>
  (b.title ?? "").length * CH + (b.author ?? "").length * 0.82 * CH;

interface BookProps {
  book: Book;
  scale: number;
  rowBase: number;
  open: boolean;
  onToggle: () => void;
}

const BookSpine: React.FC<BookProps> = ({ book, scale, rowBase, open, onToggle }) => {
  const src = coverSrc(book);
  const h = hash(book.isbn);
  const fallback = CLOTH[h % CLOTH.length];
  const spine = useSpineColor(src, fallback, book.spine?.color);
  const ink = book.spine?.textColor ?? inkFor(spine);
  const fav = book.shelf === "favourites";

  const D = Math.round(Math.min(46, Math.max(17, (book.pages ?? 300) / 13)) * scale);
  // shared row height (sized so the longest spine fits at MIN_FS) plus a few
  // px of per-book variation; the type then shrinks only as far as needed
  const H = Math.round(rowBase + (h % 30) * scale);
  const W = Math.round(H * 0.64);
  const room = H - SPINE_PAD - (book.author ? 8 : 0);
  const fs = Math.max(MIN_FS, Math.min(5.5 + D * 0.11, 11, room / textUnits(book)));

  const style = {
    "--h": `${H}px`,
    "--w": `${W}px`,
    "--d": `${D}px`,
    "--fs": `${fs}px`,
    "--spine": spine,
    "--spine-ink": ink,
  } as CSSProperties;

  return (
    // a div rather than <button>: Chrome flattens 3D transforms inside buttons
    <div
      role="button"
      tabIndex={0}
      className={`book${open ? " open" : ""}`}
      style={style}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); }
      }}
      aria-pressed={open}
      aria-label={`${book.title ?? book.isbn}${book.author ? ` by ${book.author}` : ""}`}
    >
      <div className="book-body">
        <div className="face spine">
          <span className="spine-title">{book.title}</span>
          <span className="spine-author">{book.author}</span>
        </div>
        <div className="face cover">
          {src ? (
            <img src={src} alt="" loading="lazy" draggable={false} />
          ) : (
            <div className="cover-blank">
              <b>{book.title}</b>
              <i>{book.author}</i>
            </div>
          )}
        </div>
        <div className="face back" />
        <div className="face top" />
        {fav && <div className="ribbon">fav</div>}
      </div>
    </div>
  );
};

const Library: React.FC = () => {
  const isMobile = !useMediaQuery("(min-width: 850px)");
  const [openIsbn, setOpenIsbn] = useState<string | null>(null);

  useEffect(() => {
    if (!openIsbn) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIsbn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIsbn]);

  const scale = isMobile ? 0.44 : 0.52;
  const rowBase = Math.max(
    280 * scale,
    ...books.map((b) => textUnits(b) * MIN_FS + SPINE_PAD + (b.author ? 8 : 0))
  );

  return (
    <div className="library-row flex flex-col-reverse md:flex-row md:items-end gap-6 md:gap-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="books"
      >
        {books.map((b) => (
          <BookSpine
            key={b.isbn}
            book={b}
            scale={scale}
            rowBase={rowBase}
            open={openIsbn === b.isbn}
            onToggle={() => setOpenIsbn((cur) => (cur === b.isbn ? null : b.isbn))}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="shrink-0 flex flex-col self-start md:mt-5 pl-2 md:pl-0 md:ml-9"
      >
        <p className="text-[12px] leading-[1.55] text-mute max-w-[230px]">
          <span className="font-semibold text-ink">you've reached the bottom!</span>
          <br />
          here are a few of my favourite reads over the years
        </p>
        {/* small hand-drawn arrow curling down-left onto the books */}
        <svg
          className="mt-1.5 -ml-4 w-[34px] h-[24px] text-ink/40"
          viewBox="0 0 34 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M31 3c-4 7-12 12-24 15" />
          <path d="M11 13l-4 5 6 3" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Library;

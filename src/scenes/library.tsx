import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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
  // pull toward the site's muted grade: 18% toward mid-grey, slightly dimmed
  const tone = (v: number) => Math.round(Math.min(255, ((v / n) * 0.74 + 150 * 0.26) * 0.97));
  return `#${[tone(best.r), tone(best.g), tone(best.b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const colorCache = new Map<string, string>();
const colorLoads = new Map<string, Promise<string | undefined>>();
/** Load a cover once and sample its spine colour; shared by every caller. */
const loadSpineColor = (src: string) => {
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
const loadAllSpineColors = () =>
  Promise.all(
    books.flatMap((b) => {
      const src = coverSrc(b);
      return src && !b.spine?.color ? [loadSpineColor(src)] : [];
    })
  );

const useSpineColor = (src: string | undefined, fallback: string, override?: string) => {
  const [color, setColor] = useState(override ?? (src && colorCache.get(src)) ?? fallback);
  useEffect(() => {
    if (override || !src) return;
    let live = true;
    loadSpineColor(src).then((c) => { if (live && c) setColor(c); });
    return () => { live = false; };
  }, [src, override]);
  return color;
};

// unscaled thickness of a spine: roughly 1px per 12 pages at full size
const thickness = (b: Book) => Math.max(15, (b.pages ?? 300) / 12);
const SHELF_THICKNESS = books.reduce((sum, b) => sum + thickness(b), 0);
const SHELF_EXTRA = (books.length - 1) * 2 + 4; // `.books` gaps plus its left padding

const CH = 0.6 * 1.04; // JetBrains Mono advance per glyph, plus letter-spacing
const MIN_FS = 7;
/** Compact shelves (a grid block) let spine type go smaller, so the books shrink in proportion. */
const MIN_FS_COMPACT = 4;
const SPINE_PAD = 30 + 6; // spine padding plus slack
const textUnits = (b: Book) =>
  (b.title ?? "").length * CH + (b.author ?? "").length * 0.82 * CH;

// the row's perspective and how far past its own depth an open book comes
// forward; both are handed to the CSS as custom properties
const PERSPECTIVE = 1100;
const PULL = 24;

/** Pixel dimensions of one book at the given shelf scale. */
const measure = (book: Book, scale: number, rowBase: number, minFs: number) => {
  const h = hash(book.isbn);
  const D = Math.round(thickness(book) * scale);
  // shared row height (sized so the longest spine fits at MIN_FS) plus a few
  // px of per-book variation; the type then shrinks only as far as needed
  const H = Math.round(rowBase + (h % 30) * scale);
  const W = Math.round(H * 0.64);
  const room = H - SPINE_PAD - (book.author ? 8 : 0);
  const fs = Math.max(minFs, Math.min(5.5 + D * 0.11, 11, room / textUnits(book)));
  return { D, H, W, fs };
};
type Geometry = ReturnType<typeof measure>;

interface BookProps {
  book: Book;
  geo: Geometry;
  /** sideways shift of the turned block, in px, that places the cover */
  openX: number;
  open: boolean;
  onToggle: () => void;
}

const BookSpine: React.FC<BookProps> = ({ book, geo, openX, open, onToggle }) => {
  const src = coverSrc(book);
  const h = hash(book.isbn);
  const fallback = CLOTH[h % CLOTH.length];
  const spine = useSpineColor(src, fallback, book.spine?.color);
  const ink = book.spine?.textColor ?? inkFor(spine);
  const fav = book.shelf === "favourites";
  const { D, H, W, fs } = geo;

  const style = {
    "--h": `${H}px`,
    "--w": `${W}px`,
    "--d": `${D}px`,
    "--fs": `${fs}px`,
    "--open-x": `${openX}px`,
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
      {/* body slides the book off the shelf; block then turns it to face the viewer */}
      <div className="book-body">
        <div className="book-block">
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
    </div>
  );
};

/**
 * `compact`: a small shelf for a grid block, label above the books (desktop projects).
 * `bare`: no label or note (the home page's slide-in shelf).
 * `maxScale`: cap the book size (the small phone footer shelf).
 * Otherwise the original footer shelf: books standing on the footer rule, note after them.
 */
const Library: React.FC<{ compact?: boolean; bare?: boolean; maxScale?: number }> = ({ compact = false, bare = false, maxScale }) => {
  const isMobile = !useMediaQuery("(min-width: 850px)");
  const [openIsbn, setOpenIsbn] = useState<string | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, margin: "-40px" });
  // hold the shelf back until every spine has its colour, so the books don't
  // recolour one by one as their covers arrive (capped so a slow image can't
  // hide the shelf for long)
  const [colorsReady, setColorsReady] = useState(false);
  useEffect(() => {
    let live = true;
    const done = () => live && setColorsReady(true);
    const t = setTimeout(done, 2500);
    loadAllSpineColors().then(done);
    return () => { live = false; clearTimeout(t); };
  }, []);
  const show = inView && colorsReady;

  useEffect(() => {
    if (!openIsbn) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIsbn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIsbn]);

  // the row's width and where it sits in the viewport: the shelf shrinks to fit
  // the column on narrow screens, and open covers are kept on screen
  const [rowBox, setRowBox] = useState<{ width: number; left: number; vw: number } | null>(null);
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setRowBox({
        width: entry.contentRect.width,
        left: el.getBoundingClientRect().left,
        vw: document.documentElement.clientWidth,
      })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const rowWidth = rowBox?.width;
  const baseScale = maxScale ?? (isMobile ? 0.42 : 0.52);
  // 8px of slack covers per-book rounding of the thicknesses
  const minFs = compact ? MIN_FS_COMPACT : MIN_FS;
  const fitScale = rowWidth ? (rowWidth - SHELF_EXTRA - 8) / SHELF_THICKNESS : baseScale;
  const scale = Math.min(baseScale, fitScale);
  const rowBase = Math.max(
    280 * scale,
    ...books.map((b) => textUnits(b) * minFs + SPINE_PAD * (compact ? 0.6 : 1) + (b.author ? 8 : 0))
  );

  const geos = books.map((b) => measure(b, scale, rowBase, minFs));
  // Where each open cover goes. Turned in place, a cover's left edge lands on
  // its spine's centre, so by default it is shifted back to sit centred over
  // the spine. But the open book is also nearer the viewer than the shelf, and
  // perspective magnifies it away from the row's centre line, so a cover near
  // either end of the shelf can project past the screen edge. The target is
  // therefore clamped in projected space to the viewport, with a small margin.
  let x = 4; // `.books` left padding
  const openXs = geos.map(({ D, W }) => {
    const left = x;
    x += D + 2; // spine plus the flex gap
    let target = left + D / 2 - W / 2;
    if (rowBox) {
      const cx = rowBox.width / 2; // perspective-origin is the row's centre
      const s = PERSPECTIVE / (PERSPECTIVE - (W + PULL + D / 2)); // magnification at the cover
      const margin = 8;
      const lo = cx + (margin - rowBox.left - cx) / s;
      const hi = cx + (rowBox.vw - margin - rowBox.left - cx) / s - W;
      target = Math.max(lo, Math.min(hi, target));
    }
    return target - left - D / 2;
  });

  return (
    // the fade lives on the row, outside the preserve-3d `.books` context: any
    // opacity below 1 on that element flattens the books to 2D while it runs
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`library-row flex ${compact ? "flex-col gap-3" : "flex-col-reverse md:flex-row md:items-end gap-6 md:gap-5"}`}
      style={{ "--perspective": `${PERSPECTIVE}px`, "--pull": `${PULL}px` } as CSSProperties}
    >
      {compact && !bare && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[12px] leading-[1.55] text-mute"
      >
        <span className="font-semibold text-ink">on my shelf</span>
        <br />
        a few favourite reads over the years
      </motion.p>
      )}
      <motion.div
        initial={{ y: 16 }}
        animate={{ y: show ? 0 : 16 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="books"
      >
        {books.map((b, i) => (
          <BookSpine
            key={b.isbn}
            book={b}
            geo={geos[i]}
            openX={openXs[i]}
            open={openIsbn === b.isbn}
            onToggle={() => setOpenIsbn((cur) => (cur === b.isbn ? null : b.isbn))}
          />
        ))}
      </motion.div>

      {!compact && !bare && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="shrink-0 flex flex-col self-start md:mt-5 pl-2 md:pl-0 md:ml-9"
        >
          <p className="text-[12px] leading-[1.55] text-mute max-w-[230px]">
            <span className="font-semibold text-ink">you've reached the bottom!</span>
            <br />
            here are a few of my favourite reads over the years
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Library;
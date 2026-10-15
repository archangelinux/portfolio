import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import useMediaQuery from "@/hooks/useMediaQuery";
import "./library.css";
import { books, coverSrc, hash, CLOTH, inkFor, colorCache, loadSpineColor, loadAllSpineColors, thickness, type Book } from "./books";

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
  const measureRow = () => {
    const el = rowRef.current;
    if (!el) return;
    setRowBox({
      width: el.clientWidth,
      left: el.getBoundingClientRect().left,
      vw: document.documentElement.clientWidth,
    });
  };
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measureRow);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const rowWidth = rowBox?.width;
  const baseScale = maxScale ?? (isMobile ? 0.42 : 0.52);
  // 8px of slack covers per-book rounding of the thicknesses
  // a capped footer shelf shrinks its spine type too, so the books keep their
  // proportions (book height is set by the type, thickness by the scale)
  const minFs = compact ? MIN_FS_COMPACT : MIN_FS * Math.min(1, (maxScale ?? 0.52) / 0.52);
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
            onToggle={() => {
              // re-measure on open: a row that slid in (the home drawer) was
              // measured off screen, which would clamp covers to the far left
              measureRow();
              setOpenIsbn((cur) => (cur === b.isbn ? null : b.isbn));
            }}
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
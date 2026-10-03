import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Library from "@/scenes/library";

/**
 * "bookshelf", a quiet text link at the bottom-right of the home page. Click
 * it and the books slide in from the right edge on their own (no tray), one
 * after another, standing on a thin line; click a book to open its cover.
 * Click "bookshelf" again, press Esc or click anywhere else to send them back.
 */
const BookshelfDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const shelfRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!shelfRef.current?.contains(t) && !linkRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // desktop only: on phones the shelf is the page's footer
  return (
    <div className="hidden md:block">
      <button
        ref={linkRef}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`fixed bottom-4 right-6 z-40 text-[11px] transition-colors ${open ? "text-ink" : "text-mute hover:text-ink"}`}
      >
        {open ? "put the books back" : "bookshelf"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="shelf"
            ref={shelfRef}
            role="dialog"
            aria-label="Bookshelf"
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}
            className="shelf-slide fixed bottom-10 right-6 z-40 w-[min(440px,calc(100vw-48px))]"
          >
            <Library bare />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookshelfDrawer;

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import pointerCursor from "@/assets/pointer-cursor.svg?url";
import type { DepthScene } from "./heroDepthScene";

/**
 * A hero photo that turns into a little 3D world on hover (see
 * heroDepthScene.ts). The plain <img> is always there underneath; the 3D
 * canvas is built in the background once the page is idle and shown the
 * instant the pointer arrives (it starts as the identical flat photo), then
 * hidden once it has sprung back flat. A green pointing-hand cursor marks it as
 * interactive. Desktop pointers only; nothing moves until you hover, and
 * reduced motion keeps the photo still.
 */
/** Also a door: hovering shows the page name; clicking ripples, the photo grows to fill the screen, and that page opens. */
const HeroDepth: React.FC<{ src: string; depth: string; label: string; sub?: string; to: string; className?: string }> = ({ src, depth, label, sub, to, className = "" }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  // where the ripple starts (the click, or the photo's centre from the keyboard)
  const [opening, setOpening] = useState<{ x: number; y: number } | null>(null);
  const open = (at?: { x: number; y: number }) => {
    if (opening || !boxRef.current) return;
    const b = boxRef.current.getBoundingClientRect();
    setOpening(at ?? { x: b.left + b.width / 2, y: b.top + b.height / 2 });
    window.setTimeout(() => navigate(to), 700);
  };
  const boxRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Promise<DepthScene> | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => () => void sceneRef.current?.then((s) => s.dispose()), []);

  // build the 3D scene in the background once the page is idle, so hovering responds instantly
  useEffect(() => {
    if (!enabled()) return;
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const id = idle ? idle(() => void scene()) : window.setTimeout(() => void scene(), 1500);
    return () => {
      if (!idle) clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enabled = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = () => {
    if (!sceneRef.current && layerRef.current) {
      sceneRef.current = import("./heroDepthScene").then(({ createDepthScene }) =>
        createDepthScene(layerRef.current!, src, depth, setActive)
      );
    }
    return sceneRef.current;
  };

  return (
    <div
      ref={boxRef}
      className={`relative overflow-hidden ${className}`}
      style={{ cursor: `url("${pointerCursor}") 11 4, pointer` }}
      onPointerEnter={() => {
        setHover(true);
        if (enabled()) setActive(true);
      }}
      onPointerMove={(e) => {
        if (!enabled()) return;
        const { clientX, clientY } = e;
        scene()?.then((s) => s.pointer({ clientX, clientY }));
      }}
      onPointerLeave={() => {
        setHover(false);
        sceneRef.current?.then((s) => s.pointer(null));
      }}
      // the canvas stays visible while springing back flat; the scene hides it once settled
      onClick={(e) => {
        if (enabled()) {
          const { clientX, clientY } = e;
          scene()?.then((s) => s.click({ clientX, clientY }));
        }
        // let the photo's own ripple start, then ripple out across the page
        const at = { x: e.clientX, y: e.clientY };
        window.setTimeout(() => open(at), enabled() ? 200 : 0);
      }}
      role="link"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
    >
      <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
      <div
        ref={layerRef}
        aria-hidden="true"
        className={`absolute inset-0 ${active ? "opacity-100" : "opacity-0"}`}
      />
      {/* the page name and a quiet line, bottom-left over a soft fade; always shown on touch screens */}
      <div
        className={`hero-door-label pointer-events-none absolute inset-0 flex flex-col justify-end p-5 transition-[opacity,transform] duration-300 ease-out ${
          hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
        }`}
      >
        <span className="hero-door-title">{label}</span>
        {sub && <span className="hero-door-sub">{sub}</span>}
      </div>
      {opening &&
        createPortal(
          // the click ripples out across the whole screen: two faint rings run
          // ahead of a white wave that washes the page clean, then the new page fades in
          <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden" aria-hidden="true">
            {[0, 0.09].map((delay, k) => (
              <motion.span
                key={k}
                className="absolute rounded-full border border-white/70"
                style={{ left: opening.x, top: opening.y, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: Math.hypot(window.innerWidth, window.innerHeight) / 16, opacity: 0 }}
                transition={{ duration: 0.75, delay, ease: [0.2, 0.7, 0.3, 1] }}
              />
            ))}
            <motion.span
              className="absolute rounded-full bg-white"
              style={{ left: opening.x, top: opening.y, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
              initial={{ scale: 0 }}
              animate={{ scale: Math.hypot(window.innerWidth, window.innerHeight) / 18 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.55, 0, 0.3, 1] }}
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default HeroDepth;

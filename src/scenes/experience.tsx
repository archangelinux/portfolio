import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import WealthsimplePrev from "@/assets/wealthsimple_banner.jpg";
import WealthsimpleLogo from "@/assets/wealthsimple_logo.jpeg";
import WatoPrev from "@/assets/wato_banner.png";
import WatoLogo from "@/assets/wato_logo.jpeg";
import InvisionPrev from "@/assets/invision.png";
import InvisionLogo from "@/assets/invision_logo.png";
import HondaPrev from "@/assets/honda.svg";
import HondaLogo from "@/assets/honda_logo.png";
import DBFBPrev from "@/assets/db-truck.svg";
import DBFBLogo from "@/assets/dbfb_logo.png";
import SSPrev from "@/assets/ss-prev.svg";
import SpringboardLogo from "@/assets/springboard_logo.png";


export interface Role {
  key: string;
  title: string;
  company: string;
  term: string;
  blurb: string;
  image: string;
  logo: string;
  link: string;
}

export const roles: Record<string, Role> = {
  ws: {
    key: "ws",
    title: "Software Engineering Intern",
    company: "Wealthsimple",
    term: "Fall 2026",
    blurb: "brokerage / lending engineering",
    image: WealthsimplePrev,
    logo: WealthsimpleLogo,
    link: "https://www.wealthsimple.com/",
  },
  wato: {
    key: "wato",
    title: "Autonomous Vehicle Developer",
    company: "WATonomous",
    term: "2026",
    blurb: "perception software · sensor fusion",
    image: WatoPrev,
    logo: WatoLogo,
    link: "https://www.watonomous.ca/",
  },
  invision: {
    key: "invision",
    title: "Software Engineer Intern",
    company: "Invision AI",
    term: "Winter 2026",
    blurb: "edge computing + 3D perception for transit systems",
    image: InvisionPrev,
    logo: InvisionLogo,
    link: "https://invision.ai/",
  },
  honda: {
    key: "honda",
    title: "Cloud Engineering Intern",
    company: "Honda Canada",
    term: "Summer 2025",
    blurb: "DevOps, FinOps, and connectivity",
    image: HondaPrev,
    logo: HondaLogo,
    link: "https://www.hondacanada.ca/home",
  },
  dbfb: {
    key: "dbfb",
    title: "Data/Development Coordinator",
    company: "Daily Bread Food Bank",
    term: "Summer 2023/2024",
    blurb: "donor statistics, corporate partnerships, data automation",
    image: DBFBPrev,
    logo: DBFBLogo,
    link: "https://www.dailybread.ca/",
  },
  springboard: {
    key: "springboard",
    title: "Development Coordinator",
    company: "Springboard Services",
    term: "Summer 2021",
    blurb: "rehabilitative programming for at-risk groups",
    image: SSPrev,
    logo: SpringboardLogo,
    link: "https://www.communitylearninghub.ca/",
  },
};

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

/* When `order` is given the card animates as part of the pipeline sequence
   (parent triggers it); otherwise it fades in on its own when scrolled to. */
const RoleCard: React.FC<{ d: Role; order?: number }> = ({ d, order }) => (
  <motion.div
    {...(order === undefined
      ? cardMotion
      : {
          variants: {
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.15 + order * 0.22,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
              },
            },
          },
        })}
    className="group rounded-lg bg-[#f7f9f8] hover:-translate-y-1 hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-300"
  >
    <div className="relative">
      <div className="overflow-hidden rounded-t-lg">
        <img
          src={d.image}
          alt={d.company}
          className="w-full h-[100px] object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
      </div>
      <div className="absolute left-4 -bottom-6 z-10 w-[52px] h-[52px] rounded-md bg-white shadow-[0_3px_10px_-2px_rgba(0,0,0,0.28)] flex items-center justify-center p-1.5 overflow-hidden">
        <img src={d.logo} alt={`${d.company} logo`} className="max-w-full max-h-full object-contain rounded-[5px]" />
      </div>
    </div>
    <div className="pt-9 px-4 pb-4">
      <h3 className="text-[13px] font-bold leading-tight">{d.title}</h3>
      <p className="text-[11px] text-acc-blue mt-0.5 whitespace-nowrap">
        {d.company} <span className="text-faint">|</span> {d.term}
      </p>
      <p className="text-[12px] text-ink/90 mt-3 leading-relaxed">{d.blurb}</p>
    </div>
  </motion.div>
);

/** The order the career path visits the roles. */
const ROUTE = ["ws", "wato", "invision", "honda", "dbfb", "springboard"] as const;
type RoleKey = (typeof ROUTE)[number];

/** Resting tilt per card (deg): pinned along a string rather than lying flat. */
const REST_TILT: Record<RoleKey, number> = { ws: -0.8, wato: 0.6, invision: -0.5, honda: 0.7, dbfb: -0.6, springboard: 0.5 };

type Pt = { x: number; y: number };

/**
 * A polyline with rounded corners: each bend is cut back by up to `r` along
 * both segments and joined with a quadratic curve. Straight-through points
 * (and near-straight ones) are left sharp, so at rest this draws the same
 * right-angled path as before, and when the nodes are pulled it bends smoothly.
 */
const roundedPolyline = (pts: Pt[], r: number) => {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const l2 = Math.hypot(c.x - b.x, c.y - b.y) || 1;
    const u = { x: (b.x - a.x) / l1, y: (b.y - a.y) / l1 };
    const v = { x: (c.x - b.x) / l2, y: (c.y - b.y) / l2 };
    if (Math.abs(u.x * v.y - u.y * v.x) < 0.02) {
      d += ` L ${b.x} ${b.y}`;
      continue;
    }
    const k = Math.min(r, l1 / 2, l2 / 2);
    d += ` L ${b.x - u.x * k} ${b.y - u.y * k} Q ${b.x} ${b.y} ${b.x + v.x * k} ${b.y + v.y * k}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x} ${last.y}`;
};

/**
 * The career path's points through the card centres (plus the two bends in
 * the gap between rows 2 and 3), with each card's current pull applied:
 * WS ↓ WATO → Invision → Honda ↓ ← Daily Bread → Springboard
 */
const pathPoints = (w: number, h: number, off: Record<RoleKey, Pt>): Pt[] => {
  const gapX = 24;
  const gapY = 48;
  const colW = (w - 2 * gapX) / 3;
  const rowH = (h - 2 * gapY) / 3;
  const x1 = colW / 2, x2 = w / 2, x3 = w - colW / 2;
  const y1 = rowH / 2, y2 = rowH * 1.5 + gapY, y3 = rowH * 2.5 + 2 * gapY;
  const yM = rowH * 2 + gapY * 1.5; // in the gap between rows 2 and 3
  const at = (x: number, y: number, o: Pt) => ({ x: x + o.x, y: y + o.y });
  const mix = (a: Pt, b: Pt, t: number) => ({ x: a.x * (1 - t) + b.x * t, y: a.y * (1 - t) + b.y * t });
  return [
    at(x1, y1, off.ws),
    at(x1, y2, off.wato),
    at(x2, y2, off.invision),
    at(x3, y2, off.honda),
    at(x3, yM, mix(off.honda, off.dbfb, 0.4)),
    at(x2, yM, mix(off.honda, off.dbfb, 0.6)),
    at(x2, y3, off.dbfb),
    at(x3, y3, off.springboard),
  ];
};

const zeroOffsets = () => Object.fromEntries(ROUTE.map((k) => [k, { x: 0, y: 0 }])) as Record<RoleKey, Pt>;

/* The career path, drawn behind the cards. It draws itself in on first view;
   while a card is being pulled its `d` is updated directly, every frame. */
const PathBehind: React.FC<{ w: number; h: number; pathRef: React.RefObject<SVGPathElement | null> }> = ({ w, h, pathRef }) => {
  if (!w || !h) return null;
  return (
    <svg className="absolute inset-0 pointer-events-none overflow-visible" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <motion.path
        ref={pathRef}
        d={roundedPolyline(pathPoints(w, h, zeroOffsets()), 26)}
        fill="none"
        stroke="#9fd4ab" // the mint of the green cursors
        strokeOpacity="0.9"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
    </svg>
  );
};

/** How far a card can be pulled (px): it gives easily at first, then resists more and more, never past this. */
const REACH = 64;
const rubber = (d: number) => REACH * Math.tanh((d * 0.7) / REACH);

/**
 * Cards on a string: drag one and it comes a little way, resisting, tugging
 * its neighbours along the path (less the further away they are), and the
 * path stretches with them. Let go and everything springs back with a wobble.
 */
const useTension = (pathRef: React.RefObject<SVGPathElement | null>, box: { w: number; h: number }) => {
  const cards = useRef(new Map<RoleKey, HTMLElement>());
  const sim = useRef({
    off: zeroOffsets(),
    vel: zeroOffsets(),
    drag: null as null | { key: RoleKey; start: Pt; pull: Pt; moved: boolean },
    raf: 0,
    last: 0,
  });

  const render = () => {
    const { off } = sim.current;
    for (const [key, el] of cards.current) {
      const o = off[key];
      // lean into the pull a little, like a card swinging on its pin
      const tilt = REST_TILT[key] + o.x * 0.06;
      el.style.transform = `translate3d(${o.x}px, ${o.y}px, 0) rotate(${tilt}deg)`;
    }
    if (pathRef.current && box.w) pathRef.current.setAttribute("d", roundedPolyline(pathPoints(box.w, box.h, off), 26));
  };

  const step = (now: number) => {
    const S = sim.current;
    // real frame time (clamped), so the feel is the same at 60 and 120 Hz
    const dt = Math.min(0.032, S.last ? (now - S.last) / 1000 : 1 / 60);
    S.last = now;
    const dragged = S.drag?.key;
    const di = dragged ? ROUTE.indexOf(dragged) : -1;
    let moving = false;
    for (const key of ROUTE) {
      const o = S.off[key], v = S.vel[key];
      let target = { x: 0, y: 0 };
      // springs: the held card chases the cursor (stiff, so it feels attached
      // but still has momentum); everything else is looser and bouncier
      let k = 190, c = 7.5;
      if (S.drag) {
        if (key === dragged) {
          target = S.drag.pull;
          k = 520;
          c = 26;
        } else {
          const f = Math.pow(0.45, Math.abs(ROUTE.indexOf(key) - di)); // tension falls off along the path
          target = { x: S.drag.pull.x * f, y: S.drag.pull.y * f };
          k = 240;
          c = 12;
        }
      }
      // semi-implicit Euler in small substeps, for a stable spring
      const n = Math.ceil(dt / (1 / 240));
      const h = dt / n;
      for (let q = 0; q < n; q++) {
        v.x += (-k * (o.x - target.x) - c * v.x) * h;
        v.y += (-k * (o.y - target.y) - c * v.y) * h;
        o.x += v.x * h;
        o.y += v.y * h;
      }
      if (Math.abs(o.x - target.x) + Math.abs(o.y - target.y) + Math.abs(v.x) + Math.abs(v.y) > 0.05) moving = true;
    }
    render();
    if (moving || S.drag) S.raf = requestAnimationFrame(step);
    else {
      S.raf = 0;
      S.last = 0;
    }
  };
  const kick = () => {
    if (!sim.current.raf) sim.current.raf = requestAnimationFrame(step);
  };

  useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box.w, box.h]);
  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  const endDrag = useRef<(() => void) | null>(null);
  const movedRef = useRef(false);
  useEffect(() => () => endDrag.current?.(), []);

  const bind = (key: RoleKey) => ({
    ref: (el: HTMLElement | null) => {
      if (el) cards.current.set(key, el);
      else cards.current.delete(key);
    },
    /*
     * The drag is tracked with window listeners for this one pointer, so it
     * always ends however the gesture finishes: release anywhere, cancel,
     * lost capture, window blur, a second button. A card can't stay "held".
     */
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      endDrag.current?.();
      const id = e.pointerId;
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture?.(id);
      const d = { key, start: { x: e.clientX, y: e.clientY }, pull: { x: 0, y: 0 }, moved: false };
      sim.current.drag = d;
      document.documentElement.classList.add("is-grabbing");
      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        if (ev.buttons === 0) return end(); // button released somewhere we didn't hear about
        const dx = ev.clientX - d.start.x, dy = ev.clientY - d.start.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
        d.pull = { x: rubber(dx), y: rubber(dy) };
      };
      const up = (ev: PointerEvent) => ev.pointerId === id && end();
      const end = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        window.removeEventListener("blur", end);
        el.removeEventListener("lostpointercapture", end);
        movedRef.current = d.moved;
        if (sim.current.drag === d) sim.current.drag = null;
        document.documentElement.classList.remove("is-grabbing");
        endDrag.current = null;
        kick();
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
      window.addEventListener("blur", end);
      el.addEventListener("lostpointercapture", end);
      endDrag.current = end;
      kick();
    },
    // never start the browser's own image drag (ghost image) instead of pulling the card
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
    // a drag shouldn't also count as a click on anything inside the card
    onClickCapture: (e: React.MouseEvent) => {
      if (movedRef.current) e.preventDefault();
    },
  });

  return bind;
};

const DesktopGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const bind = useTension(pathRef, box);
  const card = (key: RoleKey, order: number) => (
    <div {...bind(key)} className="tension-card">
      <RoleCard d={roles[key]} order={order} />
    </div>
  );

  return (
    <div className="hidden md:block relative">
      <PathBehind w={box.w} h={box.h} pathRef={pathRef} />
      <motion.div
        ref={gridRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative grid grid-cols-3 gap-x-6 gap-y-12 items-start"
      >
        {card("ws", 0)}
        <div />
        <div />

        {card("wato", 1)}
        {card("invision", 2)}
        {card("honda", 3)}

        <div />
        {card("dbfb", 4)}
        {card("springboard", 5)}
      </motion.div>
    </div>
  );
};

const Experience: React.FC = () => (
  <div className="w-full">
    {/* Desktop: 3x3 grid — WS alone, then mobility row, then community pair */}
    <DesktopGrid />

    {/* Mobile: single column */}
    <div className="md:hidden flex flex-col gap-5">
      {[roles.ws, roles.wato, roles.invision, roles.honda, roles.dbfb, roles.springboard].map(
        (d) => (
          <RoleCard key={d.key} d={d} />
        )
      )}
    </div>
  </div>
);

export default Experience;

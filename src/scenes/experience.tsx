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

interface Role {
  key: string;
  title: string;
  company: string;
  term: string;
  blurb: string;
  image: string;
  logo: string;
  link: string;
}

const roles: Record<string, Role> = {
  ws: {
    key: "ws",
    title: "Software Engineering Intern",
    company: "Wealthsimple",
    term: "Fall 2026",
    blurb: "stock lending",
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
    term: "2026",
    blurb: "edge computing + 3D perception for transit systems",
    image: InvisionPrev,
    logo: InvisionLogo,
    link: "https://invision.ai/",
  },
  honda: {
    key: "honda",
    title: "Cloud Engineering Student",
    company: "Honda Canada",
    term: "2025",
    blurb: "DevOps, FinOps, and connectivity",
    image: HondaPrev,
    logo: HondaLogo,
    link: "https://www.hondacanada.ca/home",
  },
  dbfb: {
    key: "dbfb",
    title: "Data / Development Intern",
    company: "Daily Bread Food Bank",
    term: "2023 · 2024",
    blurb: "donor statistics, corporate partnerships, data automation",
    image: DBFBPrev,
    logo: DBFBLogo,
    link: "https://www.dailybread.ca/",
  },
  springboard: {
    key: "springboard",
    title: "Project Development Intern",
    company: "Springboard Services",
    term: "2021",
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

const RoleCard: React.FC<{ d: Role }> = ({ d }) => (
  <motion.a
    {...cardMotion}
    href={d.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group block rounded-lg bg-card hover:-translate-y-1 hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-300"
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
        <img src={d.logo} alt={`${d.company} logo`} className="max-w-full max-h-full object-contain" />
      </div>
    </div>
    <div className="pt-9 px-4 pb-4">
      <h3 className="text-[13px] font-bold leading-tight">{d.title}</h3>
      <p className="text-[12px] text-acc-blue mt-0.5">
        {d.company} <span className="text-faint">|</span> {d.term}
      </p>
      <p className="text-[12px] text-ink/75 mt-3 leading-relaxed">{d.blurb}</p>
    </div>
  </motion.a>
);

/* Solid, opaque tint of the teal accent — the bulge overlaps the line with no seam */
const PIPE_COLOR = "#a7c5cc";

/* Career path drawn behind the cards, in pixel space so corners stay round:
   WS ↓ WATO → across the row → Honda ↓ ← Daily Bread → Springboard */
const PathBehind: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  if (!w || !h) return null;
  const gapX = 24;
  const gapY = 48;
  const colW = (w - 2 * gapX) / 3;
  const rowH = (h - 2 * gapY) / 3;
  const x1 = colW / 2;
  const x2 = w / 2;
  const x3 = w - colW / 2;
  const y1 = rowH / 2;
  const y2 = rowH * 1.5 + gapY;
  const y3 = rowH * 2.5 + 2 * gapY;
  const yM = rowH * 2 + gapY * 1.5; // in the gap between rows 2 and 3
  const r = 26;

  const d = [
    `M ${x1} ${y1}`,
    `V ${y2 - r}`,
    `Q ${x1} ${y2} ${x1 + r} ${y2}`,
    `H ${x3 - r}`,
    `Q ${x3} ${y2} ${x3} ${y2 + r}`,
    `V ${yM - r}`,
    `Q ${x3} ${yM} ${x3 - r} ${yM}`,
    `H ${x2 + r}`,
    `Q ${x2} ${yM} ${x2} ${yM + r}`,
    `V ${y3 - r}`,
    `Q ${x2} ${y3} ${x2 + r} ${y3}`,
    `H ${x3}`,
  ].join(" ");

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      {/* the pipe — one solid line, draws itself in on first view */}
      <motion.path
        d={d}
        fill="none"
        stroke={PIPE_COLOR}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      {/* iridescent glints — streaks of light sweeping along the tube */}
      <defs>
        <linearGradient id="glintGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9dcb8" />
          <stop offset="35%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#cfe6ec" />
          <stop offset="100%" stopColor="#d8cfe6" />
        </linearGradient>
      </defs>
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        {/* primary glint */}
        <motion.path
          d={d}
          fill="none"
          stroke="url(#glintGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0.14, pathOffset: 0 }}
          animate={{ pathOffset: [0, 1] }}
          transition={{ duration: 7, ease: "linear", repeat: Infinity }}
        />
        {/* counter-glint — thinner, slower, out of phase for shimmer */}
        <motion.path
          d={d}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.8"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0.07, pathOffset: 0.5 }}
          animate={{ pathOffset: [0.5, 1.5] }}
          transition={{ duration: 11, ease: "linear", repeat: Infinity }}
        />
      </motion.g>
    </svg>
  );
};

const DesktopGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () =>
      setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hidden md:block relative">
      <PathBehind w={box.w} h={box.h} />
      <div ref={gridRef} className="relative grid grid-cols-3 gap-x-6 gap-y-12 items-start">
        <RoleCard d={roles.ws} />
        <div />
        <div />

        <RoleCard d={roles.wato} />
        <RoleCard d={roles.invision} />
        <RoleCard d={roles.honda} />

        <div />
        <RoleCard d={roles.dbfb} />
        <RoleCard d={roles.springboard} />
      </div>
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

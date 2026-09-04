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
      <p className="text-[12px] text-ink/75 mt-3 leading-relaxed">{d.blurb}</p>
    </div>
  </motion.div>
);

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
      {/* the pipe — one solid dark-turquoise line, draws itself in on first view */}
      <motion.path
        d={d}
        fill="none"
        stroke="#3f7c7e"
        strokeOpacity="0.18"
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
      <motion.div
        ref={gridRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative grid grid-cols-3 gap-x-6 gap-y-12 items-start"
      >
        <RoleCard d={roles.ws} order={0} />
        <div />
        <div />

        <RoleCard d={roles.wato} order={1} />
        <RoleCard d={roles.invision} order={2} />
        <RoleCard d={roles.honda} order={3} />

        <div />
        <RoleCard d={roles.dbfb} order={4} />
        <RoleCard d={roles.springboard} order={5} />
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

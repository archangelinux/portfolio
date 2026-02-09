import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, LayoutGroup } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import Navbar from "@/scenes/navbar";
import Experience from "@/scenes/experience";
import Projects from "@/scenes/projects";
import ToolsSection from "@/scenes/tools";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaSquareXTwitter,
} from "react-icons/fa6";

import logoW from "@/assets/logo_w.svg";
import headshot from "@/assets/headshot-db.jpg";

// Types and data for animated name
interface Letter {
  char: string;
  id: number;
  isNew: boolean;
}

const nameVariants: string[] = [
  "angelina",
  "angelinux",
  "archangel",
  "architect",
  "architect of",
  "architect of change",
  "archangelinux",
];

function diffAssign(
  prev: Letter[],
  nextStr: string,
  idCounter: React.RefObject<number>
): Letter[] {
  const m = prev.length;
  const n = nextStr.length;

  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        prev[i - 1].char === nextStr[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const matches: { prevIndex: number; newIndex: number }[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (prev[i - 1].char === nextStr[j - 1]) {
      matches.unshift({ prevIndex: i - 1, newIndex: j - 1 });
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const matchMap = new Map<number, number>();
  matches.forEach(({ prevIndex, newIndex }) =>
    matchMap.set(newIndex, prevIndex)
  );

  const out: Letter[] = [];
  for (let k = 0; k < n; k++) {
    if (matchMap.has(k)) {
      const prevIndex = matchMap.get(k)!;
      out.push({ char: nextStr[k], id: prev[prevIndex].id, isNew: false });
    } else {
      out.push({ char: nextStr[k], id: idCounter.current++, isNew: true });
    }
  }

  if (nextStr === "architect") {
    return out.map((l) => (l.char === "e" ? { ...l, isNew: true } : l));
  }
  return out;
}

const AnimatedSection = ({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [50, 0, 0, -50]
  );

  return (
    <motion.section
      id={id}
      ref={ref}
      style={{ opacity, y }}
      className={`transition-all duration-500 ${className}`}
    >
      {children}
    </motion.section>
  );
};

const TerminalNavigation: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const options = useMemo(() => [
    { label: "View my work experience", action: () => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Check out what I've built", action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Connect with me", action: () => document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" }) },
  ], []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % options.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        setShowPrompt(false);
        setIsComplete(true);
        options[selectedIndex].action();
      } else if (e.key >= "1" && e.key <= "3") {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        setSelectedIndex(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isComplete, options]);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex items-center"
      >
        <span className="text-gold">angelina</span>
        <span className="text-space-gray">:</span>
        <span className="text-gold-light">~</span>
        <span className="text-space-gray">$</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-1 w-2 h-5 bg-gold inline-block"
        />
      </motion.div>
    );
  }

  return (
    <div>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.5 }}
          className="mb-6 text-base-content hidden sm:block"
        >
          Where would you like to go first?
        </motion.div>
      )}

      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.3, duration: 0.5 }}
          className="mb-6 hidden sm:block"
        >
          {options.map((option, index) => (
            <motion.div
              key={index}
              className="flex items-center mb-1 cursor-pointer pl-4"
              onClick={() => {
                setSelectedIndex(index);
                setShowPrompt(false);
                setIsComplete(true);
                option.action();
              }}
            >
              {selectedIndex === index ? (
                <span className="mr-2 text-gold">&#10095;</span>
              ) : (
                <span className="mr-2 text-transparent">&#10095;</span>
              )}
              <span className="mr-3 text-gold-light">
                {index + 1}.
              </span>
              <span className={selectedIndex === index ? "text-gold" : "text-space-gray"}>
                {option.label}
              </span>
            </motion.div>
          ))}
          <div className="mt-3 text-xs text-space-gray pl-4">
            Use &#8593;&#8595; arrow keys or type 1-3 to navigate, Enter to select
          </div>
        </motion.div>
      )}
    </div>
  );
};


const socialLinks = [
  { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/angelinabai/", label: "/in/angelinabai" },
  { icon: <FaGithub />, href: "https://github.com/archangelinux", label: "archangelinux" },
  { icon: <FaSquareXTwitter />, href: "https://x.com/angie_bw", label: "@angie_bw" },
  { icon: <FaEnvelope />, href: "mailto:a498wang@uwaterloo.ca", label: "a498wang@uwaterloo.ca" },
];

const App: React.FC = () => {

  // Animated name state
  const [step, setStep] = useState(0);
  const [letters, setLetters] = useState<Letter[]>(
    nameVariants[0].split("").map((c, i) => ({ char: c, id: i, isNew: false }))
  );
  const idCounter = useRef(letters.length);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  useEffect(() => {
    const iv = setInterval(
      () => setStep((s) => (s + 1) % nameVariants.length),
      1500
    );
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setLetters((prev) => diffAssign(prev, nameVariants[step], idCounter));
  }, [step]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes popIn {
        0% { transform: translateY(-100%) scale(0.8); opacity: 0; }
        30% { transform: translateY(0) scale(1.1); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes popOut {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        20% { transform: translateY(0) scale(1.1); opacity: 1; }
        100% { transform: translateY(-100%) scale(0.8); opacity: 0; }
      }
      .navbar-pop-in {
        animation: popIn 0.5s cubic-bezier(0.34, 1.36, 0.64, 1) forwards;
        transform-origin: center top;
      }
      .navbar-pop-out {
        animation: popOut 0.4s cubic-bezier(0.34, 1.36, 0.64, 1) forwards;
        transform-origin: center top;
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="app bg-circuit">

      <Navbar />

      <AnimatedSection
        id="home"
        className="flex flex-col items-center justify-center min-h-[85vh] pt-12 px-4 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center w-full"
        >
          <div className="flex flex-col md:flex-row max-w-6xl w-full gap-0">
            {/* Terminal */}
            <div className="relative bg-base-100 rounded-sm md:rounded-r-none overflow-visible flex-1 border border-gold-light/30 md:border-r-0 flex flex-col">
              {/* Terminal Header */}
              <div className="bg-base-200 px-4 py-3 flex items-center justify-between border-b border-gold-light/30 rounded-t-sm relative">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-copper shadow-[0_0_6px_rgba(198,125,75,0.6)]" />
                  <div className="w-2 h-2 rounded-full bg-teal shadow-[0_0_6px_rgba(78,138,138,0.6)]" />
                  <div className="w-2 h-2 rounded-full bg-rose shadow-[0_0_6px_rgba(201,58,42,0.6)]" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 text-sm font-mono flex items-center justify-center">
                  <LayoutGroup>
                    <motion.div layout className="inline-flex lowercase">
                      {letters.map(({ char, id, isNew }) => {
                        const current = nameVariants[step];
                        let color: string;
                        if (current === "angelina") {
                          color = "#1D1D1F";
                        } else if (current === "archangelinux") {
                          color = isNew ? "#C67D4B" : "#4E8A8A";
                        } else if (isNew) {
                          color = "#C93A2A";
                        } else {
                          color = "#86868B";
                        }
                        return (
                          <motion.span key={id} layout style={{ color }}>
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        );
                      })}
                    </motion.div>
                  </LayoutGroup>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral/40 tracking-wider">v1.0</span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="px-8 py-4 font-mono text-sm md:text-base flex-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-gold">angelina</span>
                  <span className="text-space-gray">:</span>
                  <span className="text-gold-light">~</span>
                  <span className="text-space-gray">$ whoami</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  className="mb-6"
                >
                  <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-space-dark">
                    Angelina Wang
                  </h1>
                  <div className="text-base-content/80 leading-relaxed text-sm">
                    Hi, I'm <span className="text-copper font-medium">Angelina (or Angie)</span>, a 2nd year{" "}
                    <span className="text-teal font-medium">Software Engineering</span> student.<br />
                    I'm always looking for ideas that help me understand the world better,<br />
                    and oftentimes they become my best creative inspirations.<br />
                    <br />
                    Alongside building in tech, I love to read, sing/songwrite, paint, skate,<br />
                    and do most things that would make me work up a sweat.<br />
                    <br />
                    Thanks for visiting my page, and talk soon!<br/>-
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.3, duration: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-gold">angelina</span>
                  <span className="text-space-gray">:</span>
                  <span className="text-gold-light">~</span>
                  <span className="text-space-gray">$ _</span>
                </motion.div>

                <TerminalNavigation />
              </div>

              {/* Mobile: horizontal dossier card below terminal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="md:hidden border-t border-rose/30"
              >
                <div className="bg-base-200 relative">
                  <div
                    className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px)",
                    }}
                  />
                  <div className="px-3 py-1.5 bg-rose/10 border-b border-rose/30 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-rose uppercase tracking-widest">classified</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose shadow-[0_0_4px_rgba(201,58,42,0.6)]" />
                  </div>
                  <div className="flex">
                    <div className="p-2.5 flex-shrink-0">
                      <img
                        src={headshot}
                        alt="Angelina Wang"
                        className="w-24 h-full object-cover rounded-sm grayscale-[20%] contrast-[1.05]"
                      />
                    </div>
                    <div className="flex-1 py-3 pr-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">id</span>
                          <span className="text-[11px] font-mono text-copper">angie</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">status</span>
                          <span className="text-[11px] font-mono text-emerald">active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">clearance</span>
                          <span className="text-[11px] font-mono text-teal">too high</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">clones</span>
                          <span className="text-[11px] font-mono text-rose">0</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-rose/20">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_3px_rgba(77,139,110,0.5)]" />
                          <span className="text-[8px] font-mono text-space-gray/50 uppercase tracking-widest">verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Desktop: vertical dossier card on the right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="hidden md:flex w-64 lg:w-72 flex-shrink-0 border border-rose/40 border-l-rose/30 rounded-r-sm overflow-hidden bg-base-200 relative flex-col"
            >
              <div
                className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px)",
                }}
              />
              {/* Header bar — same height as terminal header */}
              <div className="px-4 py-3 bg-rose/10 border-b border-rose/30 flex items-center justify-between">
                <span className="text-[9px] font-mono text-rose uppercase tracking-widest">classified</span>
                <div className="w-1.5 h-1.5 rounded-full bg-rose shadow-[0_0_4px_rgba(201,58,42,0.6)]" />
              </div>
              {/* Photo */}
              <div className="px-5 pt-4 pb-2 flex-shrink-0">
                <img
                  src={headshot}
                  alt="Angelina Wang"
                  className="w-full aspect-[3/4] object-cover rounded-sm grayscale-[20%] contrast-[1.05]"
                />
              </div>
              {/* Circuit / chip decoration */}
              <div className="mx-5 mb-2 flex-1 min-h-[40px] relative">
                <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Central chip */}
                  <rect x="70" y="10" width="60" height="40" rx="3" fill="none" stroke="currentColor" className="text-rose/20" strokeWidth="1.5" />
                  <rect x="82" y="22" width="36" height="16" rx="2" fill="none" stroke="currentColor" className="text-rose/30" strokeWidth="1" />
                  {/* Chip pins - top */}
                  <line x1="85" y1="10" x2="85" y2="3" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="95" y1="10" x2="95" y2="3" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="105" y1="10" x2="105" y2="3" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="115" y1="10" x2="115" y2="3" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  {/* Chip pins - bottom */}
                  <line x1="85" y1="50" x2="85" y2="57" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="95" y1="50" x2="95" y2="57" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="105" y1="50" x2="105" y2="57" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="115" y1="50" x2="115" y2="57" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  {/* Chip pins - left */}
                  <line x1="70" y1="22" x2="63" y2="22" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="70" y1="30" x2="63" y2="30" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="70" y1="38" x2="63" y2="38" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  {/* Chip pins - right */}
                  <line x1="130" y1="22" x2="137" y2="22" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="130" y1="30" x2="137" y2="30" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  <line x1="130" y1="38" x2="137" y2="38" stroke="currentColor" className="text-space-gray/25" strokeWidth="1" />
                  {/* Traces - left side */}
                  <path d="M63 22 L40 22 L25 12 L8 12" fill="none" stroke="currentColor" className="text-copper/20" strokeWidth="0.8" />
                  <path d="M63 30 L40 30 L20 30 L8 30" fill="none" stroke="currentColor" className="text-teal/20" strokeWidth="0.8" />
                  <path d="M63 38 L40 38 L25 48 L8 48" fill="none" stroke="currentColor" className="text-copper/20" strokeWidth="0.8" />
                  {/* Traces - right side */}
                  <path d="M137 22 L160 22 L175 12 L192 12" fill="none" stroke="currentColor" className="text-copper/20" strokeWidth="0.8" />
                  <path d="M137 30 L160 30 L180 30 L192 30" fill="none" stroke="currentColor" className="text-teal/20" strokeWidth="0.8" />
                  <path d="M137 38 L160 38 L175 48 L192 48" fill="none" stroke="currentColor" className="text-copper/20" strokeWidth="0.8" />
                  {/* Trace endpoints - small circles */}
                  <circle cx="8" cy="12" r="1.5" fill="currentColor" className="text-copper/25" />
                  <circle cx="8" cy="30" r="1.5" fill="currentColor" className="text-teal/25" />
                  <circle cx="8" cy="48" r="1.5" fill="currentColor" className="text-copper/25" />
                  <circle cx="192" cy="12" r="1.5" fill="currentColor" className="text-copper/25" />
                  <circle cx="192" cy="30" r="1.5" fill="currentColor" className="text-teal/25" />
                  <circle cx="192" cy="48" r="1.5" fill="currentColor" className="text-copper/25" />
                </svg>
              </div>
              {/* Data strip */}
              <div className="px-4 pb-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">id</span>
                  <span className="text-[11px] font-mono text-copper">angie</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">status</span>
                  <span className="text-[11px] font-mono text-emerald">active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">clearance</span>
                  <span className="text-[11px] font-mono text-teal">too high</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] font-mono text-space-gray/70 uppercase tracking-wider">clones</span>
                  <span className="text-[11px] font-mono text-rose">0</span>
                </div>
                <div className="pt-1.5 mt-1 border-t border-rose/20">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_3px_rgba(77,139,110,0.5)]" />
                    <span className="text-[8px] font-mono text-space-gray/50 uppercase tracking-widest">verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="experience" className="pt-16 px-4 max-w-6xl mx-auto">
        <Experience />
      </AnimatedSection>

      <AnimatedSection id="projects" className="pt-16 px-4 max-w-6xl mx-auto">
        <Projects />
      </AnimatedSection>

      <AnimatedSection id="tools" className="pt-16 px-4 max-w-6xl mx-auto">
        <ToolsSection />
      </AnimatedSection>

      <AnimatedSection id="connect" className="pt-16 pb-8 px-4 max-w-6xl mx-auto">
        <div className="bg-base-100 rounded-sm overflow-hidden border border-copper/25">
          {/* Panel header */}
          <div className="px-6 py-3 border-b border-copper/25 flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-copper" />
              <span className="text-[10px] font-mono text-copper uppercase tracking-widest">signal</span>
              <span className="text-[10px] font-mono text-copper/40 uppercase tracking-widest">| connect</span>
            </div>
          </div>

          {/* Links list */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-sm border border-copper/15 hover:border-copper/30 hover:bg-copper/5 transition-colors group"
                >
                  <span className="text-lg text-copper">{item.icon}</span>
                  <span className="text-sm font-mono text-base-content/60 group-hover:text-copper transition-colors">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-gold-light/10 py-4 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xs text-space-gray/60">&copy; 2025 Angelina Wang</span>
          <a
            href="https://se-webring.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-space-gray/60 hover:text-gold transition-colors"
          >
            <img src={logoW} alt="SE Webring" className="w-3.5 h-3.5 opacity-50" />
            SE Webring
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;

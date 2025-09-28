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

import headshot from "@/assets/headshot.jpeg";

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
    [0, 0.2, 0.8, 1], //input range (entering to leaving viewport)
    [0, 1, 1, 0] //output range (fade on enter/leave)
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [50, 0, 0, -50] //move up/down
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
        <span className="text-[#E87A30]">angelina@portfolio</span>
        <span className="text-slate-300">:</span>
        <span className="text-[#FFB347]">~</span>
        <span className="text-slate-300">$</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-1 w-2 h-5 bg-[#FDECBF] inline-block"
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
          transition={{ delay: 3.3, duration: 0.5 }}
          className="mb-6 text-slate-200"
        >
          Where would you like to go first?
        </motion.div>
      )}

      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8, duration: 0.5 }}
          className="mb-6"
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
                <span className="mr-2 text-[#FFB347]">❯</span>
              ) : (
                <span className="mr-2 text-transparent">❯</span>
              )}
              <span className={`mr-3 text-[#FFB347]`}>
                {index + 1}.
              </span>
              <span className={selectedIndex === index ? "text-[#FFB347]" : "text-slate-300"}>
                {option.label}
              </span>
            </motion.div>
          ))}
          <div className="mt-3 text-xs text-slate-400 pl-4">
            Use ↑↓ arrow keys or type 1-3 to navigate, Enter to select
          </div>
        </motion.div>
      )}
    </div>
  );
};



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

  // Animated name effects
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


  //navbar animation
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
      document.head.removeChild(styleElement); //on unmount
    };
  }, []);

  return (
    <div className="app">

      <Navbar />

      <AnimatedSection
        id="home"
        className="flex flex-col items-center justify-center min-h-[85vh] pt-12 mx-8 md:mx-12 lg:mx-12"
      >
        {/* Terminal Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center w-full"
        >
          {/* Terminal Container - Centered */}
          <div className="relative bg-[#3F534E] rounded-t-xl rounded-b-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-visible max-w-5xl border border-[#E87A30]/20">
            {/* Terminal Header - Animated Name */}
            <div className="bg-[#2A3D36] px-4 py-3 flex items-center justify-between border-b border-[#E87A30]/20 rounded-t-xl">
              {/* Terminal dots */}
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#E87A30]/80 shadow-[0_0_8px_rgba(232,122,48,0.4)]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFB347]/70 shadow-[0_0_8px_rgba(255,179,71,0.3)]"></div>
                <div className="w-3 h-3 rounded-full bg-green-700/50 shadow-[0_0_8px_rgba(21,128,61,0.3)]"></div>
              </div>
              <div className="text-sm font-mono flex items-center justify-center">
                <LayoutGroup>
                  <motion.div layout className="inline-flex lowercase">
                    {letters.map(({ char, id, isNew }) => {
                      const current = nameVariants[step];
                      let color: string;
                      if (current === "angelina") {
                        color = "#FDECBF";
                      } else if (current === "archangelinux" || isNew) {
                        color = "#E87A30";
                      } else {
                        color = "#FFB347";
                      }
                      return (
                        <motion.span key={id} layout style={{ color }}>
                          {char}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                </LayoutGroup>
                <span className="text-slate-300">
                  @portfolio:~
                </span>
              </div>
              {/* Empty div for center alignment */}
              <div className="w-12"></div>
            </div>

            {/* Terminal Content */}
            <div className="px-8 py-4 pr-8 md:pr-48 font-mono text-sm md:text-base">
              {/* Terminal Commands */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-4"
              >
                <span className="text-[#E87A30]">angelina@portfolio</span>
                <span className="text-slate-300">:</span>
                <span className="text-[#FFB347]">~</span>
                <span className="text-slate-300">$ whoami</span>
              </motion.div>

              {/* Mobile/tablet - inline image */}
              <div className="block lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="mb-4 text-slate-100"
                >
                  <h1 className="text-2xl font-bold text-[#FDECBF]">
                    Angelina Wang
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="mb-2"
                >
                  <img
                    src={headshot}
                    alt="Angelina Wang"
                    className="w-24 h-24 object-cover rounded-lg border-2 border-[#E87A30]/40"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.3, duration: 0.5 }}
                  className="mb-6 text-slate-300"
                >
                  angie.jpg
                </motion.div>
              </div>

              {/* Desktop - just name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="mb-6 text-slate-100 hidden lg:block"
              >
                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-[#FDECBF]">
                  Angelina Wang
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3, duration: 0.5 }}
                className="mb-4"
              >
                <span className="text-[#E87A30]">angelina@portfolio</span>
                <span className="text-slate-300">:</span>
                <span className="text-[#FFB347]">~</span>
                <span className="text-slate-300">$ cat about.txt</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.5 }}
                className="mb-6 text-slate-200 leading-relaxed"
              >
                Hi, I'm <span className="text-[#FDECBF] font-semibold">Angelina (or Angie)</span>, a 2nd year{" "}
                <span className="text-[#FFB347] font-semibold">Software Engineering</span> student.<br />
                I'm always looking for ideas that help me understand the world better,<br />
                and oftentimes they become my best creative inspirations.<br />
                <br />
                Alongside building in tech, I love to read, sing/songwrite, paint, skate,<br />
                and do most things that would make me work up a sweat.<br />
                <br />
                Thanks for visiting my page, and talk soon!<br/>-
              </motion.div>

              <TerminalNavigation />
            </div>

            {/* Floating Headshot Window - Medium/Large screens only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="absolute top-8 -right-20 md:top-12 md:-right-24 lg:top-16 lg:-right-28 xl:-right-32 z-20 hidden lg:block"
            >
            {/* Floating window container */}
            <div className="relative">
              {/* Window frame */}
              <div className="bg-[#2A3D36] rounded-lg shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* Window header */}
                <div className="bg-[#1F2B26] px-4 py-3 flex items-center justify-between border-b border-[#E87A30]/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#E87A30]/40 shadow-[0_0_6px_rgba(232,122,48,0.2)]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFB347]/40 shadow-[0_0_6px_rgba(255,179,71,0.2)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-700/25 shadow-[0_0_6px_rgba(21,128,61,0.2)]"></div>
                  </div>
                  <div className="text-[#FDECBF] text-sm font-mono opacity-80">
                    angie.exe
                  </div>
                  <div className="w-12"></div>
                </div>

                {/* Image container with hover effects */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative overflow-hidden"
                >
                  <img
                    src={headshot}
                    alt="Angelina Wang"
                    className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover"
                  />

                  {/* Subtle overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#E87A30]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              </div>

              {/* Floating animation effect */}
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 pointer-events-none"
              />

              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-[#E87A30]/10 rounded-lg blur-xl -z-10 scale-110"></div>
            </div>
            </motion.div>

          </div>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="experience" className="pt-40 px-4">
        <Experience />
      </AnimatedSection>
      <AnimatedSection
        id="projects"
        className="pt-40 mt-32 mx-auto px-4 mb-20 max-w-[1600px]"
      >
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center">
            &lt;Build/&gt;
          </h2>
        </div>
        <Projects />
      </AnimatedSection>
      <ToolsSection />

      <AnimatedSection id="connect" className="pt-40 mt-20 relative">
        <div className="relative overflow-hidden">
          {/* Dark themed background container matching your brand */}
          <div
            className="absolute inset-0 bg-[#3F534E] z-0 border-t-2 border-[#E87A30]/20"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: "300vw",
              height: "300vw",
              borderRadius: "50%",
            }}
          ></div>

          {/* Content container */}
          <div className="max-w-[1400px] mx-auto relative z-10 mt-30 px-8 md:px-16 lg:px-24">
            {/* Section heading */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#FDECBF] text-center">
                &lt;Connect/&gt;
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center mb-20 mt-20"
            >
              {/* Pill-shaped container */}
              <div className="bg-[#2A3D36]/90 border-2 border-[#E87A30]/30 rounded-full px-8 md:px-12 lg:px-16 py-6 md:py-8 shadow-lg">
                {/* Icons row */}
                <div className="flex items-center justify-center space-x-6 md:space-x-8 lg:space-x-10">
                  {[
                    {
                      icon: <FaLinkedin className="text-[#E87A30] text-3xl md:text-4xl lg:text-5xl" />,
                      href: "https://www.linkedin.com/in/angelinabai/",
                      text: "/angelinabai",
                    },
                    {
                      icon: <FaGithub className="text-[#E87A30] text-3xl md:text-4xl lg:text-5xl" />,
                      href: "https://github.com/archangelinux",
                      text: "/archangelinux",
                    },
                    {
                      icon: <FaSquareXTwitter className="text-[#E87A30] text-3xl md:text-4xl lg:text-5xl" />,
                      href: "https://x.com/angie_bw",
                      text: "/angie_bw",
                    },
                    {
                      icon: <FaEnvelope className="text-[#E87A30] text-3xl md:text-4xl lg:text-5xl" />,
                      href: "mailto:a498wang@uwaterloo.ca",
                      text: "a498wang@uwaterloo.ca",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 md:p-4 rounded-full hover:bg-[#3F534E] hover:scale-110 transition-all duration-300"
                      >
                        {item.icon}
                      </a>
                      
                      {/* Theme-matched tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-[#2A3D36] border border-[#E87A30] text-[#FDECBF] text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 shadow-md">
                        {item.text}
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#E87A30]"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>



            {/* Thin line divider */}
            <div className="w-full h-px bg-[#E87A30]/30 mb-4"></div>

            <motion.footer
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="py-5 text-center text-sm text-slate-300"
            >
              &copy; 2025 Angelina Wang
            </motion.footer>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default App;

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import Navbar from "@/scenes/navbar";
import Experience from "@/scenes/experience";
import AnimatedName from "@/scenes/animatedname";
import Projects from "@/scenes/projects";
import ToolsSection from "@/scenes/tools";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaSquareXTwitter,
} from "react-icons/fa6";

import retroComputer from "@/assets/retro-computer.png";



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



const App: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  //navbar scroll response
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Check if we're at the very top
      if (scrollY === 0) {
        setIsAtTop(true);
        setShowNavbar(true);
      } else {
        setIsAtTop(false);
        if (scrollY > lastScrollY) {
          setShowNavbar(false);
        } else if (scrollY + 30 < lastScrollY) {
          setShowNavbar(true);
        }
      }
      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
      {/* Dynamic rotating text placed above the navbar - only visible at top */}
      <div
        className={`relative z-40 mt-8 flex justify-center transition-all duration-500 ease-out overflow-hidden ${
          isAtTop ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
        }`}
      >
        <div className="text-white/80 text-2xl md:text-3xl font-semibold">
          <AnimatedName />
        </div>
      </div>

      <div
        className={`fixed left-0 w-full z-50 transition-all duration-500 ease-out ${
          isAtTop ? "top-16" : "top-0"
        } ${showNavbar ? "navbar-pop-in" : "navbar-pop-out"}`}
        style={{ perspective: "1000px" }}
      >
        <Navbar />
      </div>

      {/* Spacer div that pushes content down when navbar is pushed down */}
      <div
        className={`transition-all duration-500 ease-out ${
          isAtTop ? "h-16" : "h-0"
        }`}
      />

      <AnimatedSection
        id="home"
        className="flex flex-col items-center justify-center min-h-[80vh] pt-16"
      >
        {/* Main hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="flex flex-col xl:flex-row items-center gap-2 xl:gap-16">
            {/* Top row: Image and Name (mobile) / Full layout (desktop) */}
            <div className="flex flex-row xl:flex-col items-center xl:items-start gap-6 xl:gap-16 w-full xl:w-auto">
              {/* Retro Computer Image */}
              <div className="flex-shrink-0">
                {/* Bouncing image */}
                <motion.img
                  src={retroComputer}
                  alt="Retro Computer"
                  className="w-40 h-auto md:w-[28rem] xl:w-80 2xl:w-96 object-contain"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Name - only visible on mobile, hidden on desktop */}
              <div className="xl:hidden text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-yellow-600 leading-none">
                  Angelina<br />
                  <span style={{ fontSize: 'clamp(56px, 8vw, 72px)' }}>Wang</span>
                </h1>
              </div>
            </div>

            {/* Description text and desktop name */}
            <div className="flex-1 text-left px-6 xl:px-0">
                              {/* Desktop name - hidden on mobile */}
                <h1 className="hidden xl:block text-4xl xl:text-5xl font-bold text-white mb-6">
                  Angelina Wang
                </h1>
                             <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl xl:max-w-4xl">
                Hi, I'm <b>Angelina (or Angie)</b>, a 2nd year{" "}
                <b>Software Engineering</b> student at the University of
                Waterloo.
                <br /> I'm always looking for ideas that help me understand the world
                better, and oftentimes they become my best creative inspirations.
                Alongside building in tech, I love to read, sing/songwrite,
                paint, skate, and do most things that would make me work up a
                sweat.
                <br/><br/>Thanks for visiting my page, and talk soon!
              </p>
            </div>
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
          {/* Light rounded background container - zoomed in circle */}
          <div
            className="absolute inset-0 bg-gray-100 z-0"
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-800 text-center">
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
              <div className="bg-white/90 border border-gray-200 rounded-full px-8 md:px-12 lg:px-16 py-6 md:py-8 shadow-lg">
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
                        className="block p-3 md:p-4 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-300"
                      >
                        {item.icon}
                      </a>
                      
                      {/* Theme-matched tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-white border border-[#E87A30] text-[#E87A30] text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 shadow-md">
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
            <div className="w-full h-px bg-slate-300 mb-4"></div>

            <motion.footer
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="py-5 text-center text-sm text-slate-700"
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

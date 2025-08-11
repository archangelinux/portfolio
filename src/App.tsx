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
import GoopyAngel from "@/assets/goopyangelcoder.png";
import headshot from "@/assets/headshot_db_nobg.png";

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

// Create a reusable component for animating individual list items
const AnimatedListItem = ({
  index = 0,
  children,
}: {
  index?: number;
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-20, 0, 0, -20]);

  return (
    <motion.li
      ref={ref}
      style={{ opacity, x }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-center justify-left space-x-4"
    >
      {children}
    </motion.li>
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
        className="flex flex-col items-center justify-center min-h-[80vh] pt-32"
      >
        {/* Main hero content - everything in one neomorphic container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-6xl mx-auto px-4 pr-0 md:pr-4"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Portrait headshot - rotated and positioned, larger to get cut off */}
            <div className="relative flex-shrink-0 w-fit max-w-sm pr-4 md:pr-0 mb-10">
              {/* Neomorphic container wrapping just the image */}
              <div className="bg-[#294240] rounded-3xl pt-5 pb-1 px-1 md:pt-0 md:pb-2 md:px-2 shadow-[inset_0_-2px_8px_rgba(255,255,255,0.15),inset_0_6px_12px_rgba(0,0,0,0.25)] overflow-hidden -mt-20 md:-mt-28 h-95 md:h-110">
                <div className="transform rotate-12 translate-x-2 translate-y-8 -mt-8">
                  <div className="relative">
                                         <img
                       src={headshot}
                       alt="Angelina Wang"
                       className="w-96 h-[28rem] md:w-[28rem] md:h-[32rem] object-cover object-top"
                       style={{
                         filter:
                           "brightness(1.02) contrast(0.92) saturate(0.88) blur(0.8px) sepia(0.1)",
                       }}
                     />
                                          {/* Gradient fade overlay for bottom and left edges */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#294240] opacity-90"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#294240] via-transparent to-transparent opacity-30"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name and description text - moved much more down */}
                         <div className="text-white text-left lg:-ml-20 space-y-3 -mt-64 lg:-mt-60 relative z-20 w-full max-w-lg px-4 lg:px-0">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-55 mb-10 ">
                  Angelina Wang
                </h1>
              </div>
              <p className="text-sm md:text-base text-white/90 leading-relaxed -mt-2">
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
              <div className="border border-slate-300 rounded-lg p-8 text-center space-y-6 w-full max-w-md bg-white/50 backdrop-blur-sm">
                <ul className="space-y-4 text-lg">
                  {[
                    {
                      icon: <FaLinkedin className="text-[#E87A30] text-3xl" />,
                      href: "https://www.linkedin.com/in/angelinabai/",
                      text: "/angelinabai",
                    },
                    {
                      icon: <FaGithub className="text-[#E87A30] text-3xl" />,
                      href: "https://github.com/archangelinux",
                      text: "/archangelinux",
                    },
                    {
                      icon: (
                        <FaSquareXTwitter className="text-[#E87A30] text-3xl" />
                      ),
                      href: "https://x.com/angie_bw",
                      text: "/angie_bw",
                    },
                    {
                      icon: <FaEnvelope className="text-[#E87A30] text-3xl" />,
                      href: "mailto:a498wang@uwaterloo.ca",
                      text: "a498wang@uwaterloo.ca",
                    },
                  ].map((item, index) => (
                    <AnimatedListItem key={index} index={index}>
                      {item.icon}
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E87A30] underline italic"
                      >
                        {item.text}
                      </a>
                    </AnimatedListItem>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Footer content on light background */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <img src={GoopyAngel} className="h-[300px]" alt="Goopy Angel" />
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

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useInView, useTransform, useMotionValueEvent } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import Navbar from "@/scenes/navbar";
import Experience from "@/scenes/experience";
import AnimatedName from "@/scenes/animatedname";
import Projects from "@/scenes/projects";
import ToolsSection from "@/scenes/tools"
import { FaLinkedin, FaGithub, FaEnvelope, FaSquareXTwitter } from "react-icons/fa6";
import GoopyAngel from "@/assets/goopyangelcoder.png";
import { SelectedPage } from "@/utils/types";


const AnimatedSection = ({
  id,
  children,
  className = ""
}: {
  id: string;
  children: React.ReactNode;
  className?: string
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
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

const SectionHeading = ({
  children,
  as = "h3"
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );

  const fontSizeClasses = {
    h1: "text-[7vh]",
    h2: "text-[6vh]",
    h3: "text-[5vh]",
    h4: "text-[4vh]",
    h5: "text-[3vh]",
    h6: "text-[2.5vh]"
  };

  const fontSize = fontSizeClasses[as] || fontSizeClasses.h3;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`ml-20 ${fontSize} font-semibold decoration-slate-200 mb-4`}
    >
      {React.createElement(as, {}, children)}
    </motion.div>
  );
};


// Create a reusable component for animating individual list items
const AnimatedListItem = ({
  index = 0,
  children
}: {
  index?: number;
  children: React.ReactNode
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );

  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [-20, 0, 0, -20]
  );

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
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  //navbar scroll response
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setSelectedPage(SelectedPage.Home);
        setShowNavbar(true);
      } else {
        if (window.scrollY > lastScrollY) {
          setShowNavbar(false);
        } else if (window.scrollY + 30 < lastScrollY) {
          setShowNavbar(true);
        }
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  //navbar animation
  useEffect(() => {
    const styleElement = document.createElement('style');
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
      <div className={`fixed top-0 left-0 w-full z-50 ${showNavbar ? "navbar-pop-in" : "navbar-pop-out"}`} style={{ perspective: "1000px" }}>
        <Navbar setSelectedPage={setSelectedPage} />
      </div>

      <AnimatedSection id="home" className="flex flex-col items-center justify-center min-h-screen pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <AnimatedName />
        </motion.div>

        <motion.p
          initial={{ opacity: 0.5, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block bg-[#294240] px-2 mb-[-40px] py-6 text-lg font-medium text-white z-10"
        >
          Angelina Wang
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative inline-block text-center z-5"
        >
          <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none"></div>
          <div className="relative px-6 py-8">
            <ul className="mt-2 list-inside space-y-2 text-base text-white">
              <li>Studying Software Engineering at the University of Waterloo </li>
              <li>Interning in Cloud Engineering at Honda Canada Inc.</li>
              <li>Building 🪸 ? </li>
            </ul>
          </div>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="experience" className="pt-40 mx-20 px-4">
        <SectionHeading as="h3">Experience</SectionHeading>
        <Experience />
      </AnimatedSection>

      <AnimatedSection id="projects" className="pt-40 mt-20 mx-20 px-4">
        <SectionHeading as="h3">Projects</SectionHeading>
        <Projects />
        <ToolsSection />
      </AnimatedSection>

      <AnimatedSection id="connect" className="pt-40 mt-20 mx-20 px-4">
        <SectionHeading as="h3">Connect</SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-20 mt-20"
        >
          <div className="border border-[#d3cbb8] rounded-lg p-8 text-center space-y-6 w-full max-w-md">
            <ul className="space-y-4 text-lg">
              {[
                { icon: <FaLinkedin className="text-[#E87A30] text-3xl" />, href: "https://www.linkedin.com/in/angelinabai/", text: "/angelinabai" },
                { icon: <FaGithub className="text-[#E87A30] text-3xl" />, href: "https://github.com/archangelinux", text: "/archangelinux" },
                { icon: <FaSquareXTwitter className="text-[#E87A30] text-3xl" />, href: "https://x.com/angie_bw", text: "/angie_bw" },
                { icon: <FaEnvelope className="text-[#E87A30] text-3xl" />, href: "mailto:a498wang@uwaterloo.ca", text: "a498wang@uwaterloo.ca" }
              ].map((item, index) => (
                <AnimatedListItem key={index} index={index}>
                  {item.icon}
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[#E87A30] underline italic">{item.text}</a>
                </AnimatedListItem>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatedSection>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-t from-[#3F534E] to-[#294240]"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <img src={GoopyAngel} className="h-[300px]" alt="Goopy Angel" />
        </motion.div>
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-5 text-center text-sm text-[#d3cbb8]"
        >
          &copy; 2025 Angelina Wang
        </motion.footer>
      </motion.section>
    </div>
  );
};

export default App;
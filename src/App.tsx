import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SideNav, ContactRail, MobileHeader, SectionId } from "@/scenes/navbar";
import Experience from "@/scenes/experience";
import Projects from "@/scenes/projects";
import ToolsSection from "@/scenes/tools";

import heroCampus from "@/assets/hero1.png";
import heroCity from "@/assets/hero2.png";
import heroPalms from "@/assets/hero3.png";
import logoW from "@/assets/logo_w.svg";

const SECTION_IDS: SectionId[] = ["me", "work", "projects"];

const useActiveSection = (): SectionId => {
  const [active, setActive] = useState<SectionId>("me");
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      let current: SectionId = "me";
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return active;
};

const Intro: React.FC = () => (
  <div className="text-[12px] leading-[1.55]">
    <p>hi i'm Angelina (or Angie), and i'm:</p>
    <ul>
      <li className="pl-4 relative">
        <span className="absolute left-0.5">•</span>a third year{" "}
        <span className="text-acc-purple font-semibold">Software Engineering</span>{" "}
        student at the{" "}
        <span className="text-acc-gold font-semibold">University of Waterloo</span>
      </li>
      <li className="pl-4 relative">
        <span className="absolute left-0.5">•</span>minoring in{" "}
        <span className="text-acc-cyan font-semibold">cognitive science</span> and
        fascinated by{" "}
        <span className="text-acc-blue font-semibold">sociotechnical systems</span>
      </li>
      <li className="pl-4 relative">
        <span className="absolute left-0.5">•</span>betting on and building for the
        future of{" "}
        <span className="text-acc-red font-semibold">physical intelligence</span> and{" "}
        <span className="text-acc-crimson font-semibold">mobility</span>
      </li>
    </ul>
  </div>
);

const heroImgMotion = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const Divider: React.FC = () => (
  <hr className="border-0 border-t border-ink/[0.08]" />
);

const App: React.FC = () => {
  const active = useActiveSection();

  // subtle parallax for the mobile collage's tall image
  const collageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <div className="app">
      <SideNav active={active} />
      <ContactRail />

      <div className="max-w-[1080px] mx-auto px-6">
        <MobileHeader active={active} />

        {/* ——— me ——— */}
        <section id="me" className="pt-4 pb-16 md:pb-6 scroll-mt-12">
          {/* Desktop hero — fills the first viewport, images base-aligned to the fold */}
          <div className="hidden md:flex flex-col h-svh justify-end">
            <div className="grid grid-cols-[auto_1fr] gap-10 items-end">
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-noto text-[44px] font-extrabold tracking-[0.03em] leading-none whitespace-nowrap -mb-1"
              >
                Angelina Wang
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Intro />
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-12 mb-8 h-[min(500px,62svh)]">
              {[heroCampus, heroPalms, heroCity].map((src, i) => (
                <motion.img
                  key={i}
                  {...heroImgMotion(0.18 + i * 0.1)}
                  src={src}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Mobile hero — intro + staggered collage */}
          <div className="md:hidden pt-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Intro />
            </motion.div>
            <div ref={collageRef} className="flex gap-4 mt-10">
              <div className="w-[42%] flex flex-col justify-between gap-4">
                <motion.img
                  {...heroImgMotion(0.15)}
                  src={heroCity}
                  alt=""
                  className="w-full aspect-[3/4] object-cover rounded-md"
                />
                <motion.img
                  {...heroImgMotion(0.35)}
                  src={heroCampus}
                  alt=""
                  className="w-full aspect-[3/4] object-cover rounded-md mt-14"
                />
              </div>
              <div className="w-[58%] pt-24">
                <motion.img
                  {...heroImgMotion(0.25)}
                  src={heroPalms}
                  alt=""
                  style={{ y: parallaxY }}
                  className="w-full aspect-[10/16] object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ——— work ——— */}
        <section id="work" className="pt-20 md:pt-28 pb-20 md:pb-28 scroll-mt-10">
          <Experience />
        </section>

        <Divider />

        {/* ——— projects ——— */}
        <section id="projects" className="pt-20 md:pt-28 pb-20 md:pb-28 scroll-mt-10">
          <Projects />
        </section>

        <Divider />

        {/* ——— tools ——— */}
        <section id="tools" className="pt-20 md:pt-28 pb-24 md:pb-32">
          <ToolsSection />
        </section>

        {/* Footer */}
        <footer className="border-t border-ink/[0.08] py-5 flex items-center justify-between">
          <span className="text-[11px] text-mute">© 2026 Angelina Wang</span>
          <a
            href="https://se-webring.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-mute hover:text-ink transition-colors"
          >
            <img src={logoW} alt="SE Webring" className="w-3.5 h-3.5 opacity-50" />
            SE Webring
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SideNav, ContactRail, MobileHeader, SectionId } from "@/scenes/navbar";
import Experience from "@/scenes/experience";
import Projects from "@/scenes/projects";
import ToolsSection from "@/scenes/tools";
import Library from "@/scenes/library";

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
  initial: { opacity: 0, y: 44, scale: 1.03, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  transition: { duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const heroTextMotion = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const Divider: React.FC = () => (
  <hr className="border-0 border-t border-ink/[0.08]" />
);

const App: React.FC = () => {
  const active = useActiveSection();

  // mobile collage "expedited scroll": the collage's layout slot shrinks from
  // the bottom 1px per 1px scrolled, so the work section approaches at twice
  // the scroll speed. The photo canvas is top-anchored at a fixed size, so the
  // shrink crops the photos from the bottom without any zooming.
  const collageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const slotH = useTransform(
    scrollY,
    (s) => `max(10svh, calc(74svh - ${Math.max(0, s - 20)}px))`
  );
  const collageFade = useTransform(scrollY, [180, 460], [1, 0]);

  return (
    <div className="app">
      <SideNav active={active} />
      <ContactRail />

      <div className="max-w-[1080px] mx-auto px-6">
        <MobileHeader active={active} />
      </div>

      {/* ——— me ——— hero scales with viewport height so large screens keep
          the laptop proportions; the rest of the page stays a 1080px column */}
      <div className="mx-auto px-6 max-w-[1080px] md:max-w-[max(1010px,calc(110svh+40px))]">
        <section id="me" className="pt-4 pb-4 md:pb-6 scroll-mt-12">
          {/* Desktop hero — fills the first viewport, images base-aligned to the fold */}
          <div className="hidden md:flex flex-col h-svh justify-end">
            <div className="grid grid-cols-[auto_1fr] gap-10 items-end">
              <motion.h1
                {...heroTextMotion(0.1)}
                className="font-noto text-[44px] font-extrabold tracking-[0.03em] leading-none whitespace-nowrap -mb-1"
              >
                Angelina Wang
              </motion.h1>
              <motion.div {...heroTextMotion(0.25)}>
                <Intro />
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-12 mb-14 h-[55svh]">
              {[heroCampus, heroPalms, heroCity].map((src, i) => (
                <motion.img
                  key={i}
                  {...heroImgMotion(0.35 + i * 0.14)}
                  src={src}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Mobile hero — the collage occupies a short layout slot but draws
              tall; on scroll the photos ride up over the intro text while
              shrinking and fading, so the scroll past them stays short */}
          <div className="md:hidden pt-32">
            <motion.div {...heroTextMotion(0.1)}>
              <Intro />
            </motion.div>
            <motion.div
              ref={collageRef}
              style={{ height: slotH }}
              className="relative z-20 mt-6 overflow-hidden pointer-events-none"
            >
              <motion.div
                style={{ opacity: collageFade }}
                className="absolute top-0 left-0 right-0 h-[74svh] flex gap-4"
              >
                  <div className="w-[42%] flex flex-col gap-4 min-h-0">
                    <motion.img
                      {...heroImgMotion(0.15)}
                      src={heroCity}
                      alt=""
                      className="w-full grow-[3] basis-0 min-h-0 object-cover rounded-md"
                    />
                    <motion.img
                      {...heroImgMotion(0.35)}
                      src={heroCampus}
                      alt=""
                      className="w-full grow-[2] basis-0 min-h-0 object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[58%] min-h-0">
                    <motion.img
                      {...heroImgMotion(0.25)}
                      src={heroPalms}
                      alt=""
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <div className="max-w-[1080px] mx-auto px-6">
        <Divider />

        {/* ——— work ——— */}
        <section id="work" className="pt-10 md:pt-28 pb-20 md:pb-28 scroll-mt-28 md:scroll-mt-10">
          {/* match the hero images' width (hero container minus its padding) */}
          <div className="mx-auto w-full md:max-w-[calc(max(1010px,110svh_+_40px)_-_48px)]">
            <Experience />
          </div>
        </section>

        <Divider />

        {/* ——— projects ——— */}
        <section id="projects" className="pt-20 md:pt-28 pb-20 md:pb-28 scroll-mt-28 md:scroll-mt-10">
          <Projects />
        </section>

        <Divider />

        {/* ——— tools ——— */}
        <section id="tools" className="pt-20 md:pt-28 pb-20 md:pb-28">
          <ToolsSection />
        </section>

        {/* ——— library ——— */}
        <section id="library" className="pt-16 md:pt-20 pb-0 border-b border-ink/[0.08]">
          <Library />
        </section>

        {/* Footer */}
        <footer className="py-5 flex items-center justify-between">
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

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { SideNav, ContactRail, MobileHeader, SectionId, scrollToSection } from "@/scenes/navbar";

import heroCampus from "@/assets/hero1.png";
import heroCity from "@/assets/hero2.png";
import heroPalms from "@/assets/hero3.png";
import depthCampus from "@/assets/hero1-depth.png";
import depthCity from "@/assets/hero2-depth.png";
import depthPalms from "@/assets/hero3-depth.png";
import HeroDepth from "@/scenes/HeroDepth";
import SiteFooter from "@/scenes/SiteFooter";
import Library from "@/scenes/library";
import HomePreview from "@/scenes/HomePreview";

const SECTION_IDS: SectionId[] = ["me"];

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

/** Each hero photo is a door into a page. */
const DOORS = [
  { src: heroCampus, depth: depthCampus, label: "work", to: "/work" },
  { src: heroPalms, depth: depthPalms, label: "projects", to: "/projects" },
  { src: heroCity, depth: depthCity, label: "writing", to: "/writing" },
];

const Intro: React.FC = () => (
  <div className="text-[12px] md:text-[length:var(--hero-intro-fs)] leading-[1.55]">
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

const App: React.FC = () => {
  const active = useActiveSection();

  // arriving from another route (nav pill on /writing) or via /#work — scroll
  // to the requested section once the page has mounted
  const location = useLocation();
  useEffect(() => {
    const fromState = (location.state as { scrollTo?: SectionId } | null)?.scrollTo;
    const fromHash = location.hash.slice(1) as SectionId | "";
    const target = fromState || fromHash;
    if (!target) return;
    const t = setTimeout(() => scrollToSection(target), 60);
    return () => clearTimeout(t);
  }, [location]);


  return (
    <div className="app">
      <SideNav active={active} />
      <ContactRail />

      <div className="max-w-[1080px] mx-auto px-6">
        <MobileHeader active={active} />
      </div>

      {/* ——— me ——— on desktop the hero is a frame sized from the window
          (--hero-w), so a laptop shows the same proportions and open margins
          as a large screen; the bookshelf stands in the right margin */}
      <div className="mx-auto px-6 max-w-[1080px] md:px-0 md:max-w-none md:w-[var(--hero-w)]">
        <section id="me" className="pt-4 pb-4 md:py-0 scroll-mt-12">
          {/* Desktop hero — fills the first viewport, images base-aligned to the fold */}
          {/* the photo row is the one part sized from the window: it takes whatever
              height is left, running right down to the bottom edge */}
          <div className="hidden md:flex flex-col h-svh pt-[var(--hero-top)]">
            <div className="grid grid-cols-[auto_1fr] gap-[calc(var(--hero-u)*33)] items-end">
              <motion.h1
                {...heroTextMotion(0.1)}
                className="font-noto text-[length:var(--hero-name-fs)] font-extrabold tracking-[0.03em] leading-none whitespace-nowrap -mb-1"
              >
                Angelina Wang
              </motion.h1>
              <motion.div {...heroTextMotion(0.25)}>
                <Intro />
              </motion.div>
            </div>
            <div className="grid grid-cols-3 grid-rows-[minmax(0,1fr)] gap-5 mt-[5svh] flex-1 min-h-0">
              {/* each photo is a door: campus → work, palms → projects, city → writing */}
              {DOORS.map(({ src, depth, label, to }, i) => (
                <motion.div key={i} {...heroImgMotion(0.35 + i * 0.14)} className="w-full h-full">
                  <HeroDepth src={src} depth={depth} label={label} to={to} className="w-full h-full rounded-t-md cursor-pointer" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile hero — the collage occupies a short layout slot but draws
              tall; on scroll the photos ride up over the intro text while
              shrinking and fading, so the scroll past them stays short */}
          {/* Mobile hero: intro, then the collage filling the rest of the screen (no scrolling) */}
          <div className="md:hidden h-[min(100svh,820px)] flex flex-col pt-40 pb-4">
            <motion.div {...heroTextMotion(0.1)}>
              <Intro />
            </motion.div>
            <div className="mt-6 flex-1 min-h-0 flex gap-4">
              <div className="w-[42%] flex flex-col gap-4 min-h-0">
                <motion.div {...heroImgMotion(0.15)} className="w-full grow-[3] basis-0 min-h-0">
                  <HeroDepth src={heroCity} depth={depthCity} label="writing" to="/writing" className="w-full h-full rounded-md" />
                </motion.div>
                <motion.div {...heroImgMotion(0.35)} className="w-full grow-[2] basis-0 min-h-0">
                  <HeroDepth src={heroCampus} depth={depthCampus} label="work" to="/work" className="w-full h-full rounded-md" />
                </motion.div>
              </div>
              <motion.div {...heroImgMotion(0.25)} className="w-[58%] min-h-0">
                <HeroDepth src={heroPalms} depth={depthPalms} label="projects" to="/projects" className="w-full h-full rounded-md" />
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* phones: a peek at each page, then a small bookshelf as the footer */}
      <div className="md:hidden max-w-[1080px] mx-auto px-6">
        <HomePreview />
        <section className="pt-14 border-b border-ink/[0.08]">
          <Library compact maxScale={0.28} />
        </section>
      </div>

      {/* bottom-left: fixed on desktop, at the end of the page on phones */}
      <SiteFooter padded />
    </div>
  );
};

export default App;

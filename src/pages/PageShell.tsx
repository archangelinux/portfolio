import React from "react";
import { motion } from "framer-motion";
import { SideNav, ContactRail, MobileHeader, type SectionId } from "@/scenes/navbar";
import SiteFooter from "@/scenes/SiteFooter";

/**
 * Shared frame for the inner pages (work, projects): the same side nav,
 * contact rail and mobile header as the home page, a title set like the
 * hero's name, and a soft entrance that picks up where the hero photo's
 * expand transition leaves off.
 */
const PageShell: React.FC<{ id: SectionId; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <div className="app">
    <SideNav active={id} />
    <ContactRail />
    <div className="max-w-[1080px] mx-auto px-6">
      <MobileHeader active={id} />
      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="pt-40 pb-8"
      >
        <header className="mb-12 md:mb-16">
          <h1 className="page-title">{title}</h1>
        </header>
        {children}
      </motion.main>
      <SiteFooter />
    </div>
  </div>
);

export default PageShell;

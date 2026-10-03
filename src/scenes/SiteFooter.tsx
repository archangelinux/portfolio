import React from "react";
import logoW from "@/assets/logo_w.svg";

/** © and the SE Webring link, bottom-left on every page (fixed on the desktop home page, which doesn't scroll). */
const SiteFooter: React.FC<{ fixed?: boolean }> = ({ fixed = false }) => (
  <footer
    className={`flex items-center gap-4 text-[11px] text-mute ${
      fixed ? "px-6 py-5 md:p-0 md:fixed md:bottom-4 md:left-6 md:z-30" : "pt-16 pb-6"
    }`}
  >
    <span>© 2026 Angelina Wang</span>
    <a
      href="https://se-webring.xyz/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
    >
      <img src={logoW} alt="SE Webring" className="w-3.5 h-3.5 opacity-80" />
      SE Webring
    </a>
  </footer>
);

export default SiteFooter;

import React from "react";
import logoW from "@/assets/logo_w.svg";

/**
 * © over the SE Webring link. On desktop it is fixed bottom-left on every
 * page, lined up with the side nav's labels; on phones it sits at the end of
 * the page. `padded` adds the side gutter when it isn't inside a padded column.
 */
const SiteFooter: React.FC<{ padded?: boolean }> = ({ padded = false }) => (
  <footer
    className={`flex flex-col items-start gap-1.5 text-[11px] text-mute pt-16 pb-6 ${
      padded ? "px-6" : ""
    } md:p-0 md:fixed md:bottom-4 md:left-11 md:z-30`}
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
